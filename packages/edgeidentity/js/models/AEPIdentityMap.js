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
  namespaces:string;

  constructor() {}

  /**
   * @brief Add Items to Identity Item
  */
  addItem(item: AEPIdentityItem, namespaces: string) {
    if (item === null) {
      console.log("add - ignore addItem, item can't be null");
      return;
  }

    if (namespaces === null) {
     console.log("add - ignore addItem, namespaces can't be null");
     return;
  }

     // add item to the existing namespace
  if (this.items[namespaces] !== undefined) {
      var list = this.items[namespaces];
      list.push(item);
      this.items[namespaces] = list;   
      console.log("map test " + JSON.stringify(this.items[namespaces]))  
  } else {
      // creates new list with the item in it
      this.items[namespaces] = [item] 
      console.log("map test else " + JSON.stringify(this.items[namespaces]))  
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
    console.log("in getIdentityItemsForNamespaces");
    var namespacesKey: Array<String>;
        
    namespacesKey = this.items[namespace]; 
    console.log("getNameSpaceInMap " + namespace);
    console.log("getNameSpaceInMap " + JSON.stringify(namespacesKey));
    //To Do, add log for undefined namespaces.
    return namespacesKey;
  }
/**
  * @brief Remove Items to Identity Item
  */
 removeItem(item: AEPIdentityItem, namespace: string) {
  if (item === null) {
    console.log("removeItem - ignore to remove item, item can't be null");
    return;
}

  if (namespace === null) {
   console.log("removeItem - ignore to remove item, namespaces can't be null");
   return;
}

   // remove item from the existing namespace
   console.log("remove in AEPIdMap" + JSON.stringify(this.items[namespace]) + " size: " + Object.keys(this.items).length);
if (this.items[namespace] !== undefined) {
    //var list = this.items[namespace];
    var list1 = this.items[namespace];
    console.log("before remove" + JSON.stringify(this.items[namespace]));


    //list1 = list1.filter(items => items !== item)
    var list2 = this.items[namespace].filter(e => e !== item)
    // var index = list1.indexOf(item);
    // if (index > -1) {
    //   list1.splice(index, 1);
    // }
    //list1 = list1.filter(item => item !== item)

    console.log("did it remove list 2" + JSON.stringify(list2));

    this.items[namespace] = list2; 
    //this.items[namespace] = list1; 
    console.log("did it remove list 2" + JSON.stringify(this.items[namespace]));
    
   
} else {
     this.items[namespaces] = [item] 
     console.log("removeItem - no item");
  }
  //return list2;
}
}

module.exports = AEPIdentityMap;