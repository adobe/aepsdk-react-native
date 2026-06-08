# Known Gotchas & Non-Obvious Rules

**Last updated:** 2026-06-08

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

### 7. Android UiScrollable needs a pause after long scroll sequences

After scrolling far down (e.g. to button #8) then back to the top (`aepsdk-sdk-init-status`), `UiScrollable.scrollIntoView()` can fail to find elements on the next downward scroll. Add `browser.pause(1000)` between scrolling to top and the next `scrollAppScrollToTestIdAndClick` to let UiScrollable settle. Discovered in `optimize-on-proposition-update.spec.js` where registering a listener (far down) then tapping update-propositions-callback (near top) failed without the pause.

---

### 8. UiAutomator2/XCUITest only sees elements in the current viewport — scroll before reading

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
1. **Truncation:** `os_log` truncates long messages with `<…>`. JSON key ordering inside `data: {}` is non-deterministic, so the truncation point varies per run. Hard-assert event names (in header) and short response strings. Assert payload fields (`mboxAug`, `decisioning.propositionDisplay`, `trackpropositions`) via the **callback log `nativePayload:`** — the app logs the full proposition data before calling the fire-and-forget API, so it is never truncated.
2. **Debug level:** `EdgeNetworkService - Sending request`, `Initiated (POST)`, `Connection to Experience Edge` are logged at `os_log_debug` level — **only visible when a debugger is attached** (Xcode). `log stream` without Xcode cannot see them. Use `/server response/i` (regex) to verify the Edge POST succeeded — it matches both iOS (`Handle server response with streaming enabled`) and Android (`Received server response`).
3. **Persistence doesn't work for simulator:** `log show`, `log collect`, `log config --mode persist:debug` (both host and `xcrun simctl spawn`) — none persist AEP SDK debug entries from simulator processes. Only live `log stream` on the host captures them. The `log show --last 60s` fallback in `getNativeSdkLogs()` provides extra coverage for entries that the stream buffer may have missed.

**All native log assertions are now hard (`expect().toContain()` / `expect().toMatch()`) on both iOS and Android.** iOS log capture via host `log stream` + `log show --last 60s` fallback is confirmed working. Soft checks (`assertNativeLogContains()`) are deprecated — do not use in new specs.

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

### 22. AEPSampleAppNewArchEnabled: "Could not connect to development server" → Watchman hang, not a network issue

The Expo sample app (`apps/AEPSampleAppNewArchEnabled`) shipped with **no `metro.config.js`** (unlike AwesomeProject). Symptom: native app builds and launches fine, but shows the red **"Could not connect to development server"** screen pointing at `localhost:8081/.expo/.virtual-metro-entry.bundle`.

The error is misleading — Metro's HTTP server is up and answers `/status` (`packager-status:running`), but **every bundle request blocks forever**. Metro's log shows `Waiting for Watchman \`watch-project\` (Ns)...` climbing without end.

**Root cause:** Watchman's daemon socket is unavailable (e.g. in a sandboxed env the state dir resolves to a path like `/tmp/.../namarora-state/sock` that doesn't exist). The watchman *client* hangs at watch establishment, before any `.watchmanconfig` `ignore_dirs` filtering applies — so adding `.watchmanconfig` does **not** fix it.

**Fix:** disable watchman in `metro.config.js` so Metro falls back to its Node-based file watcher:

```js
config.resolver.useWatchman = false;
```

(`useWatchman` is a `resolver` config field in Metro 0.83.) After this, the bundle compiles (HTTP 200) and the app connects on reload (`Cmd+R` in the simulator).

The app also needed the standard monorepo `metro.config.js` (`watchFolders` + `nodeModulesPaths` + `extraNodeModules` mapping `@adobe/react-native-aep*` → `packages/*`), mirroring AwesomeProject — see gotcha #12.

