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
import {Button, Platform, StyleSheet, Text, View, ScrollView, NativeModules} from 'react-native';
import {AEPIdentity as AEPIdentity, AEPCore} from '@adobe/react-native-aepcore';
import {AEPIdentity as AEPEdgeIdentity } from '@adobe/react-native-aepedgeidentity';

export default EdgeIdentityAndIdentity = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Identity</Text>
        <Button title="extensionVersion()" onPress={identityExtensionVersion}/>
        <Text style={styles.welcome}>EdgeIdentity</Text>
        <Button title="extensionVersion()" onPress={identityEdgeExtensionVersion}/>
        </ScrollView>
      </View>
  )
}

function identityExtensionVersion() {
  AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: Identity version: " + version));
}

function identityEdgeExtensionVersion() {
  AEPEdgeIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdgeIdentity version: " + version));
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