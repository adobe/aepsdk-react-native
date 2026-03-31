# Appium E2E: `no such element` for RN `testID` on Android (AwesomeProject)

**Status:** Fixed  
**Area:** AwesomeProject, E2E, Appium, WebdriverIO, Android UiAutomator2  
**Last updated:** 2026-03-24

---

## Symptom

WebdriverIO / Appium tests fail to find elements that clearly exist in **Appium Inspector** (same `testID` / `resource-id`):

```text
NoSuchElementError: An element could not be located on the page using the given search parameters.
```

Logs show strategies like:

- `findElement("id", "aepsdk-app-title")`
- `findElement("id", "com.awesomeproject:id/aepsdk-app-title")`

Inspector’s **App Source** may show:

- `resource-id="aepsdk-app-title"` (short form, no `com.awesomeproject:id/` prefix)

Separately, **`yarn e2e:android`** could look like it “does not open the app” if the session is on the launcher or the wrong device; **`mobile: activateApp`** + pinned **`ANDROID_UDID`** in **`e2e/.env`** help.

---

## Cause

1. **Locator strategy vs hierarchy:** React Native maps `testID` to Android **`resource-id`**. On many builds the hierarchy exposes a **short** id (`aepsdk-app-title`), not `com.awesomeproject:id/aepsdk-app-title`. Appium’s **`id`** strategy does not always match the short id the same way **`~` (accessibility id)** would—and **`~`** fails when **`content-desc`** is empty.

2. **Full `id=` assumption:** Using `id=com.awesomeproject:id/<testID>` can fail if the live tree only contains the short resource id.

3. **Foreground / device:** Wrong **`appium:udid`** or launcher on top makes every locator fail even when the locator string is correct.

---

## Fix

1. **`e2e/helpers/rnSelectors.js`**
   - Prefer **UiAutomator2** for `testID`-backed nodes:  
     `android=new UiSelector().resourceId("<testID>")` via **`androidByTestId(testId)`**.
   - Keep **`androidByTestIdFull(testId)`** for trees that expose **`com.awesomeproject:id/<testID>`** (`id=` strategy).

2. **`e2e/test/specs/awesome-smoke.spec.js`** (shared with iOS)
   - After session start, **`activateAwesomeProject()`** in **`e2e/helpers/rnSelectors.js`** ( **`mobile: activateApp`** with the right **`appId`** on Android) so the app is in the foreground.

3. **`e2e/wdio.android.conf.js`** + **`e2e/.env`**
   - Use **`appium:app`** when **`app-debug.apk`** exists (or **`AWESOME_PROJECT_APK`**) so install/launch is explicit.
   - Set **`ANDROID_UDID`** (from `adb devices -l`) when multiple devices are connected.

---

## Verify

```sh
# One device / correct UDID in e2e/.env
yarn awesomeproject:android:assembleDebug   # if you rely on default APK path
yarn e2e:android
```

Expect the smoke spec to pass and logs to show **`UiAutomator2`** / resourceId-based find, not repeated failed **`id=`** for the wrong string.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-24 | **`id=`** with short and full resource-id failed; **`android=new UiSelector().resourceId("aepsdk-app-title")`** succeeded. Documented; smoke test green. |

---

## Fixed

- **Date:** 2026-03-24  
- **Summary:** Use **`androidByTestId`** (UiAutomator **`resourceId`**) for RN `testID` on Android; optional **`activateApp`** + **`ANDROID_UDID`** + APK **`app`** capability.  
- **Refs:** `e2e/helpers/rnSelectors.js`, `e2e/test/specs/awesome-smoke.spec.js`, `e2e/wdio.android.conf.js`
