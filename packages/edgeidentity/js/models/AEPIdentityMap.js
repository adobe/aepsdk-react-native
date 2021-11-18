/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

'use strict';

import AEPIdentityItem from './AEPIdentityItem';

class AEPIdentityMap {
  items: {string: Array<AEPIdentityItem>} = {};

  constructor() {}

  /**
   * Adds an `AEPIdentityItem` to this `AEPIdentityMap`
   */
  addItem(item: AEPIdentityItem, namespace: string) {
    if (item == null || !namespace) {
      return;
    }
    if (!item.id || item.id.length === 0) {
      return;
    }

    let itemCopy = copyItem(item);
    // add item to the existing namespace
    if (this.items[namespace] !== undefined) {
      var index = this.items[namespace].findIndex(e => equalIds(e.id, itemCopy.id));
      if (index !== -1) {
        this.items[namespace][index] = itemCopy;
      } else {
        this.items[namespace].push(itemCopy); 
      }
    } else {
      // creates new list with the item in it
      this.items[namespace] = [itemCopy];
    }
  }

  /**
   * Checks if this `AEPIdentityMap` is empty
   */
  isEmpty() {
    return !Object.keys(this.items).length;
  }

  /**
   * Gets a list of all namespaces available in this `AEPIdentityMap`
   */
  getNamespaces() {
    return Object.keys(this.items);
  }

  /**
  * Retrieves the AEPIdentityItem s for a given namespace
  */
  getIdentityItemsForNamespace(namespace: string) : Promise<?Array<AEPIdentityItem>> {
    var namespacesKey = Object.assign([], this.items[namespace]);
    return namespacesKey;
  }

  /**
   * Removes the provided `AEPIdentityItem` for a namespace from the `AEPIdentityMap`
   */
 removeItem(item: AEPIdentityItem, namespace: string) {
  if (item == null || !namespace) {
    return;
  }

  if (!item.id || item.id.length === 0) {
    return;
  }

  // remove item from the existing namespace
  if (this.items[namespace] !== undefined) {
    var list = this.items[namespace].filter(e => !equalIds(e.id, item.id))
    this.items[namespace] = list;  
  }
 } 
}

function equalIds(id1: string, id2: string): Promise<boolean> {
  return id1.toLowerCase() === id2.toLowerCase()
}

function copyItem(item: AEPIdentityItem) : Promise<AEPIdentityItem> {
  var clonedItem = new AEPIdentityItem(item.id, item.authenticatedState, item.primary);
  return clonedItem;
}

module.exports = AEPIdentityMap;