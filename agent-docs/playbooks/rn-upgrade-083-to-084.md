# Playbook: Upgrade AEPSampleApp from React Native 0.83 → 0.84

**Created:** 2026-04-23
**Status:** Ready for execution (not yet started)

---

## Upgrade Summary

| Field | Value |
|-------|-------|
| **App** | `apps/AEPSampleApp` |
| **Current RN version** | `0.83.0` (from `package.json`) |
| **Target RN version** | `0.84.0` |
| **Current React** | `19.2.0` |
| **Target React** | `19.2.3` (per RN 0.84 requirement) |
| **Current Node requirement** | `>=20` |
| **Target Node requirement** | `>=22.11` (**BREAKING** — RN 0.84 requires Node 22.11+) |
| **Upgrade Helper** | https://react-native-community.github.io/upgrade-helper/?from=0.83.0&to=0.84.0 |
| **Release notes** | https://reactnative.dev/blog/2026/02/11/react-native-0.84 |

**Other apps in monorepo:**
- `apps/AwesomeProject` — already on `0.84.1` (no action needed)
- `apps/AEPSampleAppNewArchEnabled` — on `0.81.5` (separate upgrade, not in scope)

---

## Pre-upgrade Checklist

- [ ] Ensure Node.js v22.11+ is installed (`nvm install 22` / `nvm use 22`)
- [ ] Verify current app builds and runs on both platforms before starting
- [ ] Create a dedicated branch for the upgrade
- [ ] Read the full RN 0.84 release notes: https://reactnative.dev/blog/2026/02/11/react-native-0.84
- [ ] Review the Upgrade Helper diff: https://react-native-community.github.io/upgrade-helper/?from=0.83.0&to=0.84.0
- [ ] Back up `ios/Podfile.lock` and `android/gradle.properties` (useful for rollback comparison)

---

## Breaking Changes in RN 0.84

### 1. Node.js v22.11+ required

**Risk: HIGH** — Build will fail with older Node versions.

**Action:**
```bash
nvm install 22
nvm use 22
node -v  # must be >= 22.11
```

Update `.nvmrc` if the app has one. Update `engines.node` in `package.json`:
```json
"engines": { "node": ">=22" }
```

---

### 2. Hermes V1 is the default engine

**Risk: MEDIUM** — Hermes V1 replaces Hermes 0.15.x. Most apps are unaffected, but edge cases with JSI or custom Hermes patches may break.

**Action:** No action needed unless the app explicitly depends on Hermes 0.15.x features. To opt out:
```json
{
  "overrides": { "hermes-compiler": "0.15.0" }
}
```

---

### 3. Legacy Architecture removed from iOS by default

**Risk: HIGH for modules using legacy bridge patterns.**

`RCT_REMOVE_LEGACY_ARCH=1` is now the default. Legacy Architecture code is compiled out.

**What remains:** The Interop Layer code stays for compatibility. `RCTEventEmitter`, `RCTBridgeModule`, `RCT_EXPORT_MODULE` still exist but have limitations (see below).

**What's gone:** Legacy bridge classes that were previously available are now compiled out.

**Impact on AEP SDKs:** See Section "AEP SDK-Specific Concerns" below.

To re-enable legacy code (temporary escape hatch, NOT recommended):
```bash
RCT_USE_PREBUILT_RNCORE=0 RCT_REMOVE_LEGACY_ARCH=0 bundle exec pod install
```

---

### 4. Precompiled iOS binaries (default)

**Risk: LOW** — `RCT_USE_PREBUILT_RNCORE=1` is now default. CocoaPods no longer compiles React Native from source.

**Benefits:** Faster pod install and build times.

**If issues arise:** Build from source with:
```bash
RCT_USE_PREBUILT_RNCORE=0 bundle exec pod install
```

---

### 5. Android legacy classes removed

**Risk: LOW for AEP SDKs** — none of the removed classes are used by our modules.

