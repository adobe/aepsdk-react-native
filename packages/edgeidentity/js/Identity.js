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
import IdentityMap from './models/IdentityMap';
import IdentityItem from './models/IdentityItem';

module.exports = {
  /**
   * Returns the version of the Identity extension
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

  /**
   * @brief Returns all identifiers, including customer identifiers which were previously added.
   *
   * If there are no identifiers stored in the `Identity` extension, then an empty `IdentityMap` is returned.
   *
   * @return promise method which will be invoked once the identifiers are available or rejected if an unexpected error occurred or the request timed out.
   */

   getIdentities(): Promise<IdentityMap> {
    const getIdentitiesPromise = new Promise((resolve, reject) => {
     
      RCTAEPEdgeIdentity.getIdentities()
      .then(identities => {
        let identityMap = toIdentityMap(identities) 
        resolve(identityMap);
      })
      .catch((error) => {
        reject(error);
      });      
  });
     return getIdentitiesPromise;
  },

  /**
   * @brief Updates the currently known `IdentityMap` within the SDK.
   *
   * The Identity extension will merge the received identifiers with the previously saved one in an additive manner, no identifiers will be removed using this API.
   * Identifiers which have an empty  `id` or empty `namespace` are not allowed and are ignored.
   *
   * 
   */
   updateIdentities(identityMap: IdentityMap) {
    RCTAEPEdgeIdentity.updateIdentities(identityMap);
  },

  /**
   * @brief Removes the provided identity item from the stored client-side `IdentityMap`. The Identity extension will stop sending this identifier.
   *  
   * This does not clear the identifier from the User Profile Graph.
   * - Parameters:
   *  - item: The identity item to remove.
   *  - withNamespace: The namespace of the Identity to remove.
   */
   removeIdentity(item: IdentityItem, namespace: string) {
    RCTAEPEdgeIdentity.removeIdentity(item, namespace);
  },
};

  function toIdentityMap(idObj: Object) {
  var idMap = new IdentityMap();

  for (const [key, value] of Object.entries(idObj)) {
    value.forEach(function(item) {
      var identityItem = new IdentityItem(item.id, item.authenticatedState, item.primary);
      idMap.addItem(identityItem, key);
    });
  }

  return idMap;
}