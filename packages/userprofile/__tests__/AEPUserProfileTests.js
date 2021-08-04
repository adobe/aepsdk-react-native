/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@format
*/

import { NativeModules } from 'react-native';
import AEPUserProfile from '../js/AEPUserProfile';

describe('AEPUserProfile', () => {

  test('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPUserProfile, 'extensionVersion');
    await AEPUserProfile.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  test('removeUserAttributes is called with correct parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPUserProfile, 'removeUserAttributes');
    let attributeNames = ["attrNameTest"];
    await AEPUserProfile.removeUserAttributes(attributeNames);
    expect(spy).toHaveBeenCalledWith(attributeNames);
  });

  test('getUserAttributes is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPUserProfile, 'getUserAttributes');
    let attributeNames = ["attrNameTest"];
    await AEPUserProfile.getUserAttributes(attributeNames);
    expect(spy).toHaveBeenCalledWith(attributeNames);
  });

  test('updateUserAttributes is called with correct parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPUserProfile, 'updateUserAttributes');
    let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
    await AEPUserProfile.updateUserAttributes(attrMap);
    expect(spy).toHaveBeenCalledWith(attrMap);
  });

});
