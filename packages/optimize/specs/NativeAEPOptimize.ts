/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { TurboModule, CodegenTypes } from 'react-native';
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
  registerOnPropositionsUpdate(): void;
  multipleOffersDisplayed(offersArray: Array<Object>): void;
  multipleOffersGenerateDisplayInteractionXdm(offersArray: Array<Object>): Promise<Object>;
  offerDisplayed(offerId: string, propositionMap: Object): void;
  offerTapped(offerId: string, propositionMap: Object): void;
  generateDisplayInteractionXdm(offerId: string, propositionMap: Object): Promise<Object>;
  generateTapInteractionXdm(offerId: string, propositionMap: Object): Promise<Object>;
  generateReferenceXdm(propositionMap: Object): Promise<Object>;
  // Legacy event support (required for interop path's NativeEventEmitter)
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  // TurboModule event support (codegen generates emitOnPropositionsUpdated:)
  // Different name from the legacy sendEventWithName:@"onPropositionsUpdate"
  // to avoid conflict between bridge and JSI event channels.
  readonly onPropositionsUpdated: CodegenTypes.EventEmitter<PropositionsPayload>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPOptimize');
