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
  //namespacesKey = items[namespaces];

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
    console.log("Add item set - " + JSON.stringify(item));
    console.log(namespaces);
    console.log("addItem - " + this.items[namespaces]);
  if (this.items[namespaces] !== undefined) {
      var list = this.items[namespaces];
      list.push(item);
      this.items[namespaces] = list;     
  } else {
      // creates new list with the item in it
      this.items[namespaces] = [item] 
  }
  
    Object.keys(this.items).forEach(namespaces => {
    var namespacesKey: Array<String> = this.items[namespaces];
  });
  }
  
  // /**
  // * @brief Check the if the item is empty
  // */
  // isEmpty(){
  //   return 
  // }

  /**
   * @brief Remove Identity Item item
  */
  removeItem(item: AEPIdentityItem, namespaces: string){
    this.items = item; 

    console.log("this remove item set - " + JSON.stringify(item));
    console.log(namespaces);

    if (item === null) {
      console.log("remove - ignore addItem, item can't be null");
      return;
  }
    if (namespaces === null) {
      console.log("remove - ignore addItem, namespace can't be null");
      return;
  }
    //remove item from the existing namespace
    console.log("remove table");
    console.log(this.items[namespaces]);

    if (this.items[namespaces] !== undefined) {
      var list = this.items[namespaces];
      list.splice(item);
      this.items[namespaces] = list;
      console.log("removeItem -  move item from namespace: " + namespaces);
    } else {
      console.log("removeItem -  no item to remove");
    }

  }
}

module.exports = AEPIdentityMap;