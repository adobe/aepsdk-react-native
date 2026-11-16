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
  getNearbyPointsOfInterest(location: Object, limit: number): Promise<Array<Object>>;
  processGeofence(geofence: Object, transitionType: number): void;
  getCurrentPointsOfInterest(): Promise<Array<Object>>;
  getLastKnownLocation(): Promise<Object>;
  clear(): void;
  setAuthorizationStatus(authStatus?: string): void;
}

function hasPlaces(mod: Spec | null | undefined): mod is Spec {
  return mod != null && typeof mod.extensionVersion === 'function';
}

function isClassicBridge(): boolean {
  return (global as { RN$Bridgeless?: boolean }).RN$Bridgeless !== true;
}

/**
 * Resolve NativeAEPPlaces across bridgeless vs classic-bridge runtimes
 * (same pattern as NativeAEPOptimize): classic bridge first, then
 * TurboModuleRegistry.get(), then NativeModules, finally getEnforcing().
 */
function resolveNativeAEPPlaces(): Spec {
  const bridge = NativeModules.NativeAEPPlaces as Spec | undefined;
  if (isClassicBridge() && hasPlaces(bridge)) {
    return bridge;
  }
  const turbo = TurboModuleRegistry.get<Spec>('NativeAEPPlaces');
  if (hasPlaces(turbo)) {
    return turbo;
  }
  if (hasPlaces(bridge)) {
    return bridge;
  }
  return TurboModuleRegistry.getEnforcing<Spec>('NativeAEPPlaces');
}

let cachedNative: Spec | undefined;

function getNativeAEPPlaces(): Spec {
  if (!cachedNative) {
    cachedNative = resolveNativeAEPPlaces();
  }
  return cachedNative;
}

const NativeAEPPlaces: Spec = new Proxy({} as Spec, {
  get(_target, prop) {
    const mod = getNativeAEPPlaces();
    const value = (mod as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? (value as Function).bind(mod) : value;
  },
});

export default NativeAEPPlaces;
