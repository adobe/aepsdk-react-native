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

import { NativeModules } from 'react-native';

interface IConsent {
  extensionVersion: () => Promise<string>;
  update: (consents: Record<string, any>) => void;
  getConsents: () => Promise<Record<string, any>>;
}

const RCTAEPEdgeConsent: IConsent = NativeModules.AEPEdgeConsent;

const Consent: IConsent = {
  /**
   * Returns the version of the Consent extension
   * @return {string} Promise resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPEdgeConsent.extensionVersion());
  },

  /**
   * Merges the existing consents with the given consents. Duplicate keys will take the value of those passed in the API
   * Input example: {"consents": {"collect": {"val": "y"}}}
   * @param {Record<string, any>} consents to be merged with the existing consents
   */
  update(consents: Record<string, any>) {
    RCTAEPEdgeConsent.update(consents);
  },

  /**
   * Retrieves the current consent preferences stored in the Consent extension
   * Output example: {"consents": {"collect": {"val": "y"}}}
   * @return {{Promise<Record<string, any>>}} Promise resolved with the current consent preferences or rejected
   * if an unexpected error occurs or the request timed out
   */
  getConsents(): Promise<Record<string, any>> {
    return RCTAEPEdgeConsent.getConsents();
  }
};

export default Consent;
