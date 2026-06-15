/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { TurboModule, EventSubscription } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

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
  // TurboModule event delivery — codegen generates emitOnPropositionsUpdated: (iOS / Android).
  // Declared as an explicit function type because @types/react-native (0.66 era)
  // predates the CodegenTypes namespace; functionally equivalent to CodegenTypes.EventEmitter<T>.
  readonly onPropositionsUpdated: (handler: (event: PropositionsPayload) => void) => EventSubscription;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPOptimize');
