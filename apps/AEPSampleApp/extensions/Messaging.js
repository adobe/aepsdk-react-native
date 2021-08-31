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