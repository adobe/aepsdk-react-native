# Playbook: Upgrade AEPSampleApp — React Native Version Upgrade

**Last updated:** 2026-04-23
**Status:** Generic template — fill in `TARGET_VERSION` before executing

---

## How to use this playbook

1. Replace every `<TARGET_VERSION>` with your target RN version (e.g., `0.84.0`, `0.85.0`)
2. Read the current version from `apps/AEPSampleApp/package.json` → `"react-native"` field
3. **MANDATORY: Open the Upgrade Helper in a browser** (Step 3 below) — it's the file-by-file source of truth and CANNOT be automated
4. Execute each step in order
5. Check off each validation item

> **WARNING:** The React Native Upgrade Helper (https://react-native-community.github.io/upgrade-helper/)
> is a client-side app that automated tools cannot crawl. An engineer MUST manually
> open it in a browser, review every file diff, and apply changes. Skipping this step
> risks missing critical template changes (Podfile, gradle, AppDelegate, etc.) that
> cause build failures or runtime crashes.

---

## Upgrade Summary

| Field | Value |
|-------|-------|
| **App** | `apps/AEPSampleApp` |
| **Current RN version** | Read from `apps/AEPSampleApp/package.json` → `"react-native"` |
| **Target RN version** | `<TARGET_VERSION>` |
| **Upgrade Helper** | `https://react-native-community.github.io/upgrade-helper/?from=<CURRENT_VERSION>&to=<TARGET_VERSION>` |
| **Release notes** | `https://reactnative.dev/blog` — find the release post for `<TARGET_VERSION>` |
| **RN Changelog** | `https://github.com/facebook/react-native/blob/main/CHANGELOG.md` |

**Other apps in monorepo (check their versions too):**
- `apps/AwesomeProject/package.json`
- `apps/AEPSampleAppNewArchEnabled/package.json`

---

## Pre-upgrade Checklist

- [ ] Read the FULL release notes for `<TARGET_VERSION>`
- [ ] **OPEN IN BROWSER** the Upgrade Helper diff: `https://react-native-community.github.io/upgrade-helper/?from=<CURRENT>&to=<TARGET>` — this is a client-side app that cannot be automated. You MUST review it manually.
- [ ] Verify current app builds and runs on BOTH platforms before starting
- [ ] Run `npm run test` and confirm all unit tests pass before starting
- [ ] Create a dedicated branch: `git checkout -b upgrade/rn-<TARGET_VERSION>`
- [ ] Check Node.js version requirement in release notes (RN 0.84+ requires Node 22.11+)
- [ ] Back up `ios/Podfile.lock` and `android/gradle.properties` for rollback comparison
- [ ] Read `agent-docs/context/known-gotchas.md` — all gotchas apply during upgrades
- [ ] Read `agent-docs/context/rn-084-085-impact-on-sdk.md` — if upgrading to 0.84+
- [ ] Read `agent-docs/context/turbo-module-event-emission.md` — if any module emits events

---

## Step-by-step Upgrade Procedure

### Step 1: Verify/update Node.js

Check the release notes for the minimum Node.js version.

```bash
node -v
# If below required version:
nvm install <required-version>
nvm use <required-version>
```

Update `engines.node` in `apps/AEPSampleApp/package.json` if needed.

---

### Step 1.5: Run `align-deps` (RECOMMENDED)

Microsoft's `@rnx-kit/align-deps` tool automatically aligns dependency versions to
known-compatible versions for your target RN version. Run it BEFORE manual version bumps.

See: https://microsoft.github.io/rnx-kit/docs/tools/align-deps

```bash
cd apps/AEPSampleApp

# Initialize config (first time only — adds rnx-kit section to package.json)
npx @rnx-kit/align-deps --init app

# Check what needs alignment
npx @rnx-kit/align-deps --requirements react-native@<TARGET_MAJOR.MINOR>

# Apply recommended changes
npx @rnx-kit/align-deps --requirements react-native@<TARGET_MAJOR.MINOR> --write
```

**What it does:**
- Updates dependency versions to known-compatible versions for the target RN
- Adds `rnx-kit` config to `package.json` with detected capabilities
- Covers ~70+ packages (react, navigation, reanimated, screens, webview, etc.)

**Limitations (verify after running):**
- Not all packages are covered — check any remaining deps manually
- Preset versions may lag behind actual compatibility. Example: align-deps set
  `react-native-reanimated: ^4.2.2` for RN 0.85, but 4.2.x fails pod install.
  Had to manually bump to `^4.3.0`.
- Still need to apply template file changes from `rn-diff-purge` (Step 3)
- Still need to update `jest.config.js` and other non-package.json files

**After running align-deps:**
1. Review the changes it made to `package.json`
2. Cross-check third-party lib compatibility (especially reanimated + worklets)
3. Run `yarn install` to update the lockfile
4. Proceed to Step 2 for any remaining version bumps

---

### Step 2: Apply dependency version changes

Open the Upgrade Helper and update `apps/AEPSampleApp/package.json`:

```
https://react-native-community.github.io/upgrade-helper/?from=<CURRENT>&to=<TARGET>
```

Typical changes:
- `react-native` → `<TARGET_VERSION>`
- `react` → version required by `<TARGET_VERSION>` (check release notes)
- `@react-native/babel-preset` → matching version
- `@react-native/eslint-config` → matching version
- `@react-native/metro-config` → matching version
- `@react-native/typescript-config` → matching version
- `@react-native-community/cli` → matching version
- `@react-native-community/cli-platform-android` → matching version
- `@react-native-community/cli-platform-ios` → matching version
- `@react-native/new-app-screen` → matching version

**Do NOT blindly bump** — check each version against the Upgrade Helper diff.

---

### Step 3: Fetch and apply ALL file changes (MANDATORY — DO NOT SKIP)

#### How to get the diff

The React Native Upgrade Helper UI (`react-native-community.github.io/upgrade-helper`)
is a client-side app that automated tools cannot crawl. However, the underlying data
comes from the **`rn-diff-purge`** GitHub repo, which IS directly fetchable.

**Method 1 — Download raw diff (RECOMMENDED for automation / agents):**
```bash
# Download the exact diff between versions
curl -sL "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/refs/heads/diffs/diffs/<CURRENT>..<TARGET>.diff" \
  -o /tmp/rn-upgrade.diff

# Verify it downloaded (should be >100 lines)
wc -l /tmp/rn-upgrade.diff

# List all changed files
grep "^diff --git" /tmp/rn-upgrade.diff

# Show actual changes (skip binaries)
grep -v "Binary" /tmp/rn-upgrade.diff | cat

# Show changes for a specific file
awk '/^diff --git.*package.json/{found=1} found{print} /^diff --git/ && !/.*package.json/{if(found) exit}' /tmp/rn-upgrade.diff
```

**Example (0.83.0 → 0.85.2):**
```bash
curl -sL "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/refs/heads/diffs/diffs/0.83.0..0.85.2.diff" -o /tmp/rn-upgrade.diff
```

**Method 2 — Browser (for manual review):**
```
https://react-native-community.github.io/upgrade-helper/?from=<CURRENT>&to=<TARGET>
```

#### How to apply the diff

1. For EACH file in the diff — **including comment-only changes**:
   - Map the template path to your app path (e.g., `RnDiffApp/` → `apps/AEPSampleApp/`)
   - If the file exists in your app, apply every `+` and `-` line exactly
   - If it's a new file, decide if it's needed
   - **Never skip a change because "it's just a comment"** — comments indicate new defaults, variants, or documentation
2. For **binary files** (e.g., `gradle-wrapper.jar`):
   - Use `./gradlew wrapper --gradle-version=<VERSION>` to regenerate Gradle wrapper files
   - This updates `gradlew`, `gradlew.bat`, `gradle-wrapper.jar`, and `gradle-wrapper.properties` together
3. For **Xcode project files** (`.pbxproj`):
   - Apply changes via Xcode UI (Build Settings) rather than editing the file directly
   - Or apply the diff carefully if you understand pbxproj format
4. **Document every file you changed** in the upgrade PR description

#### Rules
- Apply **every** change from the diff, no exceptions
- The `rn-diff-purge` diff is the **authoritative source of truth** for template changes
- If a change looks like "just a comment," apply it anyway — it may indicate new build variants or changed defaults
- After applying all changes, run `yarn install` to update the lockfile

5. Pay special attention to these commonly changed files:

**Shared:**
- `babel.config.js`
- `metro.config.js`
- `tsconfig.json`
- `.eslintrc.js` / `eslint.config.js`

**iOS:**
- `ios/Podfile` — check platform version, frameworks, post_install hooks
- `ios/<App>.xcodeproj/project.pbxproj` — build settings
- `ios/<App>/AppDelegate.mm` or `AppDelegate.swift`
- `ios/<App>/Info.plist`

**Android:**
- `android/build.gradle` — Kotlin version, SDK versions, plugin versions
- `android/app/build.gradle` — compileSdk, targetSdk, dependencies
- `android/gradle/wrapper/gradle-wrapper.properties` — Gradle version
- `android/gradle.properties` — new/changed properties
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/java/.../MainApplication.kt` or `.java`
- `android/app/src/main/java/.../MainActivity.kt` or `.java`

---

### Step 4: Install dependencies

```bash
# From monorepo root
cd /Users/namarora/aepsdk-react-native
yarn install
```

If yarn install fails, check for:
- Peer dependency conflicts (may need `--legacy-peer-deps` or resolution overrides)
- Workspace hoisting issues (check `nohoist` in `package.json`)

---

### Step 5: Clean and rebuild iOS

```bash
cd apps/AEPSampleApp/ios
rm -rf Pods Podfile.lock build
pod install
```

**CRITICAL: Do NOT delete `ios/build` after `pod install`.** Codegen writes `RCTAppDependencyProvider.h` into `ios/build/generated/` during pod install. Deleting it breaks xcodebuild.

If pod install fails, try:
```bash
# Clear CocoaPods cache
rm -rf ~/Library/Caches/CocoaPods
pod install --repo-update

# If still failing, build from source
RCT_USE_PREBUILT_RNCORE=0 pod install
```

---

### Step 6: Clean and rebuild Android

```bash
cd apps/AEPSampleApp/android
rm -rf app/.cxx app/build
# Do NOT use ./gradlew clean — causes CMake GLOB mismatch (known gotcha)
./gradlew assembleDebug
```

If build fails with hermesc errors:
```bash
# Check hermesCommand path in app/build.gradle
# For monorepo with nohoist, may need:
# hermesCommand = "$rootDir/../../../node_modules/hermes-compiler/hermesc/%OS-BIN%/hermesc"
```

---

## Post-upgrade Validation

### Validation Commands

Run these in order. **ALL must succeed** before considering the upgrade complete.

#### 0. Reset Watchman (MANDATORY after clean install)

```bash
watchman watch-del-all
watchman watch-project /Users/namarora/aepsdk-react-native
```

**Why:** Stale Watchman state causes `Failed to get SHA-1` errors on Metro 0.84+.
The file watcher's internal state gets corrupt after node_modules are deleted and
recreated. This MUST be done before testing Metro.

#### 1. Metro bundler + bundle test

```bash
npm run sampleapp:start
```

**Expected:** Metro starts, shows "Welcome to Metro" banner.

**Then test the actual bundle** (in a separate terminal):
```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8081/index.bundle?platform=ios&dev=true"
```

**Expected:** HTTP `200`. If `500`, check Metro terminal for errors.

**Why test the bundle:** A green Metro startup does NOT mean the bundle works.
Asset resolution errors (drawer icons, polyfills) only appear when a bundle is
actually requested. Always test with curl or by running the app.

**Kill Metro with Ctrl+C after confirming.**

#### 2. iOS pod install

```bash
npm run sampleapp:ios:pod:install
# If pods are outdated or conflict:
npm run sampleapp:ios:pod:update
```

**Expected:** Pod install completes without errors. Watch for:
- Missing pods → check Podfile
- Version conflicts → check pod version constraints
- Swift verification errors → ensure `post_install` has `-no-verify-emitted-module-interface`

#### 3. iOS build

```bash
npm run sampleapp:ios:build
```

**Expected:** `BUILD SUCCEEDED` in terminal output.

#### 4. iOS run

```bash
npm run sampleapp:ios:run
```

**Expected:** App launches in simulator. Verify:
- [ ] App launches without crash
- [ ] SDK init status shows "ready"
- [ ] Navigate to Optimize screen → tap Extension Version → version logged
- [ ] Tap Update Propositions → success callback fires
- [ ] Tap Get Propositions → propositions returned with content

#### 5. Android build

```bash
npm run sampleapp:android:build
```

**Expected:** `BUILD SUCCESSFUL` in terminal output.

#### 6. Android run

```bash
npm run sampleapp:android:run
```

**Expected:** App launches on emulator/device. Verify same items as iOS above.

#### 7. Unit tests

```bash
npm run test
```

**Expected:** All tests pass. Zero failures.

---

## AEP SDK-Specific Concerns (check for EVERY upgrade)

### 1. `sendEventWithName:` is dead on RN 0.84+

`RCTTurboModuleManager.mm:794` hardcodes `callableJSModules:nil` for ALL modules with `getTurboModule:`. Any module emitting events via `sendEventWithName:` will silently drop them.

**Check:**
```bash
grep -rn "sendEventWithName" packages/*/ios/src/
```

If any module uses it, migrate to `CodegenTypes.EventEmitter` + `NativeAEP<Module>SpecBase`.
See: `agent-docs/context/turbo-module-event-emission.md`

### 2. `getTurboModule:` is mandatory

For any module with `codegenConfig` in `package.json`, `getTurboModule:` must exist. Codegen's `RCTModuleProviders.mm` checks for it at startup.

**Check:**
```bash
# Find packages with codegenConfig
grep -l "codegenConfig" packages/*/package.json

# For each, verify getTurboModule: exists in iOS impl
grep -l "getTurboModule" packages/*/ios/src/*.mm
```

### 3. `NativeModules` = turbo module proxy (RN 0.84+)

`NativeModules.X` and `TurboModuleRegistry.get('X')` return the SAME instance. No separate bridge fallback.

### 4. Module name consistency

```bash
# Check JS side
grep -rn "TurboModuleRegistry.getEnforcing\|TurboModuleRegistry.get" packages/*/src/

# Check iOS side
grep -rn "moduleName\|RCT_EXPORT_MODULE" packages/*/ios/src/

# Check Android side
grep -rn "getName()" packages/*/android/src/
```

All must match exactly: `NativeAEP<Module>`.

### 5. Third-party library compatibility

Check that these dependencies have versions compatible with `<TARGET_VERSION>`:

```bash
# From apps/AEPSampleApp/package.json, check:
react-native-webview
react-native-gesture-handler
react-native-reanimated
react-native-screens
react-native-safe-area-context
react-native-worklets
recyclerlistview
@react-navigation/*
```

Search each library's GitHub releases or changelog for RN `<TARGET_VERSION>` compatibility.

---

## Known Gotchas (from agent-docs)

These gotchas have been discovered through prior work and apply during ANY RN upgrade:

### iOS

| # | Gotcha | Rule |
|---|--------|------|
| 1 | `RCTAppDependencyProvider.h` deleted after pod install | NEVER `rm -rf ios/build` after `pod install` |
| 2 | `getTurboModule:` missing on interop path | Always implement outside `#if USE_INTEROP_ROOT` |
| 3 | `.m` → `.mm` required for TurboModule | C++ return type needs Obj-C++ file |
| 4 | Stale Pods after switching `USE_INTEROP_ROOT` | Clean Pods + build before switching |
| 5 | Swift framework verification errors | Add `-no-verify-emitted-module-interface` to `post_install` |
| 6 | `sendEventWithName:` silently drops events | Use `CodegenTypes.EventEmitter` instead |

### Android

| # | Gotcha | Rule |
|---|--------|------|
| 7 | `./gradlew clean` breaks CMake GLOB | Use `rm -rf app/.cxx app/build` instead |
| 8 | Stale autolinking cache | Delete `android/build/generated/autolinking/` |
| 9 | Stale package build dirs (turbo) | Clean `packages/*/android/build/` before release build |
| 10 | hermesc path wrong in monorepo | Set `hermesCommand` to monorepo root path |
| 11 | `USE_INTEROP_ROOT` is runtime on Android | Change in `build.gradle`, rebuild — no clean needed |

### General

| # | Gotcha | Rule |
|---|--------|------|
| 12 | Module name mismatch across JS/iOS/Android | Must match exactly: `NativeAEP<Module>` |
| 13 | AEP SDK log messages differ per platform | Use regex in assertions, not exact strings |

---

## Likely Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `nvm: command not found` / wrong Node | RN version needs newer Node | `nvm install <version> && nvm use <version>` |
| `RCTAppDependencyProvider.h: No such file` | Deleted `ios/build` after pod install | Re-run `pod install` |
| `Module provider does not conform to RCTModuleProvider` | Missing `getTurboModule:` | Add to iOS `.mm` file |
| `TurboModuleRegistry: could not be found` | Module name mismatch or missing `getTurboModule:` | Verify names match across JS/iOS/Android |
| `sendEventWithName:` events lost | `callableJSModules:nil` (RN 0.84+) | Migrate to `CodegenTypes.EventEmitter` |
| `externalNativeBuildCleanDebug FAILED` | Used `./gradlew clean` | Use `rm -rf app/.cxx app/build` |
| `Couldn't determine Hermesc location` | nohoist + hermesc path | Set `hermesCommand` in `app/build.gradle` |
| Pod install fails | Stale cache or version conflict | `rm -rf ~/Library/Caches/CocoaPods && pod install --repo-update` |
| Swift module verification errors | Missing post_install flag | Add `-no-verify-emitted-module-interface` |
| `peer dep` errors during yarn install | Incompatible third-party lib versions | Update libs or add resolutions in `package.json` |
| Android build: `Could not resolve` | Gradle dependency resolution | Check `android/build.gradle` repository configuration |
| Metro: `Unable to resolve module` | Workspace symlink issue | Check `metro.config.js` `watchFolders` and `resolver.nodeModulesPaths` |
| Metro: `Failed to get SHA-1 for ... js-polyfills` | Stale Watchman state after clean install | `watchman watch-del-all && watchman watch-project /path/to/repo` |
| Metro: `could not be found, because it is not within projectRoot or watchFolders` | Metro 0.84 PR #1643 asset validation (monorepo) | Patch Metro: remove `doesFileExist` in `Server.js`. Or rewrite `metro.config.js` to use `nodeModulesPaths` instead of `extraNodeModules` Proxy |
| Metro: `Recrawled this watch N times` | Watchman watch corruption | `watchman watch-del-all && watchman watch-project /path/to/repo` |
| Metro: old `extraNodeModules` Proxy breaks on 0.84+ | Metro 0.84 file map validation incompatible with Proxy pattern | Rewrite metro.config.js using `watchFolders` + `nodeModulesPaths` + `blockList` (see `AEPSampleAppNewArchEnabled/metro.config.js`) |

---

## Open Risks / Things to Investigate

1. **Breaking changes in release notes** — ALWAYS read the full release blog post. This playbook can't predict future breaking changes.
2. **Third-party library compatibility** — the most common source of upgrade failures. Check EVERY dependency.
3. **Hermes engine version** — RN 0.84+ uses Hermes V1. Watch for JS behavior differences.
4. **Precompiled binaries** — RN 0.84+ uses precompiled iOS binaries by default. If architecture mismatch occurs, build from source.
5. **Monorepo workspace resolution** — `yarn install` with hoisting may resolve differently. Watch for duplicate dependencies.
6. **AEP SDK pod compatibility** — verify native AEP SDK pods work with the new Xcode/Swift toolchain.
7. **Codegen changes** — new RN versions may change codegen output format. Regenerate and verify.

---

## Post-upgrade Cleanup

After all validations pass:

- [ ] Delete the 0.83-specific upgrade playbook if it exists (`rn-upgrade-083-to-084.md`)
- [ ] Update this generic playbook with any new lessons learned
- [ ] Update `agent-docs/context/known-gotchas.md` with any new gotchas discovered
- [ ] Update `agent-docs/context/rn-084-085-impact-on-sdk.md` if upgrading to a new version
- [ ] Commit and push the upgrade branch
- [ ] Create a PR with the upgrade changes

---

## Lessons Learned (accumulated from prior upgrades)

1. **Never delete `ios/build` after `pod install`** — codegen output lives there.
2. **`getTurboModule:` must be on ALL paths** — `RCTModuleProviders.mm` requires it.
3. **`sendEventWithName:` is dead for turbo modules** — use `CodegenTypes.EventEmitter`.
4. **`NativeModules` = turbo proxy on RN 0.84+** — no separate bridge fallback.
5. **Clean Pods when switching `USE_INTEROP_ROOT`** — stale artifacts ignore new value.
6. **Android: clean `packages/*/android/build/`** before turbo release builds.
7. **Android: never use `./gradlew clean`** — use `rm -rf app/.cxx app/build`.
8. **Test on BOTH turbo and interop paths** — `USE_INTEROP_ROOT=0` and `USE_INTEROP_ROOT=1`.
9. **Read the Upgrade Helper diff FIRST** — it's the file-by-file source of truth.
10. **Read `agent-docs/` FIRST** — it has 17+ gotchas from prior work.
11. **Third-party libs are the #1 blocker** — `react-native-reanimated` and `react-native-worklets` have strict RN version compatibility. Always check and bump BEFORE pod install.
12. **Jest preset changes in RN 0.85** — `preset: 'react-native'` → `preset: '@react-native/jest-preset'`. Add `@react-native/jest-preset` to devDependencies.
13. **Reanimated + Worklets version coupling** — Reanimated 4.3.0 requires `react-native-worklets: 0.8.x`. Update both together.
14. **Apply EVERY change from the diff — even comments.** The `rn-diff-purge` diff is the authoritative source. Comment changes may indicate new build variants, new defaults, or updated documentation that engineers rely on. Never skip a change because "it's just a comment."
15. **`rn-diff-purge` is scrapable.** The Upgrade Helper UI is a client-side app that automated tools can't crawl, but the underlying diff data is available at: `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/refs/heads/diffs/diffs/<FROM>..<TO>.diff`. Download this file and apply every change. Example: `curl -sL "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/refs/heads/diffs/diffs/0.83.0..0.85.2.diff" -o /tmp/rn-upgrade.diff`
16. **Use `./gradlew wrapper --gradle-version=X.Y.Z`** to update Gradle wrapper files. This regenerates `gradlew`, `gradlew.bat`, and `gradle-wrapper.jar` correctly — don't manually edit these files.
17. **Run `align-deps` BEFORE manual bumps.** `npx @rnx-kit/align-deps --requirements react-native@0.85 --write` auto-aligns ~70+ dependencies. But verify its output — the preset may lag behind actual compatibility (e.g., it set reanimated 4.2.2 for RN 0.85, but 4.3.0 was required). Always cross-check third-party libs after align-deps runs.
18. **Reset Watchman after clean install.** Stale Watchman state causes `Failed to get SHA-1` errors on Metro 0.84+. Run `watchman watch-del-all && watchman watch-project /path/to/repo` after any clean install or RN upgrade.
19. **Rewrite `metro.config.js` for Metro 0.84+.** The old Proxy-based `extraNodeModules` pattern is incompatible with Metro 0.84's file map validation. Use the modern pattern: `watchFolders` + `nodeModulesPaths` + `blockList`. See `AEPSampleAppNewArchEnabled/metro.config.js` for reference.
20. **Metro 0.84 PR #1643 breaks monorepo asset serving.** Assets in `node_modules` may fail with "could not be found, because it is not within projectRoot or watchFolders." Apply the yarn patch from Metro issue #1667: remove `doesFileExist` validation in `Server.js`. Patch: `yarn patch metro@npm:0.84.3` → remove lines 442 and 449 in `src/Server.js`.
21. **Always test Metro bundling after upgrade.** Start Metro with `--reset-cache`, then `curl http://localhost:8081/index.bundle?platform=ios&dev=true` and verify HTTP 200. A green Metro startup doesn't mean the bundle works — the error only appears when a bundle is requested.

### Upgrade execution log (0.83.0 → 0.85.2, AEPSampleApp, 2026-04-23)

**Diff source:** `curl -sL "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/refs/heads/diffs/diffs/0.83.0..0.85.2.diff"` — 11 files, 1594 lines.

**Files from diff — applied:**

| File from diff | Change | How applied |
|----------------|--------|-------------|
| `Gemfile` | Add `gem 'nkf'` | Already present |
| `package.json` | RN 0.85.2, React 19.2.3, CLI 20.1.0, devDeps 0.85.2, jest-preset added | Manual edit |
| `jest.config.js` | `preset: '@react-native/jest-preset'` | Manual edit |
| `android/gradle/wrapper/gradle-wrapper.properties` | Gradle 9.0.0 → 9.3.1 | `./gradlew wrapper --gradle-version=9.3.1` |
| `android/gradle/wrapper/gradle-wrapper.jar` | Binary update | `./gradlew wrapper --gradle-version=9.3.1` |
| `android/gradlew` | CLASSPATH removed | `./gradlew wrapper --gradle-version=9.3.1` |
| `android/gradlew.bat` | CLASSPATH removed | `./gradlew wrapper --gradle-version=9.3.1` |
| `android/app/build.gradle` | Comment: debugOptimized variants | Manual edit |
| `tsconfig.json` | Trailing comma removal | Already correct |
| `ios/*.xcodeproj` | SUPPORTED_PLATFORMS, TARGETED_DEVICE_FAMILY | Skipped (iPad-only, optional) |
| `ios/Info.plist` | iPad orientation support | Skipped (iPad-only, optional) |

**Additional fixes (not from diff — third-party compatibility):**

| Package | Old | New | Why |
|---------|-----|-----|-----|
| `react-native-reanimated` | ^4.2.1 | ^4.3.0 | 4.2.x incompatible with RN 0.85 |
| `react-native-worklets` | ^0.7.2 | ^0.8.1 | Required by reanimated 4.3.0 |

**Validation results:**

| Step | Command | Result |
|------|---------|--------|
| yarn install | `yarn install` | ✅ |
| Metro | `npm run sampleapp:start` | ✅ React Native v0.85 |
| Pod install | `npm run sampleapp:ios:pod:install` | ✅ (after reanimated/worklets fix) |
| iOS build + run | `npm run sampleapp:ios:build` | ✅ BUILD SUCCEEDED + launched |
| Android build | `npm run sampleapp:android:build` | ✅ BUILD SUCCESSFUL |
| Android run | `npm run sampleapp:android:run` | ✅ Launched on emulator |
| Unit tests | `npm run test` | ✅ 17 suites, 147 tests passed |
| Android run | `npm run sampleapp:android:run` | Launched on emulator |
| Unit tests | `npm run test` | 17 suites, 147 tests — ALL PASSED |

---

## Reference Documents

| Document | When to read |
|----------|-------------|
| `agent-docs/context/known-gotchas.md` | Before any upgrade work |
| `agent-docs/context/turbo-module-event-emission.md` | If any module emits events |
| `agent-docs/context/rn-084-085-impact-on-sdk.md` | If upgrading to 0.84 or 0.85 |
| `agent-docs/context/ios-native-log-capture.md` | If debugging iOS native logs |
| `agent-docs/context/architecture.md` | To understand module structure |
| `agent-docs/playbooks/new-module-migration.md` | If migrating modules during upgrade |
| `agent-docs/migrations/optimize-turbo.md` | For turbo module migration reference |
