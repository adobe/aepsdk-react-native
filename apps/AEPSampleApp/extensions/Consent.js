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
import {AEPConsent} from '@adobe/react-native-aepedgeconsent';
import {AEPCore} from '@adobe/react-native-aepcore';

export default Consent = ({ navigation }) => {
  const [version, setVersion] = useState('');
  const [consents, setConsents] = useState('');
  AEPConsent.extensionVersion().then(version => setVersion(version));

  function getConsents() {
    var consents  = {"consents" : {"collect" : {"val": "n"}}};
    AEPConsent.getConsents().then(currentConsents => {
      let consentsStr = JSON.stringify(currentConsents);
      setConsents(consentsStr);
      console.log("AdobeExperienceSDK: Current consents:  " + consentsStr);
    });
  }

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Consent v{version}</Text>
        <Button title="Set Collect Consent - Yes" onPress={updateConsentYes}/>
        <Button title="Set Collect Consent - No" onPress={updateConsentNo}/>
        <Button title="Set Default Consent - Yes" onPress={setDefaultConsentYes}/>
        <Button title="Get Consents" onPress={getConsents}/>
        <Text style={styles.text}>{consents}</Text>
        </ScrollView>
      </View>
  )
}

function updateConsentYes() {
  var consents  = {"consents" : {"collect" : {"val": "y"}}};
  AEPConsent.update(consents);
}

function updateConsentNo() {
  var consents  = {"consents" : {"collect" : {"val": "n"}}};
  AEPConsent.update(consents);
}

function setDefaultConsentYes() {
  var defaultConsents  = {"consent.default": {"consents" : {"collect" : {"val": "y"}}}};
  AEPCore.updateConfiguration(defaultConsents);
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
    marginTop: 10,
    margin: 5
  }
});