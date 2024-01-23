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

  function sendEvent(experienceEvent: any) {
    Edge.sendEvent(experienceEvent).then(eventHandles => {
      let eventHandlesStr = JSON.stringify(eventHandles);
      console.log('AdobeExperienceSDK: EdgeEventHandles = ' + eventHandlesStr);
      setEventHandles(eventHandlesStr);
    });
  }

  function sendEventWithParams(datasetId?: string) {
    const sampleXdmData = {eventType: 'SampleXDMEvent'};
    const freeFormData = {free: 'form', data: 'example'};

    // Method using params
    let experienceEvent = new ExperienceEvent(sampleXdmData, freeFormData, datasetId);

    sendEvent(experienceEvent);
  }

  function sendEventAsObject(datasetId?: string) {
    const sampleXdmData = {eventType: 'SampleXDMEvent'};
    const freeFormData = {free: 'form', data: 'example'};

    // Method using object
    let experienceEvent = new ExperienceEvent({
      xdmData: sampleXdmData,
      data: freeFormData,
      datasetIdentifier: datasetId,
    });

    sendEvent(experienceEvent);
  }

  function sendEventDataStreamIdOverride() {
    const sampleXdmData = {eventType: 'SampleXDMEvent'};
    const freeFormData = {free: 'form', data: 'example'};

    let datastreamIdOverride = 'sampleDatastreamID';
    let experienceEvent = new ExperienceEvent({
      xdmData: sampleXdmData,
      data: freeFormData,
      datastreamIdOverride: datastreamIdOverride,
    });

    sendEvent(experienceEvent);
  }

  function sendEventDataStreamConfigOverride() {
    const sampleXdmData = {eventType: 'SampleXDMEvent'};
    const freeFormData = {free: 'form', data: 'example'};

    let configOverrides = {
      com_adobe_experience_platform: {
        datasets: {
          event: {
            datasetId: 'sampleDatasetID',
          },
        },
      },
      com_adobe_analytics: {
        reportSuites: ['sampleReportSuiteID'],
      },
    };
    let experienceEvent = new ExperienceEvent({
      xdmData: sampleXdmData,
      data: freeFormData,
      datastreamConfigOverride: configOverrides,
    });

    sendEvent(experienceEvent);
  }

  function getLocationHint() {
    Edge.getLocationHint().then(hint => {
      let locationStr = hint;
      console.log('AdobeExperienceSDK: location hint = ' + locationStr);
      if (hint == null) {
       locationStr = "null";
      }
      getlocationHintText(locationStr);
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge v{version}</Text>
        <Button
          title="sendEventWithParams"
          onPress={() => sendEventWithParams()}
        />
        <Button title="sendEventAsObject" onPress={() => sendEventAsObject()} />
        <Button
          title="sendEvent(params) to Dataset"
          onPress={() => sendEventWithParams('datasetIdExample')}
        />
        <Button
          title="sendEvent(object) to Dataset"
          onPress={() => sendEventAsObject('datasetIdExample')}
        />
        <Button
          title="sendEvent() with DatastreamIdOverride"
          onPress={() => sendEventDataStreamIdOverride()}
        />
        <Button
          title="sendEvent() with DatastreamConfigOverride"
          onPress={() => sendEventDataStreamConfigOverride()}
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
        <Button title="getLocationHint()" onPress={() => getLocationHint()} />
        <Text style={styles.text}>Location Hint: {locationHint}</Text>
      </ScrollView>
    </View>
  );
};

export default EdgeView;
