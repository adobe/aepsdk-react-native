# Optimize → Turbo Native Module Migration Playbook

**Status:** Android + iOS extensionVersion DONE  
**Last updated:** 2026-03-26

---

## Architecture overview

```
JS spec (specs/NativeAEPOptimize.ts)   ← Codegen reads this
         ↓ generates
─── Android ───
NativeAEPOptimizeSpec.java             ← abstract base class
         ↓ extends
NativeAEPOptimizeModule.java           ← Turbo module impl (USE_INTEROP_ROOT=false)
         ↓ delegates to
RCTAEPOptimizeUtil.java                ← shared logic (also used by Interop module)

─── iOS ───
NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h  ← generated protocol + JSI class
         ↓ conforms to
RCTAEPOptimize.mm                      ← Turbo module impl (NSObject <NativeAEPOptimizeSpec>)

src/NativeAEPOptimize.ts               ← runtime import for Optimize.ts, Offer.ts, Proposition.ts
         ↓ TurboModuleRegistry.getEnforcing
native module
```

### Dual-mode switch

Both Android and iOS use the same `USE_INTEROP_ROOT` flag (`false`/`0` = Turbo, `true`/`1` = legacy bridge):

| Platform | Where the flag lives | How it works |
|----------|---------------------|-------------|
| **Android** | `packages/optimize/android/build.gradle` → `buildConfigField "boolean", "USE_INTEROP_ROOT", "false"` | `RCTAEPOptimizePackage` reads `BuildConfig.USE_INTEROP_ROOT` at runtime to pick Turbo vs interop module. |
| **iOS** | `packages/optimize/RCTAEPOptimize.podspec` → `GCC_PREPROCESSOR_DEFINITIONS` → `USE_INTEROP_ROOT=0` | `#if USE_INTEROP_ROOT` in `.h`/`.mm` selects at **compile time** between legacy bridge (`RCTEventEmitter`, `RCT_EXPORT_MODULE`) and Turbo (`NSObject <NativeAEPOptimizeSpec>`, `getTurboModule:`). |

To switch to the interop (legacy bridge) path, change the value to `true` (Android) / `1` (iOS) and rebuild.

---

## Migrated APIs

| API | Android | iOS | E2E spec | Notes |
|-----|---------|-----|----------|-------|
| `extensionVersion()` | ✅ | ✅ | `optimize-extension-version.spec.js` | First migrated; reference pattern |

---

## Steps to migrate an API (reference: extensionVersion)

### 1. JS / TypeScript

| File | What changed |
|------|-------------|
| `specs/NativeAEPOptimize.ts` | Add method to `Spec` interface (Codegen source of truth) |
| `src/NativeAEPOptimize.ts` | Mirror of `specs/` — same interface, `TurboModuleRegistry.getEnforcing<Spec>('NativeAEPOptimize')` |
| `src/Optimize.ts` | Replace `NativeModules.AEPOptimize` with `import NativeAEPOptimize from './NativeAEPOptimize'` |
| `src/models/Offer.ts` | Same — replace `NativeModules` import with `NativeAEPOptimize` |
| `src/models/Proposition.ts` | Same |

**Gotcha:** `specs/` must be excluded from `tsconfig.json` (`"exclude": ["__tests__", "dist", "specs"]`) because `rootDir` is `./src`.

**Gotcha:** Turbo spec uses `Object` for complex types. TS methods returning `Promise<Map<string, any>>` need a cast: `as Promise<Map<string, any>>`.

### 2. package.json — codegenConfig

```json
"codegenConfig": {
  "name": "NativeAEPOptimizeSpec",
  "type": "modules",
  "jsSrcsDir": "specs",
  "android": {
    "javaPackageName": "com.adobe.marketing.mobile.reactnative.optimize"
  },
  "ios": {
    "modulesProvider": {
      "NativeAEPOptimize": "RCTAEPOptimize"
    }
  }
}
```

**Gotcha (iOS):** The `modulesProvider` value must be the **ObjC class name** (`RCTAEPOptimize`), NOT `RCTNativeAEPOptimize`. The key is the spec/module name used in JS.

### 3. Android build.gradle

```groovy
def isNewArchitectureEnabled() {
    return rootProject.hasProperty("newArchEnabled") && rootProject.newArchEnabled == "true"
}
if (isNewArchitectureEnabled()) {
    apply plugin: 'com.facebook.react'
}

// In defaultConfig:
buildConfigField "boolean", "USE_INTEROP_ROOT", "false"

// Enable BuildConfig generation:
buildFeatures { buildConfig true }
```

### 4. Android native

| File | Role |
|------|------|
| `NativeAEPOptimizeModule.java` | **New.** Extends `NativeAEPOptimizeSpec` (generated). Implements each spec method. |
| `RCTAEPOptimizeModule.java` | **Unchanged.** Legacy bridge module (`getName()` = `"AEPOptimize"`). |
| `RCTAEPOptimizeUtil.java` | **Refactored.** Shared helpers (`offerDisplayed`, `cachePropositionOffers`, `emitOnPropositionsUpdate`, etc.) callable from both modules. |
| `RCTAEPOptimizePackage.java` | **Rewritten.** `extends BaseReactPackage`. `getModule()` + `getReactModuleInfoProvider()` switch on `BuildConfig.USE_INTEROP_ROOT`. |