Removed classes:
```
com.facebook.react.LazyReactPackage
com.facebook.react.bridge.CxxModuleWrapper / CxxModuleWrapperBase
com.facebook.react.bridge.CallbackImpl
com.facebook.react.bridge.NotThreadSafeBridgeIdleDebugListener
com.facebook.react.bridge.OnBatchCompleteListener
com.facebook.react.bridge.ReactCxxErrorHandler
com.facebook.react.bridge.ReactInstanceManagerInspectorTarget
com.facebook.react.modules.debug.DidJSUpdateUiDuringFrameDetector
com.facebook.react.devsupport.BridgeDevSupportManager
com.facebook.react.uimanager.NativeKind
com.facebook.react.uimanager.debug.NotThreadSafeViewHierarchyUpdateDebugListener
com.facebook.react.uimanager.layoutanimation.LayoutAnimationController / LayoutAnimationListener
```

**Action:** Grep the codebase for any reference to these classes. If found, migrate to New Architecture equivalents.

---

### 6. iOS RCTImage observer API change

**Risk: LOW** — Only affects libraries using `ImageResponseObserverCoordinator`.

**Action:** Check if `react-native-svg` or other image libraries need updates.

---

### 7. C++ `BigStringBuffer` removed

**Risk: LOW** — `JSBigString` now implements `jsi::Buffer` directly.

**Action:** Check for any C++ code subclassing `BigStringBuffer`.

---

### 8. `TurboModuleProviderFunctionType` deprecated

**Risk: LOW** — We don't use this directly.

**Action:** No immediate action. Monitor for removal in future releases.

---

## Files That Need Changes

### Shared / Root

| File | Change | Notes |
|------|--------|-------|
| `package.json` | Update `react-native` to `0.84.0`, `react` to `19.2.3` | Also update `@react-native/*` devDeps to `0.84.x` |
| `package.json` | Update `engines.node` to `>=22` | RN 0.84 requires Node 22.11+ |
| `package.json` | Update `@react-native-community/cli*` to matching version | Must match RN 0.84 |
| `.nvmrc` | Create or update to `22` | If not already present |

### iOS

| File | Change | Notes |
|------|--------|-------|
| `ios/Podfile` | Update `min_ios_version_supported` if changed | Check upgrade helper |
| `ios/Podfile` | Verify `use_frameworks! :linkage => :static` still present | Required for AEP SDK |
| `ios/Podfile` | Verify `post_install` Swift flags still present | `-no-verify-emitted-module-interface` |
| `ios/Podfile.lock` | Delete and regenerate | `rm -rf Pods Podfile.lock build && pod install` |
| `ios/*.xcodeproj` | Check for Xcode project setting changes | Upgrade helper will show diffs |

### Android

| File | Change | Notes |
|------|--------|-------|
| `android/build.gradle` | Update `com.facebook.react:react-native` if pinned | Should resolve from RN 0.84 |
| `android/build.gradle` | Check `kotlinVersion`, `compileSdkVersion`, `targetSdkVersion` | Current: Kotlin 2.1.20, SDK 36 — may need bump |
| `android/gradle/wrapper/gradle-wrapper.properties` | Update Gradle version if required | Current: 9.0.0 |
| `android/app/build.gradle` | Check `hermesEnabled`, build config changes | Hermes V1 is now default |
| `android/gradle.properties` | Check for new/changed properties | Upgrade helper will show |

---

## Proposed Upgrade Steps

### Step 1: Update Node.js

```bash
nvm install 22
nvm use 22
node -v  # verify >= 22.11
```

### Step 2: Update dependencies

```bash
cd apps/AEPSampleApp

# Update package.json manually based on upgrade helper diff:
# - react-native: "0.84.0"
# - react: "19.2.3"
# - @react-native/babel-preset: "0.84.0"
# - @react-native/eslint-config: "0.84.0"
# - @react-native/metro-config: "0.84.0"
# - @react-native/typescript-config: "0.84.0"
# - @react-native-community/cli: matching 0.84 version
# - @react-native-community/cli-platform-android: matching
# - @react-native-community/cli-platform-ios: matching
# - @react-native/new-app-screen: "0.84.0"

# Then install
cd ../..
yarn install
```

