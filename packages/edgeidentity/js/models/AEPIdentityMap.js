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

  //addItem
  addItem(item: AEPIdentityItem, namespaces: string) {
    if (item === null) {
      console.log("add - ignore addItem, item can't be null");
      return;
  }

  if (namespaces === null) {
    console.log("add - ignore addItem, namespaces can't be null");
    return;
}

  if (this.items[namespaces] !== undefined) {
      var list = this.items[namespaces];
      list.push(item);
      this.items[namespaces] = list;
      console.log("I am here -  namespaces " + JSON.stringify(this.items[namespaces]));
      console.log("I am here -  has own property " + namespaces);
     
  } else {
      this.items[namespaces] = [item] // creates new list with item in it
        //console.log("I am here -  namespaces " + JSON.stringify(this.items[namespaces]));
  }

  console.log("Calise NameSpaces2 and NameSpacesKey2 " + namespaces);
  
  Object.keys(this.items).forEach(namespaces => {
    var namespacesKey: Array<String> = this.items[namespaces];
    console.table(namespacesKey);
  });
  }
    //console.table(namespacesKey);
 // }
  
  isEmpty(){
    return this.items.isEmpty();
  }

  removeItem(item: AEPIdentityItem, namespaces: string){
    this.items = item; 

    if (item === null) {
      console.log("remove - ignore addItem, item can't be null");
      return;
  }
  if (namespaces === null) {
    console.log("remove - ignore addItem, namespaces can't be null");
    return;
}
    
    if (this.items[namespaces] !== undefined) {
      var list = this.items[namespaces];
      list.splice(item);
      this.items[namespaces] = list;

      console.table(this.items[namespaces]);
      
      console.log("removeItem -  namespaces" + namespaces);
    } else {
      console.log("removeItem -  no item to remove");
      //console.log("I am here -  namespaces " + JSON.stringify(this.items[namespaces]));
    }

  }
}

module.exports = AEPIdentityMap;