### 5. iOS native

| File | Role |
|------|------|
| `ios/src/RCTAEPOptimize.h` | Declares `RCTAEPOptimize` conforming to `NativeAEPOptimizeSpec` (Codegen-generated protocol). |
| `ios/src/RCTAEPOptimize.mm` | Implements the module: `getTurboModule:`, `moduleName`, and all spec methods. |
| `RCTAEPOptimize.podspec` | Pod spec with `React-Codegen` dependency and `HEADER_SEARCH_PATHS` for codegen output. |

#### Header (`RCTAEPOptimize.h`) — dual-mode via `USE_INTEROP_ROOT`

```objc
#import <Foundation/Foundation.h>

#if USE_INTEROP_ROOT
  #import <React/RCTBridgeModule.h>
  #import <React/RCTEventEmitter.h>
  #import <ReactCommon/RCTTurboModule.h>
  @interface RCTAEPOptimize : RCTEventEmitter <RCTBridgeModule, RCTTurboModule>
#else
  #import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
  @interface RCTAEPOptimize : NSObject <NativeAEPOptimizeSpec>
#endif
@end
```

Key points:
- `USE_INTEROP_ROOT=0` (Turbo): imports codegen header, conforms to `NativeAEPOptimizeSpec` protocol
- `USE_INTEROP_ROOT=1` (Interop): inherits from `RCTEventEmitter`, conforms to both `RCTBridgeModule` and `RCTTurboModule` (the latter satisfies the codegen `RCTModuleProvider` conformance check)
- **Import path:** Use `<ReactCommon/RCTTurboModule.h>` (NOT `<React/RCTTurboModule.h>`) — in RN 0.84 with prebuilt binaries, the header lives under `ReactCommon`
- The flag is set via `GCC_PREPROCESSOR_DEFINITIONS` in the podspec

#### Implementation (`RCTAEPOptimize.mm`) — dual-mode via `#if USE_INTEROP_ROOT`

The `.mm` file uses `#if USE_INTEROP_ROOT` / `#else` to compile two separate code paths:

**Interop path** (`USE_INTEROP_ROOT=1`):
- Uses `RCT_EXPORT_MODULE(NativeAEPOptimize)` for bridge registration (name must match JS lookup)
- Uses `RCT_EXPORT_METHOD(...)` macros for each method
- Conforms to `RCTTurboModule` with `getTurboModule:` returning a generic `ObjCTurboModule(params)` wrapper (wraps `RCT_EXPORT_METHOD` methods for dynamic dispatch)
- Uses `RCTEventEmitter` methods: `supportedEvents`, `startObserving`, `stopObserving`, `sendEventWithName:`

**Turbo path** (`USE_INTEROP_ROOT=0`):
- Implements `+ moduleName` → `@"NativeAEPOptimize"`
- Implements `- getTurboModule:` → `NativeAEPOptimizeSpecJSI`
- Implements all protocol methods with exact codegen selector names
- Uses `addListener:` / `removeListeners:` for event emission

```objc
#if USE_INTEROP_ROOT
RCT_EXPORT_MODULE(NativeAEPOptimize);
// ... RCT_EXPORT_METHOD macros ...
// getTurboModule: returns ObjCTurboModule(params) — generic interop wrapper
#else
+ (NSString *)moduleName { return @"NativeAEPOptimize"; }
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}
// ... protocol methods with codegen-exact selectors ...
#endif
```

Shared helpers (caching, conversion, etc.) live **outside** the `#if`/`#else` block.

**Critical:** Method selectors differ between interop and Turbo. E.g. interop uses `rejecter:` while Turbo uses `reject:`, interop uses `propositionDictionary:` while Turbo uses `propositionMap:`.

#### Podspec (`RCTAEPOptimize.podspec`)

```ruby
s.source_files  = 'ios/**/*.{h,m,mm}'          # Include .mm files
s.dependency "React-Codegen"                    # Required for codegen headers
s.pod_target_xcconfig = {
  "CLANG_ENABLE_MODULES" => "YES",
  "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules",
  "HEADER_SEARCH_PATHS" => '$(inherited) "$(PODS_ROOT)/../build/generated/ios/ReactCodegen" "$(PODS_ROOT)/Headers/Public/ReactCodegen"',
  "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=0"
}
```

The `USE_INTEROP_ROOT=0` define controls the compile-time switch between Turbo (`0`) and legacy bridge (`1`). Change to `USE_INTEROP_ROOT=1` to fall back to the interop layer.

#### package.json — iOS modulesProvider

```json
"ios": {
  "modulesProvider": {
    "NativeAEPOptimize": "RCTAEPOptimize"
  }
}
```

- **Key** `"NativeAEPOptimize"` = spec/module name (matches JS side and `moduleName`)
- **Value** `"RCTAEPOptimize"` = ObjC class name (the actual implementation class)

### 6. Run codegen

