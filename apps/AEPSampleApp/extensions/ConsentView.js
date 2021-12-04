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
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {Consent} from '@adobe/react-native-aepedgeconsent';
import {MobileCore} from '@adobe/react-native-aepcore';

export default ConsentView = ({ navigation }) => {
  const [version, setVersion] = useState('');
  const [consents, setConsents] = useState('');
  Consent.extensionVersion().then(version => setVersion(version));

  function getConsents() {
    var consents  = {"consents" : {"collect" : {"val": "n"}}};
    Consent.getConsents().then(currentConsents => {
      let consentsStr = JSON.stringify(currentConsents);
      setConsents(consentsStr);
      console.log("AdobeExperienceSDK: Consent.getConsents returned current consent preferences:  " + consentsStr);
    }).catch((error) => {
      console.warn("AdobeExperienceSDK: Consent.getConsents returned error: ", error);
    });
  }

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Consent v{version}</Text>
        <Button title="Set Default Consent - Yes" onPress={() => setDefaultConsent(true)}/>
        <Button title="Set Collect Consent - Yes" onPress={() => updateCollectConsent(true)}/>
        <Button title="Set Collect Consent - No" onPress={() => updateCollectConsent(false)}/>
        <Button title="Get Consents" onPress={getConsents}/>
        <View style={styles.breakLine}/>
        <Text style={styles.text}>{consents}</Text>
        </ScrollView>
      </View>
  )
}

function updateCollectConsent(allowed: boolean) {
  var collectConsentStatus = allowed ? {"val": "y"} : {"val": "n"};

  var consents: {[keys: string]: any} = {"consents" : {"collect" : collectConsentStatus}};
  Consent.update(consents);
  console.log("AdobeExperienceSDK: Consent.update called with:  " + JSON.stringify(consents));
}

function setDefaultConsent(allowed: boolean) {
  var collectConsentStatus = allowed ? {"val": "y"} : {"val": "n"};
  var defaultConsents: {[keys: string]: any} = {"consent.default": {"consents" : {"collect" : collectConsentStatus}}};
  MobileCore.updateConfiguration(defaultConsents);
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