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

const RCTAEPEdgeIdentity = require('react-native').NativeModules.AEPEdgeIdentity;

module.exports = {
  /**
   * Returns the version of the AEPEdgeIdentity extension
   * @param  {string} Promise a promise that resolves with the extension verison
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPEdgeIdentity.extensionVersion());
  },

   /**
   * @brief Returns the Experience Cloud ID.
   *
   * Returns the Experience Cloud ID. An empty string is returned if the Experience Cloud ID was previously cleared.
   *
   * @return promise method which will be invoked once the Experience Cloud ID is available or rejected if an unexpected error occurred or the request timed out.
   */
  getExperienceCloudId(): Promise<?string> {
    return RCTAEPEdgeIdentity.getExperienceCloudId();
  },
};
