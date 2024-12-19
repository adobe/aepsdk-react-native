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

import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Target,
  TargetOrder,
  TargetParameters,
  TargetPrefetchObject,
  TargetProduct,
  TargetRequestObject,
} from '@adobe/react-native-aeptarget';
import { useRouter } from 'expo-router';

function TargetView() {
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
  const targetParameters1 = new TargetParameters(
    { mbox_parameter_key: 'mbox_parameter_value' },
    { profile_parameter_key: 'profile_parameter_value' },
    new TargetProduct('764334', 'Footwear'),
    new TargetOrder('223d24411', 445.12, ['ppId1']),
  );
  const retrieveLocationContent = () => {

    const request1 = new TargetRequestObject(
      'sdk_smoke_tests_target',
      new TargetParameters(),
      'DefaultValue1',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const request2 = new TargetRequestObject(
      'aep-loc-2',
      new TargetParameters(),
      'DefaultValue2',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );


    const request3 = new TargetRequestObject(
      'sdk_smoke_tests_target_a4t',
      targetParameters1,
      'DefaultValuex',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const locationRequests = [request1, request2, request3];

    Target.retrieveLocationContent(locationRequests, targetParameters1);
  };

  const displayedLocations = () =>
    Target.displayedLocations([
      'sdk_smoke_tests_target',
      'aep-loc-2',
      'sdk_smoke_tests_target_a4t',
    ], targetParameters1);

  const clickedLocation = () => {

    Target.clickedLocation('sdk_smoke_tests_target_a4t', targetParameters1);
  };

  const prefetchContent = () => {
    const prefetch1 = new TargetPrefetchObject(
      'sdk_smoke_tests_target',
      new TargetParameters(),
    );

    const prefetch2 = new TargetPrefetchObject(
      'aep-loc-2',
      targetParameters1
    );

    const prefetchList = [prefetch1, prefetch2];
 

    Target.prefetchContent(prefetchList, targetParameters1)
      .then(success => console.log(success))
      .catch(err => console.log(err));
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={router.back} title="Go to main page" />
        <Text style={styles.welcome}>Target Test App</Text>
        <Button title="extensionVersion()" onPress={targetExtensionVersion} />
        <Button
          title="clearPrefetchCache()"
          onPress={() => clearPrefetchCache()}
        />
        <Button title="getSessionId()" onPress={getSessionId} />
        <Button title="getThirdPartyId()" onPress={getThirdPartyId} />
        <Button title="getTntId()" onPress={getTntId} />
        <Button title="resetExperience()" onPress={resetExperience} />
        <Button
          title="setPreviewRestartDeeplink(...)"
          onPress={setPreviewRestartDeeplink}
        />
        <Button title="setSessionId(...)" onPress={setSessionId} />
        <Button title="setThirdPartyId(...)" onPress={setThirdPartyId} />
        <Button title="setTntId(...)" onPress={setTntId} />
        <Button
          title="retrieveLocationContent(...)"
          onPress={retrieveLocationContent}
        />
        <Button title="prefetchContent(...)" onPress={prefetchContent} />
        <Button title="displayedLocations(...)" onPress={displayedLocations} />
        <Button title="clickedLocation(...)" onPress={clickedLocation} />
      </ScrollView>
    </View>
  );
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
});

export default TargetView;
