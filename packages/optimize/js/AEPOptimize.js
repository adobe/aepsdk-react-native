/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

'use strict';

import { DeviceEventEmitter, NativeModules } from 'react-native';
const RCTAEPOptimize = NativeModules.AEPOptimize;

var onPropositionUpdateSubscription;

module.exports = {
  /**
   * Returns the version of the AEPMessaging extension
   * @param  {string} Promise a promise that resolves with the extension verison
   */
  extensionVersion() { 
    return Promise.resolve(RCTAEPOptimize.extensionVersion());a
  },
  onPropositionUpdate(onPropositionUpdateCallback) {
    if(onPropositionUpdateSubscription) {
      onPropositionUpdateSubscription.remove();
    }
    onPropositionUpdateSubscription = DeviceEventEmitter.addListener("onPropositionsUpdate", propositions => {
      onPropositionUpdateCallback(propositions);
    });
    RCTAEPOptimize.onPropositionsUpdate();        
  }, 
  clearCachedPropositions() {
    RCTAEPOptimize.clearCachedPropositions();
  },
  getPropositions(decisionScopesArray) {
    return Promise.resolve(RCTAEPOptimize.getPropositions(decisionScopesArray));
  },
  updatePropositions(decisionScopesArray, xdm, data) {
    RCTAEPOptimize.updatePropositions(decisionScopesArray, xdm, data);
  },
  removeOnPropositionUpdateListener() {
    onPropositionUpdateSubscription.remove();
  }
};