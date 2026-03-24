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
