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
  items: {string: Array<AEPIdentityItem>};
  namespace: string;

  //var namespacesKey: Array<String> = this.items[namespaces];
  
  constructor() {}

  //addItem
  addItem(item: AEPIdentityItem, namespaces: string) {
    this.add(item, namespaces, false);
  }

  add(item: AEPIdentityItem, namespaces: string, asFirstItem: boolean) {
    this.items = item;

    //console.log("namespacesKey -  items" + JSON.stringify(namespacesKey));
    // console.log("Number2 -  namespaces" + JSON.stringify(namespaces));

//     if (typeof item !== "undefined" && item) {
//         console.log("add - ignore addItem, item can't be null");
//         return;
//     }

//     if (typeof namespaces !== "undefined" && item) {
//         console.log("add - ignore addItem, namespaces can't be null");
//         return;
//  }

    if (item === null) {
        console.log("add - ignore addItem, item can't be null");
        return;
    }

    if (namespaces === null) {
      console.log("add - ignore addItem, namespaces can't be null");
      return;
  }

    if (namespaces in this.items) {
        var list = this.items[namespaces];
        list.append(item);
        this.items[namespaces] = list;
        console.log("I am here -  has own property " + namespaces);
    } else {
        this.items[namespaces] = [item] // creates new list with item in it
        console.log("I am here -  namespaces " + namespaces);
        
        //console.table(namespacesKey);
        //console.log("I am here -  namespaces " + JSON.stringify(this.items[namespaces]));
    }
  }
  
  isEmpty(){
    return this.items.isEmpty();
  }

  removeItem(items: AEPIdentityItem, namespaces: string){
    this.items = items; 
    this.namespaces = namespaces;
  }
}

module.exports = AEPIdentityMap;