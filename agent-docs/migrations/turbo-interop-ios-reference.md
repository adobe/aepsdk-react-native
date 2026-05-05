# Turbo Module + interop layer on iOS (RN 0.73+)

Reference for a **standalone npm library** that supports **both** the legacy bridge (interop) and **Turbo Modules**, toggled with a compile-time flag. Android patterns differ; this document focuses on **iOS**.

---

## 1. Why iOS fails when Android works

Typical causes:

| Cause | Symptom |
|--------|---------|
| **Module name mismatch** | `TurboModuleRegistry.getEnforcing(...): 'X' could not be found` |
| **Wrong ObjC selectors** | `myFunction is not a function` / `undefined is not a function` — Turbo uses **codegen selectors** (e.g. `myFunction:reject:`), not `RCT_EXPORT_METHOD` names (`rejecter:`) |
| **Interop path returns wrong Turbo type** | Returning a **generic** `ObjCTurboModule` without codegen bindings — methods are **not** exposed to JS |
| **Missing `getTurboModule:`** | Codegen’s `RCTModuleProviders` requires `RCTTurboModule`; without `getTurboModule:` returning **`NativeMyModuleSpecJSI`**, the module is incomplete |
| **Header / codegen path** | `NativeMyModuleSpec/NativeMyModuleSpec.h` not found at compile time |
| **Single implementation for Turbo** | Turbo path must implement **`NativeMyModuleSpec` protocol methods** (same as Android’s generated interface). `RCT_EXPORT_METHOD` alone does **not** populate the Turbo `methodMap_` for Codegen’s `NativeMyModuleSpecJSI` |

**Important:** On iOS, the **reliable** pattern for “one binary, two registration styles” is:

- **One** set of **protocol methods** matching Codegen (`NativeMyModuleSpec`).
- **Interop vs Turbo** differs mainly by **base class** (`RCTEventEmitter` vs `NSObject`) and **`RCT_EXPORT_MODULE`** vs **`+moduleName`**, not by duplicating logic in `RCT_EXPORT_METHOD` vs protocol (duplicate selectors cause confusion; Turbo uses protocol selectors only).

---

## 2. Full `MyModule.h`

```objc
/*
 * MyModule.h
 * React Native library — Turbo + interop toggle via USE_INTEROP_ROOT.
 */

#import <Foundation/Foundation.h>
#import <NativeMyModuleSpec/NativeMyModuleSpec.h>

#if USE_INTEROP_ROOT
#import <React/RCTEventEmitter.h>
// Use RCTEventEmitter only if you need sendEventWithName:. Otherwise use NSObject in both branches.
@interface MyModule : RCTEventEmitter <NativeMyModuleSpec>
#else
@interface MyModule : NSObject <NativeMyModuleSpec>
#endif

@end
```

If you **do not** need legacy event emission, use `NSObject` in **both** branches and drop `RCTEventEmitter`.

---

## 3. Full `MyModule.mm`

```objc
/*
 * MyModule.mm
 * Must be Obj-C++ (.mm) for std::shared_ptr and NativeMyModuleSpecJSI.
 */

#import "MyModule.h"
#import <Foundation/Foundation.h>

@implementation MyModule

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

#if USE_INTEROP_ROOT

RCT_EXPORT_MODULE(NativeMyModule);

#else

+ (NSString *)moduleName {
  return @"NativeMyModule";
}

#endif

#pragma mark - RCTTurboModule (Codegen)

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeMyModuleSpecJSI>(params);
}

#pragma mark - NativeMyModuleSpec (Codegen protocol — required for Turbo path; keep implementations shared)

- (void)myFunction:(NSString *)param
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  if (param.length == 0) {
    reject(@"invalid_input", @"param required", nil);
    return;
  }
  resolve([NSString stringWithFormat:@"Hello %@", param]);
}

#if USE_INTEROP_ROOT

#pragma mark - RCTEventEmitter (optional, interop-only)

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"MyEvent" ];
}

#endif

@end
```

**Notes:**

- **`RCT_EXPORT_MODULE(NativeMyModule)`** — the string must equal the **JS** name passed to `TurboModuleRegistry.getEnforcing('NativeMyModule')` and match **`modulesProvider`** keys.
- **Do not** rely on generic `ObjCTurboModule` for Codegen modules — use **`NativeMyModuleSpecJSI`** so `methodMap_` matches your spec.
- Protocol method **signatures** must match generated `NativeMyModuleSpec.h` (parameter labels `resolve:` / `reject:` not `resolver:` / `rejecter:` unless Codegen says so).

---

## 4. Podspec (preprocessor flag + Codegen headers)

```ruby
require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "MyModule"
  s.version      = package["version"]
  s.summary      = "My React Native module"
  s.homepage     = "https://example.com"
  s.license      = "MIT"
  s.authors      = "You"
  s.platform     = :ios, '13.4'

  s.source       = { :git => "https://example.com/repo.git", :tag => s.version.to_s }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "React-Codegen"

  # Toggle: 1 = interop-oriented (e.g. RCT_EXPORT_MODULE + RCTEventEmitter), 0 = Turbo-only style
  use_interop = ENV["USE_INTEROP_ROOT"] != "0"

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop ? 1 : 0}"
  }
end
```

**Consumer app:** after changing the flag, run **`pod install`** from the app `ios/` folder so CocoaPods picks up `GCC_PREPROCESSOR_DEFINITIONS`.

