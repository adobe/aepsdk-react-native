/*
Copyright 2023 Adobe. All rights reserved.
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
import {EdgeBridge} from '@adobe/react-native-aepedgebridge';
import {MobileCore} from '@adobe/react-native-aepcore';
import styles from '../styles/styles';
import {NavigationProps} from '../types/props';


const EdgeBridgeView = ({navigation}: NavigationProps) => {
  const [version, setVersion] = useState('');
  EdgeBridge.extensionVersion().then(version => setVersion(version));


function trackAction() {
  MobileCore.trackAction('action value', {"customKey": "value"});
}

function trackState() {
  MobileCore.trackState('state value ', {"customKey": "value"});
}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge Bridge v{version}</Text>
        <Button title="trackAction()" onPress={trackAction} />
        <Button title="trackState()" onPress={trackState} />
      </ScrollView>
    </View>
  );
};

export default EdgeBridgeView;
