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

jest.mock('../src/NativeAEPUserProfile', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    removeUserAttributes: jest.fn(),
    getUserAttributes: jest.fn().mockResolvedValue({}),
    updateUserAttributes: jest.fn()
  }
}));

import { UserProfile } from '../src';
import NativeAEPUserProfile from '../src/NativeAEPUserProfile';

describe('UserProfile', () => {
  it('extensionVersion is called', async () => {
    expect(UserProfile.extensionVersion).toBeDefined();
    await UserProfile.extensionVersion();
    expect(NativeAEPUserProfile.extensionVersion).toHaveBeenCalled();
  });

  it('removeUserAttributes is called with correct parameter', async () => {
    let attributeNames = ['attrNameTest'];
    await UserProfile.removeUserAttributes(attributeNames);
    expect(NativeAEPUserProfile.removeUserAttributes).toHaveBeenCalledWith(
      attributeNames
    );
  });

  it('getUserAttributes is called with correct parameters', async () => {
    let attributeNames = ['attrNameTest'];
    await UserProfile.getUserAttributes(attributeNames);
    expect(NativeAEPUserProfile.getUserAttributes).toHaveBeenCalledWith(
      attributeNames
    );
  });

  it('updateUserAttributes is called with correct parameter', async () => {
    let attrMap = { mapKey: 'mapValue', mapKey1: 'mapValue1' };
    await UserProfile.updateUserAttributes(attrMap);
    expect(NativeAEPUserProfile.updateUserAttributes).toHaveBeenCalledWith(
      attrMap
    );
  });
});
