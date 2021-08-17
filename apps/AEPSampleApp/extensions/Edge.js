import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AEPEdge, AEPExperienceEvent} from '@adobe/react-native-aepedge';

export default Edge = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge</Text>
        <Button title="extensionVersion()" onPress={edgeExtensionVersion}/>
        <Button title="sendEvent()" onPress={sendEvent}/>
        </ScrollView>
      </View>
  )
}

function edgeExtensionVersion() {
  AEPEdge.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdge version: " + version));
}

function sendEvent() {
  var experienceEvent = new AEPExperienceEvent({"xdmdata": "xdmdataValue"}, {"data": "dataValue"}, {"query": "queryValue"}, {"datasetIdentifier": "datasetIdentifierValue"});
  AEPEdge.sendEvent(experienceEvent);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  }
});