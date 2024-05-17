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
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
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
    const parameters1 = new TargetParameters(mboxParameters1);
    const request1 = new TargetRequestObject(
      'clickTestRyan',
      parameters1,
      'defaultContent1',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const parameters2 = new TargetParameters(
      mboxParameters2,
      {profileParameters: 'parameterValue'},
      targetProduct,
      targetOrder,
    );
    const request2 = new TargetRequestObject(
      'mboxName2',
      parameters2,
      'defaultContent2',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const locationRequests = [request1, request2];
    const profileParameters1 = {ageGroup: '20-32'};

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );
    Target.retrieveLocationContent(locationRequests, parameters);
  };

  const displayedLocations = () =>
    Target.displayedLocations(['clickTestRyan', 'clickTestRyan']);

  const clickedLocation = () => {
    const purchaseIDs = ['34', '125'];

    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const profileParameters1 = {ageGroup: '20-32'};
    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );

    Target.clickedLocation('clickTestRyan', parameters);
  };

  const prefetchContent = () => {
    const mboxParameters1 = {status: 'platinum'};
    const mboxParameters2 = {userType: 'Paid'};
    const purchaseIDs = ['34', '125'];

    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const parameters1 = new TargetParameters(mboxParameters1);
    const prefetch1 = new TargetPrefetchObject('clickTestRyan', parameters1);

    const parameters2 = new TargetParameters(
      mboxParameters2,
      {profileParameters: 'parameterValue'},
      targetProduct,
      targetOrder,
    );
    const prefetch2 = new TargetPrefetchObject('mboxName2', parameters2);

    const prefetchList = [prefetch1, prefetch2];
    const profileParameters1 = {ageGroup: '20-32'};

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );
    Target.prefetchContent(prefetchList, parameters)
      .then(success => console.log(success))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
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
        <Button
          title="clickedLocation(...)"
          onPress={clickedLocation}
        />
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
