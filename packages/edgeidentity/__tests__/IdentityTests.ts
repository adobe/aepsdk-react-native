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
import { Identity, AuthenticatedState, IdentityItem, IdentityMap } from '../';

afterEach(() => {    
  jest.clearAllMocks();
});

describe('Identity for Edge Network', () => {

  it('extensionVersion is called', async () => {
    expect(Identity.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'extensionVersion');
    await Identity.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('getExperienceCloudId is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'getExperienceCloudId');
    await Identity.getExperienceCloudId();
    expect(spy).toHaveBeenCalled();
  });

  it('getIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'getIdentities');
    await Identity.getIdentities();
    expect(spy).toHaveBeenCalled();
  });

  it('updateIdentities is validated', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'updateIdentities');
    let identifier1 = "id1";
    let namespace1 = "namespace1"
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identifier2 = "id2";
    let namespace2 = "namespace2"
    let authenticatedState2 = AuthenticatedState.AUTHENTICATED;
    let isPrimary2 = false;

    let identityItems1  = new IdentityItem(identifier1, authenticatedState1, isPrimary1);
    let identityItems2  = new IdentityItem(identifier2, authenticatedState2, isPrimary2);
  
    let idMap = new IdentityMap();

    let expectedIdMap = {"items": { "namespace1" : [{"id": identifier1, "authenticatedState": authenticatedState1, "primary": isPrimary1}], "namespace2" : [{"id": identifier2, "authenticatedState": authenticatedState2, "primary": isPrimary2}]}};
   

    //add item 1
    idMap.addItem(identityItems1, namespace1);

    //add item 2
    idMap.addItem(identityItems2, namespace2);
    await Identity.updateIdentities(idMap);
    expect(spy).toHaveBeenCalledWith(expectedIdMap);
  });

 it('removeIdentity is called with correct data', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'removeIdentity');
    let namespace1 = "namespace1"

    let identityItem1  = new IdentityItem("id1", AuthenticatedState.LOGGED_OUT, true);
    let identityItem2  = new IdentityItem("id2");

    await Identity.removeIdentity(identityItem1, namespace1);
    await Identity.removeIdentity(identityItem2, namespace1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, {"id": "id1", "authenticatedState": "loggedOut", "primary": true}, namespace1);
    expect(spy).toHaveBeenNthCalledWith(2, {"id": "id2", "authenticatedState": "ambiguous", "primary": false}, namespace1);
  });
});
