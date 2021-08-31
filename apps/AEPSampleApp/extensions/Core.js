import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, ScrollView, NativeModules} from 'react-native';
import {AEPCore, AEPLifecycle, AEPSignal, AEPMobileLogLevel, AEPMobilePrivacyStatus, AEPMobileVisitorAuthenticationState, AEPVisitorID, AEPExtensionEvent} from '@adobe/react-native-aepcore';
import styles from '../styles/styles';

export default Core = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Core</Text>
        <Button title="extensionVersion()" onPress={coreExtensionVersion}/>
        <Button title="updateConfiguration" onPress={updateConfiguration}/>
        <Button title="setPrivacyStatus(OptIn)" onPress={setPrivacyOptIn}/>
        <Button title="getPrivacyStatus()" onPress={getPrivacyStatus}/>
        <Button title="log(...)" onPress={log}/>
        <Button title="setLogLevel(AEPMobileLogLevel.VERBOSE)" onPress={setLogLevel}/>
        <Button title="getLogLevel()" onPress={getLogLevel}/>
        <Button title="setPushIdentifier()" onPress={setPushIdentifier}/>
        <Button title="setAdvertisingIdentifier()" onPress={setAdvertisingIdentifier}/>
        <Button title="getSdkIdentities()" onPress={getSdkIdentities}/>
        <Button title="collectPii()" onPress={collectPii}/>
        <Button title="trackAction()" onPress={trackAction}/>
        <Button title="trackState()" onPress={trackState}/>
        <Button title="dispatchEvent()" onPress={dispatchEvent}/>
        <Button title="dispatchEventWithResponseCallback()" onPress={dispatchEventWithResponseCallback}/>
        <Text style={styles.welcome}>Lifecycle</Text>
        <Button title="AEPLifecycle::extensionVersion()" onPress={lifecycleExtensionVersion}/>
        <Text style={styles.welcome}>Signal</Text>
        <Button title="AEPSignal::extensionVersion()" onPress={signalExtensionVersion}/>
        
        </ScrollView>
      </View>
  )
}

function trackAction(){
  AEPCore.trackAction("action name", {"key": "value"});
}

function trackState(){
  AEPCore.trackState("state name", {"key": "value"});
}

function setPushIdentifier(){
  AEPCore.setPushIdentifier("xxx");
}

function collectPii() {
  AEPCore.collectPii({"myPii": "data"});
}

function dispatchEvent() {
  var event = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
  AEPCore.dispatchEvent(event);
}

function dispatchEventWithResponseCallback() {
  var event = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
  AEPCore.dispatchEventWithResponseCallback(event).then(responseEvent => console.log("AdobeExperienceSDK: responseEvent = " + responseEvent));
}

function setAdvertisingIdentifier() {
  AEPCore.setAdvertisingIdentifier("adID");
}
function getSdkIdentities() {
  AEPCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
}
function updateConfiguration(){
  AEPCore.updateConfiguration({"global.privacy":"optedout"});
}

function getLogLevel() {
  AEPCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
}

function setLogLevel() {
  AEPCore.setLogLevel(AEPMobileLogLevel.VERBOSE);
}

function lifecycleExtensionVersion() {
  AEPLifecycle.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPLifecycle version: " + version));
}

function identityExtensionVersion() {
  AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPIdentity version: " + version));
}

function signalExtensionVersion() {
  AEPSignal.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPSignal version: " + version));
}

function coreExtensionVersion() {
  AEPCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPCore version: " + version));
}

function setPrivacyOptIn() {
  AEPCore.setPrivacyStatus(AEPMobilePrivacyStatus.OPT_IN);
}

function getPrivacyStatus() {
  AEPCore.getPrivacyStatus().then(status => console.log("AdobeExperienceSDK: Privacy Status = " + status));
}
function log() {
  AEPCore.log(AEPMobileLogLevel.ERROR, "React Native Tag", "React Native Message");
}