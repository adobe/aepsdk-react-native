/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import {UserProfile} from '@adobe/react-native-aepuserprofile';
import styles from '../styles/styles';
import {NavigationProps} from '../types/props';

function profileExtensionVersion() {
  UserProfile.extensionVersion().then(version =>
    console.log('AdobeExperienceSDK: UserProfile version: ' + version),
  );
}

function updateUserAttributes() {
  let attrMap = {mapKey: 'mapValue', mapKey1: 'mapValue1'};
  UserProfile.updateUserAttributes(attrMap);
}

function removeUserAttributes() {
  UserProfile.removeUserAttributes(['mapKey1']);
}

function getUserAttributes() {
  UserProfile.getUserAttributes(['mapKey', 'mapKey1']).then(map =>
    console.log(
      'AdobeExperienceSDK: UserProfile getUserAttributes: ' +
        JSON.stringify(map),
    ),
  );
}

const ProfileView = ({navigation}: NavigationProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>UserProfile</Text>
        <Button title="extensionVersion()" onPress={profileExtensionVersion} />
        <Button title="updateUserAttributes()" onPress={updateUserAttributes} />
        <Button title="removeUserAttributes()" onPress={removeUserAttributes} />
        <Button title="getUserAttributes()" onPress={getUserAttributes} />
      </ScrollView>
    </View>
  );
};

export default ProfileView;
