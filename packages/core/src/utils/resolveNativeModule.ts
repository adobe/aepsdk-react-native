/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import type { TurboModule } from 'react-native';
import { NativeModules, TurboModuleRegistry } from 'react-native';

export interface NativeModuleOptions<T> {
  /** A method that must exist on a registered module for it to be considered usable. */
  probeMethod: keyof T & string;
  /** Properties returned as-is (not `.bind()`-wrapped), e.g. codegen EventEmitters. */
  unboundProps?: ReadonlyArray<string>;
}

function isClassicBridge(): boolean {
  return (global as { RN$Bridgeless?: boolean }).RN$Bridgeless !== true;
}

/**
 * Resolves a native module across bridgeless vs classic-bridge runtimes.
 *
 * Uses undocumented RN internals (`global.RN$Bridgeless`, TurboModuleRegistry vs
 * NativeModules registration). Re-validate on every RN minor bump.
 *
 * Resolution order:
 * 1. NativeModules, when running on the classic bridge (old arch)
 * 2. TurboModuleRegistry (new arch / bridgeless)
 * 3. NativeModules fallback
 * 4. TurboModuleRegistry.getEnforcing, which throws a descriptive error
 */
export function resolveNativeModule<T extends TurboModule>(
  name: string,
  probeMethod: keyof T & string
): T {
  const isUsable = (mod: T | null | undefined): mod is T =>
    mod != null &&
    typeof (mod as unknown as Record<string, unknown>)[probeMethod] ===
      'function';

  const bridge = (NativeModules as Record<string, unknown>)[name] as
    | T
    | undefined;
  if (isClassicBridge() && isUsable(bridge)) {
    return bridge;
  }
  const turbo = TurboModuleRegistry.get<T>(name);
  if (isUsable(turbo)) {
    return turbo;
  }
  if (isUsable(bridge)) {
    return bridge;
  }
  return TurboModuleRegistry.getEnforcing<T>(name);
}

/**
 * Returns a lazily resolved proxy for a native module. Resolution happens on first
 * access (and is retried until the module is usable), so importing a package never
 * throws and the same code path serves both legacy and Turbo modules.
 */
export function createNativeModuleProxy<T extends TurboModule>(
  name: string,
  { probeMethod, unboundProps = [] }: NativeModuleOptions<T>
): T {
  let cached: T | undefined;

  const getModule = (): T => {
    if (
      !cached ||
      typeof (cached as unknown as Record<string, unknown>)[probeMethod] !==
        'function'
    ) {
      cached = resolveNativeModule<T>(name, probeMethod);
    }
    return cached;
  };

  return new Proxy({} as T, {
    get(_target, prop) {
      const mod = getModule();
      const value = (mod as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof prop === 'string' && unboundProps.includes(prop)) {
        return value;
      }
      return typeof value === 'function' ? (value as Function).bind(mod) : value;
    }
  });
}
