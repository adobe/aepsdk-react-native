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
        <Button title="updateIdentity()" onPress={updateIdentities}/>
        <Button title="removeIdentity()" onPress={removeIdentities}/>
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

  var identifier = "id";
  var namespace = "localTest"
  var authenticatedState = "unknown";
  var isPrimary = "true";

  var identifier1 = "2ndID";
  var namespace1 = "2ndTest"
  var authenticatedState1 = "unknown";
  var isPrimary1 = "false";

  var identifier2 = "3ndID";
  var namespace2 = "3ndTest"
  var authenticatedState2 = "unknown";
  var isPrimary2 = "false";

  var identityItems  = new AEPIdentityItem(identifier, authenticatedState, isPrimary);
  var identityItems1  = new AEPIdentityItem(identifier1, authenticatedState1, isPrimary1);
  var identityItems2  = new AEPIdentityItem(identifier2, authenticatedState2, isPrimary2);
  var map = new AEPIdentityMap();
  

  //map = AEPIdentity.getIdentities();

  //console.table(AEPIdentity.getIdentities());
  console.log("hello -  update Identity" + JSON.stringify(identityItems));
  console.log("hello -  update Identity" + namespace1);

  //AEPIdentity.getIdentities().then(identities => console.log("AdobeExperienceSDK: Get AEPIdentity Maps = " + JSON.stringify(identities)));
  map.addItem(identityItems, namespace);
  map.addItem(identityItems1, namespace);
  map.addItem(identityItems2, namespace1);

  
  console.log("hello -  update Identity final" + JSON.stringify(map));
  AEPIdentity.updateIdentities(map);

  
}

function removeIdentities() {
  var identifier = "id";
  var namespace = "removeTest"
  var authenticatedState = "unknown";
  var isPrimary = true;
  var map = new AEPIdentityMap();

  var identityItems  = new AEPIdentityItem(identifier, authenticatedState, isPrimary);
  map.removeItem(identityItems, namespace);
  AEPIdentity.updateIdentities(map);
  console.log("EdgeIdentity - removeItem");
  AEPIdentity.removeIdentity(identityItems, namespace);
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