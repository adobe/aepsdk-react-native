# Android build: `A problem occurred starting process 'command '...node''` — hardcoded nvm node version missing

**Status:** Fixed
**Area:** AEPSampleApp, Android, Gradle, nvm
**Last updated:** 2026-03-27

---

## Symptom

`yarn android` (or `yarn sampleapp:android:run`) fails immediately with:

```text
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred evaluating settings 'android'.
> A problem occurred starting process 'command '/Users/<user>/.nvm/versions/node/v22.13.0/bin/node''

BUILD FAILED in 547ms
```

The build fails before any tasks run — Gradle can't evaluate `settings.gradle`.

A second error may also appear on the first run after the node fix, because the autolinking cache is stale:

```text
error: package com.adobe.marketing.mobile.messagingsample does not exist
if (com.adobe.marketing.mobile.messagingsample.BuildConfig.IS_NEW_ARCHITECTURE_ENABLED)
```

---

## Environment

- `apps/AEPSampleApp`, Android, Gradle 9
- nvm for node version management
- The hardcoded version (`v22.13.0`) was uninstalled / never installed on this machine

---

## Cause

### Error 1 — Missing node version

`apps/AEPSampleApp/android/settings.gradle` hardcoded a specific nvm node version:

```groovy
def nodeExecutable = System.getenv("HOME") + "/.nvm/versions/node/v22.13.0/bin/node"
```

When that version is not installed (e.g. after `nvm uninstall`, machine reset, or a new dev machine), Gradle cannot start the node process at all. The build fails at settings evaluation, before any tasks run.

### Error 2 — Stale autolinking cache (secondary)

The autolinking cache at `android/build/generated/autolinking/autolinking.json` contained the old app package `com.adobe.marketing.mobile.messagingsample` instead of the current `com.aepsampleapp`. The generated `ReactNativeApplicationEntryPoint.java` referenced the old package which no longer compiled.

---

## Fix

### Error 1 — Dynamic node detection

Replace the hardcoded version in `apps/AEPSampleApp/android/settings.gradle` with a Groovy closure that reads nvm's `alias/default` file at build time:

```diff
-def nodeExecutable = System.getenv("HOME") + "/.nvm/versions/node/v22.13.0/bin/node"
+// Dynamically find node via nvm's default alias, then fall back to PATH.
+def nodeExecutable = { ->
+    def home = System.getenv("HOME")
+    def nvmDir = System.getenv("NVM_DIR") ?: "$home/.nvm"
+    def defaultAlias = new File("$nvmDir/alias/default")
+    if (defaultAlias.exists()) {
+        def ver = defaultAlias.text.trim()
+        if (!ver.startsWith("v")) ver = "v$ver"
+        def candidate = new File("$nvmDir/versions/node/$ver/bin/node")
+        if (candidate.exists()) return candidate.absolutePath
+    }
+    return "node" // fallback: node must be on PATH
+}()
```

This reads `~/.nvm/alias/default` (or `$NVM_DIR/alias/default`) to find the currently active nvm default, constructs the binary path, and falls back to `"node"` on PATH if nvm is not present (e.g. CI machines with system node).

### Error 2 — Stale autolinking cache

```sh
rm -rf apps/AEPSampleApp/android/build/generated/autolinking/
```

Then rebuild — Gradle will regenerate the autolinking cache with the correct package name.

---

## Switching between apps from the monorepo root

Both apps can coexist on the same emulator (different package IDs):

| App | Package ID | Run command (from repo root) |
|-----|-----------|------------------------------|
| AwesomeProject | `com.awesomeproject` | `yarn awesomeproject:android:run` |
| AEPSampleApp | `com.aepsampleapp` | `yarn sampleapp:android:run` |

No cleanup required when switching — both APKs stay installed simultaneously.

---

## Verify

```sh
# From monorepo root:
yarn sampleapp:android:run    # AEPSampleApp
yarn awesomeproject:android:run  # AwesomeProject
```

Both should reach `BUILD SUCCESSFUL` and launch on the emulator.

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-27 | `yarn android` in `apps/AEPSampleApp` failed with `A problem occurred starting process '...v22.13.0/bin/node'` — v22.13.0 not installed. |
| 2026-03-27 | Secondary error: stale autolinking cache with old package `com.adobe.marketing.mobile.messagingsample`. Fixed by deleting `android/build/generated/autolinking/`. |
| 2026-03-27 | Permanent fix: replaced hardcoded node version in `settings.gradle` with dynamic nvm default-alias detection. `BUILD SUCCESSFUL`. |

---

## Fixed

- **Date:** 2026-03-27
- **Summary:** `settings.gradle` now dynamically reads nvm's default alias instead of hardcoding a node version; stale autolinking cache cleared.
- **Refs:** `apps/AEPSampleApp/android/settings.gradle`

---

## Key lesson

**Never hardcode a specific nvm node version in `settings.gradle`.** nvm versions are machine-local and will differ between developers and CI. Use dynamic detection (read `$NVM_DIR/alias/default`) or rely on `node` being on PATH. Compare: `apps/AwesomeProject/android/settings.gradle` uses `ex.autolinkLibrariesFromCommand()` with no explicit node path — the safer pattern.
