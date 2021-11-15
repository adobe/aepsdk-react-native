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
  namespace:string;

  constructor() {}

  /**
   * @brief Add Item to Identity Map
  */
  addItem(item: AEPIdentityItem, namespace: string) {
    if (item === null) {
      console.log("add - ignore addItem, item can't be null");
      return;
  }

    if (namespace === null) {
     console.log("add - ignore addItem, namespaces can't be null");
     return;
  }

     // add item to the existing namespace
  if (this.items[namespace] !== undefined) {
      var list = this.items[namespace];
      list.push(item);
      this.items[namespace] = list;   
  } else {
      // creates new list with the item in it
      this.items[namespace] = [item];
    }
  }

  // /**
  // * @brief Check if IdentityMap is empty
  // */
  isEmpty() {
    return !Object.keys(this.items).length;
  }

  /**
  * @brief Get a list of namespaces
  */
  getNamespaces() {
    var namespacesKey: Array<String>;
    if (Object.keys(this.items).length === 0) {
       namespacesKey = " ";
    } else {
      namespacesKey = Object.keys(this.items)  
    }   
    return namespacesKey; 
  }

     /**
  * @brief Get a list of items for a given namespace
  */
  getIdentityItemsForNamespace(namespace: string) {
    var namespacesKey: Array<String>;
        
    namespacesKey = this.items[namespace]; 

    //To Do, add log for undefined namespaces.
    return namespacesKey;
  }
/**
  * @brief Remove Items to Identity Item
  */
 removeIdentityItem(item: AEPIdentityItem, namespace: string) {
  if (item === null) {
    console.log("removeItem - ignore to remove item, item can't be null");
    return;
}

  if (namespace === null) {
   console.log("removeItem - ignore to remove item, namespaces can't be null");
   return;
  }

   // remove item from the existing namespace
  if (this.items[namespace] !== undefined) {
    var list = this.items[namespace].filter(e => e !== item)
    this.items[namespace] = list;  
   
  } else {
     this.items[namespace] = [item] 
     console.log("removeItem - no item is removed");
  }
}
}

module.exports = AEPIdentityMap;