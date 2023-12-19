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

import React, {useState} from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import {Edge, ExperienceEvent} from '@adobe/react-native-aepedge';
import styles from '../styles/styles';
import {NavigationProps} from '../types/props';

const EdgeView = ({navigation}: NavigationProps) => {
  const [version, setVersion] = useState('');
  const [eventHandles, setEventHandles] = useState('');
  const [locationHint, getlocationHintText] = useState('');

  Edge.extensionVersion().then(version => setVersion(version));

  function sendEvent(datasetId?: string) {
    var xdmData = {eventType: 'SampleXDMEvent'};
    var data = {free: 'form', data: 'example'};

 // Previous methods
    // var experienceEvent = new ExperienceEvent(xdmData, data, datasetId);

 // experienceEvent with datasetIdentifier with new constructor
    let experienceEvent = new ExperienceEvent({
      xdmData: xdmData,
      data: data,
      datasetIdentifier: datasetId,
    });

  // experienceEvent datastreamIdOverride with new constructor
    // let datastreamIdOverride = 'sampleDatastreamID';
    // let experienceEvent = new ExperienceEvent({
    //   xdmData: xdmData,
    //   data: data,
    //   datastreamIdOverride: datastreamIdOverride,
    // });

  // experienceEvent datastreamConfOverride with new constructor
    // let configOverrides = {
    //   'com_adobe_experience_platform': {
    //     'datasets': {
    //       'event': {
    //         'datasetId': 'sampleDatasetID'
    //       }
    //     }
    //   },
    //   'com_adobe_analytics': {
    //     'reportSuites': [
    //       'sampleReportSuiteID',
    //     ]
    //   }
    // };

    // let experienceEvent = new ExperienceEvent({
    //   xdmData: xdmData,
    //   data: data,
    //   datastreamConfigOverride: configOverrides,
    // });


    Edge.sendEvent(experienceEvent).then(eventHandles => {
      let eventHandlesStr = JSON.stringify(eventHandles);
      console.log('AdobeExperienceSDK: EdgeEventHandles = ' + eventHandlesStr);
      setEventHandles(eventHandlesStr);
    })
  }
  
  function getLocationHint() {
    Edge.getLocationHint().then(hint => {
      let locationStr = hint;
      console.log('AdobeExperienceSDK: location hint = ' + locationStr);
      if (hint == null) {
       locationStr = "null";
      }
      getlocationHintText(locationStr);
  })
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge v{version}</Text>
        <Button title="sendEvent()" onPress={() => sendEvent()} />
        <Button
          title="sendEvent() to Dataset"
          onPress={() => sendEvent('datasetIdExample')}
        />
        <Text style={styles.text}>Response event handles: {eventHandles}</Text>
        <Button
          title="setLocationHint(va6)"
          onPress={() => Edge.setLocationHint('va6')} 
        />
        <Button
          title="setLocationHint(null))"
          onPress={() => Edge.setLocationHint(null)} 
        />
        <Button title="getLocationHint()" onPress={() => getLocationHint()}  />
        <Text style={styles.text}>Location Hint: {locationHint}</Text>
      </ScrollView>
    </View>
  );
};

export default EdgeView;
