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

interface IUserProfile {
  extensionVersion: () => Promise<string>;
  removeUserAttributes: (attributeNames: Array<string>) => void;
  getUserAttributes: (
    attributeNames: Array<string>
  ) => Promise<Record<string, any>>;
  updateUserAttributes: (attributeMap: Record<string, any>) => void;
}

const RCTAEPUserProfile: IUserProfile = NativeModules.AEPUserProfile;

const UserProfile: IUserProfile = {
  /**
   * Returns the version of the UserProfile extension
   * @param  {string} Promise a promise that resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPUserProfile.extensionVersion());
  },

  /**
   * UserProfile API to remove the give attribute names
   *
   * If the attribute does not exist, this API has no effects
   * If the attribute exists, then the User Attribute will be removed
   *
   * @param attributeNames Attribute keys which have to be removed.
   */
  removeUserAttributes(attributeNames: Array<string>) {
    RCTAEPUserProfile.removeUserAttributes(attributeNames);
  },

  /**
   * UserProfile API to retrieve the user attributes
   *
   * @param attributeNames Attribute keys/names which will be used to retrieve user attributes
   */
  getUserAttributes(
    attributeNames: Array<string>
  ): Promise<Record<string, any>> {
    return RCTAEPUserProfile.getUserAttributes(attributeNames);
  },

  /**
   * UserProfile API to set user profile attributes keys and values.
   *
   * If the attribute does not exist, it will be created. If the attribute
   * already exists, then the value will be updated. A empty attribute value will remove the attribute.
   *
   * @param attributeMap of profile attributes key-value pairs to be set.
   */
  updateUserAttributes(attributeMap: Record<string, any>) {
    RCTAEPUserProfile.updateUserAttributes(attributeMap);
  }
};

export default UserProfile;
