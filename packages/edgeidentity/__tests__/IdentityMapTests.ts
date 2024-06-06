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

import { AuthenticatedState, IdentityItem, IdentityMap } from '../src';

describe('IdentityMap', () => {
  it('IdentityMap addItem is validated', async () => {
    let identifier1 = 'id1';
    let namespace1 = 'namespace1';
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identifier2 = 'id2';
    let namespace2 = 'namespace2';
    let authenticatedState2 = AuthenticatedState.AUTHENTICATED;
    let isPrimary2 = false;

    let identifier3 = 'id3';
    let authenticatedState3 = AuthenticatedState.LOGGED_OUT;

    let identifier4 = 'id4';

    let identityItems1 = new IdentityItem(
      identifier1,
      authenticatedState1,
      isPrimary1
    );
    let identityItems2 = new IdentityItem(
      identifier2,
      authenticatedState2,
      isPrimary2
    );
    let identityItems3 = new IdentityItem(identifier3, authenticatedState3);
    let identityItems4 = new IdentityItem(identifier4);

    // add items
    let idMap = new IdentityMap();
    idMap.addItem(identityItems1, namespace1);
    idMap.addItem(identityItems2, namespace1);
    idMap.addItem(identityItems3, namespace2);
    idMap.addItem(identityItems4, namespace2);

    // verify
    expect(idMap.getNamespaces().length).toEqual(2);

    let itemsForNamespace1 = idMap.getIdentityItemsForNamespace(namespace1);
    expect(itemsForNamespace1.length).toEqual(2);
    expect(itemsForNamespace1).toEqual([
      {
        id: identifier1,
        authenticatedState: authenticatedState1,
        primary: isPrimary1
      },
      {
        id: identifier2,
        authenticatedState: authenticatedState2,
        primary: isPrimary2
      }
    ]);

    let itemsForNamespace2 = idMap.getIdentityItemsForNamespace(namespace2);
    expect(itemsForNamespace2.length).toEqual(2);
    expect(itemsForNamespace2).toEqual([
      {
        id: identifier3,
        authenticatedState: AuthenticatedState.LOGGED_OUT,
        primary: false
      },
      {
        id: identifier4,
        authenticatedState: AuthenticatedState.AMBIGUOUS,
        primary: false
      }
    ]);
  });

  it('IdentityMap addItem replaces items with same id', async () => {
    let identifier1 = 'id1';
    let namespace1 = 'namespace1';
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let authenticatedState2 = AuthenticatedState.AUTHENTICATED;

    // add same item twice
    let idMap = new IdentityMap();
    let item1 = new IdentityItem(identifier1, authenticatedState1, isPrimary1);
    idMap.addItem(item1, namespace1);
    idMap.addItem(item1, namespace1); // same item, should be ignored

    // verify
    expect(idMap.getNamespaces().length).toEqual(1);

    const expectedItems = [
      {
        id: identifier1,
        authenticatedState: authenticatedState1,
        primary: isPrimary1
      }
    ];
    var itemsForNamespace = idMap.getIdentityItemsForNamespace(namespace1);
    expect(itemsForNamespace).toEqual(expectedItems);

    // add item with same id, should replace existing item
    idMap.addItem(
      new IdentityItem(identifier1, authenticatedState2),
      namespace1
    );

    // verify
    expect(idMap.getNamespaces().length).toEqual(1);

    itemsForNamespace = idMap.getIdentityItemsForNamespace(namespace1);
    expect(itemsForNamespace.length).toEqual(1);

    const nextExpectedItems = [
      {
        id: identifier1,
        authenticatedState: authenticatedState2,
        primary: false
      }
    ]; // primary false by default
    expect(itemsForNamespace).toEqual(nextExpectedItems);
  });

  it('IdentityMap removeItem is validated', async () => {
    let identifier1 = 'id1';
    let namespace1 = 'namespace1';
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let identifier2 = 'id2';
    let namespace2 = 'namespace2';
    let authenticatedState2 = AuthenticatedState.AUTHENTICATED;
    let isPrimary2 = false;

    let identifier3 = 'id3';
    let authenticatedState3 = AuthenticatedState.LOGGED_OUT;

    let item1 = new IdentityItem(identifier1, authenticatedState1, isPrimary1);
    let item2 = new IdentityItem(identifier2, authenticatedState2, isPrimary2);
    let item3 = new IdentityItem(identifier3, authenticatedState3);

    // add items
    let idMap = new IdentityMap();
    idMap.addItem(item1, namespace1);
    idMap.addItem(item2, namespace2);
    idMap.addItem(item3, namespace2);

    idMap.removeItem(item1, namespace1);
    idMap.removeItem(new IdentityItem(identifier2), namespace2); // remove item based on id only

    expect(idMap.getNamespaces().length).toEqual(1);
    let itemsForNamespace2 = idMap.getIdentityItemsForNamespace(namespace2);
    expect(itemsForNamespace2.length).toEqual(1);
    expect(itemsForNamespace2).toEqual([
      {
        id: identifier3,
        authenticatedState: authenticatedState3,
        primary: false
      }
    ]);

    idMap.removeItem(item3, namespace2);

    // all items removed
    expect(idMap.isEmpty()).toEqual(true);
  });

  it('IdentityMap removeItem invalid params', async () => {
    let identifier1 = 'id1';
    let namespace1 = 'namespace1';
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let item1 = new IdentityItem(identifier1, authenticatedState1, isPrimary1);

    // add items
    let idMap = new IdentityMap();
    idMap.addItem(item1, namespace1);

    // removeItem requires valid items + namespace
    idMap.removeItem(item1, ''); // empty namespace
    idMap.removeItem(new IdentityItem('anotherId'), namespace1); // unknown id

    expect(idMap.getNamespaces().length).toEqual(1);
    let itemsForNamespace1 = idMap.getIdentityItemsForNamespace(namespace1);
    expect(itemsForNamespace1.length).toEqual(1);
  });

  it('IdentityMap getItemsForNamespace invalid params', async () => {
    let identifier1 = 'id1';
    let namespace1 = 'namespace1';
    let authenticatedState1 = AuthenticatedState.AMBIGUOUS;
    let isPrimary1 = true;

    let item1 = new IdentityItem(identifier1, authenticatedState1, isPrimary1);

    // add items
    let idMap = new IdentityMap();
    idMap.addItem(item1, namespace1);

    expect(idMap.getIdentityItemsForNamespace('invalid').length).toEqual(0);
    expect(idMap.getIdentityItemsForNamespace('').length).toEqual(0);
  });
});
