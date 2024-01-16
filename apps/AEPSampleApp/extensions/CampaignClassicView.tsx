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
    

  return (
    <View style={{...styles.container, marginTop: 30}}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Campaign Classic</Text>
        <View style={{margin: 5}}>
          <Button title="Extension Version" onPress={extensionVersion} />
          <Button title="Register Device" onPress={registerDeviceWithToken} />
          <Button
            title="Track User Click"
            onPress={trackNotificationClickWithUserInfo}
          />
          <Button
            title="Track User Receive"
            onPress={trackNotificationReceiveWithUserInfo}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default CampaignClassicView;
