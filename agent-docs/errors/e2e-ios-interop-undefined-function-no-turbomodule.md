# iOS interop path: `undefined is not a function` — NativeAEPOptimize methods not callable

**Status:** Fixed
**Area:** AwesomeProject, iOS, E2E, Optimize, Turbo Module, Interop layer
**Last updated:** 2026-03-26

---

## Symptom

`yarn e2e:ios:build:release:interop` (`USE_INTEROP_ROOT=1`) builds successfully but E2E fails when the button is tapped — the callback log shows an error like:

```text
Optimize.extensionVersion error: TypeError: undefined is not a function
```

(or "NativeAEPOptimize.extensionVersion is not a function")

`yarn e2e:ios:build:release:turbo` (`USE_INTEROP_ROOT=0`) passes fine.

---

## Environment

- React Native 0.84.1, New Architecture on, iOS Release simulator build
- Branch: `optimize-turbo-module-e2e`
- Files affected: `packages/optimize/ios/src/RCTAEPOptimize.{h,mm}`

---

## Cause

The interop path (`USE_INTEROP_ROOT=1`) was missing `getTurboModule:` and did not conform to `NativeAEPOptimizeSpec`:

**`RCTAEPOptimize.h` (before):**
```objc
#if USE_INTEROP_ROOT
  #import <React/RCTEventEmitter.h>
  @interface RCTAEPOptimize : RCTEventEmitter   // ← no spec conformance
#else
  #import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
  @interface RCTAEPOptimize : NSObject <NativeAEPOptimizeSpec>
#endif
```

**`RCTAEPOptimize.mm` (before):**
```objc
#if USE_INTEROP_ROOT
  RCT_EXPORT_MODULE(NativeAEPOptimize);        // ← no getTurboModule:
#else
  + (NSString *)moduleName { ... }
  - (std::shared_ptr<...>)getTurboModule:(...) {
    return NativeAEPOptimizeSpecJSI(params);   // ← only in turbo branch
  }
#endif
```

In RN 0.84, codegen generates `RCTModuleProviders.mm` (during `pod install`) which does:

```objc
[RCTAEPOptimize conformsToProtocol:@protocol(RCTModuleProvider)]
```

`RCTModuleProvider` requires `getTurboModule:`. The interop class had neither the conformance nor the method, so this check failed. The module was never registered in the Turbo system. Every JS call to `NativeAEPOptimize.*()` via `TurboModuleRegistry.getEnforcing('NativeAEPOptimize')` resolved to `undefined`.

The code comment had assumed "the RN interop layer wraps bridge modules transparently" — this was true in older RN versions but not in RN 0.84 when `codegenConfig.ios.modulesProvider` is set.

---

## Fix

**`packages/optimize/ios/src/RCTAEPOptimize.h`** — import the spec in both branches; interop path conforms to `NativeAEPOptimizeSpec`:

```diff
 #import <Foundation/Foundation.h>
+#import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>

 #if USE_INTEROP_ROOT
   #import <React/RCTEventEmitter.h>
-  @interface RCTAEPOptimize : RCTEventEmitter
+  @interface RCTAEPOptimize : RCTEventEmitter <NativeAEPOptimizeSpec>
 #else
-  #import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
   @interface RCTAEPOptimize : NSObject <NativeAEPOptimizeSpec>
 #endif
```

**`packages/optimize/ios/src/RCTAEPOptimize.mm`** — move `getTurboModule:` outside the `#if/#else` block so both paths use it:

```diff
 #if USE_INTEROP_ROOT
 RCT_EXPORT_MODULE(NativeAEPOptimize);
 #else
 + (NSString *)moduleName { return @"NativeAEPOptimize"; }
-
-- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
-    (const facebook::react::ObjCTurboModule::InitParams &)params
-{
-  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
-}
 #endif
+
+// Shared for both paths — satisfies RCTModuleProvider conformance check from
+// codegen-generated RCTModuleProviders.mm, and gives TurboModuleRegistry the
+// correct JSI method map for all protocol methods.
+- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
+    (const facebook::react::ObjCTurboModule::InitParams &)params
+{
+  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
+}
```

The protocol method implementations (e.g. `extensionVersion:reject:`) were already shared outside the conditional — no changes needed there.

---

## Why `NativeAEPOptimizeSpecJSI` works for the interop path

`NativeAEPOptimizeSpecJSI` dispatches JS calls via ObjC runtime (`invokeObjCMethod`). It looks up methods by the codegen-generated selector names at runtime — it does not require a static compile-time cast. As long as the object responds to those selectors (which it does, since the protocol implementations are compiled in), calls succeed. This matches the pattern in `cursor-docs/migrations/turbo-interop-ios-reference.md`.

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
yarn e2e:ios:build:release:interop
```

Expect: `2 passed, 2 total (100% completed)` — smoke test + optimize extension version.

Also verify turbo is unaffected:
```sh
yarn e2e:ios:build:release:turbo
```

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2026-03-26 | `e2e:ios:build:release:interop` added; E2E failed with "undefined is not a function" on every button tap. Turbo path (`e2e:ios:build:release:turbo`) passed. |
| 2026-03-26 | Root cause identified: missing `getTurboModule:` and spec conformance in the interop branch. RN 0.84 codegen checks `RCTModuleProvider` conformance at startup — without `getTurboModule:`, the module is invisible to TurboModuleRegistry. |
| 2026-03-26 | Fixed: conformed interop header to `NativeAEPOptimizeSpec`; moved `getTurboModule:` outside the `#if/#else`. Rebuilt and ran E2E — 2/2 passing. |

---

## Fixed

- **Date:** 2026-03-26
- **Summary:** Added `NativeAEPOptimizeSpec` conformance to the interop path header and moved `getTurboModule:` (returning `NativeAEPOptimizeSpecJSI`) outside the `#if USE_INTEROP_ROOT` conditional so it is compiled for both interop and turbo paths.
- **Refs:** `packages/optimize/ios/src/RCTAEPOptimize.h`, `packages/optimize/ios/src/RCTAEPOptimize.mm`

---

## Key lesson

**In RN 0.84+ with `codegenConfig.ios.modulesProvider`, every class listed in `modulesProvider` must implement `getTurboModule:` — even on the interop/bridge path.** The codegen-generated `RCTModuleProviders.mm` checks `conformsToProtocol:@protocol(RCTModuleProvider)` at startup; if it fails, `TurboModuleRegistry.getEnforcing()` never resolves the module. The safe pattern (matching `turbo-interop-ios-reference.md`): both branches conform to the generated spec, and `getTurboModule:` returning `NativeXxxSpecJSI` is shared outside the `#if/#else` block.
