# Android release build: `externalNativeBuildCleanDebug FAILED` — stale CMake GLOB mismatch

**Status:** Fixed
**Area:** AwesomeProject, Android, E2E, CMake, Release build
**Last updated:** 2026-03-26

---

## Symptom

`yarn e2e:android:build:release:interop` (or `turbo`) fails immediately at the `clean` step:

```text
> Task :app:externalNativeBuildCleanDebug FAILED

CMake Error at .../Android-autolinking.cmake:17 (add_subdirectory):
  add_subdirectory given source
  ".../node_modules/@adobe/react-native-aepoptimize/android/build/generated/source/codegen/jni/"
  which is not an existing directory.

ninja: error: rebuilding 'build.ninja': subcommand failed
```

The build exits in under 2 seconds with `BUILD FAILED`.

---

## Environment

- React Native 0.84.1, New Architecture on, Android release build
- NDK 27.1.12297006, CMake 3.22.1
- Branch: `optimize-turbo-module-e2e`

---

## Cause

The original release scripts used `./gradlew clean assembleRelease`. When `clean` ran, it triggered CMake to re-run because of a GLOB mismatch (cached `.cxx/Debug` state referenced the codegen JNI directory for `@adobe/react-native-aepoptimize`). That codegen directory is generated during `assembleDebug`/`assembleRelease`, not before — so during clean the directory did not exist and CMake configuration failed.

The codegen JNI directory path that CMake expects:
```
node_modules/@adobe/react-native-aepoptimize/android/build/generated/source/codegen/jni/
```
is produced by `:adobe_react-native-aepoptimize:generateXxxCodegen` tasks, which run as part of assembly, not clean.

---

## Fix

Replace `./gradlew clean assembleRelease` with a manual delete of `app/.cxx` and `app/build` before `./gradlew assembleRelease`. Deleting `.cxx` removes the stale CMake state entirely; `gradlew assembleRelease` then performs a fresh CMake configuration as part of the build without the GLOB mismatch issue.

**`package.json`:**

```diff
-"e2e:android:build:release:turbo":   "cd apps/AwesomeProject/android && USE_INTEROP_ROOT=0 ./gradlew clean assembleRelease && ...",
-"e2e:android:build:release:interop": "cd apps/AwesomeProject/android && USE_INTEROP_ROOT=1 ./gradlew clean assembleRelease && ...",
+"e2e:android:build:release:turbo":   "cd apps/AwesomeProject/android && rm -rf app/.cxx app/build && USE_INTEROP_ROOT=0 ./gradlew assembleRelease && ...",
+"e2e:android:build:release:interop": "cd apps/AwesomeProject/android && rm -rf app/.cxx app/build && USE_INTEROP_ROOT=1 ./gradlew assembleRelease && ...",
```

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:android:build:release:interop
```

Expect: build proceeds past the clean step and reaches `assembleRelease`.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | `e2e:android:build:release:interop` added with `./gradlew clean assembleRelease`. Build failed at `externalNativeBuildCleanDebug` with CMake GLOB mismatch on aepoptimize codegen JNI dir. |
| 2026-03-26 | Fix: replaced `./gradlew clean assembleRelease` with `rm -rf app/.cxx app/build && ./gradlew assembleRelease`. |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** Replaced `./gradlew clean` with manual `rm -rf app/.cxx app/build` to avoid CMake GLOB mismatch during the clean phase.
- **Refs:** root `package.json` (`e2e:android:build:release:turbo`, `e2e:android:build:release:interop`)

---

## Key lesson

**Do NOT use `./gradlew clean` when the CMake `.cxx` cache references generated source directories.** CMake re-runs during `clean` (to rebuild `build.ninja`) and fails if the codegen JNI directories don't exist yet. The safe pattern: `rm -rf app/.cxx app/build` before `./gradlew assembleRelease`.
