/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

import React, {useState} from 'react';
import {Button, Text, View, ScrollView, TextInput, Alert} from 'react-native';
import { Messaging, MessagingDelegate, MessagingEdgeEventType } from '@adobe/react-native-aepmessaging';
const AEPCore = require('@adobe/react-native-aepcore');
import styles from '../styles/styles';

const MobileCore = AEPCore.MobileCore;
const Event = AEPCore.Event;

export default ({ navigation }) => {

    const [keys, setKeys] = useState('');
    const [values, setValues] = useState('');
    const messagingExtensionVersion = () => Messaging.extensionVersion().then(version => console.log("AdobeExperienceSDK: Messaging version: " + version));
    const sentTrackingEvent = () => {
        const keysArr = keys.split(";").map(text => text.trim());
        const valuesArr = values.split(";").map(text => text.trim());
        if(keysArr.length !== valuesArr.length) {
            //Show error Alert
            Alert.alert("Error!!", "Mismatch in Context data keys and value length", [
                {
                    text: "Ok"
                }
            ]);
        } else {
            var eventData: {[string]: string} = {};
            keysArr.forEach((element, index) => {
                if(element && valuesArr[index]){
                    eventData[element] = valuesArr[index];
                }                    
            });
            //Sent event to trigger IAM            
            var event = new Event("test", "iamtest", "iamtest", eventData);
            MobileCore.dispatchEvent(event);
        }
    }; 

    const setMessagingDelegate = () => {
        const messagingDelegate = {

            onShow(message: Message) {
                console.log("Onshow called");
            },

            onDismiss(message: Message) {
                console.log("Ondismiss called");
            },

            shouldShowMessage(message: Message) {
                console.log("shouldShowMessage called");
                return true;
            },

            urlLoaded(url: string) {
                console.log("urlLoaded");
            }
        };
        Messaging.setMessagingDelegate(messagingDelegate);
    };
    
    return (<View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }} >
        <Button title="Go to main page" onPress={() => navigation.goBack()} />
        <Text style={styles.welcome}>Messaging</Text>
        <Button title="extensionVersion()" onPress={ messagingExtensionVersion }/>
        <Button title="refreshInAppMessages()" onPress={ Messaging.refreshInAppMessages }/>        
        <Button title="setMessagingDelegate()" onPress={setMessagingDelegate}/>
        <Text style={{...styles.welcome, fontSize: 12}}>Context data keys as colon(;) separated values</Text>
        <TextInput style={styles.textinput} placeholder="Context data keys" placeholderTextColor="#8e8e8e" value={keys} onChangeText={text => setKeys(text)}/>
        <Text style={{...styles.welcome, fontSize: 12}}>Context data values as colon(;) separated values</Text>
        <TextInput style={styles.textinput} placeholder="Context data values" placeholderTextColor="#8e8e8e" value={values} onChangeText={text => setValues(text)}/>        
        <Button title="Track Event" onPress={sentTrackingEvent}/>
        </ScrollView>
    </View>)
};