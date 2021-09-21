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

import React from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import {AEPUserProfile} from '@adobe/react-native-aepuserprofile';
import styles from '../styles/styles';

export default Profile = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>UserProfile</Text>
        <Button title="extensionVersion()" onPress={profileExtensionVersion}/>
        <Button title="updateUserAttributes()" onPress={updateUserAttributes}/>
        <Button title="removeUserAttributes()" onPress={removeUserAttributes}/>
        <Button title="getUserAttributes()" onPress={getUserAttributes}/>
        </ScrollView>
      </View>
  )
}

function profileExtensionVersion() {
  AEPUserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPUserProfile version: " + version));
}

function updateUserAttributes() {
  let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
  AEPUserProfile.updateUserAttributes(attrMap);
}

function removeUserAttributes() {
  AEPUserProfile.removeUserAttributes(["mapKey1"]);
}

function getUserAttributes(){
  AEPUserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: AEPUserProfile getUserAttributes: " +map));
}