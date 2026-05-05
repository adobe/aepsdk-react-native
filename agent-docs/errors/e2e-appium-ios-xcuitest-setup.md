# Appium E2E: iOS (XCUITest) setup for AwesomeProject

**Status:** Documented  
**Area:** E2E, Appium, WebdriverIO, iOS XCUITest  
**Last updated:** 2026-03-24

---

## Symptom

- **`yarn e2e`** or **`yarn e2e:ios`** fails when Appium starts the session, with messages indicating the **XCUITest** driver is missing or iOS automation is unavailable.

---

## Cause

**Appium 2** installs drivers separately. Android **UiAutomator2** may already be installed globally while **XCUITest** is not, so iOS sessions cannot start until the driver is added.

### Parity with Android (build before e2e)

On **Android**, **`yarn e2e:android:build`** runs **`assembleDebug`** so **`app-debug.apk`** exists at the path **`wdio.android.conf.js`** expects. On **iOS**, the same idea applies: **`yarn awesomeproject:ios:build`** writes a **Debug simulator `.app`** under **`apps/AwesomeProject/ios/build/...`** (fixed **`-derivedDataPath ./build`**), which **`wdio.ios.conf.js`** uses as **`appium:app`**.

A plain **`yarn ios`** / **`react-native run-ios`** build usually lands in **Xcode DerivedData**, not that path—so for repeatable e2e, prefer **`e2e:ios:build`** or **`yarn e2e:build`** (see below), or set **`AWESOME_PROJECT_APP`** to your `.app`.

---

## Fix

1. **Install the XCUITest driver** (once per Appium install):

   ```sh
   appium driver install xcuitest
   ```

   If Appium reports **`xcuitest` is already installed**, no action is needed; confirm with **`appium driver list --installed`**. To refresh the driver, use **`appium driver update xcuitest`**.

   Verify:

   ```sh
   appium driver list
   ```

   You should see `xcuitest` listed as installed.

2. **Build the simulator `.app`** so `wdio.ios.conf.js` can pass `appium:app` (or set **`AWESOME_PROJECT_APP`** / **`E2E_SKIP_APP=1`** as in `e2e/.env.example`):

   ```sh
   yarn awesomeproject:ios:build
   ```

   Default artifact path (when unset):

   `apps/AwesomeProject/ios/build/Build/Products/Debug-iphonesimulator/AwesomeProject.app`

3. **Pin the simulator** when multiple devices are available — set **`IOS_UDID`** in **`e2e/.env`** (from `xcrun simctl list devices available`).

---

## Commands

| Command | Behavior |
|--------|----------|
| **`yarn e2e`** | On **macOS**, runs **`e2e:ios`** by default; on other platforms, runs **`e2e:android`**. Override with **`E2E_PLATFORM=ios`** or **`E2E_PLATFORM=android`**. |
| **`yarn e2e:build`** | Same platform rule as **`yarn e2e`**, but **builds first** (iOS: **`awesomeproject:ios:build`**; Android: **`awesomeproject:android:assembleDebug`**), then runs the matching WDIO config. Same as **`e2e:ios:build`** / **`e2e:android:build`** when **`E2E_PLATFORM`** matches. |
| **`yarn e2e:ios`** | WebdriverIO with **`wdio.ios.conf.js`** (same **`test/specs/**/*.spec.js`** as Android). Default `.app` path: `Debug-iphonesimulator`. Pass **`IOS_CONFIGURATION=Release`** to use the Release build instead. |
| **`yarn e2e:ios:build`** | **`awesomeproject:ios:build`** then **`e2e:ios`** (Android equivalent: **`e2e:android:build`**). |
| **`yarn e2e:ios:build:turbo`** | Clean pod install (`USE_INTEROP_ROOT=0`) + Debug build + `e2e:ios`. |
| **`yarn e2e:ios:build:release:turbo`** | Clean pod install (`USE_INTEROP_ROOT=0`) + Release build + `e2e:ios` (passes `IOS_CONFIGURATION=Release`). |
| **`yarn e2e:ios:build:release:interop`** | Clean pod install (`USE_INTEROP_ROOT=1`) + Release build + `e2e:ios` (passes `IOS_CONFIGURATION=Release`). |
| **`yarn e2e:android`** | WebdriverIO with **`wdio.android.conf.js`** (shared specs). |

---

## Verify

```sh
# Recommended: build + test (matches default .app / APK paths)
yarn e2e:build

# Or: test only (expects artifact already built, or E2E_SKIP_APP / E2E_SKIP_APK)
yarn e2e
```

Expect the **AwesomeProject (iOS)** smoke spec to pass.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-24 | Initial iOS WDIO config, smoke spec, **`yarn e2e`** runner; documented **`appium driver install xcuitest`** prerequisite. |
| 2026-03-24 | Documented Android parity: fixed DerivedData **`.app`** vs **`run-ios`**; added **`yarn e2e:build`**. |
| 2026-03-24 | Single shared **`awesome-smoke.spec.js`**; platform helpers in **`rnSelectors.js`** (`byTestId`, **`activateAwesomeProject`**). |
| 2026-03-26 | Added `IOS_CONFIGURATION` env var support to `wdio.ios.conf.js` — default `.app` path now uses `${IOS_CONFIGURATION}-iphonesimulator` (default `Debug`). Release E2E scripts (`e2e:ios:build:release:turbo/interop`) pass `IOS_CONFIGURATION=Release`. See `errors/e2e-ios-appium-bundle-id-unknown-release-build.md`. |

---

## Fixed / refs

- **Refs:** `e2e/wdio.ios.conf.js`, `e2e/test/specs/awesome-smoke.spec.js`, `e2e/run-e2e.mjs`, `e2e/run-e2e-build.mjs`, `e2e/helpers/rnSelectors.js` (`IOS_APP_ID`, **`byTestId`**, **`activateAwesomeProject`**), root **`package.json`** scripts **`awesomeproject:ios:build`**, **`e2e`**, **`e2e:build`**, **`e2e:ios`**, **`e2e:ios:build`**
