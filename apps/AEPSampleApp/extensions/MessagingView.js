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

export default ({ navigation }) => {

    var cachedMessage: Message;
    const [keys, setKeys] = useState('action;');
    const [values, setValues] = useState('testFullscreen;');
    const [eventName, setEventName] = useState('AnalyticsTrack');
    const [eventType, setEventType] = useState('com.adobe.eventType.generic.track');
    const [eventSource, setEventSource] = useState('com.adobe.eventSource.requestContent');    
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

    const setMessagingDelegate = () => {
        const messagingDelegate = {

            onShow(message: Message) {
                console.log(">>>> Onshow called");
            },

            onDismiss(message: Message) {
                console.log(">>>> Ondismiss called");
            },

            shouldShowMessage(message: Message) {
                console.log(">>>> shouldShowMessage called");
                if(message){
                    console.log(">>>> shouldShowMessage. caching the message.");
                    cachedMessage = message;
                    Messaging.saveMessage(message);
                }                
                return false;
            },

            urlLoaded(url: string) {
                console.log(">>>> urlLoaded");
            }
        };
        Messaging.setMessagingDelegate(messagingDelegate);
    };

    const showMessage = () => {
        console.log(">>>> showMessage1");
        if(cachedMessage){
            console.log(">>>> showMessage2");
            cachedMessage.show();
        } else {
            console.log(">>>> showMessage. Cached message is null");
        }        
    };

    const dismissMessage = () => {                
        console.log(">>>> dismissMessage1");
        if(cachedMessage){
            console.log(">>>> dismissMessage2");
            cachedMessage.dismiss();
        }        
    };

    const clearMessage = () => {        
        console.log(">>>> clearMessage1");
        if(cachedMessage){
            console.log(">>>> clearMessage2");
            cachedMessage.clearMessage();
        }
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
        <Text style={{...styles.welcome, marginTop: 30}}>Event Data</Text>                
        <TextInput style={styles.textinput} placeholder="Event name" placeholderTextColor="#8e8e8e" value={eventName} onChangeText={text => setEventName(text)}/>        
        <TextInput style={styles.textinput} placeholder="Event type" placeholderTextColor="#8e8e8e" value={eventType} onChangeText={text => setEventType(text)}/>        
        <TextInput style={styles.textinput} placeholder="Event source" placeholderTextColor="#8e8e8e" value={eventSource} onChangeText={text => setEventSource(text)}/>        
        <TextInput style={styles.textinput} placeholder="Colon(;) separated Event data keys" placeholderTextColor="#8e8e8e" value={keys} onChangeText={text => setKeys(text)}/>        
        <TextInput style={styles.textinput} placeholder="Colon(;) separated Event data values" placeholderTextColor="#8e8e8e" value={values} onChangeText={text => setValues(text)}/>        
        <Button title="Sent Event()" onPress={sentTrackingEvent}/>
        </ScrollView>
    </View>)
};