**Android:**
```sh
cd apps/AwesomeProject/android
./gradlew generateCodegenArtifactsFromSchema
```
Generates `NativeAEPOptimizeSpec.java` in `packages/optimize/android/build/generated/source/codegen/`.

**iOS:**
```sh
cd apps/AwesomeProject/ios
pod install
```
Codegen runs as a CocoaPods script phase. Generates `NativeAEPOptimizeSpec.h` and `NativeAEPOptimizeSpecJSI.h` in `build/generated/ios/ReactCodegen/NativeAEPOptimizeSpec/`.

### 7. Build

```sh
yarn build                        # TS compile all packages

# Android
yarn awesomeproject:android:assembleDebug

# iOS
yarn awesomeproject:ios:build     # or: cd apps/AwesomeProject/ios && xcodebuild ...
```

### 8. Verify

```sh
# Android
E2E_PLATFORM=android yarn e2e:android

# iOS
yarn e2e:ios
```

Success metric: `Optimize.extensionVersion() => x.y.z` in callback log, no error line.

---

## Errors encountered and fixes

| # | Platform | Error | Fix |
|---|----------|-------|-----|
| 1 | TS | `TS6059: File 'specs/NativeAEPOptimize.ts' is not under rootDir 'src'` | Add `"specs"` to `tsconfig.json` `"exclude"` array |
| 2 | TS | `TS2322: Type 'Promise<Object>' is not assignable to type 'Promise<Map<string, any>>'` | Cast return values: `as Promise<Map<string, any>>` |
| 3 | Android | `TurboModuleRegistry.getEnforcing(...): 'NativeAEPOptimize' could not be found` | Stale autolinking cache — see **Troubleshooting: Stale autolinking cache** below |
| 4 | iOS | `duplicate declaration of method 'moduleName'` | `RCT_EXPORT_MODULE()` macro defines `moduleName`. Don't also define it manually in the same `#ifdef` branch. |
| 5 | iOS | `fatal error: 'NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h' file not found` | Add `HEADER_SEARCH_PATHS` to podspec — see **Troubleshooting: Codegen header not found** below |
| 6 | iOS | `Module provider RCTAEPOptimize does not conform to RCTModuleProvider` → `TurboModuleRegistry.getEnforcing(...): 'NativeAEPOptimize' could not be found` | `RCT_NEW_ARCH_ENABLED` is NOT defined in pod build settings on RN 0.84. Remove `#ifdef RCT_NEW_ARCH_ENABLED` guards — see **Troubleshooting: RCT_NEW_ARCH_ENABLED not defined** below |
| 7 | iOS | `TurboModuleRegistry.getEnforcing(...): 'NativeAEPOptimize' could not be found` when `USE_INTEROP_ROOT=1` | Interop `RCT_EXPORT_MODULE(AEPOptimize)` registered module as `"AEPOptimize"` but JS calls `getEnforcing('NativeAEPOptimize')`. Fix: use `RCT_EXPORT_MODULE(NativeAEPOptimize)` so the bridge name matches the JS lookup name. |
| 8 | iOS | `Module provider RCTAEPOptimize does not conform to RCTModuleProvider` + `'NativeAEPOptimize' could not be found` on first launch when `USE_INTEROP_ROOT=1`. | Two-part fix: (a) conform to `RCTTurboModule` in header (b) return `std::make_shared<ObjCTurboModule>(params)` from `getTurboModule:` (NOT `nullptr` — the codegen provider short-circuits legacy fallback). See **Troubleshooting: Interop module does not conform to RCTModuleProvider** below. |
| 9 | iOS | `RCTAppDependencyProvider.h: No such file or directory` during xcodebuild (`ReactAppDependencyProvider` target) | `e2e:ios:build:turbo` / `e2e:ios:build:interop` had a second `rm -rf ios/build` after `pod install`, deleting codegen output before xcodebuild. Fix: remove the redundant second clean. See **Troubleshooting: RCTAppDependencyProvider.h missing after pod install** below and `cursor-docs/errors/e2e-ios-build-rctappdependencyprovider-not-found.md`. |
| 10 | iOS | `undefined is not a function` on every API call when `USE_INTEROP_ROOT=1` | Interop path was missing `getTurboModule:` and `NativeAEPOptimizeSpec` conformance. RN 0.84 codegen checks `RCTModuleProvider` at startup — without `getTurboModule:` the module is invisible to TurboModuleRegistry. Fix: conform interop header to `NativeAEPOptimizeSpec`; move `getTurboModule:` (returning `NativeAEPOptimizeSpecJSI`) outside the `#if/#else` block. See **Troubleshooting: Interop path undefined function** below and `cursor-docs/errors/e2e-ios-interop-undefined-function-no-turbomodule.md`. |
| 11 | Android | `externalNativeBuildCleanDebug FAILED` — CMake GLOB mismatch / aepoptimize codegen JNI dir not found during clean | Stale `.cxx/Debug` state references the codegen JNI directory that only exists after assembly. `./gradlew clean` triggers CMake re-run which fails. Fix: replace `./gradlew clean assembleRelease` with `rm -rf app/.cxx app/build && ./gradlew assembleRelease`. See `cursor-docs/errors/e2e-android-build-cmake-clean-glob-mismatch.md`. |
| 12 | Android | `Couldn't determine Hermesc location` during `createBundleReleaseJsAndAssets` | `hermes-compiler` is a transitive dep of `react-native` but `nohoist: ["**"]` prevents it from being installed in `apps/AwesomeProject/node_modules/`. Fix: set `hermesCommand = "$rootDir/../../../node_modules/hermes-compiler/hermesc/%OS-BIN%/hermesc"` in `build.gradle`. See `cursor-docs/errors/e2e-android-build-hermesc-not-found.md`. |
| 13 | Android | `Activity cannot be launched` — release APK not installed by Appium | `wdio.android.conf.js` hardcoded debug APK path; release build writes `app-release.apk` to a different directory. Fix: add `ANDROID_CONFIGURATION` env var to `wdio.android.conf.js`; pass `ANDROID_CONFIGURATION=release` in release E2E scripts. See `cursor-docs/errors/e2e-android-appium-release-apk-not-installed.md`. |

