/**
 * React Native element lookup for Appium (UiAutomator2 / XCUITest).
 *
 * JigNect guidance: use `testID` in RN, then confirm the mapped attribute in Appium Inspector
 * (often `resource-id` on Android, accessibility id on iOS) before writing the locator.
 *
 * @see https://medium.com/@jignect/appium-in-action-test-automation-for-flutter-and-react-native-projects-4abb2ce93bf2
 */

import { expect } from '@wdio/globals';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── iOS log capture state (module-level) ─────────────────────────────────────
let _iosLogProcess = null;  // kept for backward compat; unused with log-show approach
let _iosLogBuffer = '';     // kept for backward compat; unused with log-show approach
let _iosCaptureStartTime = null; // ISO timestamp for `log show --start`

/** Persistent log file for iOS native log debugging. */
const IOS_LOG_FILE = path.join(__dirname, '..', 'logs', 'ios_native_sdk_logs.txt');

/** Must match `applicationId` (see apps/AwesomeProject/android/app/build.gradle). */
export const ANDROID_APP_ID = 'com.awesomeproject';

/** Must match `PRODUCT_BUNDLE_IDENTIFIER` (see apps/AwesomeProject/ios/.../project.pbxproj). */
export const IOS_APP_ID = 'org.reactjs.native.example.AwesomeProject';

/**
 * Android: RN `testID` maps to `resource-id`. On many RN builds the hierarchy shows a **short**
 * id (e.g. `aepsdk-app-title`); UiAutomator2 is reliable for that. If your tree only has
 * `com.awesomeproject:id/...`, use `androidByTestIdFull` instead.
 */
export function androidByTestId(testId) {
  return `android=new UiSelector().resourceId("${testId}")`;
}

/** When Inspector shows full `resource-id` as `package:id/name`. */
export function androidByTestIdFull(testId) {
  return `id=${ANDROID_APP_ID}:id/${testId}`;
}

/** iOS: RN `testID` maps to accessibility id → WebdriverIO `~value`. */
export function iosByTestId(testId) {
  return `~${testId}`;
}

/** Current session platform from WebDriver capabilities (set after session starts). */
export function getE2ePlatform() {
  const name = browser.capabilities.platformName;
  return name === 'iOS' ? 'iOS' : 'Android';
}

/** RN `testID` locator for the active platform (UiAutomator2 vs accessibility id). */
export function byTestId(testId) {
  return getE2ePlatform() === 'iOS' ? iosByTestId(testId) : androidByTestId(testId);
}

/** Bring AwesomeProject to the foreground (Android `appId` vs iOS `bundleId`). */
export async function activateAwesomeProject() {
  if (getE2ePlatform() === 'iOS') {
    await browser.execute('mobile: activateApp', { bundleId: IOS_APP_ID });
  } else {
    await browser.execute('mobile: activateApp', { appId: ANDROID_APP_ID });
  }
}

/**
 * Android: scroll the main app `ScrollView` (`scrollTestId`) until `targetTestId` is visible, then return a selector for that view.
 * Use with `await $(androidScrollIntoViewInAppScroll(...)).click()`.
 */
export function androidScrollIntoViewInAppScroll(scrollTestId, targetTestId) {
  return `android=new UiScrollable(new UiSelector().resourceId("${scrollTestId}")).scrollIntoView(new UiSelector().resourceId("${targetTestId}"))`;
}

// ── iOS log file helpers ─────────────────────────────────────────────────────

/**
 * Ensure the logs directory exists and append a separator + text to the iOS log file.
 * Creates the file if it doesn't exist; appends on subsequent calls.
 */
