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

jest.mock('../src/NativeAEPIdentity', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    syncIdentifiers: jest.fn(),
    syncIdentifiersWithAuthState: jest.fn(),
    syncIdentifier: jest.fn(),
    appendVisitorInfoForURL: jest.fn().mockResolvedValue(''),
    getUrlVariables: jest.fn().mockResolvedValue(''),
    getIdentifiers: jest.fn().mockResolvedValue([]),
    getExperienceCloudId: jest.fn().mockResolvedValue('')
  }
}));
jest.mock('../src/NativeAEPCore', () => ({
  __esModule: true,
  default: { extensionVersion: jest.fn().mockResolvedValue('1.0.0') }
}));
jest.mock('../src/NativeAEPLifecycle', () => ({
  __esModule: true,
  default: { extensionVersion: jest.fn().mockResolvedValue('1.0.0') }
}));
jest.mock('../src/NativeAEPSignal', () => ({
  __esModule: true,
  default: { extensionVersion: jest.fn().mockResolvedValue('1.0.0') }
}));

import { MobileVisitorAuthenticationState, Identity } from '../src';
import NativeAEPIdentity from '../src/NativeAEPIdentity';

describe('Identity', () => {
  it('extensionVersion is called', async () => {
    expect(Identity.extensionVersion).toBeDefined();
    await Identity.extensionVersion();
    expect(NativeAEPIdentity.extensionVersion).toHaveBeenCalled();
  });

  it('syncIdentifiers is called with correct parameters', async () => {
    let identifiers = { testKey: 'testValue' };
    Identity.syncIdentifiers(identifiers);
    expect(NativeAEPIdentity.syncIdentifiers).toHaveBeenCalledWith(
      identifiers
    );
  });

  test('syncIdentifiersWithAuthState is called with correct parameters', async () => {
    let identifiers = { testKey: 'testValue' };
    let authState = MobileVisitorAuthenticationState.LOGGED_OUT;
    Identity.syncIdentifiersWithAuthState(identifiers, authState);
    expect(
      NativeAEPIdentity.syncIdentifiersWithAuthState
    ).toHaveBeenCalledWith(
      identifiers,
      MobileVisitorAuthenticationState.LOGGED_OUT
    );
  });

  test('syncIdentifier is called with correct parameters', async () => {
    let identifier = 'testId';
    let identifierType = 'testIdType';
    let authState =
      MobileVisitorAuthenticationState.AUTHENTICATED;
    Identity.syncIdentifier(identifier, identifierType, authState);
    expect(NativeAEPIdentity.syncIdentifier).toHaveBeenCalledWith(
      identifier,
      identifierType,
      MobileVisitorAuthenticationState.AUTHENTICATED
    );
  });

  test('appendVisitorInfoForURL is called with correct parameters', async () => {
    let url = 'testurl.com';
    await Identity.appendVisitorInfoForURL(url);
    expect(NativeAEPIdentity.appendVisitorInfoForURL).toHaveBeenCalledWith(
      url
    );
  });

  test('getUrlVariables is called', async () => {
    await Identity.getUrlVariables();
    expect(NativeAEPIdentity.getUrlVariables).toHaveBeenCalled();
  });

  test('getIdentifiers is called', async () => {
    await Identity.getIdentifiers();
    expect(NativeAEPIdentity.getIdentifiers).toHaveBeenCalled();
  });

  test('getExperienceCloudId is called', async () => {
    await Identity.getExperienceCloudId();
    expect(NativeAEPIdentity.getExperienceCloudId).toHaveBeenCalled();
  });
});