---

## Troubleshooting: Stale autolinking cache (Error #3)

### Symptoms

At runtime the app red-boxes with:

```
Uncaught Error: TurboModuleRegistry.getEnforcing(...):
  'NativeAEPOptimize' could not be found.
  Verify that a module by this name is registered in the native binary.
```

Followed by:

```
Render Error: Cannot read property 'DecisionScope' of undefined
```

The build itself succeeds; the Java classes are present in the APK; logcat shows `RCTAEPOptimizePackage.getReactModuleInfos` registering the module info. Yet the JS side cannot resolve it.

### Root cause

React Native's Turbo Module system on Android has **two layers** of module lookup:

1. **C++ autolinking** — `autolinking.cpp` (generated by `@react-native/gradle-plugin`) contains `autolinking_ModuleProvider()` which provides C++ JNI wrappers that call into Java modules. The TurboModuleManager calls this first via `global.__turboModuleProxy(name)`.
2. **Java fallback** — `NativeModules[name]` on the legacy bridge, but modules marked with `isTurboModule = true` in `ReactModuleInfo` are intentionally *skipped* by the bridge iterator in `BaseReactPackage.getNativeModuleIterator()`.

The generated `autolinking.cpp` and `Android-autolinking.cmake` are driven by an **input JSON file**: `<rootProject>/build/generated/autolinking/autolinking.json`. This file is created by the React Native settings plugin (`ReactSettingsExtension.kt`) which runs `npx @react-native-community/cli config` and **caches the result**. The cache is invalidated only when:

- The `autolinking.json` file is missing or empty
- Lock files (`yarn.lock`, `package-lock.json`, `package.json`) have changed (SHA comparison)
- The config model's `project.android.packageName` is null

**The problem:** When you add `codegenConfig` to a package's `package.json` (which populates `libraryName` in the config output), the *package-level* `package.json` changes — but the **root-level** lock files and `package.json` do not change. So the cache is NOT invalidated. The stale `autolinking.json` has `libraryName: null` for the module, causing `autolinking_ModuleProvider()` to skip it entirely.

### The fix

Delete the cached `autolinking.json` and its SHA files, then rebuild:

```sh
# 1. Remove stale autolinking cache
rm -f apps/AwesomeProject/android/build/generated/autolinking/autolinking.json
rm -f apps/AwesomeProject/android/build/generated/autolinking/*.sha

# 2. Remove old build artifacts (use rm -rf instead of gradlew clean,
#    because clean runs cmake which may fail referencing deleted dirs)
rm -rf apps/AwesomeProject/android/app/build
rm -rf apps/AwesomeProject/android/app/.cxx
rm -rf apps/AwesomeProject/android/build

# 3. Rebuild — Gradle will re-run `npx @react-native-community/cli config`
#    and regenerate autolinking.json with the correct libraryName
cd apps/AwesomeProject/android && ./gradlew assembleDebug
```

### How to verify

After rebuilding, inspect the generated files:

```sh
# autolinking.cpp should now include your module provider:
grep NativeAEPOptimizeSpec apps/AwesomeProject/android/app/build/generated/autolinking/src/main/jni/autolinking.cpp
# Expected: #include <NativeAEPOptimizeSpec.h>
#           auto module_NativeAEPOptimizeSpec = NativeAEPOptimizeSpec_ModuleProvider(moduleName, params);

# Android-autolinking.cmake should include the codegen JNI subdirectory:
grep NativeAEPOptimizeSpec apps/AwesomeProject/android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake
# Expected: add_subdirectory(".../android/build/generated/source/codegen/jni/" NativeAEPOptimizeSpec_autolinked_build)
#           react_codegen_NativeAEPOptimizeSpec
```

### Key lesson for future migrations

**After adding `codegenConfig` to any package's `package.json`, always invalidate the autolinking cache before building the app.** This is required because the Gradle settings plugin caches `npx @react-native-community/cli config` output and only re-runs it when root-level lock/package files change.

Add this to your migration checklist:

```sh
rm -f apps/AwesomeProject/android/build/generated/autolinking/autolinking.json
rm -f apps/AwesomeProject/android/build/generated/autolinking/*.sha
```

---

## Troubleshooting: Codegen header not found (Error #5, iOS)

