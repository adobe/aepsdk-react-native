/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { EventSubscription, NativeEventEmitter, Platform } from 'react-native';
import Proposition from './models/Proposition';
import DecisionScope from './models/DecisionScope';
import Offer from './models/Offer';
import { AdobePropositionCallback } from './models/AdobePropositionCallback';
import AEPOptimizeError from './models/AEPOptimizeError';
import NativeAEPOptimize from './NativeAEPOptimize';

interface IOptimize {
  extensionVersion: () => Promise<string>;
  onPropositionUpdate: (adobeCallback: AdobePropositionCallback) => void;
  clearCachedPropositions: () => void;
  getPropositions: (decisionScopes: Array<DecisionScope>) => Promise<Map<string, Proposition>>;
  updatePropositions: (
    decisionScopes: Array<DecisionScope>,
    xdm?: Map<string, any>,
    data?: Map<string, any>,
    onSuccess?: (response: Map<string, Proposition>) => void,
    onError?: (error: AEPOptimizeError) => void
  ) => void;
  displayed: (offers: Array<Offer>) => void;
  generateDisplayInteractionXdm: (offers: Array<Offer>) => Promise<Map<string, any>>;
}

var onPropositionUpdateSubscription: EventSubscription | null = null;


/**
* Public APIs for Optimize extension
*/
const Optimize: IOptimize = {
  /**
   * Returns the version of the AEPOptimize extension
   * @return {string} - Promise a promise that resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(NativeAEPOptimize.extensionVersion());
  },

  /**
   * This API registers a permanent callback which is invoked whenever the Edge extension dispatches a response Event received from the Experience Edge Network upon a personalization query.
   * @param {Object} onPropositionUpdateCallback - the callback that will be called with the updated Propositions.
   */
  onPropositionUpdate(adobeCallback: AdobePropositionCallback) {
    // Remove previous subscription
    if (onPropositionUpdateSubscription) {
      onPropositionUpdateSubscription.remove();
      onPropositionUpdateSubscription = null;
    }

    const native = NativeAEPOptimize;
    if (Platform.OS === 'android') {
      // Android emits the propositions map directly (no 'propositions' wrapper key).
      // RCTAEPOptimizeUtil.createCallbackResponse returns { scopeName: proposition, ... }.
      // Delivered via RCTDeviceEventEmitter — not a callable @ReactMethod on Android.
      const emitter = new NativeEventEmitter(native as any);
      onPropositionUpdateSubscription = emitter.addListener('onPropositionsUpdate', (payload: any) => {
        const map = new Map<string, Proposition>();
        for (const [key, value] of Object.entries(payload)) {
          map.set(key, new Proposition(value as any));
        }
        adobeCallback.call(map);
      });
    } else {
      // iOS: codegen JSI event emitter wraps payload as { propositions: { scopeName: ... } }.
      onPropositionUpdateSubscription = native.onPropositionsUpdated((payload: { propositions: any }) => {
        const map = new Map<string, Proposition>();
        for (const [key, value] of Object.entries(payload.propositions)) {
          map.set(key, new Proposition(value as any));
        }
        adobeCallback.call(map);
      });
    }

    // Register the listener on the native AEP SDK side
    native.registerOnPropositionsUpdate();
  },

  /**
  * Clears the client-side in-memory propositions cache.
  */
  clearCachedPropositions() {
    NativeAEPOptimize.clearCachedPropositions();
  },

 /**
 * This API retrieves the previously fetched propositions, for the provided decision scopes, from the in-memory extension's propositions cache.
 * @param {Array<DecisionScope>} decisionScopes - an array of decision scopes for which Offers needs to be requested
 * @returns {Promise<Map<string, Proposition>>} - a Promise that resolves with the Map of decision scope string and Propositions
 */
  getPropositions(decisionScopes: Array<DecisionScope>): Promise<Map<string, Proposition>> {    
    var decisionScopeNames: Array<string> = decisionScopes.map(decisionScope => decisionScope.getName());
    return new Promise((resolve, reject) => {      
      NativeAEPOptimize.getPropositions(decisionScopeNames).then((propositions: any) => {
        const map = new Map<string, Proposition>();
        for (const [key, value] of Object.entries(propositions)) {
          map.set(key, new Proposition(value as any));
        }
        resolve(map);
      }).catch((error: any) => reject(error));
    });
  },

/**
* This API dispatches an Event for the Edge network extension to fetch decision propositions, for the provided decision scopes list, from the decisioning services enabled in the Experience Edge network.
* The returned decision propositions are cached in-memory in the Optimize SDK extension and can be retrieved using getPropositions API.
* @param {Array<DecisionScope>} decisionScopes - containing scopes for which offers need to be updated
* @param {Map<string, any>} xdm - containing additional XDM-formatted data to be sent in the personalization query request. 
* @param {Map<string, any>} data - containing additional free-form data to be sent in the personalization query request
* @param {UpdatePropositionsCallback} callback - optional callback that will be called with the response containing updated propositions and/or error information
*/
  updatePropositions(
    decisionScopes: Array<DecisionScope>,
    xdm?: Map<string, any>,
    data?: Map<string, any>,
    onSuccess?: (response: Map<string, Proposition>) => void,
    onError?: (error: AEPOptimizeError) => void
  ) {
    var decisionScopeNames: Array<string> = decisionScopes.map(decisionScope => decisionScope.getName());
    NativeAEPOptimize.updatePropositions(
      decisionScopeNames,
      xdm,
      data,
      typeof onSuccess === 'function' ? (propositions: any) => {
        const map = new Map<string, Proposition>();
        for (const [key, value] of Object.entries(propositions)) {
          map.set(key, new Proposition(value as any));  
        }      
        onSuccess(map);
      } : () => {},
      typeof onError === 'function' ? onError : () => {}
    );
  },  

/**
   * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the display interaction data for the
   * given list of Proposition offers.
   * @param {Array<Offer>} offers - an array of Proposition Offers
   */
  displayed(offers: Array<Offer>) {
    NativeAEPOptimize.multipleOffersDisplayed(offers);
  },

/**
 * Generates a map containing XDM formatted data for `Experience Event - OptimizeProposition Interactions` 
 * field group from the provided list of Proposition Offers.
 * @param {Array<Offer>} offers - an array of Proposition Offers
 * @return {Promise<Map<string, any>>} - a promise that resolves to xdm map
 */
  generateDisplayInteractionXdm(offers: Array<Offer>) {
    return NativeAEPOptimize.multipleOffersGenerateDisplayInteractionXdm(offers) as Promise<Map<string, any>>;
  },
};

export default Optimize;
