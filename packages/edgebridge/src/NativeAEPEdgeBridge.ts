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

export interface Spec extends TurboModule {
  extensionVersion(): Promise<string>;
}

function hasExtensionVersion(mod: Spec | null | undefined): mod is Spec {
  return mod != null && typeof mod.extensionVersion === 'function';
}

function isClassicBridge(): boolean {
  return (global as { RN$Bridgeless?: boolean }).RN$Bridgeless !== true;
}

/**
 * Resolve NativeAEPEdgeBridge across bridgeless vs classic-bridge runtimes
 * (same pattern as NativeAEPOptimize): classic bridge first, then
 * TurboModuleRegistry.get(), then NativeModules, finally getEnforcing().
 */
export function resolveNativeAEPEdgeBridge(): Spec {
  const bridge = NativeModules.NativeAEPEdgeBridge as Spec | undefined;
  if (isClassicBridge() && hasExtensionVersion(bridge)) {
    return bridge;
  }
  const turbo = TurboModuleRegistry.get<Spec>('NativeAEPEdgeBridge');
  if (hasExtensionVersion(turbo)) {
    return turbo;
  }
  if (hasExtensionVersion(bridge)) {
    return bridge;
  }
  return TurboModuleRegistry.getEnforcing<Spec>('NativeAEPEdgeBridge');
}

let cachedNative: Spec | undefined;

function getNativeAEPEdgeBridge(): Spec {
  if (!cachedNative) {
    cachedNative = resolveNativeAEPEdgeBridge();
  }
  return cachedNative;
}

const NativeAEPEdgeBridge: Spec = new Proxy({} as Spec, {
  get(_target, prop) {
    const mod = getNativeAEPEdgeBridge();
    const value = (mod as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? (value as Function).bind(mod) : value;
  },
});

export default NativeAEPEdgeBridge;