### Symptom

```
fatal error: 'NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h' file not found
```

### Root cause

The codegen generates iOS headers into `apps/<App>/ios/build/generated/ios/ReactCodegen/` during `pod install`. The pod's default `HEADER_SEARCH_PATHS` does not include this directory.

### Fix

Add `HEADER_SEARCH_PATHS` to the podspec's `pod_target_xcconfig`:

```ruby
s.pod_target_xcconfig = {
  "HEADER_SEARCH_PATHS" => '$(inherited) "$(PODS_ROOT)/../build/generated/ios/ReactCodegen" "$(PODS_ROOT)/Headers/Public/ReactCodegen"'
}
```

Then re-run `pod install` and rebuild.

---

## Troubleshooting: RCT_NEW_ARCH_ENABLED not defined (Error #6, iOS)

### Symptom

Runtime error:
```
Module provider RCTAEPOptimize does not conform to RCTModuleProvider
```
Followed by:
```
TurboModuleRegistry.getEnforcing(...): 'NativeAEPOptimize' could not be found.
```

The build succeeds, but the module isn't registered at runtime.

### Root cause

In React Native 0.84, the new architecture is the **default**. The preprocessor macro `RCT_NEW_ARCH_ENABLED` is **NOT** defined for pod targets. Instead, RN 0.84 uses `RCT_REMOVE_LEGACY_ARCH=1`.

If your code uses `#ifdef RCT_NEW_ARCH_ENABLED` to guard `getTurboModule:` and `moduleName`, those methods are never compiled. The codegen-generated `RCTModuleProviders.mm` instantiates your class at runtime and checks `respondsToSelector:@selector(getTurboModule:)` — which fails because the method was ifdef'd out.

### Fix

Remove all `#ifdef RCT_NEW_ARCH_ENABLED` / `#ifndef RCT_NEW_ARCH_ENABLED` guards. Since RN 0.84 only supports the new architecture, always compile:

1. `getTurboModule:` → returns `NativeAEPOptimizeSpecJSI`
2. `+ (NSString *)moduleName` → returns `@"NativeAEPOptimize"`
3. The codegen protocol conformance in the header

Do NOT use `RCT_EXPORT_MODULE()` macro (legacy bridge registration). Do NOT conditionally inherit from `RCTEventEmitter`.

### Key lesson

**For RN 0.84+, do NOT use `#ifdef RCT_NEW_ARCH_ENABLED` to guard Turbo Module methods.** The new architecture is always active and `RCT_NEW_ARCH_ENABLED` is not guaranteed to be defined in all build targets.

---

## Troubleshooting: Interop module does not conform to RCTModuleProvider (Error #8, iOS)

### Symptom

On first app launch with `USE_INTEROP_ROOT=1`, the redbox shows:

```
Module provider RCTAEPOptimize does not conform to RCTModuleProvider
```

The app works correctly after pressing the **Reload** button, but e2e tests fail because the module is not available on the first load.

### Root cause

The `codegenConfig.ios.modulesProvider` entry in `package.json` causes codegen to generate `RCTModuleProviders.mm` (during `pod install`). This generated file runs at startup and checks:

```objc
[RCTAEPOptimize conformsToProtocol:@protocol(RCTModuleProvider)]
```

The `RCTModuleProvider` protocol (defined in `<React/RCTTurboModule.h>`) requires:

```objc
@protocol RCTModuleProvider <NSObject>
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params;
@end
```

And `RCTTurboModule` inherits from it:

```objc
@protocol RCTTurboModule <RCTModuleProvider>
@end
```

When `USE_INTEROP_ROOT=1`, the interop header declared `RCTAEPOptimize` as conforming only to `RCTBridgeModule`:

```objc
@interface RCTAEPOptimize : RCTEventEmitter <RCTBridgeModule>  // ← missing RCTModuleProvider
```

The class did not implement `getTurboModule:`, so the conformance check failed. The module wasn't registered in the Turbo Module system. On reload, the legacy bridge's `RCT_EXPORT_MODULE` registration kicked in via the interop layer, which is why it worked the second time.

### Fix

1. **Header** — also conform to `RCTTurboModule` in the interop branch:

```objc
#if USE_INTEROP_ROOT
  #import <React/RCTBridgeModule.h>
  #import <React/RCTEventEmitter.h>
  #import <ReactCommon/RCTTurboModule.h>
  @interface RCTAEPOptimize : RCTEventEmitter <RCTBridgeModule, RCTTurboModule>
#else
  // ... Turbo path unchanged ...
#endif
```

2. **Implementation** — return a generic `ObjCTurboModule` wrapper from `getTurboModule:` in the interop branch:

```objc
#if USE_INTEROP_ROOT
// ... RCT_EXPORT_MODULE / RCT_EXPORT_METHOD macros ...

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::ObjCTurboModule>(params);
}

#else
// ... Turbo path returns NativeAEPOptimizeSpecJSI ...
#endif
```

