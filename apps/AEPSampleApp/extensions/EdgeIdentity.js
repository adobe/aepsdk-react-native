
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

import React, {useState, Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
import {AEPIdentity, AEPIdentityItem, AEPIdentityMap, AEPAuthenticatedState} from '@adobe/react-native-aepedgeidentity';

export default EdgeIdentity = ({ navigation }) => {
  const [version, setVersion] = useState('');
  const [identities, setIdentities] = useState('');
  const [ecid, setECID] = useState("");
  AEPIdentity.extensionVersion().then(version => setVersion(version));

  function getIdentities() {
    AEPIdentity.getIdentities().then(currentIdentity => {
      let identitiesStr = JSON.stringify(currentIdentity);
      setIdentities(identitiesStr);
      console.log("AdobeExperienceSDK: getIdentities " + identitiesStr);
    }).catch((error) => {
      console.warn("AdobeExperienceSDK: getIdentities returned error: ", error);
    });
  }

  function getExperienceCloudId() {
  AEPIdentity.getExperienceCloudId().then(experienceCloudId => {
    setECID(experienceCloudId);
    console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId);
     }).catch((error) => {
      console.warn("AdobeExperienceSDK: ECID returned error: ", error);
    });
  }
  

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>EdgeIdentity v{version}</Text>
        <Button title="getExperienceCloudId()" onPress={getExperienceCloudId}/>
        <Button title="updateIdentities()" onPress={updateIdentities}/>
        <Button title="removeIdentity()" onPress={removeIdentity}/>
        <Button title="getIdentities()" onPress={getIdentities}/>
        <View style={styles.breakLine}/>
        <Text>{identities}</Text>
        <Text>{ecid}</Text>
        </ScrollView>
      </View>
  )
}


function getIdentities() {
  AEPIdentity.getIdentities().then(identities => console.log("AdobeExperienceSDK: Get AEPIdentity Maps = " + JSON.stringify(identities)));
}

function updateIdentities() {

  var identifier = "test-id";
  var namespace = "test-namespace"
  
  var identityItems  = new AEPIdentityItem(identifier);
  
  var map = new AEPIdentityMap();
  
  //add an item
  map.addItem(identityItems, namespace);

  console.log("sample app - update identity");
  AEPIdentity.updateIdentities(map); 
}

function removeIdentity() {
  var identifier = "test-id";
  var namespace = "test-namespace"

  var identityItem  = new AEPIdentityItem(identifier);
  
  console.log("sample app - removeIdentity");
  AEPIdentity.removeIdentity(identityItem, namespace);
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
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    margin: 5,
  }, 
  breakLine: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
  }
});