**Note:** also confirm Metro is launched with nvm node on PATH (gotcha #9) and that the simulator was reloaded *after* Metro came up — the app caches the failed-connection screen until reloaded.

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

---

### 15. AEP SDK native log messages differ between iOS and Android

The same SDK event produces different log message text on each platform. Never hard-code a platform-specific string in E2E assertions — use regex or `assertNativeLogContains()`.

Key difference discovered: the Edge network response log:
- iOS: `"Handle server response with streaming enabled"` (from `EdgeNetworkService`)
- Android: `"Received server response"` (from `Edge/NetworkResponseHandler`)

**Rule:** Use `expect(sdkLogs).toMatch(/server response/i)` instead of `.toContain('Handle server response with streaming enabled')`. Always verify assertions pass on BOTH platforms before merging.

---

### 16. `Optimize.generateDisplayInteractionXdm(offers)` — two separate bugs

**Android (FIXED):** `TypeError: iterator method is not callable` — the native SDK returns a `WritableMap` which the bridge converts to a plain JS Object, NOT a `Map`. The app code called `Object.fromEntries(displayInteractionXdm)` which requires an iterable. Fix: use `JSON.stringify(displayInteractionXdm)` directly (changed in `OptimizeExperienceScreen.tsx`). After fix, Android returns the full XDM payload with `eventType`, `decisioning.propositionDisplay`, `mboxAug`, etc.

**iOS (OPEN):** `Error in generating Display interaction XDM for multiple offers` — the iOS `propositionCache` in `RCTAEPOptimize.mm` fails to cache Target mbox propositions. Root cause: `cachePropositions:` checks `activity.id` at the top level first, but Target mbox propositions have `activity: {}` (empty dict — truthy) with no `id`. The original code used `if/else` so it never reached the `scopeDetails.activity.id` fallback. Partial fix applied (changed to sequential `if (!activityId)` fallback) but the cache is still not populated — `convertPropositionToDict` may return a structure where neither path finds the activity ID. Needs further investigation.

---

### 18. Android CodegenTypes.EventEmitter: subscribe via `native.onPropositionsUpdated(callback)` (unified with iOS)

**Updated 2026-06-08 — old workaround replaced.**

On Android (turbo path), `CodegenTypes.EventEmitter<T>` generates `emitOnPropositionsUpdated(ReadableMap)` in the Java spec. JS subscribes via `NativeAEPOptimize.onPropositionsUpdated(callback)` — the same call used on iOS. No `NativeEventEmitter.addListener` or `Platform.OS` branch needed.

The Android native module wraps the payload in `{ propositions: ... }` to match `PropositionsPayload`:
```java
WritableMap payload = Arguments.createMap();
payload.putMap("propositions", RCTAEPOptimizeUtil.createCallbackResponse(map));
emitOnPropositionsUpdated(payload);
```

JS reads `payload.propositions` on both platforms:
```typescript
NativeAEPOptimize.onPropositionsUpdated((payload) => {
  for (const [key, value] of Object.entries(payload.propositions)) { ... }
});
```

**Historical note:** Before 2026-06-08, Android used `RCTDeviceEventEmitter.emit("onPropositionsUpdate", flatMap)` (flat payload, no wrapper) and JS used `NativeEventEmitter.addListener('onPropositionsUpdate', ...)`. This is still used in the legacy interop path (`RCTAEPOptimizeModule.java`) but NOT on the turbo path. See `context/turbo-module-event-emission.md`.

---

### 19. E2E: `pause(3000)` required between `updatePropositions onSuccess` → `getPropositions` → action tap

Specs that call `getPropositions` immediately after `updatePropositions onSuccess` and then immediately tap an action button (e.g. `multipleOffersDisplayed`, `generateDisplayInteractionXdm`) fail intermittently on Android because the SDK cache hasn't fully settled by the time the next API is called.

**Confirmed pattern that works:**
```
updatePropositions callback → waitUntil onSuccess → pause(3000)
→ getPropositions → waitUntil size > 0 → pause(3000)
→ tap action button
```

**Affected specs:** `optimize-multiple-displayed.spec.js`, `optimize-generate-display-xdm.spec.js`

**Rule:** Add `browser.pause(3000)` after the `updatePropositions onSuccess` waitUntil AND after the `getPropositions size > 0` waitUntil, before tapping any API that depends on the populated cache.

---

### 21. E2E: Add `pause(3000)` at the start of `it()` before the first button press

After `activateAwesomeProject()` + SDK "ready" status check, the SDK may not yet be fully settled for network calls — especially after a fresh emulator/simulator restart. Immediately pressing the first button (e.g. `update-propositions-callback`) causes `updatePropositions onError` because the SDK hasn't connected to the network yet.

**Fix:** Add `await browser.pause(3000)` at the very start of `it()` before any `scrollAppScrollToTestIdAndClick` call. This is separate from the inter-step pauses (gotcha #19) and applies to all specs that make network calls on their first action.

**Affected specs:** `optimize-displayed-proposition.spec.js`, `optimize-tapped-proposition.spec.js`

---

### 20. Editing package TypeScript source requires `yarn build` before running e2e

Packages use `"main": "./dist/index.js"` — Metro and release builds serve the compiled output, not the TypeScript source. Editing `packages/optimize/src/*.ts` has no effect until the dist is rebuilt.

**Rule:** After any change to `packages/*/src/`, always run `yarn build` from the repo root before rebuilding the app or running e2e tests. Skipping this causes the old compiled JS to be bundled, making the fix invisible at runtime.

```bash
cd /path/to/aepsdk-react-native && yarn build   # rebuilds all packages via lerna tsc
```

---

### 17. `sendEventWithName:` is dead for turbo-registered modules on RN 0.84+

`RCTTurboModuleManager.mm:794` hardcodes `callableJSModules:nil` for ALL modules with `getTurboModule:`. Since `getTurboModule:` is required by `RCTModuleProviders.mm` for any module with a codegen spec, `sendEventWithName:` silently drops events on BOTH turbo and interop paths. This affects any module that needs to emit events from native to JS.

**Root cause:** `sendEventWithName:` calls `[_callableJSModules invokeModule:@"RCTDeviceEventEmitter" ...]`. When `_callableJSModules` is nil, the call silently returns.

**Fix:** Use `CodegenTypes.EventEmitter` + `NativeAEPOptimizeSpecBase`. The codegen generates `emitOnPropositionsUpdated:` which uses `_eventEmitterCallback` (JSI-native, bypasses `callableJSModules` entirely).

**Files changed:**
- `specs/NativeAEPOptimize.ts`: `readonly onPropositionsUpdated: CodegenTypes.EventEmitter<PropositionsPayload>`
- `RCTAEPOptimize.h`: `NativeAEPOptimizeSpecBase <NativeAEPOptimizeSpec>` on both paths
- `RCTAEPOptimize.mm`: `[self emitOnPropositionsUpdated:@{@"propositions": dict}]`
- `NativeAEPOptimizeModule.java`: `emitOnPropositionsUpdated(payload)` where payload wraps in `{propositions: ...}`
- `Optimize.ts`: `NativeAEPOptimize.onPropositionsUpdated(callback)` — unified, no `Platform.OS` branch

**Result:** ✓ callback fires on both iOS and Android turbo paths.

See: `agent-docs/context/turbo-module-event-emission.md` for the full investigation.

---

### 24. Multi-version RN monorepo: Metro picks up the wrong `react-native` from root `node_modules`

When multiple apps in a monorepo use different RN versions, root `devDependencies` must NOT include `react-native` or `react`. If they do, Metro (which searches `nodeModulesPaths` including root) may resolve the wrong version and produce hard-to-trace codegen errors like:

```
Unable to determine event arguments for "onModeChange" in "VirtualViewExperimentalNativeComponent.js"
```

**Fix (three layers):**

1. **Yarn install-time** — remove `react-native`/`react` from root `devDependencies`; resolve `react-native` for Jest from `AwesomeProject/node_modules` via `moduleNameMapper` in `jest.config.js`.

2. **Metro bundle-time** — in `apps/AEPSampleAppNewArchEnabled/metro.config.js`, block root `node_modules/react-native` and `node_modules/react` via `blockList`, and pin them with `extraNodeModules` to the app's own `node_modules`.

3. **`@react-navigation` multiple-copies crash** — `expo-router` ships its own nested `@react-navigation/core` and `@react-navigation/native` that conflict with the app's top-level versions. Fix: block `expo-router/node_modules/@react-navigation` in `blockList`, pin all `@react-navigation/*` in `extraNodeModules`, and add a `resolutions` block in `apps/AEPSampleAppNewArchEnabled/package.json` so yarn deduplicates them at install time.

```js
// apps/AEPSampleAppNewArchEnabled/metro.config.js (key parts)
config.resolver.blockList = [
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react-native'))}/.*`),
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react'))}/.*`),
  new RegExp(`^${escapePath(join(projectRoot, 'node_modules/expo-router/node_modules/@react-navigation'))}/.*`),
];
config.resolver.extraNodeModules = {
  'react-native': join(projectRoot, 'node_modules/react-native'),
  'react': join(projectRoot, 'node_modules/react'),
  '@react-navigation/core': join(projectRoot, 'node_modules/@react-navigation/core'),
  // ... other @react-navigation/* packages
};
```

**`AEPSampleApp` is NOT in root workspaces** — its `react-native@0.85` lives exclusively in `apps/AEPSampleApp/node_modules` and cannot leak. No blockList needed for it.

---

### 23. `JSON.stringify(Map)` always outputs `{}`

JavaScript's `JSON.stringify` cannot serialize `Map` objects — it outputs `{}` regardless of contents. This made `onPropositionUpdate` logs appear empty when the data was actually flowing correctly.

**Symptom:** `console.log(JSON.stringify(propositions))` → `{}` even though `propositions.size > 0`.

**Fix:** Convert to a plain object first:
```typescript
console.log(JSON.stringify(Object.fromEntries(propositions), null, 2));
// or for class instances with non-enumerable properties:
propositions.forEach((val, key) => console.log(key, JSON.stringify(val)));
```

**Rule:** Never `JSON.stringify` a `Map` directly in debug logs. Always use `Object.fromEntries(map)` or iterate the entries.
