import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AEPIdentity, AEPMobileVisitorAuthenticationState} from '@adobe/react-native-aepcore';
import styles from '../styles/styles';

export default Identity = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>UserProfile</Text>
        <Button title="extensionVersion()" onPress={identityExtensionVersion}/>
        <Button title="syncIdentifiers()" onPress={syncIdentifiers}/>
        <Button title="syncIdentifiersWithAuthState()" onPress={syncIdentifiersWithAuthState}/>
        <Button title="syncIdentifier()" onPress={syncIdentifier}/>
        <Button title="appendVisitorInfoForURL()" onPress={appendVisitorInfoForURL}/>
        <Button title="getUrlVariables()" onPress={getUrlVariables}/>
        <Button title="getIdentifiers()" onPress={getIdentifiers}/>
        <Button title="getExperienceCloudId()" onPress={getExperienceCloudId}/>
        </ScrollView>
      </View>
  )
}

function identityExtensionVersion() {
  AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPIdentity version: " + version));
}
function syncIdentifiers() {
  AEPIdentity.syncIdentifiers({"id1": "identifier1"});
}

function syncIdentifiersWithAuthState() {
  AEPIdentity.syncIdentifiersWithAuthState({"id1": "identifier1"}, "AEP_VISITOR_AUTH_STATE_AUTHENTICATED");
}

function syncIdentifier() {
  AEPIdentity.syncIdentifier("idType", "ID", AEPMobileVisitorAuthenticationState.AUTHENTICATED);
}

function appendVisitorInfoForURL() {
  AEPIdentity.appendVisitorInfoForURL("test.com").then(urlWithVisitorData => console.log("AdobeExperienceSDK: VisitorData = " + urlWithVisitorData));
}

function getUrlVariables() {
  AEPIdentity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: UrlVariables = " + urlVariables));
}

function getIdentifiers() {
  AEPIdentity.getIdentifiers().then(identifiers => console.log("AdobeExperienceSDK: Identifiers = " + identifiers));
}

function getExperienceCloudId() {
  AEPIdentity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
}