# TurboModule Event Emission on RN 0.84+ (iOS and Android)

**Last updated:** 2026-04-22

> Critical discovery from the Optimize TurboModule migration. Applies to ALL
> native modules that need to emit events to JS on RN 0.84+ new architecture.

---

## The Problem

`sendEventWithName:` (from `RCTEventEmitter`) silently drops events for any
module that has `getTurboModule:`. This affects both turbo and interop paths.

## Root Cause Chain (verified by reading React Native source code)

### 1. `getTurboModule:` is mandatory

`RCTModuleProviders.mm` (codegen-generated) checks at startup:
```objc
if (![instance respondsToSelector:@selector(getTurboModule:)]) {
    RCTLogError(@"Module provider %@ does not conform to RCTModuleProvider");
    continue;  // module skipped — invisible to TurboModuleRegistry
}
```
Source: `apps/AwesomeProject/ios/build/generated/ios/ReactCodegen/RCTModuleProviders.mm:38`

### 2. `NativeModules` in RN 0.84+ IS the turbo module proxy

```javascript
// NativeModules.js:183
if (global.nativeModuleProxy) {
  NativeModules = global.nativeModuleProxy;  // turbo module proxy
}
```

And `nativeModuleProxy` tries turbo first, legacy second:
```cpp
// TurboModuleBinding.cpp:61-71
auto turboModule = turboBinding_.getModule(runtime, moduleName);  // turbo first
if (turboModule.isObject()) return turboModule;
if (legacyBinding_) {
    auto legacyModule = legacyBinding_->getModule(runtime, moduleName);  // legacy fallback
    if (legacyModule.isObject()) return legacyModule;
}
```

If the module has a codegen spec → turbo binding finds it first → legacy never reached.

### 3. Turbo module manager sets `callableJSModules:nil`

```objc
// RCTTurboModuleManager.mm:794
RCTModuleData *data = [[RCTModuleData alloc] initWithModuleInstance:module
                                                            bridge:_bridge
                                                    moduleRegistry:_bridge.moduleRegistry
                                                callableJSModules:nil];  // ← HARDCODED nil
```

### 4. `sendEventWithName:` requires `callableJSModules`

```objc
// RCTEventEmitter.m:65
if (shouldEmitEvent && _callableJSModules) {  // ← nil, never enters
    [_callableJSModules invokeModule:@"RCTDeviceEventEmitter" ...];
} else {
    RCTLogWarn(@"Sending `%@` with no listeners registered.");  // silently dropped
}
```

### Result

```
Has codegen spec → getTurboModule: required → module created by TurboModuleManager
→ callableJSModules:nil → sendEventWithName: silently drops ALL events
```

This is true for BOTH turbo and interop paths. `USE_INTEROP_ROOT` doesn't matter.

---

## The Solution

Use `CodegenTypes.EventEmitter` in the turbo module spec. Codegen generates:
- `NativeAEPOptimizeSpecBase` class with `emitOnPropositionsUpdated:` method
- `_eventEmitterCallback` that goes through JSI (not bridge)
- No dependency on `callableJSModules`

### Spec (`specs/NativeAEPOptimize.ts`)
```typescript
import type { TurboModule, CodegenTypes } from 'react-native';

export type PropositionsPayload = { propositions: Object; };

export interface Spec extends TurboModule {
  registerOnPropositionsUpdate(): void;
  readonly onPropositionsUpdated: CodegenTypes.EventEmitter<PropositionsPayload>;
  // ...
}
```

### iOS Header
```objc
// NativeAEPOptimizeSpecBase provides emitOnPropositionsUpdated:
@interface RCTAEPOptimize : NativeAEPOptimizeSpecBase <NativeAEPOptimizeSpec>
```

### iOS Implementation
```objc
if (_eventEmitterCallback) {
    [self emitOnPropositionsUpdated:@{@"propositions": dict}];
}
```

### JS Subscription
```typescript
NativeAEPOptimize.onPropositionsUpdated((payload) => { ... });
NativeAEPOptimize.registerOnPropositionsUpdate();  // register on native SDK
```

See: https://reactnative.dev/docs/the-new-architecture/native-modules-custom-events

---

## Why `RCTEventEmitter` cannot be used as base class