### Step 3: Apply file changes from Upgrade Helper

Open https://react-native-community.github.io/upgrade-helper/?from=0.83.0&to=0.84.0 and apply each file diff to the AEPSampleApp.

### Step 4: Clean and rebuild iOS

```bash
cd apps/AEPSampleApp/ios
rm -rf Pods Podfile.lock build
pod install
# DO NOT delete ios/build after pod install (known gotcha #1)
```

### Step 5: Clean and rebuild Android

```bash
cd apps/AEPSampleApp/android
rm -rf app/.cxx app/build
# Do NOT use ./gradlew clean (known gotcha — CMake GLOB mismatch)
./gradlew assembleDebug
```

---

## Proposed Validation Steps

### iOS Validation

```bash
# Debug build
cd apps/AEPSampleApp/ios
xcodebuild -workspace AEPSampleApp.xcworkspace \
  -scheme AEPSampleApp \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build

# If build succeeds, launch on simulator
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/AEPSampleApp.app
xcrun simctl launch booted <bundle-id>
```

**Verify:**
- [ ] App launches without crash
- [ ] SDK init status shows "ready"
- [ ] Navigate to each SDK screen (Core, Edge, Optimize, Messaging, etc.)
- [ ] Call `extensionVersion()` on each module
- [ ] Call `updatePropositions` + `getPropositions` on Optimize screen
- [ ] Verify `onPropositionUpdate` callback fires (if using CodegenTypes.EventEmitter)

### Android Validation

```bash
# Debug build
cd apps/AEPSampleApp/android
./gradlew assembleDebug

# Install and launch
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n <package>/<activity>
```

**Verify:**
- [ ] App launches without crash
- [ ] SDK init status shows "ready"
- [ ] Navigate to each SDK screen
- [ ] Call `extensionVersion()` on each module
- [ ] Call `updatePropositions` + `getPropositions` on Optimize screen
- [ ] Verify `onPropositionUpdate` callback fires

---

## AEP SDK-Specific Concerns

### 1. `sendEventWithName:` is dead on RN 0.84+

**Impact:** Any AEP module that emits events via `sendEventWithName:` will silently drop events.

**Root cause:** `RCTTurboModuleManager.mm:794` sets `callableJSModules:nil` for turbo modules. `sendEventWithName:` requires non-nil `callableJSModules`.

**Affected modules:** Any module with `getTurboModule:` that uses `sendEventWithName:`.

**Fix:** Migrate to `CodegenTypes.EventEmitter` + `NativeAEP<Module>SpecBase`. See `agent-docs/context/turbo-module-event-emission.md`.

**Already fixed for:** `@adobe/react-native-aepoptimize` (on `optimize-turbo-module-e2e` branch).

**Check for other modules:** Grep for `sendEventWithName:` in:
```bash
grep -rn "sendEventWithName" packages/*/ios/src/
```

### 2. `NativeModules` is now turbo module proxy

**Impact:** `NativeModules.AEP<Module>` returns the turbo module instance (if codegen spec exists), NOT a bridge module.

**Implication:** Modules that rely on `NativeModules` + bridge behavior for events will need migration.

### 3. `getTurboModule:` is mandatory for codegen-registered modules

**Impact:** Modules with `codegenConfig` in `package.json` MUST implement `getTurboModule:`. Without it, `RCTModuleProviders.mm` skips the module.

**Check:** Verify all packages with `codegenConfig` have `getTurboModule:` on iOS.

### 4. Module name consistency

**Risk:** Name mismatch between `TurboModuleRegistry.getEnforcing()`, iOS `moduleName`, and Android `getName()` causes silent "module not found".

**Check:** Verify module names match exactly for all migrated modules.

---

