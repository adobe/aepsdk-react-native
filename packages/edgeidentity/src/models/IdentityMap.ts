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

import IdentityItem from './IdentityItem';

class IdentityMap {
  identityMap: Record<string, Array<IdentityItem>> = {};

  /**
   * Adds an `IdentityItem` to this `IdentityMap`
   */
  addItem(item: IdentityItem, namespace: string) {
    if (item == null || !namespace) {
      return;
    }
    if (!item.id || item.id.length === 0) {
      return;
    }

    let itemCopy = copyItem(item);
    // add item to the existing namespace
    if (this.identityMap[namespace] !== undefined) {
      var index = this.identityMap[namespace].findIndex((e) =>
        equalIds(e.id, itemCopy.id)
      );
      if (index !== -1) {
        this.identityMap[namespace][index] = itemCopy;
      } else {
        this.identityMap[namespace].push(itemCopy);
      }
    } else {
      // creates new list with the item in it
      this.identityMap[namespace] = [itemCopy];
    }
  }

  /**
   * Checks if this `IdentityMap` is empty
   */
  isEmpty() {
    return !Object.keys(this.identityMap).length;
  }

  /**
   * Gets a list of all namespaces available in this `IdentityMap`
   */
  getNamespaces() {
    return Object.keys(this.identityMap);
  }

  /**
   * Retrieves the IdentityItems for a given namespace
   */
  getIdentityItemsForNamespace(namespace: string): Array<IdentityItem> {
    return Object.assign([], this.identityMap[namespace]);
  }

  /**
   * Removes the provided `IdentityItem` for a namespace from the `IdentityMap`
   */
  removeItem(item: IdentityItem, namespace: string) {
    if (item == null || !namespace) {
      return;
    }

    if (!item.id || item.id.length === 0) {
      return;
    }

    // remove item from the existing namespace
    if (this.identityMap[namespace] !== undefined) {
      var list = this.identityMap[namespace].filter(
        (e) => !equalIds(e.id, item.id)
      );
      if (list.length == 0) {
        delete this.identityMap[namespace];
      } else {
        this.identityMap[namespace] = list;
      }
    }
  }
}

function equalIds(id1: string, id2: string): boolean {
  return id1.toLowerCase() === id2.toLowerCase();
}

function copyItem(item: IdentityItem): IdentityItem {
  var clonedItem = new IdentityItem(
    item.id,
    item.authenticatedState,
    item.primary
  );
  return clonedItem;
}

export default IdentityMap;
