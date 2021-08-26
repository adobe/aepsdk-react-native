import React, {useState,Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
import {AEPAssurance} from '@adobe/react-native-aepassurance';

export default Assurance = ({ navigation }) => {
 const [version, setVersion] = useState('');
 const [sessionURL, setsessionURL] = useState('assurance://?adb_validation_sessionid=26bcb125-a6c2-445b-b57a-5442c16edc8c');

 AEPAssurance.extensionVersion().then(version => {
   setVersion(version)
 });

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Assurance v{version}</Text>
        <Button title="Start Session" onPress={startSessionClicked}/>
        <TextInput
          style={{height: 40, margin: 10}}
          placeholder="Paste your Assurance Session URL"
          onChangeText={(val) => setsessionURL(val)}
        />
        </ScrollView>
      </View>
  )

  function startSessionClicked() {
    AEPAssurance.startSession(sessionURL)
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    marginTop: 80,
  }
});
