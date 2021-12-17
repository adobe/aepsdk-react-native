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

const RCTAEPAssurance = require('react-native').NativeModules.AEPAssurance;

module.exports = {
  /**
   * Returns the version of the Assurance extension.
   * @param  {string} Promise a promise that resolves with the extension verison
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
   * @param url a valid Assurance URL string to start a session
   */
  startSession(url: string) {
    RCTAEPAssurance.startSession(url);
  },

};
