/**
 * React Native element lookup for Appium (UiAutomator2 / XCUITest).
 *
 * JigNect guidance: use `testID` in RN, then confirm the mapped attribute in Appium Inspector
 * (often `resource-id` on Android, accessibility id on iOS) before writing the locator.
 *
 * @see https://medium.com/@jignect/appium-in-action-test-automation-for-flutter-and-react-native-projects-4abb2ce93bf2
 */

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

/**
 * Drain the Android logcat buffer and return nothing. Call this before the action
 * you want to verify so that the next `getAndroidSdkLogcat()` only returns entries
 * from after this point.
 * No-op on iOS.
 */
export async function drainAndroidLogcat() {
  if (getE2ePlatform() !== 'Android') return;
  try {
    await browser.getLogs('logcat');
  } catch { /* ignore if unavailable */ }
}

/**
 * Read recent Android logcat entries and return all lines from the
 * `AdobeExperienceSDK` tag as a single string. Used to verify native SDK events
 * (e.g. Edge requests) for fire-and-forget APIs that have no JS callback.
 *
 * Call `drainAndroidLogcat()` before the action, then call this after.
 * Returns '' on iOS.
 */
export async function getAndroidSdkLogcat() {
  if (getE2ePlatform() !== 'Android') return '';
  try {
    const logs = await browser.getLogs('logcat');
    return logs
      .map((entry) => (typeof entry === 'string' ? entry : entry.message || ''))
      .filter((msg) => msg.includes('AdobeExperienceSDK'))
      .join('\n');
  } catch {
    return '';
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
