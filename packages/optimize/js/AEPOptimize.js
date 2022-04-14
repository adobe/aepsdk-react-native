"use strict";
/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const react_native_2 = require("react-native");
const Proposition_1 = tslib_1.__importDefault(require("./models/Proposition"));
const RCTAEPOptimize = react_native_1.NativeModules.AEPOptimize;
var onPropositionUpdateSubscription;
/**
* Public APIs for Optimize extension
*/
const AEPOptimize = {
    /**
     * Returns the version of the AEPOptimize extension
     * @return {string} - Promise a promise that resolves with the extension version
     */
    extensionVersion() {
        return Promise.resolve(RCTAEPOptimize.extensionVersion());
    },
    /**
     * This API registers a permanent callback which is invoked whenever the Edge extension dispatches a response Event received from the Experience Edge Network upon a personalization query.
     * @param {Object} onPropositionUpdateCallback - the callback that will be called with the updated Propositions.
     */
    onPropositionUpdate(adobeCallback) {
        if (onPropositionUpdateSubscription) {
            onPropositionUpdateSubscription.remove();
        }
        const eventEmitter = new react_native_2.NativeEventEmitter(RCTAEPOptimize);
        onPropositionUpdateSubscription = eventEmitter.addListener("onPropositionsUpdate", (propositions) => {
            const map = new Map();
            for (const [key, value] of Object.entries(propositions)) {
                map.set(key, new Proposition_1.default(value));
            }
            adobeCallback.call(map);
        });
        RCTAEPOptimize.onPropositionsUpdate();
    },
    /**
    * Clears the client-side in-memory propositions cache.
    */
    clearCachedPropositions() {
        RCTAEPOptimize.clearCachedPropositions();
    },
    /**
    * This API retrieves the previously fetched propositions, for the provided decision scopes, from the in-memory extension's propositions cache.
    * @param {Array<DecisionScope>} decisionScopes - an array of decision scopes for which Offers needs to be requested
    * @returns {Promise<Map<string, Proposition>>} - a Promise that resolves with the Map of decision scope string and Propositions
    */
    getPropositions(decisionScopes) {
        var decisionScopeNames = decisionScopes.map(decisionScope => decisionScope.getName());
        return new Promise((resolve, reject) => {
            RCTAEPOptimize.getPropositions(decisionScopeNames).then((propositions) => {
                const map = new Map();
                for (const [key, value] of Object.entries(propositions)) {
                    map.set(key, new Proposition_1.default(value));
                }
                resolve(map);
            }).catch((error) => reject(error));
        });
    },
    /**
    * This API dispatches an Event for the Edge network extension to fetch decision propositions, for the provided decision scopes list, from the decisioning services enabled in the Experience Edge network.
    * The returned decision propositions are cached in-memory in the Optimize SDK extension and can be retrieved using getPropositions API.
    * @param {Array<DecisionScope>} decisionScopes - containing scopes for which offers need to be updated
    * @param {Map<string, any>} xdm - containing additional XDM-formatted data to be sent in the personalization query request.
    * @param {Map<string, any>} data - containing additional free-form data to be sent in the personalization query request
    */
    updatePropositions(decisionScopes, xdm, data) {
        var decisionScopeNames = decisionScopes.map(decisionScope => decisionScope.getName());
        RCTAEPOptimize.updatePropositions(decisionScopeNames, xdm, data);
    }
};
exports.default = AEPOptimize;
//# sourceMappingURL=AEPOptimize.js.map