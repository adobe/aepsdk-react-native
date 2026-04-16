# Known Gotchas & Non-Obvious Rules

**Last updated:** 2026-03-30

> Quick reference for things that burned us and aren't obvious from reading the code.

---

## iOS

### 1. Never delete `ios/build` after `pod install`
RN codegen writes `RCTAppDependencyProvider.h` into `apps/AwesomeProject/ios/build/generated/ios/ReactAppDependencyProvider/` during pod install's pre-install hook. If you delete `ios/build` after that, xcodebuild fails with "No such file or directory".

**Rule:** Clean sequence is `rm -rf Pods Podfile.lock build` → `pod install` → `xcodebuild`. Never `rm -rf build` a second time.

See: `errors/e2e-ios-build-rctappdependencyprovider-not-found.md`

---

### 2. `getTurboModule:` is required even on the interop path (RN 0.84+)
In RN 0.84, codegen generates `RCTModuleProviders.mm` which checks `conformsToProtocol:@protocol(RCTModuleProvider)` at startup. If `getTurboModule:` is missing, the module is invisible to TurboModuleRegistry even if the bridge registers it via `RCT_EXPORT_MODULE`.

**Rule:** Always implement `getTurboModule:` returning `NativeAEP<Module>SpecJSI` — outside the `#if USE_INTEROP_ROOT` block so both paths include it.

See: `context/architecture.md`, `migrations/optimize-turbo.md`

---

### 3. `.m` → `.mm` rename is required for TurboModule
`getTurboModule:` returns a C++ type (`std::shared_ptr<NativeAEP<Module>SpecJSI>`). Obj-C (`.m`) cannot handle C++ types — the file must be Obj-C++ (`.mm`).

---

### 4. Pods must be cleaned when switching USE_INTEROP_ROOT
iOS flag is compile-time. Switching `USE_INTEROP_ROOT` without cleaning Pods + build produces a stale binary that ignores the new value.

---

### 5. `use_frameworks! :linkage => :static` + `-no-verify-emitted-module-interface`
AEP SDK requires static frameworks. All AEP pod targets also need `OTHER_SWIFT_FLAGS = '-no-verify-emitted-module-interface'` in Podfile `post_install` or Swift verification errors appear at link time.

---

## Android

### 6. `USE_INTEROP_ROOT` is runtime on Android, compile-time on iOS
Android reads `BuildConfig.USE_INTEROP_ROOT` at runtime in `RCTAEPOptimizePackage.java` to pick the module. You do not need to clean/rebuild when toggling — just change `build.gradle` and rebuild.

---

## E2E / Appium

### 7. UiAutomator2/XCUITest only sees elements in the current viewport — scroll before reading

After calling `scrollAppScrollToTestIdAndClick()` to tap a button deep in the page, any element that was ABOVE that button (e.g. `CallbackLogPanel`) gets pushed off-screen and disappears from the element hierarchy entirely. Calling `.getText()` on it will throw "element wasn't found".

**Rule:** Always call `scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status')` after any deep scroll-and-tap, before reading the log. Target `aepsdk-sdk-init-status` (not `aepsdk-callback-log-content`) because the log text is inside a nested ScrollView that UiScrollable can't traverse from the outer scroll. Use `scrollAppScrollToTestId` (no-click variant) for scroll-only operations.

Additional: `wdio.android.conf.js` must have `appium:forceAppLaunch: true` — without it, Appium reuses the existing app process (scroll position persists from prior sessions, causing ALL specs to fail on the very first element lookup).

In `App.tsx` the layout order is: init status → Core → Assurance → **CallbackLogPanel** → OptimizeExperienceScreen. The log is above the optimize buttons.

See: `errors/e2e-android-element-not-found-scrolled-off-screen.md`

---

### 8. iOS: `mobile: swipe` on a ScrollView lands on nested WebView — use coordinate-based swipes

XCUITest dispatches `mobile: swipe` at the **center** of the element's visible bounds. If a nested scrollable container (e.g. HTML offer WebView, nested ScrollView) occupies that center, the gesture is consumed by the nested container and the outer ScrollView doesn't scroll.

**Rule:** On iOS, use `browser.performActions` with screen coordinates in the **upper portion** (15–45% from top) of the screen instead of `mobile: swipe` with `elementId`. This avoids nested containers that sit in the middle/lower part of the page.

See: `errors/e2e-ios-scroll-nested-webview-intercepts-gesture.md`

---