**Alternative:** hardcode in the podspec for library releases:

```ruby
"GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=1"
```

---

## 5. JS `NativeModule.ts` (both paths, same logical name)

The **native module name must be identical** for Turbo and for `NativeModules`:

```ts
// src/NativeModule.ts
import { NativeModules, TurboModuleRegistry } from 'react-native';
import type { Spec } from './specs/NativeMyModule';

/**
 * Set at build time by your bundler (e.g. babel plugin) or two package entry points.
 * Do NOT mix two different module name strings between Turbo and NativeModules.
 */
declare const USE_TURBO: boolean;

const MODULE_NAME = 'NativeMyModule' as const;

export const MyNativeModule: Spec = USE_TURBO
  ? TurboModuleRegistry.getEnforcing<Spec>(MODULE_NAME)
  : (NativeModules[MODULE_NAME] as Spec);

export default MyNativeModule;
```

**Critical:** `NativeModules.NativeMyModule` exists only if **`RCT_EXPORT_MODULE(NativeMyModule)`** (or equivalent) registers that name. **`TurboModuleRegistry.getEnforcing('NativeMyModule')`** uses the **same** string.

If you previously used `'MyModule'` in one place and `'NativeMyModule'` in another, iOS will fail unpredictably.

---

## 6. Codegen spec `src/specs/NativeMyModule.ts`

```ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  myFunction(param: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeMyModule');
```

**Library publishing:** ship **TypeScript sources** under `specs/` (or `src/specs/`) so the **app’s** `pod install` / Gradle codegen runs against your published package.

---

## 7. `package.json` `codegenConfig`

```json
{
  "codegenConfig": {
    "name": "NativeMyModuleSpec",
    "type": "modules",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.myapp.mymodule"
    },
    "ios": {
      "modulesProvider": {
        "NativeMyModule": "MyModule"
      }
    }
  }
}
```

- **`name`**: umbrella name for generated artifacts (e.g. `NativeMyModuleSpec`).
- **`jsSrcsDir`**: folder containing `NativeMyModule.ts` (adjust path if you use `src/specs`).
- **`modulesProvider`**: maps **JS Turbo module name** → **ObjC class name** (must match `@implementation MyModule` and `NSClassFromString` in generated `RCTModuleProviders`).

---

## 8. Checklist — everything that must match

| Item | Value (example) |
|------|------------------|
| JS `TurboModuleRegistry.getEnforcing('…')` | `NativeMyModule` |
| `NativeModules` key | `NativeMyModule` (same string) |
| `RCT_EXPORT_MODULE(…)` (interop) | `NativeMyModule` |
| `+ moduleName` (Turbo branch) | `return @"NativeMyModule"` |
| `codegenConfig.ios.modulesProvider` key | `NativeMyModule` |
| `codegenConfig.ios.modulesProvider` value | ObjC class: `MyModule` |
| Generated protocol / umbrella import | `#import <NativeMyModuleSpec/NativeMyModuleSpec.h>` |
| `getTurboModule:` return type | `NativeMyModuleSpecJSI` |
| ObjC protocol methods | Exact selectors in generated `NativeMyModuleSpec.h` |

---

## 9. iOS-specific gotchas (vs Android)

1. **`.mm` not `.m`** — Turbo/C++ types require Objective-C++.
2. **Codegen headers live under the app’s** `ios/build/generated/ios/ReactCodegen` — **pod install** in the **app** generates them; the library podspec must add **HEADER_SEARCH_PATHS** as above.
3. **`RCTModuleProviders` + `NSClassFromString`** — the ObjC class must be linked (usually satisfied by `-ObjC` and linking your pod). If the class is stripped, use `-force_load` for that library (rare if the pod is linked normally).
4. **Do not return `nullptr` from `getTurboModule:`** if Codegen registered your module — use **`NativeMyModuleSpecJSI`**.
5. **`RCT_EXPORT_METHOD` selector names ≠ Codegen** — Turbo calls **protocol** methods; duplicate `RCT_EXPORT_METHOD` with different parameter labels can confuse maintenance; prefer **one** protocol implementation for both flags.
6. **New Architecture flag** — RN 0.73+ may not define `RCT_NEW_ARCH_ENABLED` in all pods; use an **explicit** `USE_INTEROP_ROOT` (or your `BUILD_FLAG`) in **your** podspec, not only `RCT_NEW_ARCH_ENABLED`.
7. **Interop + `RCTEventEmitter`** — if you subclass `RCTEventEmitter`, still conform to **`NativeMyModuleSpec`** and implement **`getTurboModule:`** as shown.

---

## 10. Mental model

```
JS (same name: NativeMyModule)
        │
        ▼
TurboModuleRegistry / NativeModules
        │
        ▼
RCTModuleProviders["NativeMyModule"] → MyModule instance
        │
        ▼
getTurboModule: → NativeMyModuleSpecJSI (methodMap_ from Codegen)
        │
        ▼
invokeObjCMethod → -[MyModule myFunction:resolve:reject:]
```

---

## Related reading in this repo

- `cursor-docs/migrations/optimize-turbo.md` — Adobe Optimize migration playbook (Android + iOS, flags, validation).

This file is a **generic** template aligned with React Native Codegen and CocoaPods; adjust names (`MyModule` → your class) and dependencies (`React-Core` vs `React`) to your RN version and app.
