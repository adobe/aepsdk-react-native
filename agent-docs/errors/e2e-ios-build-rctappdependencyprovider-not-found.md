# iOS build: `RCTAppDependencyProvider.h: No such file or directory`

**Status:** Fixed
**Area:** AwesomeProject, iOS, E2E, xcodebuild, React Native Codegen
**Last updated:** 2026-03-26

---

## Symptom

`yarn awesomeproject:ios:build` (or `yarn e2e:ios:build:turbo` / `yarn e2e:ios:build:interop`) fails with:

```text
error: /Users/.../apps/AwesomeProject/ios/build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h: No such file or directory (in target 'ReactAppDependencyProvider' from project 'Pods')

** BUILD FAILED **

The following build commands failed:
    CpHeader .../build/Build/Products/Debug-iphonesimulator/ReactAppDependencyProvider/ReactAppDependencyProvider.framework/Headers/RCTAppDependencyProvider.h
              .../build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h
              (in target 'ReactAppDependencyProvider' from project 'Pods')
```

---

## Environment

- React Native **0.84.1**, New Architecture (default on)
- macOS / Xcode 16
- Branch: `optimize-turbo-module-e2e`

---

## Cause

React Native 0.84 runs codegen **during `pod install`** (via a pre-install hook). The codegen generates several files into `apps/AwesomeProject/ios/build/generated/ios/`, including:

```
build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.h
build/generated/ios/ReactAppDependencyProvider/RCTAppDependencyProvider.mm
build/generated/ios/ReactCodegen/   (NativeAEPOptimizeSpec headers, etc.)
```

The `ReactAppDependencyProvider` Xcode target sources those generated files. If the `build/generated/ios/` directory is deleted **after** `pod install` but **before** xcodebuild, the build fails because xcodebuild cannot find the file.

The root cause was a redundant second `rm -rf ios/build` in the `e2e:ios:build:turbo` and `e2e:ios:build:interop` scripts in the root `package.json`:

```sh
# Old (buggy) script
cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build &&  # ← step 1: cleans build/
  USE_INTEROP_ROOT=0 pod install &&                               # ← step 2: regenerates build/generated/ios/
  cd .. && rm -rf ios/build &&                                    # ← step 3: BUG — deletes the just-generated files!
  yarn awesomeproject:ios:build && yarn e2e:ios                   # ← step 4: fails — files gone
```

Step 1 already cleans `build/`; step 2 regenerates what is needed; step 3 undoes step 2.

---

## Fix

**`package.json`** — remove the redundant `rm -rf ios/build` (step 3) from both scripts:

```diff
-"e2e:ios:build:interop": "cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=1 pod install && cd .. && rm -rf ios/build && yarn awesomeproject:ios:build && yarn e2e:ios",
-"e2e:ios:build:turbo":   "cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=0 pod install && cd .. && rm -rf ios/build && yarn awesomeproject:ios:build && yarn e2e:ios"
+"e2e:ios:build:interop": "cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=1 pod install && cd .. && yarn awesomeproject:ios:build && yarn e2e:ios",
+"e2e:ios:build:turbo":   "cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=0 pod install && cd .. && yarn awesomeproject:ios:build && yarn e2e:ios"
```

**Recovery** (if `build/generated/ios/` is already missing after the broken run):

```sh
# Re-run pod install to regenerate the codegen files; do NOT rm -rf build beforehand
cd apps/AwesomeProject/ios
USE_INTEROP_ROOT=0 pod install   # or USE_INTEROP_ROOT=1 for the interop path

# Then build normally
cd ..
yarn awesomeproject:ios:build
```

---

## Verify

```sh
# Turbo path (USE_INTEROP_ROOT=0)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:ios:build:turbo

# Or step-by-step
cd apps/AwesomeProject/ios && rm -rf Pods Podfile.lock build && USE_INTEROP_ROOT=0 pod install && cd ../..
ls apps/AwesomeProject/ios/build/generated/ios/ReactAppDependencyProvider/
# Expected: RCTAppDependencyProvider.h  RCTAppDependencyProvider.mm  ReactAppDependencyProvider.podspec
yarn awesomeproject:ios:build   # should print ** BUILD SUCCEEDED **
yarn e2e:ios                    # should show 2 passing
```

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | First encountered during first run of `yarn e2e:ios:build:turbo`. Identified double `rm -rf ios/build` in `package.json` script as root cause. |
| 2026-03-26 | Removed second `rm -rf ios/build` from both `e2e:ios:build:turbo` and `e2e:ios:build:interop`. Re-ran pod install to recover generated files. Build + E2E passed (2/2). |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** Removed redundant `rm -rf ios/build` from `e2e:ios:build:turbo` and `e2e:ios:build:interop` scripts; `build/generated/ios/` (React Native codegen output from `pod install`) is now preserved for xcodebuild.
- **Refs:** `package.json` (`e2e:ios:build:turbo`, `e2e:ios:build:interop` scripts)

---

## Key lesson

**In RN 0.84+, `pod install` generates codegen files into `build/generated/ios/`. Never delete `build/` between `pod install` and xcodebuild.** The first `rm -rf Pods Podfile.lock build` in the clean step is the only intended clean; any subsequent `rm -rf build` will wipe codegen output and break the build.