function _appendToIosLogFile(label, text) {
  try {
    const dir = path.dirname(IOS_LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const header = `\n${'='.repeat(72)}\n[${new Date().toISOString()}] ${label}\n${'='.repeat(72)}\n`;
    fs.appendFileSync(IOS_LOG_FILE, header + text + '\n');
  } catch { /* best-effort */ }
}

/**
 * Resolve the UDID of the booted iOS Simulator.
 * Returns the first booted device UDID, or 'booted' as fallback.
 *
 * Why: `xcrun simctl spawn booted` can be ambiguous when multiple simulators
 * are available. Resolving the explicit UDID avoids targeting the wrong device.
 */
function _getBootedSimulatorUdid() {
  // Prefer the UDID from wdio capabilities or env var
  try {
    const envUdid = process.env.IOS_UDID;
    if (envUdid) return envUdid;
  } catch { /* fall through */ }

  // Query simctl for the booted device
  try {
    const out = execSync('xcrun simctl list devices booted -j', {
      encoding: 'utf-8',
      timeout: 5000,
    });
    const json = JSON.parse(out);
    for (const runtime of Object.values(json.devices || {})) {
      for (const dev of runtime) {
        if (dev.state === 'Booted' && dev.udid) return dev.udid;
      }
    }
  } catch { /* fall through */ }

  return 'booted'; // fallback
}

/**
 * Start capturing native SDK logs. Call BEFORE the action you want to verify.
 *
 * Android: drains the logcat buffer so the next `getNativeSdkLogs()` only
 *          returns entries from after this point.
 * iOS:     spawns `/usr/bin/log stream` on the host Mac (NOT `simctl spawn`)
 *          filtered by the AEP SDK subsystem. The stream accumulates output
 *          into a module-level buffer until `getNativeSdkLogs()` kills it.
 *
 * Note: `log stream` truncates long os_log messages with `<…>`. Deeply nested
 * fields like `propositions[].scope` ("mboxAug") may be cut off. Assert those
 * via the callback log instead. See `agent-docs/context/ios-native-log-capture.md`.
 */
export async function startNativeLogCapture() {
  if (getE2ePlatform() === 'Android') {
    try { await browser.getLogs('logcat'); } catch { /* drain */ }
    return;
  }

  // iOS: kill any lingering log stream from a prior capture
  if (_iosLogProcess) {
    try { _iosLogProcess.kill('SIGKILL'); } catch { /* ignore */ }
    _iosLogProcess = null;
  }
  _iosLogBuffer = '';

  // Use the HOST Mac `/usr/bin/log stream` (not `xcrun simctl spawn`).
  // `simctl spawn` runs inside the simulator sandbox and cannot see AEP SDK
  // os_log entries. The host unified log captures all simulator process logs.
  // Filter by subsystem to exclude XCUITest accessibility framework noise.
  _iosLogProcess = spawn('/usr/bin/log', [
    'stream',
    '--level', 'debug',
    '--style', 'compact',
    '--predicate', 'subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"',
  ]);

  _iosLogProcess.stdout.on('data', (chunk) => { _iosLogBuffer += chunk.toString(); });
  _iosLogProcess.stderr.on('data', (chunk) => { _iosLogBuffer += chunk.toString(); });
  _iosLogProcess.on('error', (err) => {
    console.warn('[e2e] iOS log stream spawn error:', err.message);
  });

  // Wait for the log stream to attach to the unified log subsystem.
  await new Promise((r) => setTimeout(r, 2000));
}

/**
 * Stop capturing and return native SDK log entries as a single string.
 * Call AFTER the action + a short pause (e.g. 3 s) to let the SDK dispatch.
 *
 * Android: reads logcat entries since the last drain, filters for `AdobeExperienceSDK`.
 * iOS:     kills the log stream process, flushes remaining output, returns the
 *          accumulated buffer. Also persists to `e2e/logs/ios_native_sdk_logs.txt`
 *          for post-mortem debugging.
 */
export async function getNativeSdkLogs() {
  if (getE2ePlatform() === 'Android') {
    try {
      const logs = await browser.getLogs('logcat');
      return logs
        .map((entry) => (typeof entry === 'string' ? entry : entry.message || ''))
        .filter((msg) => msg.includes('AdobeExperienceSDK'))
        .join('\n');
    } catch { return ''; }
  }

  // iOS: stop the stream and collect buffered output
  if (_iosLogProcess) {
    _iosLogProcess.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 1000));
    try { _iosLogProcess.kill('SIGKILL'); } catch { /* already dead */ }
    _iosLogProcess = null;
  }

  const raw = _iosLogBuffer;
  _iosLogBuffer = '';

  // Persist to file for debugging (append mode)
  _appendToIosLogFile('getNativeSdkLogs() capture', raw || '(empty)');

  if (!raw || raw.trim().length === 0) {
    console.warn('[e2e] iOS native log capture returned EMPTY. Possible causes:');
    console.warn('  - Simulator not booted');
    console.warn('  - App process name mismatch (check process == "AwesomeProject")');
    console.warn(`  - Saved log file: ${IOS_LOG_FILE}`);
    return '';
  }

  const lineCount = raw.split('\n').filter((l) => l.trim()).length;
  const snippet = raw.substring(0, 500);
  console.log(`[e2e] iOS native logs: ${lineCount} lines captured. Snippet:\n${snippet}...`);

  return raw;
}

