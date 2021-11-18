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

import React, {Component, useState} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {Edge, ExperienceEvent, EdgeEventHandle} from '@adobe/react-native-aepedge';

export default EdgeView = ({ navigation }) => {
  const [version, setVersion] = useState('');
  const [eventHandles, setEventHandles] = useState('');

  Edge.extensionVersion().then(version => setVersion(version));

  function sendEvent(datasetId: String) {
    var xdmData  = {"eventType" : "SampleXDMEvent"};
    var data  = {"free": "form", "data": "example"};
    var experienceEvent = new ExperienceEvent(xdmData, data, datasetId);
   
    Edge.sendEvent(experienceEvent).then(eventHandles => {
      let eventHandlesStr = JSON.stringify(eventHandles);
      console.log("AdobeExperienceSDK: EdgeEventHandles = " + eventHandlesStr);
      setEventHandles(eventHandlesStr);
    });
  }

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge v{version}</Text>
        <Button title="sendEvent()" onPress={() => sendEvent()}/>
        <Button title="sendEvent() to Dataset" onPress={() => sendEvent("datasetIdExample")}/>
        <Text style={styles.text}>Response event handles: {eventHandles}</Text>
        </ScrollView>
      </View>
  )
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
});