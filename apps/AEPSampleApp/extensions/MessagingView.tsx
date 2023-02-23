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

import React from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import {Message, Messaging} from '@adobe/react-native-aepmessaging';
import styles from '../styles/styles';
import {NavigationProps} from '../types/props';

const messagingExtensionVersion = async () => {
  const version = await Messaging.extensionVersion();
  console.log(`AdobeExperienceSDK: Messaging version: ${version}`);
};

const refreshInAppMessages = () => {
  Messaging.refreshInAppMessages();
  console.log('messages refreshed');
};

const setMessagingDelegate = () => {
  Messaging.setMessagingDelegate({
    onDismiss: () => console.log('dismissed!'),
    onShow: () => console.log('show'),
    shouldShowMessage: () => true,
    urlLoaded: () => true,
  });
  console.log('messaging delegate set');
};

const saveMessage = () => {
  const message = new Message('1', true);
  Messaging.saveMessage(message);
  console.log('message saved');
};

const MessagingView = ({navigation}: NavigationProps) => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={{marginTop: 75}}>
      <Button onPress={() => navigation.goBack()} title="Go to main page" />
      <Text style={styles.welcome}>Messaging</Text>
      <Button title="extensionVersion()" onPress={messagingExtensionVersion} />
      <Button title="refreshInAppMessages()" onPress={refreshInAppMessages} />
      <Button title="setMessagingDelegate()" onPress={setMessagingDelegate} />
      <Button title="saveMessage()" onPress={saveMessage} />
    </ScrollView>
  </View>
);

export default MessagingView;
