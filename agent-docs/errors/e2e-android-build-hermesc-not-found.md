# Android release build: `Couldn't determine Hermesc location`

**Status:** Fixed
**Area:** AwesomeProject, Android, Hermes, Release build
**Last updated:** 2026-03-26

---

## Symptom

`./gradlew assembleRelease` fails at the JS bundling step:

```text
> Task :app:createBundleReleaseJsAndAssets FAILED

Execution failed for task ':app:createBundleReleaseJsAndAssets'.
> Couldn't determine Hermesc location. Please set `react.hermesCommand` to the path
  of the hermesc binary file. node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc
```

This does NOT affect `assembleDebug` — Metro handles JS bundling for debug builds.

---

## Environment

- React Native 0.84.1, yarn 3.6.4 monorepo with `nohoist: ["**"]`
- Branch: `optimize-turbo-module-e2e`

---

## Cause

The React Native gradle plugin (`@react-native/gradle-plugin`) resolves the Hermes compiler (`hermesc`) in this order:

1. `react.hermesCommand` if set in `build.gradle`
2. `node_modules/react-native/sdks/hermes/build/bin/hermesc` (if building Hermes from source)
3. `node_modules/hermes-compiler/hermesc/%OS-BIN%/hermesc` relative to the React project root (`apps/AwesomeProject/`)

The monorepo has `nohoist: ["**"]` which prevents yarn from hoisting `hermes-compiler` (a dependency of `react-native`) into `apps/AwesomeProject/node_modules/`. It is only installed at the monorepo root (`node_modules/hermes-compiler/`). All three fallback paths fail, so the build errors.

---

## Fix

Set `hermesCommand` in `apps/AwesomeProject/android/app/build.gradle` to point to the root-level `hermes-compiler` via Gradle's `$rootDir`:

```diff
 react {
     /* Hermes Commands */
     //   The hermes compiler command to run. By default it is 'hermesc'
     // hermesCommand = "$rootDir/my-custom-hermesc/bin/hermesc"
+    hermesCommand = "$rootDir/../../../node_modules/hermes-compiler/hermesc/%OS-BIN%/hermesc"
```

`$rootDir` is `apps/AwesomeProject/android/`, so `$rootDir/../../../` resolves to the monorepo root. The `%OS-BIN%` placeholder is substituted by the gradle plugin at build time (`osx-bin` on macOS).

---

## Verify

```sh
# From monorepo root:
cd apps/AwesomeProject/android && rm -rf app/.cxx app/build && USE_INTEROP_ROOT=1 ./gradlew assembleRelease
```

Expect: `createBundleReleaseJsAndAssets` succeeds and build reaches `BUILD SUCCESSFUL`.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | `./gradlew assembleRelease` (after fixing CMake clean issue) failed at `createBundleReleaseJsAndAssets`: hermesc not found. |
| 2026-03-26 | `hermes-compiler` found at monorepo root `node_modules/` but not in `apps/AwesomeProject/node_modules/` due to nohoist. |
| 2026-03-26 | Fixed: set `hermesCommand` in `build.gradle` using `$rootDir/../../../node_modules/hermes-compiler/...`. |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** Added `hermesCommand` to the `react {}` block in `build.gradle` pointing to the monorepo root `hermes-compiler` package.
- **Refs:** `apps/AwesomeProject/android/app/build.gradle`

---

## Key lesson

**In `nohoist` monorepos, transitive dependencies of `react-native` (like `hermes-compiler`) are only installed at the monorepo root, not in the app workspace's `node_modules/`.** The gradle plugin only searches the app's `node_modules/`, so hermesc will not be found for release builds. Fix: set `hermesCommand` explicitly with `$rootDir` to reach the monorepo root.
