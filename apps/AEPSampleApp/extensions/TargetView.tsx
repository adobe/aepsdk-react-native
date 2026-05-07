/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  Target,
  TargetOrder,
  TargetParameters,
  TargetPrefetchObject,
  TargetProduct,
  TargetRequestObject,
} from '@adobe/react-native-aeptarget';
import {NavigationProps} from '../types/props';

function TargetView({navigation}: NavigationProps) {
  const [mbox1, setMbox1] = useState('clickTestRyan');
  const [mbox2, setMbox2] = useState('mboxName2');

  const targetExtensionVersion = async () => {
    const version = await Target.extensionVersion();
    console.log(`AdobeExperienceSDK: Target version: ${version}`);
  };

  const clearPrefetchCache = () => Target.clearPrefetchCache();

  const getSessionId = async () => {
    const sessionId = await Target.getSessionId();
    console.log(`Session ID: ${sessionId}`);
  };

  const getThirdPartyId = async () => {
    const id = await Target.getThirdPartyId();
    console.log(`AdobeExperienceSDK: Third Party ID: ${id}`);
  };

  const getTntId = async () => {
    const id = await Target.getTntId();
    console.log(`AdobeExperienceSDK: TNT ID ${id}`);
  };

  const resetExperience = () => Target.resetExperience();

  const setPreviewRestartDeeplink = () =>
    Target.setPreviewRestartDeeplink('https://www.adobe.com');

  const setSessionId = () => Target.setSessionId('sessionId');
  const setTntId = () => Target.setTntId('tntId');
  const setThirdPartyId = () => Target.setThirdPartyId('thirdPartyId');

  const retrieveLocationContent = () => {
    const mboxParameters1 = {status: 'platinum'};
    const mboxParameters2 = {userType: 'Paid'};
    const purchaseIDs = ['34', '125'];
    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');

    const request1 = new TargetRequestObject(
      mbox1,
      new TargetParameters(mboxParameters1),
      'defaultContent1',
      (error, content) => {
        if (error) console.error(error);
        else console.log('Adobe content:' + content);
      },
    );

    const request2 = new TargetRequestObject(
      mbox2,
      new TargetParameters(mboxParameters2, {profileParameters: 'parameterValue'}, targetProduct, targetOrder),
      'defaultContent2',
      (error, content) => {
        if (error) console.error(error);
        else console.log('Adobe content:' + content);
      },
    );

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      {ageGroup: '20-32'},
      targetProduct,
      targetOrder,
    );
    Target.retrieveLocationContent([request1, request2], parameters);
  };

  const displayedLocations = () =>
    Target.displayedLocations([mbox1, mbox2]);

  const clickedLocation = () => {
    const purchaseIDs = ['34', '125'];
    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      {ageGroup: '20-32'},
      targetProduct,
      targetOrder,
    );
    Target.clickedLocation(mbox1, parameters);
  };

  const prefetchContent = () => {
    const mboxParameters1 = {status: 'platinum'};
    const mboxParameters2 = {userType: 'Paid'};
    const purchaseIDs = ['34', '125'];
    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');

    const prefetch1 = new TargetPrefetchObject(mbox1, new TargetParameters(mboxParameters1));
    const prefetch2 = new TargetPrefetchObject(
      mbox2,
      new TargetParameters(mboxParameters2, {profileParameters: 'parameterValue'}, targetProduct, targetOrder),
    );

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      {ageGroup: '20-32'},
      targetProduct,
      targetOrder,
    );
    Target.prefetchContent([prefetch1, prefetch2], parameters)
      .then(success => console.log(success))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 16, marginTop: 30, paddingBottom: 40}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Target Test App</Text>

        <Text style={styles.label}>Mbox 1</Text>
        <TextInput
          style={styles.input}
          value={mbox1}
          onChangeText={setMbox1}
          placeholder="Mbox name 1"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.label}>Mbox 2</Text>
        <TextInput
          style={styles.input}
          value={mbox2}
          onChangeText={setMbox2}
          placeholder="Mbox name 2"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.divider} />

        <View style={styles.buttonWrapper}><Button title="extensionVersion()" onPress={targetExtensionVersion} /></View>
        <View style={styles.buttonWrapper}><Button title="clearPrefetchCache()" onPress={() => clearPrefetchCache()} /></View>
        <View style={styles.buttonWrapper}><Button title="getSessionId()" onPress={getSessionId} /></View>
        <View style={styles.buttonWrapper}><Button title="getThirdPartyId()" onPress={getThirdPartyId} /></View>
        <View style={styles.buttonWrapper}><Button title="getTntId()" onPress={getTntId} /></View>
        <View style={styles.buttonWrapper}><Button title="resetExperience()" onPress={resetExperience} /></View>
        <View style={styles.buttonWrapper}><Button title="setPreviewRestartDeeplink(...)" onPress={setPreviewRestartDeeplink} /></View>
        <View style={styles.buttonWrapper}><Button title="setSessionId(...)" onPress={setSessionId} /></View>
        <View style={styles.buttonWrapper}><Button title="setThirdPartyId(...)" onPress={setThirdPartyId} /></View>
        <View style={styles.buttonWrapper}><Button title="setTntId(...)" onPress={setTntId} /></View>
        <View style={styles.buttonWrapper}><Button title={`retrieveLocationContent(${mbox1}, ${mbox2})`} onPress={retrieveLocationContent} /></View>
        <View style={styles.buttonWrapper}><Button title={`prefetchContent(${mbox1}, ${mbox2})`} onPress={prefetchContent} /></View>
        <View style={styles.buttonWrapper}><Button title={`displayedLocations(${mbox1}, ${mbox2})`} onPress={displayedLocations} /></View>
        <View style={styles.buttonWrapper}><Button title={`clickedLocation(${mbox1})`} onPress={clickedLocation} /></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  buttonWrapper: {
    marginVertical: 4,
  },
});

export default TargetView;