1. `NativeAEPOptimizeSpecBase` provides `emitOnPropositionsUpdated:` and `_eventEmitterCallback`
2. `RCTEventEmitter` provides `sendEventWithName:` which is dead (callableJSModules:nil)
3. You can't have two base classes in Objective-C
4. Conditional base class (`#if USE_INTEROP_ROOT`) doesn't help because `getTurboModule:`
   exists on both paths, making `sendEventWithName:` dead everywhere

---

## Approaches tried and failed

| # | Approach | Result | Why |
|---|----------|--------|-----|
| 1 | `RCTEventEmitter` + `sendEventWithName:` | Events dropped | `callableJSModules:nil` |
| 2 | Remove `getTurboModule:` on interop | App crash | `RCTModuleProviders.mm` requires it |
| 3 | `NativeModules` fallback | Module null | `NativeModules` = turbo proxy in RN 0.84+ |
| 4 | `DeviceEventEmitter` on JS | Events dropped | Same `callableJSModules:nil` |
| 5 | Different event names | Events dropped | Same mechanism |
| 6 | Remove `hasListeners` guard | Events dropped | `callableJSModules:nil` regardless |
| 7 | Conditional spec exclusion | Impractical | `package.json` codegen not conditional |
| 8 | `NativeAEPOptimizeSpecBase` on both | **✓ WORKS** | Uses JSI, bypasses bridge |

---

## Key files (React Native source references)

| File | What it tells us |
|------|-----------------|
| `ReactCommon/react/nativemodule/core/.../RCTTurboModuleManager.mm:794` | `callableJSModules:nil` for turbo modules |
| `React/Modules/RCTEventEmitter.m:65` | `sendEventWithName:` checks `_callableJSModules` |
| `ReactCommon/react/nativemodule/core/ReactCommon/TurboModuleBinding.cpp:61` | `nativeModuleProxy` tries turbo first |
| `Libraries/BatchedBridge/NativeModules.js:183` | `NativeModules` = `global.nativeModuleProxy` |
| `build/generated/ios/ReactCodegen/RCTModuleProviders.mm:38` | `getTurboModule:` check at startup |

---

## Android Event Emission (confirmed 2026-05-08)

Android codegen behavior differs from iOS in two critical ways:

### 1. `onPropositionsUpdated` is not callable from JS on Android

The generated `NativeAEPOptimizeSpec.java` only has:
```java
protected final void emitOnPropositionsUpdated(ReadableMap value) {
    mEventEmitterCallback.invoke("onPropositionsUpdated", value);
}
```
There is NO `@ReactMethod onPropositionsUpdated` — it is native→JS only.
Calling `native.onPropositionsUpdated(callback)` from JS on Android throws
`Cannot read property 'onPropositionsUpdated' of null`.

**Fix:** Use `NativeEventEmitter.addListener('onPropositionsUpdate', callback)` on Android.
Note: `RCTAEPOptimizeUtil.emitOnPropositionsUpdate` emits via `RCTDeviceEventEmitter`
with event name `"onPropositionsUpdate"` (no trailing 'd').

### 2. Android payload is NOT wrapped in a `propositions` key

`RCTAEPOptimizeUtil.createCallbackResponse` returns the scopes map directly:
```
{ "mboxAug": { ...proposition... }, "scope2": { ... } }
```
iOS wraps it: `@{ @"propositions": dict }` → `payload.propositions`.
Android emits the map as the top-level payload → use `payload` directly.

### JS-side branch in `Optimize.ts`

```typescript
if (Platform.OS === 'android') {
  const emitter = new NativeEventEmitter(native as any);
  onPropositionUpdateSubscription = emitter.addListener('onPropositionsUpdate', (payload: any) => {
    const map = new Map<string, Proposition>();
    for (const [key, value] of Object.entries(payload)) {  // payload IS the map
      map.set(key, new Proposition(value as any));
    }
    adobeCallback.call(map);
  });
} else {
  // iOS: codegen JSI emitter, payload wrapped in { propositions: {...} }
  onPropositionUpdateSubscription = native.onPropositionsUpdated((payload) => {
    const map = new Map<string, Proposition>();
    for (const [key, value] of Object.entries(payload.propositions)) {
      map.set(key, new Proposition(value as any));
    }
    adobeCallback.call(map);
  });
}
native.registerOnPropositionsUpdate();
```
