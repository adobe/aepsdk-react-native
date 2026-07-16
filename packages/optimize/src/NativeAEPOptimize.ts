/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { TurboModule, EventSubscription } from 'react-native';
import { NativeModules, TurboModuleRegistry } from 'react-native';

export type PropositionsPayload = {
  propositions: Object;
};

export interface Spec extends TurboModule {
  extensionVersion(): Promise<string>;
  clearCachedPropositions(): void;
  getPropositions(decisionScopeNames: Array<string>): Promise<Object>;
  updatePropositions(
    decisionScopeNames: Array<string>,
    xdm?: Object,
    data?: Object,
    onSuccess?: (propositions: Object) => void,
    onError?: (error: Object) => void
  ): void;
  onPropositionsUpdate(): void;
  multipleOffersDisplayed(offersArray: Array<Object>): void;
  multipleOffersGenerateDisplayInteractionXdm(offersArray: Array<Object>): Promise<Object>;
  offerDisplayed(offerId: string, propositionMap: Object): void;
  offerTapped(offerId: string, propositionMap: Object): void;
  generateDisplayInteractionXdm(offerId: string, propositionMap: Object): Promise<Object>;
  generateTapInteractionXdm(offerId: string, propositionMap: Object): Promise<Object>;
  generateReferenceXdm(propositionMap: Object): Promise<Object>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  readonly onPropositionsUpdated: (handler: (event: PropositionsPayload) => void) => EventSubscription;
}

function hasUpdatePropositions(mod: Spec | null | undefined): mod is Spec {
  return mod != null && typeof mod.updatePropositions === 'function';
}

function isClassicBridge(): boolean {
  return (global as { RN$Bridgeless?: boolean }).RN$Bridgeless !== true;
}

/**
 * Resolve NativeAEPOptimize across bridgeless vs classic-bridge runtimes.
 *
 * Uses undocumented RN internals (`global.RN$Bridgeless`, TurboModuleRegistry vs
 * NativeModules registration). Re-validate on every RN minor bump.
 *
 * Validated (June 2026 smoke matrix):
 * - BareSampleApp RN 0.76 — old arch (NativeModules) and new arch (TurboModuleRegistry)
 * - AEPSampleApp RN 0.85 — new arch / bridgeless (TurboModuleRegistry first, NativeModules fallback)
 */
function resolveNativeAEPOptimize(): Spec {
  const bridge = NativeModules.NativeAEPOptimize as Spec | undefined;
  if (isClassicBridge() && hasUpdatePropositions(bridge)) {
    return bridge;
  }
  const turbo = TurboModuleRegistry.get<Spec>('NativeAEPOptimize');
  if (hasUpdatePropositions(turbo)) {
    return turbo;
  }
  if (hasUpdatePropositions(bridge)) {
    return bridge;
  }
  return TurboModuleRegistry.getEnforcing<Spec>('NativeAEPOptimize');
}

let cachedNative: Spec | undefined;

function getNativeAEPOptimize(): Spec {
  if (!cachedNative || !hasUpdatePropositions(cachedNative)) {
    cachedNative = resolveNativeAEPOptimize();
  }
  return cachedNative;
}

const NativeAEPOptimize: Spec = new Proxy({} as Spec, {
  get(_target, prop) {
    const mod = getNativeAEPOptimize();
    const value = (mod as unknown as Record<string | symbol, unknown>)[prop];
    // Codegen EventEmitter must not be .bind()-wrapped — breaks JSI subscription on RN 0.85.
    if (prop === 'onPropositionsUpdated') {
      return value;
    }
    return typeof value === 'function' ? (value as Function).bind(mod) : value;
  },
});

export default NativeAEPOptimize;
