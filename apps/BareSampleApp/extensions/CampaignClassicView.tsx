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

import {CampaignClassic} from '@adobe/react-native-aepcampaignclassic';
import React from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import styles from '../styles/styles';
import {NavigationProps} from '../types/props';

function CampaignClassicView({navigation}: NavigationProps) {
  const extensionVersion = async () => {
    const version = await CampaignClassic.extensionVersion();
    console.log(`AdobeExperienceSDK: Campaign Classic version: ${version}`);
  };

  const registerDeviceWithToken = () => {
    CampaignClassic.registerDeviceWithToken('myToken', 'myUserKey');
    console.log('Device registered!')
  }

  const trackNotificationClickWithUserInfo = () => {
    CampaignClassic.trackNotificationClickWithUserInfo({'_mId': '12345', '_dId': 'testDId'});
    console.log('Notification clicked!')
  }
    
  const trackNotificationReceiveWithUserInfo = () => {
    CampaignClassic.trackNotificationReceiveWithUserInfo({'_mId': '12345', '_dId': 'testDId'});
    console.log('Notification received!')
  }

  const registerDeviceWithAdditionalParams = () => {
    CampaignClassic.registerDeviceWithToken('myToken', 'myUserKey', {
      firstName: 'someFirstName',
      lastName: 'someLastName',
      age: 30,
    });
    console.log('Device registered with additional params!')
  }

  // Android only: builds and shows the notification from an FCM data payload.
  // Resolves false on iOS, or when the payload cannot be turned into a notification.
  const handleRemoteMessage = async () => {
    try {
      const handled = await CampaignClassic.handleRemoteMessage({
        _mId: '12345',
        _dId: 'testDId',
        _msg: 'Hello from Campaign Classic',
        adb_title: 'Campaign Classic',
      });
      console.log(`AdobeExperienceSDK: handleRemoteMessage handled: ${handled}`);
    } catch (e) {
      console.log(`AdobeExperienceSDK: handleRemoteMessage failed: ${e}`);
    }
  }
    

  return (
    <View style={{...styles.container, marginTop: 30}}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Campaign Classic</Text>
        <View style={{margin: 5}}>
          <Button title="Extension Version" onPress={extensionVersion} />
          <Button title="Register Device" onPress={registerDeviceWithToken} />
          <Button
            title="Register Device (additional params)"
            onPress={registerDeviceWithAdditionalParams}
          />
          <Button
            title="Track User Click"
            onPress={trackNotificationClickWithUserInfo}
          />
          <Button
            title="Track User Receive"
            onPress={trackNotificationReceiveWithUserInfo}
          />
          <Button title="Handle Remote Message" onPress={handleRemoteMessage} />
        </View>
      </ScrollView>
    </View>
  );
}

export default CampaignClassicView;