**Critical:** Do NOT return `nullptr` — the codegen module provider takes priority over legacy bridge registration. If `getTurboModule:` returns `nullptr`, the Turbo Module manager considers the module "not found" and does **not** fall back to the bridge. Instead, return a generic `ObjCTurboModule` which automatically wraps the `RCT_EXPORT_METHOD` method map for dynamic JS-to-ObjC dispatch. This is the same mechanism the interop layer uses internally.

### Key lesson

**When using `modulesProvider` in `codegenConfig` alongside a dual-mode (interop/turbo) switch, the interop path must still conform to `RCTTurboModule` and return a valid `ObjCTurboModule` from `getTurboModule:`.** The codegen module provider takes priority — if `getTurboModule:` returns `nullptr`, the Turbo Module manager considers the module "not found" and does NOT fall back to the legacy bridge. Return `std::make_shared<ObjCTurboModule>(params)` to create a generic wrapper that uses the `RCT_EXPORT_METHOD` method map for dynamic dispatch.

---

## Checklist for next API migration

- [ ] Add method signature to `specs/NativeAEPOptimize.ts` and `src/NativeAEPOptimize.ts`
- [ ] **Android:** Implement in `NativeAEPOptimizeModule.java` (override spec method)
- [ ] **Android:** Extract shared logic to `RCTAEPOptimizeUtil.java` if not already there
- [ ] **iOS:** Implement protocol method in `RCTAEPOptimize.mm` with exact selector names from codegen protocol
- [ ] Update JS caller (Optimize.ts / Offer.ts / Proposition.ts) if needed
- [ ] Add e2e spec or extend existing one with new assertion
- [ ] Run codegen → build → e2e on both platforms
- [ ] Update this playbook table

## Checklist for first-time Turbo Module setup on a new package

### Common (JS / TS)
- [ ] Add `codegenConfig` to the package's `package.json` (name, type, jsSrcsDir, android, ios)
- [ ] Create `specs/NativeXxx.ts` with `TurboModuleRegistry.getEnforcing<Spec>('NativeXxx')`
- [ ] Run `yarn build` to compile TS changes

### Android
- [ ] Set up `build.gradle` with `com.facebook.react` plugin, `USE_INTEROP_ROOT` flag, `buildFeatures { buildConfig true }`
- [ ] Set `hermesCommand` in `apps/AwesomeProject/android/app/build.gradle` to point to the monorepo root `hermes-compiler` (required for release builds in `nohoist` monorepos)
- [ ] Create `NativeXxxModule.java` extending the generated spec
- [ ] Rewrite the package class to extend `BaseReactPackage` with dual-mode switch
- [ ] **Invalidate the autolinking cache** (see Troubleshooting: Stale autolinking cache)
- [ ] For release builds: use `rm -rf app/.cxx app/build && ./gradlew assembleRelease` (NOT `./gradlew clean assembleRelease`)
- [ ] Run codegen → build → verify on device

### iOS
- [ ] Rename `.m` to `.mm` (Objective-C++ required for C++ JSI types)
- [ ] Update header: import `<NativeXxxSpec/NativeXxxSpec.h>` once, outside the `#if`. Both branches conform to `NativeXxxSpec`. Interop: `RCTEventEmitter <NativeXxxSpec>`. Turbo: `NSObject <NativeXxxSpec>`.
- [ ] Update `.mm`: `#if USE_INTEROP_ROOT` → `RCT_EXPORT_MODULE(NativeXxx)` only; `#else` → `+moduleName` only. Move `getTurboModule:` **outside** both branches — always returns `NativeXxxSpecJSI(params)`. Protocol method implementations are shared outside the `#if/#else`.
- [ ] Shared helpers (caching, conversion) go **outside** the `#if`/`#else` block
- [ ] Do NOT use `#ifdef RCT_NEW_ARCH_ENABLED` guards (see Troubleshooting: RCT_NEW_ARCH_ENABLED)
- [ ] Update podspec: include `.mm` in `source_files`, add `React-Codegen` dependency, add `HEADER_SEARCH_PATHS`, add `GCC_PREPROCESSOR_DEFINITIONS` with `USE_INTEROP_ROOT=0`
- [ ] Set `ios.modulesProvider` in `codegenConfig`: key = spec name, value = ObjC class name
- [ ] Clear caches: `cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build`
- [ ] Run `USE_INTEROP_ROOT=0 pod install` to trigger codegen (generates `build/generated/ios/`)
- [ ] **Do NOT delete `build/` after this point** — `build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h` is codegen output needed by xcodebuild
- [ ] Build and verify on simulator: `yarn awesomeproject:ios:build && yarn e2e:ios`

---

## Troubleshooting: Interop path — undefined function on every API call (Error #10, iOS)

### Symptom

E2E (or manual test) with `USE_INTEROP_ROOT=1` fails on every button tap:

```
Optimize.extensionVersion error: TypeError: undefined is not a function
```

The build succeeds; only the runtime JS-to-native call fails.

### Root cause

In RN 0.84, `pod install` generates `RCTModuleProviders.mm` which checks:
```objc
[RCTAEPOptimize conformsToProtocol:@protocol(RCTModuleProvider)]
```
`RCTModuleProvider` requires `getTurboModule:`. If the interop-path class:
- does not conform to the spec (`NativeAEPOptimizeSpec`), **and**
- does not implement `getTurboModule:`

