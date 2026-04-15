/**
 * React Native element lookup for Appium (UiAutomator2 / XCUITest).
 *
 * JigNect guidance: use `testID` in RN, then confirm the mapped attribute in Appium Inspector
 * (often `resource-id` on Android, accessibility id on iOS) before writing the locator.
 *
 * @see https://medium.com/@jignect/appium-in-action-test-automation-for-flutter-and-react-native-projects-4abb2ce93bf2
 */

import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── iOS log stream state (module-level) ──────────────────────────────────────
let _iosLogProcess = null;
let _iosLogBuffer = '';

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
 * iOS:     spawns `xcrun simctl spawn <udid> log stream` with a broad predicate
 *          capturing all AwesomeProject process logs. The stream accumulates
 *          output into a module-level buffer.
 *
 * Predicate notes (iOS):
 *   - AEP SDK on iOS uses os_log under various subsystems — NOT a single
 *     "com.adobe.mobile.marketing.aep" subsystem. Event dispatch, Edge
 *     extension, and Optimize extension each log under different subsystems.
 *   - We filter ONLY on process name to avoid missing any SDK log lines.
 *   - Post-filtering is done by the caller (or getNativeSdkLogs) if needed.
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

  const udid = _getBootedSimulatorUdid();

  // Broad predicate: capture ALL logs from the AwesomeProject process.
  // The AEP SDK logs under many os_log subsystems (Optimize, Edge, Core,
  // Messaging) so restricting by subsystem misses critical entries.
  // eventMessage-based filtering is too fragile for streaming predicates;
  // we capture everything and post-filter in getNativeSdkLogs().
  _iosLogProcess = spawn('xcrun', [
    'simctl', 'spawn', udid, 'log', 'stream',
    '--level', 'debug',
    '--style', 'ndjson',
    '--predicate', 'process == "AwesomeProject"',
  ]);

  _iosLogProcess.stdout.on('data', (chunk) => { _iosLogBuffer += chunk.toString(); });
  _iosLogProcess.stderr.on('data', (chunk) => { _iosLogBuffer += chunk.toString(); });
  _iosLogProcess.on('error', (err) => {
    console.warn('[e2e] iOS log stream spawn error:', err.message);
  });

  // Wait for the log stream to fully attach to the process.
  // 2 seconds is needed because `xcrun simctl spawn` has startup latency —
  // the daemon needs to connect to the log subsystem before any events flow.
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
    // SIGTERM first, then wait for flush
    _iosLogProcess.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 1000));

    // Force kill if still alive
    try { _iosLogProcess.kill('SIGKILL'); } catch { /* already dead */ }
    _iosLogProcess = null;
  }

  const raw = _iosLogBuffer;
  _iosLogBuffer = '';

  // Persist to file for debugging (append mode)
  _appendToIosLogFile('getNativeSdkLogs() capture', raw || '(empty)');

  if (!raw || raw.trim().length === 0) {
    console.warn('[e2e] iOS native log capture returned EMPTY. Possible causes:');
    console.warn('  - Simulator not booted or wrong UDID');
    console.warn('  - Log stream did not attach in time (increase startup delay)');
    console.warn('  - App process name mismatch (check process == "AwesomeProject")');
    console.warn(`  - Saved log file: ${IOS_LOG_FILE}`);
    return '';
  }

  // ndjson mode: each line is a JSON object with an "eventMessage" field.
  // Extract eventMessage from each JSON line for easier assertion matching.
  // Fall back to raw lines if JSON parsing fails (e.g. header lines).
  const lines = raw.split('\n');
  const messages = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.eventMessage) {
        messages.push(obj.eventMessage);
      } else {
        // Include the full JSON line for completeness
        messages.push(line);
      }
    } catch {
      // Non-JSON line (header, etc.) — include as-is
      messages.push(line);
    }
  }

  const result = messages.join('\n');

  // Debug: log a snippet so test output shows what we captured
  const lineCount = messages.length;
  const snippet = result.substring(0, 500);
  console.log(`[e2e] iOS native logs: ${lineCount} lines captured. Snippet:\n${snippet}...`);

  return result;
}

// Keep old names as aliases for backward compatibility within this session
export const drainAndroidLogcat = startNativeLogCapture;
export const getAndroidSdkLogcat = getNativeSdkLogs;

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
