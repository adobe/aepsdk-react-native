# Playbook: Migrate an AEP Module to Turbo Native Module

**Last updated:** 2026-03-30
**Reference implementation:** `packages/optimize` (`extensionVersion` API)

---

## Overview

Each AEP package uses the old bridge (`NativeModules`) by default. Migrating to TurboModules requires changes in JS, Android, and iOS. A `USE_INTEROP_ROOT` flag allows toggling between Turbo and legacy bridge without removing backward compatibility.

See `migrations/optimize-turbo.md` for the full Optimize playbook with detailed code patterns.

---

## Checklist

### 1. JS / TypeScript

- [ ] Add method to `specs/Native<Module>.ts` (Codegen source of truth)
- [ ] Mirror in `src/Native<Module>.ts` — `TurboModuleRegistry.getEnforcing<Spec>('Native<Module>')`
- [ ] Update `src/<Module>.ts` — replace `NativeModules.AEP<Module>` with `import Native<Module> from './Native<Module>'`
- [ ] Update any model files (e.g. `src/models/`) that import `NativeModules`

### 2. Android

- [ ] Add method to `NativeAEP<Module>Spec.java` (abstract)
- [ ] Implement in `NativeAEP<Module>Module.java` (Turbo path, `USE_INTEROP_ROOT=false`)
- [ ] Shared logic in `RCTAEP<Module>Util.java` (used by both Turbo + interop)
- [ ] `RCTAEPOptimizePackage.java` — reads `BuildConfig.USE_INTEROP_ROOT` to pick module at runtime
- [ ] `build.gradle` — `buildConfigField "boolean", "USE_INTEROP_ROOT", "false"`

### 3. iOS

- [ ] `RCTAEP<Module>.h` — add `#if USE_INTEROP_ROOT` block:
  - `#if`: `RCTAEP<Module> : RCTEventEmitter <NativeAEP<Module>Spec>` + `RCT_EXPORT_MODULE(NativeAEP<Module>)`
  - `#else`: `RCTAEP<Module> : NSObject <NativeAEP<Module>Spec>` + `+ (NSString *)moduleName { return @"NativeAEP<Module>"; }`
- [ ] `RCTAEP<Module>.mm` (Obj-C++ required for `getTurboModule:` C++ return type)
  - `getTurboModule:` returning `NativeAEP<Module>SpecJSI` must be **outside** the `#if/#else` — both paths need it
  - Protocol method implementations outside `#if/#else` (shared)
  - Event emission (`sendEventWithName:`, `supportedEvents`, etc.) inside `#if USE_INTEROP_ROOT`
- [ ] `RCTAEP<Module>.podspec` — read `ENV['USE_INTEROP_ROOT']`, inject into `GCC_PREPROCESSOR_DEFINITIONS`

### 4. E2E

- [ ] Add screen buttons with testIDs in `apps/AwesomeProject/src/screens/<Module>Screen.tsx`
- [ ] Write spec in `e2e/test/specs/<module>-<api-name>.spec.js`
- [ ] Test both `yarn e2e:ios:build:turbo` and `yarn e2e:ios:build:interop`

---

## Key rules

- `getTurboModule:` is **always required** (outside `#if`) — in RN 0.84, codegen generates `RCTModuleProviders.mm` which checks `conformsToProtocol:@protocol(RCTModuleProvider)` at startup. Without it, the module is invisible to TurboModuleRegistry even if the bridge registers it.
- `.m` → `.mm` rename is mandatory once you add `getTurboModule:` (C++ return type needs Obj-C++).
- Pods + build dir must be cleaned when switching `USE_INTEROP_ROOT` on iOS.
- Android flag is runtime; iOS flag is compile-time.

---

## Module name convention

| Location | Name |
|----------|------|
| JS `TurboModuleRegistry.getEnforcing` | `'NativeAEP<Module>'` |
| iOS `moduleName` / `RCT_EXPORT_MODULE` | `NativeAEP<Module>` |
| Android `getName()` | `NativeAEP<Module>` |

All three must match exactly — a mismatch causes a "module not found" runtime crash.
