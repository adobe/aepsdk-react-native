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
        <Button title="getIdentity()" onPress={getIdentities}/>
        <Button title="updateIdentity(), addItem()" onPress={updateIdentities}/>
        <Button title="removeIdentity()" onPress={removeIdentities}/>
        <Button title="removeItem()" onPress={removeItem}/>
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

  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";

  var identifier2 = "2ndID";
  var namespace2 = "2ndNameSpace"
  var authenticatedState2 = "loggedOut";
  var isPrimary2 = "false";

  var identifier3 = "3rdID";
  var namespace3 = "3rdNameSpace"
  var authenticatedState3 = "unknown";
  var isPrimary3 = "false";

  var identifier4 = "4thID";
  var authenticatedState4 = "ambiguous";
  var isPrimary4 = "false";

  var identityItems1  = new AEPIdentityItem(identifier1,authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
  var identityItems3  = new AEPIdentityItem(identifier3, authenticatedState3, isPrimary3);
  var identityItems4  = new AEPIdentityItem(identifier4, authenticatedState4, isPrimary4);
  var map = new AEPIdentityMap();
  
  //add item 1
  map.addItem(identityItems1, namespace1);

  //add item 1
  map.addItem(identityItems2, namespace2);

  //add item 3
  map.addItem(identityItems3, namespace3);

  //add item 4 has the same namespace as namespace3
  map.addItem(identityItems4, namespace3);

  console.log("sample app - update identity");
  AEPIdentity.updateIdentities(map); 
  console.log("names spaces" + map.getNamespaces(namespace3));
  console.log("sample app - check empty map " +  map.isEmpty());
  
}

function removeIdentities() {
  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";

  var identifier3 = "3rdID";
  var namespace3 = "3rdNameSpace"
  var authenticatedState3 = "unknown";
  var isPrimary3 = "false";

  var identityItems  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
  var identityItems3  = new AEPIdentityItem(identifier3);

  console.log("sample app - removeIdentity");
  AEPIdentity.removeIdentity(identityItems, namespace1);
  AEPIdentity.removeIdentity(identityItems3, namespace3);
}

function removeItem() {
  var identifier1 = "user@example.com";
  var namespace1 = "1stNameSpace"
  var authenticatedState1 = "authenticated";
  var isPrimary1 = "true";
  var map = new AEPIdentityMap();

  var identityItems  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);

  console.log("sample app - removeItem");
  map.removeItem(identityItems, namespace1); 
  console.log("removeItem " + map)
  AEPIdentity.updateIdentities(map); 
}

function get_ListOfItems_inNamespace() {
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