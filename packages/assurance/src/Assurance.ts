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

import NativeAEPAssurance from './NativeAEPAssurance';

interface IAssurance {
  extensionVersion: () => Promise<string>;
  startSession: (url?: string) => void;
}

const RCTAEPAssurance = NativeAEPAssurance;

const Assurance: IAssurance = {
  /**
   * Returns the version of the Assurance extension.
   * @return  {string} Promise a promise that resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPAssurance.extensionVersion());
  },

  /**
   * Starts an Assurance session.
   * Calling this method when a session has already been started results in a no-op, otherwise it attempts
   * to initiate a new Assurance session.
   * A call to this API with an non assurance session url will be ignored
   *
   * When called without a url, the Quick Connect flow is started instead. Quick Connect is only
   * available in debuggable (debug) builds; in release builds the call is a no-op.
   *
   * @param url a valid Assurance URL string to start a session; omit to start Quick Connect
   */
  startSession(url?: string) {
    RCTAEPAssurance.startSession(url ?? null);
  }
};

export default Assurance;
