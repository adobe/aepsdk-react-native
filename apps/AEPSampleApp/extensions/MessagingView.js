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
import { Messaging, MessagingDelegate, MessagingEdgeEventType, Message } from '@adobe/react-native-aepmessaging';
const AEPCore = require('@adobe/react-native-aepcore');
import styles from '../styles/styles';

const MobileCore = AEPCore.MobileCore;
const Event = AEPCore.Event;

var i = 1;

export default ({ navigation }) => {

    var cachedMessage: Message;
    const [keys, setKeys] = useState('');
    const [values, setValues] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventSource, setEventSource] = useState('');    
    const [action, setAction] = useState('testFullscreen');

    const messagingExtensionVersion = () => Messaging.extensionVersion().then(version => console.log("AdobeExperienceSDK: Messaging version: " + version));

    const sentTrackingEvent = () => {

        const keysArr = keys.split(";").map(text => text.trim());
        const valuesArr = values.split(";").map(text => text.trim());        
        var eventData: {[string]: any} = {};
        keysArr.forEach((element, index) => {
            if(element && valuesArr[index]){
                eventData[element] = valuesArr[index];
            }                    
        });
        //Sent event to trigger IAM            
        var event = new Event(eventName, eventType, eventSource, eventData);
        MobileCore.dispatchEvent(event);        
    }; 

    const trackAction = () => {
        MobileCore.trackAction(action, null);
    };

    const setMessagingDelegate = () => {
        const messagingDelegate = {

            onShow(message: Message) {
                //Handle onshow callback of MessageDelegate
            },

            onDismiss(message: Message) {
                //Handle onDismiss callback of MessageDelegate
            },

            shouldShowMessage(message: Message) {                  
                cachedMessage = message;
                return true; //Return true if want to show the Message else return false
            },

            urlLoaded(url: string, message: Message) {}
        };
        Messaging.setMessagingDelegate(messagingDelegate);
    };

    const showMessage = () => {                
        cachedMessage.show();         
    };

    const dismissMessage = () => {                
        cachedMessage.dismiss();
    };

    const clearMessage = () => {                
        cachedMessage.clearMessage();        
    };    
    
    return (<View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }} >
        <Button title="Go to main page" onPress={() => navigation.goBack()} />
        <Text style={styles.welcome}>Messaging</Text>
        <Button title="extensionVersion()" onPress={ messagingExtensionVersion }/>
        <Button title="refreshInAppMessages()" onPress={ Messaging.refreshInAppMessages }/>        
        <Button title="setMessagingDelegate()" onPress={setMessagingDelegate}/>
        <Button title="show message()" onPress={showMessage}/>
        <Button title="dismiss message()" onPress={dismissMessage}/>
        <Button title="clear message()" onPress={clearMessage}/>
        <Text style={{...styles.welcome, marginTop: 20}}>Event Data</Text>                
        <TextInput style={styles.textinput} placeholder="Event name" placeholderTextColor="#8e8e8e" value={eventName} onChangeText={text => setEventName(text)}/>        
        <TextInput style={styles.textinput} placeholder="Event type" placeholderTextColor="#8e8e8e" value={eventType} onChangeText={text => setEventType(text)}/>        
        <TextInput style={styles.textinput} placeholder="Event source" placeholderTextColor="#8e8e8e" value={eventSource} onChangeText={text => setEventSource(text)}/>        
        <TextInput style={styles.textinput} placeholder="Colon(;) separated Event data keys" placeholderTextColor="#8e8e8e" value={keys} onChangeText={text => setKeys(text)}/>        
        <TextInput style={styles.textinput} placeholder="Colon(;) separated Event data values" placeholderTextColor="#8e8e8e" value={values} onChangeText={text => setValues(text)}/>        
        <Button title="Sent Event()" onPress={sentTrackingEvent}/>
        <Text style={{...styles.welcome, marginTop: 20}}>Track Action</Text>                
        <TextInput style={styles.textinput} placeholder="Action name" placeholderTextColor="#8e8e8e" value={action} onChangeText={text => setAction(text)}/>        
        <Button title="Track Action()" onPress={trackAction}/>
        </ScrollView>
    </View>)
};