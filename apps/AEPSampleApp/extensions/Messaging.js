/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@format
*/

import React from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import { AEPMessaging } from '@adobe/react-native-aepmessaging';
import styles from '../styles/styles';

const messagingExtensionVersion = () => AEPMessaging.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPMessaging version: " + version));
export default ({ navigation }) => (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }} >
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Messaging</Text>
        <Button title="extensionVersion()" onPress={messagingExtensionVersion}/>
        </ScrollView>
    </View>
);