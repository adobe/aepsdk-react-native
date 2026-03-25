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
 * Scroll the main app scroll view until `targetTestId` is visible, then tap it.
 * Android: UiScrollable `scrollIntoView`. iOS: repeated `mobile: swipe` on the app (see XCUITest driver).
 */
export async function scrollAppScrollToTestIdAndClick(scrollTestId, targetTestId) {
  if (getE2ePlatform() === 'Android') {
    const sel = androidScrollIntoViewInAppScroll(scrollTestId, targetTestId);
    await $(sel).click();
    return;
  }

  const target = await $(byTestId(targetTestId));
  const scrollEl = await $(byTestId(scrollTestId));
  await scrollEl.waitForDisplayed({ timeout: 60000 });

  const swipeOnScroll = async () => {
    const id =
      scrollEl.elementId ??
      (typeof scrollEl.getElementId === 'function'
        ? await scrollEl.getElementId()
        : undefined);
    const args = id
      ? { elementId: id, direction: 'up', velocity: 2500 }
      : { direction: 'up', velocity: 2500 };
    await browser.execute('mobile: swipe', args);
  };

  for (let i = 0; i < 40; i++) {
    const visible = await target
      .isDisplayed()
      .catch(() => false);
    if (visible) {
      await target.click();
      return;
    }
    await swipeOnScroll();
  }

  throw new Error(
    `[e2e] Could not scroll to testID "${targetTestId}" inside "${scrollTestId}" (iOS)`,
  );
}
