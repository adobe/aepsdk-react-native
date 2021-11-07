
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

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AEPIdentity, AEPIdentityItem, AEPIdentityMap, AEPAuthenticatedState} from '@adobe/react-native-aepedgeidentity';

export default EdgeIdentity = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>EdgeIdentity</Text>
        <Button title="extensionVersion()" onPress={edgeIdentityExtensionVersion}/>
        <Button title="getExperienceCloudId()" onPress={getExperienceCloudId}/>
        <Button title="getIdentities()" onPress={getIdentities}/>
        <Button title="updateIdentities()" onPress={updateIdentities}/>
        <Button title="removeIdentity())" onPress={removeIdentity}/>
        <Button title="updateIdentitiesAddItem())" onPress={updateIdentitiesAddItem}/>
        <Button title="removeItem()" onPress={removeItem}/>
        <Button title="isEmpty()" onPress={isEmpty}/>
        <Button title="getNamespaces()" onPress={namespacesList}/>
        <Button title="getIdentityItemsForNameSpace()" onPress={getIdentityItemsForNameSpace}/>
        </ScrollView>
      </View>
  )
}

function edgeIdentityExtensionVersion() {
  AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdgeIdentity version: " + version));
}

function getExperienceCloudId() {
  AEPIdentity.getExperienceCloudId().then(experienceCloudId => console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId));
}

function getIdentities() {
  AEPIdentity.getIdentities().then(identities => console.log("AdobeExperienceSDK: Get AEPIdentity Maps = " + JSON.stringify(identities)));
}

function updateIdentities() {

  var identifier1 = "id1";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = true;

  var identifier2 = "id2";
  var namespace2 = "2ndNameSpace"
  var authenticatedState2 = "auth";
  var isPrimary2 = false;

  var identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
  
  var map = new AEPIdentityMap();
  
  //add item 1
  map.addItem(identityItems1, namespace1);

  //add item 1
  map.addItem(identityItems2, namespace1);


  console.log("sample app - update identity");
  AEPIdentity.updateIdentities(map); 
}

function updateIdentitiesAddItem () {

  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var namespace2 = "2ndNameSpace"
  var authenticatedState1 = "unknown";
  var isPrimary1 = false;

  var identityItems1  = new AEPIdentityItem(identifier1,authenticatedState1, isPrimary1);

  var map = new AEPIdentityMap();
  
  //add item 1
  map.addItem(identityItems1, namespace2);

  console.log("sample app - update identity");
  AEPIdentity.updateIdentities(map); 
}

function removeIdentity() {
  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = true;

  var identifier3 = "3rdID";
  var namespace3 = "3rdNameSpace"
  var authenticatedState3 = "unknown";
  var isPrimary3 = false;

  var identityItems  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
  var identityItems3  = new AEPIdentityItem(identifier3);

  console.log("sample app - removeIdentity");
  AEPIdentity.removeIdentity(identityItems, namespace1);
  AEPIdentity.removeIdentity(identityItems3, namespace3);
}

function removeItem() {
  var identifier1 = "user@example.com";
  var identifier2 = "user1@examples.com";
  var identifier3 = "user2@examples.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = true;
  var map = new AEPIdentityMap();

  var identityItems  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
  var identityItems1  = new AEPIdentityItem(identifier2, authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier3, authenticatedState1, isPrimary1);
  map.addItem(identityItems, namespace1);
  map.addItem(identityItems1, namespace1);
  map.addItem(identityItems2, namespace1);
  console.log("sampleAppRemoveMap add " + JSON.stringify(map))
  console.log("sample app - removeItem");
  map.removeItem(identityItems1, namespace1); 
  console.log("removeItem " + JSON.stringify(map))
  AEPIdentity.updateIdentities(map); 
  console.log("sampleAppRemoveMap remove " + JSON.stringify(map))
}


function isEmpty() {

  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";

  var identityItems1  = new AEPIdentityItem(identifier1,authenticatedState1, isPrimary1);
  var mapNotEmpty = new AEPIdentityMap();
  
  mapNotEmpty.addItem(identityItems1, namespace1);

  console.log("---sample app - check non empty map---");
  var checkItemEmptyInMap = new Boolean(mapNotEmpty.isEmpty());
  console.log("This is a non-empty map: isEmpty() = " + checkItemEmptyInMap);

  var mapEmpty = new AEPIdentityMap();

  console.log("---sample app - check empty map---");
  var checkEmptyMap = new Boolean(mapEmpty.isEmpty());
  console.log("This is an empty map: isEmpty() = " + checkEmptyMap); 
}

function namespacesList() {

  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";

  var identifier2 = "identifier2@example.com";
  var namespace2 = "2ndtNameSpace"
  var authenticatedState2 = "authenticated";
  var isPrimary2 = "true";

  var identityItems1  = new AEPIdentityItem(identifier1,authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier2,authenticatedState2, isPrimary2);
  var mapNotEmpty = new AEPIdentityMap();
  
   mapNotEmpty.addItem(identityItems1, namespace1);
   mapNotEmpty.addItem(identityItems2, namespace2);

  var namespacecheck = mapNotEmpty.getNamespaces();


  console.log("list of namespace" + JSON.stringify(namespacecheck));
}

function getIdentityItemsForNameSpace() {

  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";

  var identifier2 = "identifier2@example.com";
  var namespace2 = "2ndtNameSpace"
  var authenticatedState2 = "authenticated";
  var isPrimary2 = "true";

  var identityItems1  = new AEPIdentityItem(identifier1,authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier2,authenticatedState2, isPrimary2);
  var mapNotEmpty = new AEPIdentityMap();
  
  mapNotEmpty.addItem(identityItems1, namespace1);
  mapNotEmpty.addItem(identityItems2, namespace1);

  var mamespacecheck = mapNotEmpty.getIdentityItemsForNamespace(namespace1);

  console.log("---sample app - getIdentityItemsForNamespace(namespace) --- ");
  console.log("Identity items in namespace: " + JSON.stringify(mamespacecheck));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  }
});