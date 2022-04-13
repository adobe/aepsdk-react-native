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
import { Consent } from '../ts';

describe('Consent', () => {
  it('extensionVersion is called', async () => {
    expect(Consent.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPEdgeConsent, 'extensionVersion');
    await Consent.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('updateConsents is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeConsent, 'update');
    let consents = { consents: { collect: { val: 'y' } } };
    await Consent.update(consents);
    expect(spy).toHaveBeenCalledWith(consents);
  });

  it('getConsents is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeConsent, 'getConsents');
    await Consent.getConsents();
    expect(spy).toHaveBeenCalled();
  });
});
