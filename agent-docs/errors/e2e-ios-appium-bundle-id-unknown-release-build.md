# Appium E2E: `App with bundle identifier unknown` — Release build not found

**Status:** Fixed
**Area:** AwesomeProject, E2E, Appium, iOS, WebdriverIO
**Last updated:** 2026-03-26

---

## Symptom

`yarn e2e:ios:build:release:turbo` (or `e2e:ios:build:release:interop`) builds successfully but the E2E session immediately fails:

```text
[aepsdk-e2e] No .app for Appium install. Expected:
  .../apps/AwesomeProject/ios/build/Build/Products/Debug-iphonesimulator/AwesomeProject.app
  Run: yarn awesomeproject:ios:build
  Or set AWESOME_PROJECT_APP, or E2E_SKIP_APP=1 if the app is already on the simulator.

WebDriverError: App with bundle identifier 'org.reactjs.native.example.AwesomeProject' unknown
```

Appium falls back to bundle-ID-only mode (no `appium:app` capability), but the app is not yet installed on the simulator, so the session fails.

---

## Environment

- React Native 0.84.1, macOS / Appium 3.2.2 / WebdriverIO 9
- Triggered by the `e2e:ios:build:release:*` scripts added to root `package.json`

---

## Cause

`wdio.ios.conf.js` hardcoded `Debug-iphonesimulator` as the default `.app` path:

```js
const DEFAULT_DEBUG_APP = path.join(
  repoRoot,
  'apps/AwesomeProject/ios/build/Build/Products/Debug-iphonesimulator/AwesomeProject.app',
);
```

The release build scripts use `-configuration Release`, so xcodebuild writes the `.app` to `Release-iphonesimulator/` instead. `resolveIosAppPath()` checked only the debug path, found nothing, warned, and omitted `appium:app` from the session capabilities.

---

## Fix

**`e2e/wdio.ios.conf.js`** — read `IOS_CONFIGURATION` env var (default `'Debug'`) to build the expected `.app` path dynamically:

```diff
-const DEFAULT_DEBUG_APP = path.join(
-  repoRoot,
-  'apps/AwesomeProject/ios/build/Build/Products/Debug-iphonesimulator/AwesomeProject.app',
-);
+const iosConfiguration = process.env.IOS_CONFIGURATION || 'Debug';
+const DEFAULT_DEBUG_APP = path.join(
+  repoRoot,
+  `apps/AwesomeProject/ios/build/Build/Products/${iosConfiguration}-iphonesimulator/AwesomeProject.app`,
+);
```

**`package.json`** — pass `IOS_CONFIGURATION=Release` in the two release E2E scripts:

```diff
-"e2e:ios:build:release:turbo":   "... && yarn awesomeproject:ios:build:release && yarn e2e:ios",
-"e2e:ios:build:release:interop": "... && yarn awesomeproject:ios:build:release && yarn e2e:ios"
+"e2e:ios:build:release:turbo":   "... && yarn awesomeproject:ios:build:release && IOS_CONFIGURATION=Release yarn e2e:ios",
+"e2e:ios:build:release:interop": "... && yarn awesomeproject:ios:build:release && IOS_CONFIGURATION=Release yarn e2e:ios"
```

Debug scripts (`e2e:ios:build:turbo`, `e2e:ios:build:interop`) are unchanged — they get `'Debug'` by default.

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"

# Full release cycle (clean build + e2e):
yarn e2e:ios:build:release:turbo

# Or if the release .app already exists:
IOS_CONFIGURATION=Release yarn e2e:ios
```

Expect: `2 passed, 2 total (100% completed)` with no `No .app` warning.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | `e2e:ios:build:release:turbo` added to `package.json`. Build succeeded but E2E failed — wdio warned `No .app for Appium install` and Appium couldn't find the app by bundle ID. Root cause: path hardcoded to `Debug-iphonesimulator`. |
| 2026-03-26 | Added `IOS_CONFIGURATION` env var to `wdio.ios.conf.js`; updated both release scripts in `package.json`. Re-ran E2E against existing Release build — 2/2 passing. |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** `wdio.ios.conf.js` now derives the default `.app` path from `IOS_CONFIGURATION` env var (`Debug` by default); release E2E scripts pass `IOS_CONFIGURATION=Release`.
- **Refs:** `e2e/wdio.ios.conf.js`, root `package.json` (`e2e:ios:build:release:turbo`, `e2e:ios:build:release:interop`)

---

## Key lesson

**When adding a new build configuration (e.g. Release), always check whether the E2E wdio config's default `.app` path matches the new config's output directory.** xcodebuild writes to `<configuration>-iphonesimulator/`, so Debug and Release produce separate directories. Pass `IOS_CONFIGURATION=<config>` (or `AWESOME_PROJECT_APP=<absolute-path>`) to tell the E2E runner where to find the built artifact.
