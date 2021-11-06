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

const RCTAEPEdgeConsent = require('react-native').NativeModules.AEPEdgeConsent;

module.exports = {
  /**
   * Returns the version of the AEPConsent extension
   * @param {string} Promise resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPEdgeConsent.extensionVersion());
  },

  /**
   * Merges the existing consents with the given consents. Duplicate keys will take the value of those passed in the API
   * Input example: {"consents": {"collect": {"val": "y"}}}
   * @param consents to be merged with the existing consents
   */
  update(consents: {string: any}) {
  	RCTAEPEdgeConsent.update(consents);
  },

  /**
   * Retrieves the current consent preferences stored in the Consent extension
   * Output example: {"consents": {"collect": {"val": "y"}}}
   * @param {{ string: any }} Promise resolved with the current consent preferences or rejected
   * if an unexpected error occurs or the request timed out
   */
  getConsents(): Promise<{string: any}> {
  	return Promise.resolve(RCTAEPEdgeConsent.getConsents());
  },
};
