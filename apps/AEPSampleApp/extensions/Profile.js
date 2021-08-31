import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AEPUserProfile} from '@adobe/react-native-aepuserprofile';
import styles from '../styles/styles';

export default Profile = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>UserProfile</Text>
        <Button title="extensionVersion()" onPress={profileExtensionVersion}/>
        <Button title="updateUserAttributes()" onPress={updateUserAttributes}/>
        <Button title="removeUserAttributes()" onPress={removeUserAttributes}/>
        <Button title="getUserAttributes()" onPress={getUserAttributes}/>
        </ScrollView>
      </View>
  )
}

function profileExtensionVersion() {
  AEPUserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPUserProfile version: " + version));
}

function updateUserAttributes() {
  let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
  AEPUserProfile.updateUserAttributes(attrMap);
}

function removeUserAttributes() {
  AEPUserProfile.removeUserAttributes(["mapKey1"]);
}

function getUserAttributes(){
  AEPUserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: AEPUserProfile getUserAttributes: " +map));
}