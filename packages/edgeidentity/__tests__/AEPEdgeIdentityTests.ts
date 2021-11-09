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
import { AEPIdentity, AEPAuthenticatedState, AEPIdentityItem, AEPIdentityMap } from '../';


describe('AEPEdgeIdentity', () => {

  it('extensionVersion is called', async () => {
    expect(AEPIdentity.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'extensionVersion');
    await AEPIdentity.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('getExperienceCloudId is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'getExperienceCloudId');
    await AEPIdentity.getExperienceCloudId();
    expect(spy).toHaveBeenCalled();
  });

  it('getIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'getIdentities');
    await AEPIdentity.getIdentities();
    expect(spy).toHaveBeenCalled();
  });

  it('updateIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'updateIdentities');
    var identifier1 = "id1";
    var namespace1 = "1stNameSpace"
    var authenticatedState1 = AEPAuthenticatedState.AMBIGUOUS;
    var isPrimary1 = true;

    var identifier2 = "id2";
    var namespace2 = "2ndNameSpace"
    var authenticatedState2 = AEPAuthenticatedState.AUTHENTICATED;
    var isPrimary2 = false;

    var identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
    var identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
  
    var idmap = new AEPIdentityMap();

    var expectedidmap = {"items": { "1stNameSpace" : [{"id": identifier1, "authenticatedState": authenticatedState1, "primary": isPrimary1}], "2ndNameSpace" : [{"id": identifier2, "authenticatedState": authenticatedState2, "primary": isPrimary2}]}};
   

    //add item 1
    idmap.addItem(identityItems1, namespace1);

    //add item 2
    idmap.addItem(identityItems2, namespace2);
    await AEPIdentity.updateIdentities(idmap);
    expect(spy).toHaveBeenCalledWith(expectedidmap);
  });

  it('removeIdentity is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'removeIdentity');

    var identifier1 = "id1";
    var namespace1 = "1stNameSpace"
    var authenticatedState1 = AEPAuthenticatedState.AMBIGUOUS;
    var isPrimary1 = true;

    var identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);

    await AEPIdentity.removeIdentity(identityItems1, namespace1);
    expect(spy).toHaveBeenCalled();
  });
});