### 9. Always source nvm before running e2e commands
Appium 3 is installed under nvm-managed Node. `yarn e2e:*` scripts spawn appium as a subprocess and need it on PATH. In a fresh shell, nvm is not sourced automatically.

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && yarn e2e:ios:build:turbo
```

---

### 10. iOS: Must use host `log stream`, not `xcrun simctl spawn`, for AEP SDK logs

The AEP SDK on iOS **does** emit logs via `os_log` under `subsystem: com.adobe.mobile.marketing.aep` with categories like `AEP SDK DEBUG - <RCTAEPOptimize>`, `AEP SDK TRACE - <EventHub>`, etc. However:

- **`xcrun simctl spawn <udid> log stream`** runs inside the simulator sandbox and does **NOT** see these log entries — it returns zero AEP SDK matches even with the correct subsystem predicate.
- **`/usr/bin/log stream`** (host Mac) captures the unified log including all simulator processes — AEP SDK entries appear correctly.
- **`process == "AwesomeProject"`** predicate is too broad — it captures thousands of XCUITest accessibility framework entries (`scroll.bar.vertical`, `page.count`, `AX element` queries) that drown out SDK logs.

**Rule:** Use `/usr/bin/log stream` on the host with predicate `subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"`. Use `--style compact` (not ndjson — ndjson also truncates). Native log assertions work on **both** platforms — do NOT guard them as Android-only.

**Caveat — os_log truncation + Debug-level visibility:**
1. **Truncation:** `os_log` truncates long messages with `<…>`. JSON key ordering inside `data: {}` is non-deterministic, so the truncation point varies per run. Hard-assert only event names (in header) and short messages. Use soft checks (if/else + console.log) for payload fields like `mboxAug`, `decisioning.propositionDisplay`.
2. **Debug level:** `EdgeNetworkService - Sending request`, `Initiated (POST)`, `Connection to Experience Edge` are logged at `os_log_debug` level — **only visible when a debugger is attached** (Xcode). `log stream` without Xcode cannot see them. Assert `Handle server response with streaming enabled` (Info level) instead to verify the Edge POST succeeded.
3. **Persistence doesn't work for simulator:** `log show`, `log collect`, `log config --mode persist:debug` (both host and `xcrun simctl spawn`) — none persist AEP SDK debug entries from simulator processes. Only live `log stream` on the host captures them.

See: `context/ios-native-log-capture.md` for the full comparison table and assertion tiers.

See: `context/ios-native-log-capture.md`, `playbooks/e2e-test-run.md` → "Fire-and-forget API" pattern

---

### 11. Android E2E APK path was hardcoded to debug in wdio config
`wdio.android.conf.js` had the APK path hardcoded to the debug build. Release E2E builds fail because the APK isn't at the expected path.

See: `errors/e2e-android-build-cmake-clean-glob-mismatch.md`

---

## JS / Metro

### 12. Metro symlink workaround required for local package development
When developing packages locally (symlinked), Metro needs `watchFolders` + `resolver.nodeModulesPaths` configured in `metro.config.js`. Without it, Metro cannot resolve `@adobe/react-native-aep*` from outside `node_modules`.

See: `docs/development.md`

---

### 13. Android turbo release build: clean library package build dirs too

The `e2e:android:build:release:turbo` script only cleans `app/.cxx` and `app/build` — it does NOT clean `packages/*/android/build/`. Stale codegen, BuildConfig, or compiled classes from a prior build (interop, debug, different branch) cause the turbo module to resolve as an empty JSI stub `{}` with no working methods. All Optimize API calls fail with `TypeError: Cannot read property '<method>' of null`.

**Rule:** Always clean `packages/optimize/android/build/` (and any other migrated turbo module package) before a release turbo build.

```bash
rm -rf packages/optimize/android/build apps/AwesomeProject/android/app/{.cxx,build}
cd apps/AwesomeProject/android && USE_INTEROP_ROOT=0 ./gradlew assembleRelease
```

See: `errors/android-turbo-module-null-stale-build.md`

---

## General

### 14. Module name must match exactly across JS, iOS, and Android
| Location | Expected name |
|----------|--------------|
| `TurboModuleRegistry.getEnforcing(...)` | `'NativeAEP<Module>'` |
| iOS `moduleName` / `RCT_EXPORT_MODULE(...)` | `NativeAEP<Module>` |
| Android `getName()` | `NativeAEP<Module>` |

Any mismatch causes a silent "module not found" or `undefined is not an object` at runtime.
