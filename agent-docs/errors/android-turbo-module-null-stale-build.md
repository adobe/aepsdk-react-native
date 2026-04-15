# Android Turbo Module returns null — stale build artifacts

**Status:** Fixed  
**Area:** Android, Optimize, E2E  
**Last updated:** 2026-04-14

---

## Symptom

All Optimize e2e tests fail with:

```text
TypeError: Cannot read property 'extensionVersion' of null
```

`TurboModuleRegistry.getEnforcing('NativeAEPOptimize')` returns a stub `{}` or null instead of the real native module. The Java `RCTAEPOptimizePackage.getModule()` is never called even though `getReactModuleInfoProvider()` runs correctly and registers the module with `isTurboModule=true`.

---

## Environment

- React Native 0.84.1 (New Architecture / Bridgeless)
- `USE_INTEROP_ROOT=0` (turbo module path)
- Release build (`assembleRelease`)

---

## Cause

**Stale build artifacts in `packages/optimize/android/build/`.** The `e2e:android:build:release:turbo` script only cleans `apps/AwesomeProject/android/app/{.cxx,build}` — it does NOT clean the library package build directories under `packages/*/android/build/`. When the optimize package's codegen output, BuildConfig, or compiled classes are stale (e.g. from a prior interop build, a different branch, or an interrupted build), the turbo module registration breaks silently:

- `getReactModuleInfoProvider()` appears to register correctly
- But the Java module class or its C++ JSI wrapper is out of sync
- The TurboModuleManager returns an empty JSI host object (`{}`) with no working methods

---

## Fix

**Always clean the library package build directories** when doing a turbo module release build:

```sh
# Full clean — both app AND library packages
cd apps/AwesomeProject/android
rm -rf app/.cxx app/build
rm -rf ../../../packages/optimize/android/build   # ← critical!
USE_INTEROP_ROOT=0 ./gradlew assembleRelease
```

Or from repo root:

```sh
rm -rf packages/optimize/android/build apps/AwesomeProject/android/app/.cxx apps/AwesomeProject/android/app/build
cd apps/AwesomeProject/android && USE_INTEROP_ROOT=0 ./gradlew assembleRelease
```

---

## Verify

```sh
cd /path/to/repo
rm -rf packages/optimize/android/build apps/AwesomeProject/android/app/.cxx apps/AwesomeProject/android/app/build
cd apps/AwesomeProject/android && USE_INTEROP_ROOT=0 ./gradlew assembleRelease && cd ../../..
ANDROID_CONFIGURATION=release yarn e2e:android
# Expect: 5 passed, 5 total (100% completed)
```

---

## Investigation log

| Date | Note |
|------|------|
| 2026-04-14 | Traced full RN 0.84 turbo module resolution: JS → C++ TurboModuleManager → JNI getTurboJavaModule → Java ReactPackageTurboModuleManagerDelegate → package getModule |
| 2026-04-14 | Added Log.e debug logging to RCTAEPOptimizePackage — getReactModuleInfoProvider fires correctly but getModule never called |
| 2026-04-14 | Console.log diagnostic showed TurboModuleRegistry.get returns `{}` (empty JSI object) not null — module IS being resolved but with no working methods |
| 2026-04-14 | Compared with working SafeAreaContext package — identical BaseReactPackage pattern, same registration approach |
| 2026-04-14 | git diff showed ZERO code changes in packages/optimize/ since last working commit (a5d3d9fa) — confirmed stale build artifacts as root cause |
| 2026-04-14 | Cleaning `packages/optimize/android/build/` + app build dirs + full rebuild fixed all 5 e2e tests (100% pass) |

---

## Fixed

- **Date:** 2026-04-14  
- **Summary:** Stale library build artifacts caused turbo module to resolve as empty stub; cleaning `packages/optimize/android/build/` before rebuild fixes it  
- **Refs:** Branch `optimize-turbo-module-e2e`
