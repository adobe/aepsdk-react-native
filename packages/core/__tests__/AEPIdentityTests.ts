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
import {AEPIdentity, AEPMobileVisitorAuthenticationState} from '../';

describe('AEPIdentity', () => {

  it('extensionVersion is called', async () => {
    expect(AEPIdentity.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'extensionVersion');
    await AEPIdentity.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('syncIdentifiers is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'syncIdentifiers');
    let identifiers = {"testKey": "testValue"};
    await AEPIdentity.syncIdentifiers(identifiers);
    expect(spy).toHaveBeenCalledWith(identifiers);
  });

  test('syncIdentifiersWithAuthState is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'syncIdentifiersWithAuthState');
    let identifiers = {"testKey": "testValue"};
    let authState = AEPMobileVisitorAuthenticationState.LOGGED_OUT;
    await AEPIdentity.syncIdentifiersWithAuthState(identifiers, authState);
    expect(spy).toHaveBeenCalledWith(identifiers, authState);
  });

  test('syncIdentifier is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'syncIdentifier');
    let identifier = "testId"
    let identifierType = "testIdType"
    let authState = AEPMobileVisitorAuthenticationState.AUTHENTICATED;
    await AEPIdentity.syncIdentifier(identifier, identifierType, authState);
    expect(spy).toHaveBeenCalledWith(identifier, identifierType, authState);
  });

  test('appendVisitorInfoForURL is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'appendVisitorInfoForURL');
    let url = "testurl.com";
    await AEPIdentity.appendVisitorInfoForURL(url);
    expect(spy).toHaveBeenCalledWith(url);
  });

  test('getUrlVariables is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'getUrlVariables');
    await AEPIdentity.getUrlVariables();
    expect(spy).toHaveBeenCalled();
  });

  test('getIdentifiers is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'getIdentifiers');
    await AEPIdentity.getIdentifiers();
    expect(spy).toHaveBeenCalled();
  });

  test('getExperienceCloudId is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPIdentity, 'getExperienceCloudId');
    await AEPIdentity.getExperienceCloudId();
    expect(spy).toHaveBeenCalled();
  });

});
