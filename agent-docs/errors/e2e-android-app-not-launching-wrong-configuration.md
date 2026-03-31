# Android E2E app not launching — wrong ANDROID_CONFIGURATION in .env

**Status:** Fixed
**Area:** Android E2E, wdio.android.conf.js
**Last updated:** 2026-03-31

---

## Symptom

Running `yarn e2e:android` does nothing — the app never installs or opens on the emulator. No Appium error, just no activity.

---

## Environment

- Release APK built and exists at `apps/AwesomeProject/android/app/build/outputs/apk/release/app-release.apk`
- App not installed on device (`adb shell pm list packages | grep awesomeproject` returns nothing)
- `e2e/.env` does not have `ANDROID_CONFIGURATION` set

---

## Cause

`wdio.android.conf.js` resolves the APK path as:

```js
const androidConfiguration = process.env.ANDROID_CONFIGURATION || 'debug';
const DEFAULT_APK = `.../apk/${androidConfiguration}/app-${androidConfiguration}.apk`;
```

If `ANDROID_CONFIGURATION` is not set in `.env` (or the shell), it defaults to `debug`. The debug APK path does not exist → `resolveApkPath()` returns `undefined` → no `appium:app` capability is set → Appium has no APK to install → emulator never receives the app.

---

## Fix

Set `ANDROID_CONFIGURATION=release` in `e2e/.env`:

```
ANDROID_CONFIGURATION=release
```

This makes the config resolve to `.../apk/release/app-release.apk` which exists.

---

## Verify

```sh
# Confirm device is connected
adb devices -l

# Confirm APK exists
ls apps/AwesomeProject/android/app/build/outputs/apk/release/app-release.apk

# Run e2e (app should install and open)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && yarn e2e:android
```

---

## Fixed

- **Date:** 2026-03-31
- **Summary:** Added `ANDROID_CONFIGURATION=release` to `e2e/.env`; also corrected `ANDROID_DEVICE_NAME` from `Pixel_8_API_34` to `sdk_gphone64_arm64` (actual emulator model from `adb devices -l`)
