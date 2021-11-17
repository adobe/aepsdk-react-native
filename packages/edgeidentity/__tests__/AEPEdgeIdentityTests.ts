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

  it('updateIdentities is validated', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'updateIdentities');
    let identifier1 = "id1";
    let namespace1 = "1stNameSpace"
    let authenticatedState1 = AEPAuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identifier2 = "id2";
    let namespace2 = "2ndNameSpace"
    let authenticatedState2 = AEPAuthenticatedState.AUTHENTICATED;
    let isPrimary2 = false;

    let identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
    let identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
  
    let idmap = new AEPIdentityMap();

    let expectedidmap = {"items": { "1stNameSpace" : [{"id": identifier1, "authenticatedState": authenticatedState1, "primary": isPrimary1}], "2ndNameSpace" : [{"id": identifier2, "authenticatedState": authenticatedState2, "primary": isPrimary2}]}};
   

    //add item 1
    idmap.addItem(identityItems1, namespace1);

    //add item 2
    idmap.addItem(identityItems2, namespace2);
    await AEPIdentity.updateIdentities(idmap);
    expect(spy).toHaveBeenCalledWith(expectedidmap);
  });

 it('removeIdentity is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'removeIdentity');
    let identifier1 = "id1";
    let namespace1 = "1stNameSpace"
    let authenticatedState1 = AEPAuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identityItem1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);

    await AEPIdentity.removeIdentity(identityItem1, namespace1)
    expect(spy).toHaveBeenCalled();
  });

  it('removeIdentityItem is validated', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdgeIdentity, 'updateIdentities');

    let identifier1 = "id1";
    let namespace1 = "1stNameSpace"
    let authenticatedState1 = AEPAuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identifier2 = "id2";
    let namespace2 = "2ndNameSpace"
    let authenticatedState2 = AEPAuthenticatedState.AUTHENTICATED;
    let isPrimary2 = false;

    let identifier3 = "id3";
    let authenticatedState3 = AEPAuthenticatedState.LOGGED_OUT;
  
    let identifier4 = "id4";

    let identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
    let identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
    let identityItems3  = new AEPIdentityItem(identifier3, authenticatedState3, isPrimary2);
    let identityItems4  = new AEPIdentityItem(identifier4, authenticatedState2);
   
    let idmap1 = new AEPIdentityMap();

        let expectedidmap = {"items": { "1stNameSpace" : [{"id": identifier1, "authenticatedState": authenticatedState1, "primary": isPrimary1}], "2ndNameSpace" : [{"id": identifier3, "authenticatedState": authenticatedState3, "primary": isPrimary2}, {"id": identifier4, "authenticatedState": authenticatedState2, "primary": isPrimary2}]}}; 

    //add item 1
    idmap1.addItem(identityItems1, namespace1);

    //add item 2
    idmap1.addItem(identityItems2, namespace1);

    //add item 3
    idmap1.addItem(identityItems3, namespace2);

    //add item 4
    idmap1.addItem(identityItems4, namespace2);

    //remove item 2
    idmap1.removeItem(identityItems2, namespace1);

    let checkEmpty = idmap1.isEmpty();
    console.log("check isEmpty: (should be false) " + checkEmpty);

    let checkGetIdentityItemsForNamespace = idmap1.getIdentityItemsForNamespace(namespace2);
    console.log("check identity items in namespace2: (should be 2 items) ");
    console.table(checkGetIdentityItemsForNamespace);

    let namespacesInMap = idmap1.getNamespaces();
    console.log("check namespaces in map: (should be 2 items) " + namespacesInMap);
    console.table(namespacesInMap);

    await AEPIdentity.updateIdentities(idmap1);

    expect(spy).toHaveBeenCalledWith(expectedidmap);
 });
});