…then the check fails, the module is not registered in the Turbo system, and `TurboModuleRegistry.getEnforcing('NativeAEPOptimize')` returns `undefined` for every method.

### Fix

**`RCTAEPOptimize.h`** — import the spec common to both branches; interop branch conforms to it:

```objc
#import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>

#if USE_INTEROP_ROOT
  #import <React/RCTEventEmitter.h>
  @interface RCTAEPOptimize : RCTEventEmitter <NativeAEPOptimizeSpec>
#else
  @interface RCTAEPOptimize : NSObject <NativeAEPOptimizeSpec>
#endif
```

**`RCTAEPOptimize.mm`** — move `getTurboModule:` outside the `#if/#else` block:

```objc
#if USE_INTEROP_ROOT
RCT_EXPORT_MODULE(NativeAEPOptimize);
#else
+ (NSString *)moduleName { return @"NativeAEPOptimize"; }
#endif

// Shared — satisfies RCTModuleProvider for both paths
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}
```

### Key lesson

**Every class in `codegenConfig.ios.modulesProvider` must implement `getTurboModule:`, even on the interop path.** In RN 0.84, the codegen module-provider startup check takes priority — returning `NativeXxxSpecJSI` from `getTurboModule:` satisfies it and dispatches all protocol methods correctly via ObjC runtime.

Full write-up: `cursor-docs/errors/e2e-ios-interop-undefined-function-no-turbomodule.md`

---

## Troubleshooting: RCTAppDependencyProvider.h missing after pod install (Error #9, iOS)

### Symptom

```
error: .../build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h: No such file or directory
(in target 'ReactAppDependencyProvider' from project 'Pods')
** BUILD FAILED **
```

### Root cause

React Native 0.84 generates `RCTAppDependencyProvider.{h,mm}` **during `pod install`** (pre-install hook), writing them to `build/generated/ios/ReactAppDependencyProvider/`. The `ReactAppDependencyProvider` Xcode target sources these files. If `build/generated/ios/` is deleted **after** `pod install` but **before** xcodebuild, the target cannot find its source files and fails.

The `e2e:ios:build:turbo` and `e2e:ios:build:interop` scripts in the root `package.json` had a bug: a redundant second `rm -rf ios/build` appeared after `pod install`, wiping the just-generated files:

```sh
# Broken sequence
rm -rf Pods Podfile.lock build   # (1) clean — fine
pod install                      # (2) regenerates build/generated/ios/
rm -rf ios/build                 # (3) BUG — deletes generated files
yarn awesomeproject:ios:build    # (4) fails — RCTAppDependencyProvider.h gone
```

### Fix

Removed the redundant `rm -rf ios/build` (step 3) from both scripts in `package.json`. Step 1 already cleans `build/`; step 2 regenerates what is needed; step 3 was undoing step 2.

**Recovery when generated files are already missing:**

```sh
# Do NOT rm -rf build first. Just re-run pod install to regenerate.
cd apps/AwesomeProject/ios
USE_INTEROP_ROOT=0 pod install   # regenerates build/generated/ios/
cd ../..
yarn awesomeproject:ios:build
```

### Key lesson

**Never delete `build/` between `pod install` and xcodebuild in RN 0.84+.** The `build/generated/ios/` tree is `pod install` output, not xcodebuild output; xcodebuild cannot regenerate it on its own.

Full write-up: `cursor-docs/errors/e2e-ios-build-rctappdependencyprovider-not-found.md`

---

## Reference commands

```sh
# Full build + test cycle (Android — debug)
yarn build
cd apps/AwesomeProject/android && ./gradlew generateCodegenArtifactsFromSchema
cd apps/AwesomeProject/android && ./gradlew assembleDebug
yarn e2e:android

# Full build + test cycle (Android — release, Turbo path)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:android:build:release:turbo

# Full build + test cycle (Android — release, Interop path)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:android:build:release:interop

# Quick rebuild after Java-only changes (release)
# NOTE: do NOT use ./gradlew clean — it triggers CMake GLOB mismatch. Use rm -rf instead:
cd apps/AwesomeProject/android && rm -rf app/.cxx app/build && USE_INTEROP_ROOT=0 ./gradlew assembleRelease

# Full build + test cycle (iOS) — Turbo path
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:ios:build:turbo
# Equivalent steps:
yarn build
cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=0 pod install && cd ../..
yarn awesomeproject:ios:build
yarn e2e:ios

# Full build + test cycle (iOS) — Interop path
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:ios:build:interop
# Equivalent steps:
cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=1 pod install && cd ../..
yarn awesomeproject:ios:build
yarn e2e:ios

# IMPORTANT: if you only changed ObjC/Swift sources (no podspec/codegenConfig change),
# you can skip pod install and go straight to xcodebuild:
yarn awesomeproject:ios:build

# Quick rebuild after ObjC-only changes (iOS)
cd apps/AwesomeProject/ios && xcodebuild -workspace AwesomeProject.xcworkspace -scheme AwesomeProject -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath ./build

# Quick rebuild after Java-only changes (Android)
cd apps/AwesomeProject/android && ./gradlew assembleDebug

# Force-refresh autolinking cache (Android — required after adding/changing codegenConfig)
rm -f apps/AwesomeProject/android/build/generated/autolinking/autolinking.json
rm -f apps/AwesomeProject/android/build/generated/autolinking/*.sha

# Force-refresh iOS pods (required after adding/changing codegenConfig or podspec)
cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && pod cache clean --all && pod install
```

