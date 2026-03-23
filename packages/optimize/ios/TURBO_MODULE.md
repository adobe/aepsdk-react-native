# iOS Turbo Module (New Architecture)

This document describes the iOS Turbo Native Module setup for AEP Optimize and the changes made to align with React Native's Turbo Module conventions.

## Overview

The Optimize extension exposes a Turbo Module so it can be used with the React Native **New Architecture**. The implementation follows the same pattern as other Turbo Modules (e.g. [AepTurboCore](https://github.com/adobe/turboCore)):

- **Spec name (JS / bridge):** `NativeAEPOptimize` — used in `TurboModuleRegistry.getEnforcing('NativeAEPOptimize')` and in `codegenConfig.ios.modulesProvider`.
- **ObjC class name:** `RCTAEPOptimize` — the native implementation class.
- **Codegen spec:** `AEPOptimizeSpec` — generates `NativeAEPOptimizeSpec` (protocol) and `NativeAEPOptimizeSpecJSI` (C++ JSI class).

## Files

| File | Role |
|------|------|
| `RCTAEPOptimize.h` | Declares `RCTAEPOptimize` conforming to `NativeAEPOptimizeSpec` (Codegen-generated protocol). |
| `RCTAEPOptimize.mm` | Implements the module: `getTurboModule:`, `moduleName`, and spec methods (e.g. `extensionVersion`). |
| `RCTAEPOptimizeProvider.mm` | Implements `RCTTurboModuleProvider`: returns the module instance when the bridge requests `"NativeAEPOptimize"`. |

## Configuration

In `package.json`:

```json
"codegenConfig": {
  "name": "AEPOptimizeSpec",
  "ios": {
    "modulesProvider": {
      "NativeAEPOptimize": "RCTAEPOptimize"
    }
  }
}
```

- **Key `"NativeAEPOptimize"`** — Spec name. Must match:
  - The string used in JS: `TurboModuleRegistry.getEnforcing('NativeAEPOptimize')`
  - The value returned by `+ (NSString *)moduleName` in `RCTAEPOptimize.mm`
  - The name checked in `RCTAEPOptimizeProvider`'s `getModuleForName:`
- **Value `"RCTAEPOptimize"`** — ObjC class that implements the Turbo Module.

## Changes Applied (Turbo Module Compliance)

The following fixes were applied so the iOS implementation correctly integrates with the New Architecture.

### 1. `RCTAEPOptimize.mm`

- **JSI class name:** Updated from `NativeRCTAEPOptimizeSpecJSI` to **`NativeAEPOptimizeSpecJSI`**.  
  Codegen for spec name `AEPOptimizeSpec` generates `NativeAEPOptimizeSpec` / `NativeAEPOptimizeSpecJSI` (no `RCT`).
- **Comments:** Updated to reference `NativeAEPOptimizeSpec` and `NativeAEPOptimizeSpecJSI` instead of `NativeRCTAEPOptimizeSpec` / `NativeRCTAEPOptimizeSpecJSI`.
- **`moduleName`:** Already returned `@"NativeAEPOptimize"` (correct); no change.

### 2. `RCTAEPOptimizeProvider.mm`

- **Lookup name:** Updated from `"RCTAEPOptimize"` to **`"NativeAEPOptimize"`**.  
  The bridge calls `getModuleForName:` with the **spec name** (the key in `modulesProvider`), not the ObjC class name. Using `"NativeAEPOptimize"` ensures the provider returns the module when the JS side requests it.

## Naming Convention Summary

| Concept | Name | Used in |
|--------|------|--------|
| Spec / module name (no `RCT`) | `NativeAEPOptimize` | JS, `moduleName`, Provider, `modulesProvider` key |
| ObjC class | `RCTAEPOptimize` | Implementation class, `modulesProvider` value |
| Codegen protocol | `NativeAEPOptimizeSpec` | `.h` protocol conformance |
| Codegen JSI class | `NativeAEPOptimizeSpecJSI` | `getTurboModule:` in `.mm` |

## References

- [React Native: Turbo Native Modules (iOS)](https://reactnative.dev/docs/turbo-native-modules-introduction?platforms=ios)
- [AepTurboCore](https://github.com/adobe/turboCore) — reference implementation using the same pattern
