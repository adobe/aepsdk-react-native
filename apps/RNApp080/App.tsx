/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Messaging, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

const messagingExtensionVersion = async () => {
  const version = await Messaging.extensionVersion();
  console.log(`AdobeExperienceSDK: Messaging version: ${version}`);
};

function App() {
  React.useEffect(() => {
    console.log("hwy ")
    messagingExtensionVersion();
    console.log("why")
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