---

## iOS naming convention summary

| Concept | Name | Used in |
|---------|------|---------|
| Spec / module name | `NativeAEPOptimize` | JS `TurboModuleRegistry.getEnforcing`, `moduleName`, `modulesProvider` key |
| ObjC class | `RCTAEPOptimize` | Implementation `.h`/`.mm`, `modulesProvider` value |
| Codegen config name | `NativeAEPOptimizeSpec` | `codegenConfig.name` in `package.json` |
| Codegen protocol | `NativeAEPOptimizeSpec` | `.h` protocol conformance |
| Codegen JSI class | `NativeAEPOptimizeSpecJSI` | `getTurboModule:` return value in `.mm` |
| Codegen header path | `<NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>` | Import in `.h` |

---

## Changelog

| Date | Note |
|------|------|
| 2026-03-25 | `extensionVersion` migrated to Turbo on Android. Codegen + build + e2e green. Playbook created. |
| 2026-03-25 | Fixed stale autolinking cache causing `TurboModuleRegistry.getEnforcing` runtime error. Root cause documented. |
| 2026-03-26 | `extensionVersion` migrated to Turbo on iOS. Renamed `.m` → `.mm`, removed `#ifdef RCT_NEW_ARCH_ENABLED`, updated podspec with `React-Codegen` + `HEADER_SEARCH_PATHS`, codegen + build + e2e green. iOS troubleshooting documented. |
| 2026-03-26 | Added `USE_INTEROP_ROOT` build flag to iOS (podspec `GCC_PREPROCESSOR_DEFINITIONS`). `.h` and `.mm` now use `#if USE_INTEROP_ROOT` dual-mode switch matching the Android pattern. `USE_INTEROP_ROOT=0` = Turbo, `=1` = legacy bridge. E2e verified. |
| 2026-03-26 | Fixed interop path (`USE_INTEROP_ROOT=1`): changed `RCT_EXPORT_MODULE(AEPOptimize)` → `RCT_EXPORT_MODULE(NativeAEPOptimize)` so the bridge module name matches the JS `TurboModuleRegistry.getEnforcing('NativeAEPOptimize')` lookup. |
| 2026-03-26 | Fixed interop first-load crash: (a) `Module provider does not conform to RCTModuleProvider` — added `RCTTurboModule` conformance via `#import <ReactCommon/RCTTurboModule.h>`. (b) `'NativeAEPOptimize' could not be found` — returning `nullptr` from `getTurboModule:` doesn't trigger legacy fallback; changed to return `std::make_shared<ObjCTurboModule>(params)` which wraps `RCT_EXPORT_METHOD` methods for dynamic dispatch. Build + e2e verified with `USE_INTEROP_ROOT=1`. |
| 2026-03-26 | Fixed `e2e:ios:build:turbo` / `e2e:ios:build:interop` scripts: removed redundant `rm -rf ios/build` that appeared after `pod install` and deleted RN codegen output (`build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h`), causing xcodebuild to fail. Fix: keep only the initial `rm -rf Pods Podfile.lock build`. Full E2E run: 2/2 passing. Details: `cursor-docs/errors/e2e-ios-build-rctappdependencyprovider-not-found.md`. |
| 2026-03-26 | Fixed interop path (`USE_INTEROP_ROOT=1`) "undefined is not a function" on all API calls: (1) added `NativeAEPOptimizeSpec` conformance to interop branch in `RCTAEPOptimize.h`; (2) moved `getTurboModule:` (returning `NativeAEPOptimizeSpecJSI`) outside the `#if/#else` block so both paths implement it. Root cause: RN 0.84 codegen checks `RCTModuleProvider` conformance at startup; without `getTurboModule:` the module is invisible to TurboModuleRegistry. `e2e:ios:build:release:interop` E2E: 2/2 passing. Details: `cursor-docs/errors/e2e-ios-interop-undefined-function-no-turbomodule.md`. |
| 2026-03-26 | Added Android release E2E scripts (`e2e:android:build:release:turbo`, `e2e:android:build:release:interop`). Fixed three sequential build errors: (1) `externalNativeBuildCleanDebug` GLOB mismatch — replaced `./gradlew clean` with `rm -rf app/.cxx app/build`; (2) `Couldn't determine Hermesc location` — set `hermesCommand` in `build.gradle` to monorepo root `hermes-compiler`; (3) `Activity cannot be launched` — added `ANDROID_CONFIGURATION` env var to `wdio.android.conf.js`, passed `ANDROID_CONFIGURATION=release` in release scripts. All E2E: 2/2 passing. Details: `cursor-docs/errors/e2e-android-build-cmake-clean-glob-mismatch.md`, `e2e-android-build-hermesc-not-found.md`, `e2e-android-appium-release-apk-not-installed.md`. |