## Likely Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `nvm: command not found` or wrong Node version | RN 0.84 needs Node 22.11+ | `nvm install 22 && nvm use 22` |
| `RCTAppDependencyProvider.h: No such file` | Deleted `ios/build` after `pod install` | Re-run `pod install` (generates files into `ios/build`) |
| `Module provider X does not conform to RCTModuleProvider` | Missing `getTurboModule:` | Add `getTurboModule:` returning `NativeAEP<Module>SpecJSI(params)` |
| `TurboModuleRegistry: module not found` | Module name mismatch | Verify `TurboModuleRegistry.getEnforcing('NativeAEP<Module>')` matches native `moduleName` |
| `sendEventWithName:` events lost | `callableJSModules:nil` for turbo modules | Migrate to `CodegenTypes.EventEmitter` |
| `externalNativeBuildCleanDebug FAILED` | Used `./gradlew clean` | Use `rm -rf app/.cxx app/build` instead |
| `Couldn't determine Hermesc location` | nohoist + hermesc path | Set `hermesCommand` in `app/build.gradle` |
| Pod install fails after Xcode upgrade | Stale CocoaPods cache | `rm -rf ~/Library/Caches/CocoaPods && pod install --repo-update` |
| Swift module verification errors | Missing `post_install` flag | Add `-no-verify-emitted-module-interface` to `OTHER_SWIFT_FLAGS` |

---

## Open Risks / Things Worth Investigating

1. **Third-party library compatibility:** Check if `react-native-webview`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`, `recyclerlistview`, `react-native-worklets` have RN 0.84-compatible versions.

2. **Navigation libraries:** `@react-navigation/*` may need updates for RN 0.84 compatibility.

3. **Hermes V1 behavior changes:** New Hermes engine may have subtle JS behavior differences. Watch for:
   - `Intl` API differences
   - `Proxy` behavior
   - WeakRef / FinalizationRegistry behavior

4. **Precompiled binary architecture:** `RCT_USE_PREBUILT_RNCORE=1` (default) downloads precompiled binaries. Verify they match the deployment architecture (arm64 vs x86_64 for simulator).

5. **Monorepo workspace resolution:** `yarn install` with workspace hoisting may resolve dependencies differently with RN 0.84. Check `nohoist` configuration.

6. **AEP SDK pod versions:** Verify AEP SDK pods are compatible with the new Xcode/Swift toolchain that RN 0.84 targets.

---

## Lessons Learned (from AwesomeProject 0.84 upgrade)

These lessons were learned during the AwesomeProject upgrade and documented in `agent-docs/`:

1. **Never delete `ios/build` after `pod install`** — codegen writes `RCTAppDependencyProvider.h` there.
2. **`getTurboModule:` must be on ALL paths** — `RCTModuleProviders.mm` requires it.
3. **`sendEventWithName:` is dead** — use `CodegenTypes.EventEmitter` for event emission.
4. **`NativeModules` = turbo proxy** — both resolve to the same instance.
5. **Clean Pods when switching `USE_INTEROP_ROOT`** — stale artifacts ignore new value.
6. **Android: clean `packages/*/android/build/`** before turbo release builds.
7. **Android: never use `./gradlew clean`** — use `rm -rf app/.cxx app/build`.

---

## Notes for the Next Engineer

1. **Start with the Upgrade Helper** — it's the file-by-file source of truth for template changes.
2. **Read `agent-docs/context/known-gotchas.md`** — has 17+ gotchas from the AwesomeProject migration.
3. **Read `agent-docs/context/turbo-module-event-emission.md`** — critical if any module emits events.
4. **Read `agent-docs/context/rn-084-085-impact-on-sdk.md`** — full impact analysis.
5. **Test on BOTH turbo and interop paths** — `USE_INTEROP_ROOT=0` and `USE_INTEROP_ROOT=1`.
6. **Don't skip Android** — it has its own set of gotchas (stale autolinking, CMake GLOB, hermesc path).
7. **Node 22+ is mandatory** — set it up FIRST before anything else.
8. **The monorepo makes things harder** — workspace hoisting, nohoist, symlinks all interact with RN's build system. Be patient.
