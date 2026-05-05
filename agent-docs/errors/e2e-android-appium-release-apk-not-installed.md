# Android E2E: `Activity cannot be launched` — release APK not installed

**Status:** Fixed
**Area:** AwesomeProject, E2E, Appium, Android, WebdriverIO
**Last updated:** 2026-03-26

---

## Symptom

`yarn e2e:android:build:release:interop` (or `turbo`) builds successfully but E2E fails immediately:

```text
WebDriverError: Cannot start the 'com.awesomeproject' application.
Original error: Activity name '.com.awesomeproject.MainActivity' used to start the app
doesn't exist or cannot be launched!
```

---

## Environment

- React Native 0.84.1, Android, Appium 3.2.2 / WebdriverIO 9
- Branch: `optimize-turbo-module-e2e`

---

## Cause

`wdio.android.conf.js` had a hardcoded path to the debug APK:

```js
const DEFAULT_DEBUG_APK = path.join(
  repoRoot,
  'apps/AwesomeProject/android/app/build/outputs/apk/debug/app-debug.apk',
);
```

The release scripts:
1. Delete `app/build` (as part of the `rm -rf app/.cxx app/build` clean step)
2. Build `app-release.apk` to `app/build/outputs/apk/release/`

So after the release build, the debug APK no longer exists. `resolveApkPath()` found neither the debug APK nor `AWESOME_PROJECT_APK`, warned, and omitted `appium:app` from the session capabilities. Appium then tried to launch the app by package + activity name without installing — and failed because no APK was on the device.

---

## Fix

**`e2e/wdio.android.conf.js`** — add `ANDROID_CONFIGURATION` env var (default `'debug'`) to build the APK path dynamically, matching the iOS pattern (`IOS_CONFIGURATION`):

```diff
-/** Default debug APK from `assembleDebug`. */
-const DEFAULT_DEBUG_APK = path.join(
-  repoRoot,
-  'apps/AwesomeProject/android/app/build/outputs/apk/debug/app-debug.apk',
-);
+const androidConfiguration = process.env.ANDROID_CONFIGURATION || 'debug';
+const DEFAULT_APK = path.join(
+  repoRoot,
+  `apps/AwesomeProject/android/app/build/outputs/apk/${androidConfiguration}/app-${androidConfiguration}.apk`,
+);
```

Also update references from `DEFAULT_DEBUG_APK` to `DEFAULT_APK` in `resolveApkPath()`.

**`package.json`** — pass `ANDROID_CONFIGURATION=release` in the two release E2E scripts:

```diff
-"e2e:android:build:release:turbo":   "... && ANDROID_CONFIGURATION=release yarn e2e:android",  // was: yarn e2e:android
-"e2e:android:build:release:interop": "... && ANDROID_CONFIGURATION=release yarn e2e:android",
+"e2e:android:build:release:turbo":   "... && ANDROID_CONFIGURATION=release yarn e2e:android",
+"e2e:android:build:release:interop": "... && ANDROID_CONFIGURATION=release yarn e2e:android",
```

Debug scripts (`e2e:android:build`, `e2e:android`) are unchanged — `ANDROID_CONFIGURATION` defaults to `'debug'`.

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"

# If release APK already built:
ANDROID_CONFIGURATION=release yarn e2e:android

# Full end-to-end:
yarn e2e:android:build:release:interop
```

Expect: `2 passed, 2 total (100% completed)`.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | Release build succeeded but E2E failed — Appium couldn't launch `com.awesomeproject/.MainActivity`. |
| 2026-03-26 | Root cause: `app/build` deleted before release build; debug APK gone; `resolveApkPath()` returned `undefined`; release APK at different path not known to wdio config. |
| 2026-03-26 | Fixed: added `ANDROID_CONFIGURATION` to `wdio.android.conf.js`; updated release scripts in `package.json`. Ran E2E with existing release APK — 2/2 passing. |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** `wdio.android.conf.js` now derives the default APK path from `ANDROID_CONFIGURATION` env var (`debug` by default); release E2E scripts pass `ANDROID_CONFIGURATION=release`.
- **Refs:** `e2e/wdio.android.conf.js`, root `package.json`

---

## Key lesson

**When adding Android release E2E scripts, always check whether the wdio config's default APK path matches the new configuration's output directory.** `assembleRelease` writes to `apk/release/app-release.apk`, not `apk/debug/app-debug.apk`. Pass `ANDROID_CONFIGURATION=release` (or `AWESOME_PROJECT_APK=<path>`) to tell the E2E runner where to find the artifact.