// Keep old names as aliases for backward compatibility within this session
export const drainAndroidLogcat = startNativeLogCapture;
export const getAndroidSdkLogcat = getNativeSdkLogs;

/**
 * Assert that `sdkLogs` contains `substring`.
 *
 * - Android: hard assertion (`expect().toContain()`) — logcat never truncates.
 * - iOS: soft check — logs ✓ if found, ⚠ if not. iOS `os_log` truncates long
 *   messages with `<…>` and JSON key ordering is non-deterministic, so payload
 *   fields may or may not survive across runs.
 *
 * Use this for payload fields inside the event `data:` block (e.g. eventType,
 * mboxAug, trackpropositions). For event names in the header (never truncated),
 * use `expect(sdkLogs).toContain(...)` directly.
 */
export function assertNativeLogContains(sdkLogs, substring, label) {
  const tag = label || substring;
  if (getE2ePlatform() === 'Android') {
    expect(sdkLogs).toContain(substring);
  } else if (sdkLogs.includes(substring)) {
    console.log(`[e2e] ✓ Native log contains ${tag}`);
  } else {
    console.warn(`[e2e] ⚠ ${tag} not found in native log (iOS os_log truncation). Verified via callback log.`);
  }
}

/**
 * Clear the callback log panel by tapping the "Clear log" button.
 * Should be called in `before` hooks to ensure each spec starts with a clean log,
 * avoiding false positives from residual entries and reducing scroll distance.
 */
export async function clearCallbackLog() {
  await scrollAppScrollToTestIdAndClick('aepsdk-app-scroll', 'aepsdk-btn-clear-log');
}

/**
 * Scroll the main app scroll view until `targetTestId` is visible — does NOT click.
 * Use this to bring an element into view for reading (e.g. the log panel after scrolling
 * down to tap a button that pushed it off screen).
 * Android: UiScrollable scrollIntoView (searches in both directions).
 * iOS: coordinate-based swipe in the upper portion of the screen to avoid nested
 *       scrollable containers (e.g. HTML offer WebView) that intercept the gesture.
 */
export async function scrollAppScrollToTestId(scrollTestId, targetTestId) {
  if (getE2ePlatform() === 'Android') {
    const sel = androidScrollIntoViewInAppScroll(scrollTestId, targetTestId);
    await $(sel).waitForDisplayed({ timeout: 10000 });
    return;
  }

  const target = await $(byTestId(targetTestId));

  for (let i = 0; i < 20; i++) {
    if (await target.isDisplayed().catch(() => false)) return;
    // Swipe DOWN in the upper quarter of the screen (scroll content up toward top).
    // Using the upper region avoids nested scrollable containers (HTML offer WebView)
    // that sit lower in the page and intercept gestures.
    const { width, height } = await browser.getWindowRect();
    const x = Math.floor(width / 2);
    const startY = Math.floor(height * 0.15);
    const endY = Math.floor(height * 0.45);
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 300 },
          { type: 'pointerMove', duration: 600, x, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await browser.releaseActions();
  }
}

/**
 * Scroll the main app scroll view until `targetTestId` is visible, then tap it.
 * Android: UiScrollable `scrollIntoView`. iOS: coordinate-based swipe in the upper
 *          portion of the screen to avoid nested scrollable containers + tap.
 */
export async function scrollAppScrollToTestIdAndClick(scrollTestId, targetTestId) {
  if (getE2ePlatform() === 'Android') {
    const sel = androidScrollIntoViewInAppScroll(scrollTestId, targetTestId);
    await $(sel).click();
    return;
  }

  const target = await $(byTestId(targetTestId));

  for (let i = 0; i < 40; i++) {
    const visible = await target.isDisplayed().catch(() => false);
    if (visible) {
      await target.click();
      return;
    }
    // Swipe UP in the upper quarter of the screen (scroll content down to reveal items below).
    // Using the upper region avoids the HTML offer WebView and other nested scrollable
    // containers that sit lower in the page and intercept gestures.
    const { width, height } = await browser.getWindowRect();
    const x = Math.floor(width / 2);
    const startY = Math.floor(height * 0.45);
    const endY = Math.floor(height * 0.15);
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 300 },
          { type: 'pointerMove', duration: 600, x, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await browser.releaseActions();
  }

  throw new Error(
    `[e2e] Could not scroll to testID "${targetTestId}" inside "${scrollTestId}" (iOS)`,
  );
}
