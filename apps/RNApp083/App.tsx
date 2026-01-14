/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Messaging } from '@adobe/react-native-aepmessaging';
import { MobileCore } from '@adobe/react-native-aepcore';
import { Edge } from '@adobe/react-native-aepedge';
import { EdgeBridge } from '@adobe/react-native-aepedgebridge';
import { Consent } from '@adobe/react-native-aepedgeconsent';
import { Identity } from '@adobe/react-native-aepedgeidentity';
import { Optimize } from '@adobe/react-native-aepoptimize';
import { Places } from '@adobe/react-native-aepplaces';
import { Target } from '@adobe/react-native-aeptarget';
import { UserProfile } from '@adobe/react-native-aepuserprofile';
import { Assurance } from '@adobe/react-native-aepassurance';
import { CampaignClassic } from '@adobe/react-native-aepcampaignclassic';

const logAllExtensionVersions = async () => {
  console.log('=== Adobe Experience Platform SDK Versions ===');
  
  try {
    const coreVersion = await MobileCore.extensionVersion();
    console.log(`✅ Core: ${coreVersion}`);
  } catch (error) {
    console.log(`❌ Core: ${error}`);
  }

  try {
    const messagingVersion = await Messaging.extensionVersion();
    console.log(`✅ Messaging: ${messagingVersion}`);
  } catch (error) {
    console.log(`❌ Messaging: ${error}`);
  }

  try {
    const edgeVersion = await Edge.extensionVersion();
    console.log(`✅ Edge: ${edgeVersion}`);
  } catch (error) {
    console.log(`❌ Edge: ${error}`);
  }

  try {
    const edgeBridgeVersion = await EdgeBridge.extensionVersion();
    console.log(`✅ EdgeBridge: ${edgeBridgeVersion}`);
  } catch (error) {
    console.log(`❌ EdgeBridge: ${error}`);
  }

  try {
    const consentVersion = await Consent.extensionVersion();
    console.log(`✅ Consent: ${consentVersion}`);
  } catch (error) {
    console.log(`❌ Consent: ${error}`);
  }

  try {
    const edgeIdentityVersion = await Identity.extensionVersion();
    console.log(`✅ EdgeIdentity: ${edgeIdentityVersion}`);
  } catch (error) {
    console.log(`❌ EdgeIdentity: ${error}`);
  }

  try {
    const optimizeVersion = await Optimize.extensionVersion();
    console.log(`✅ Optimize: ${optimizeVersion}`);
  } catch (error) {
    console.log(`❌ Optimize: ${error}`);
  }

  try {
    const placesVersion = await Places.extensionVersion();
    console.log(`✅ Places: ${placesVersion}`);
  } catch (error) {
    console.log(`❌ Places: ${error}`);
  }

  try {
    const targetVersion = await Target.extensionVersion();
    console.log(`✅ Target: ${targetVersion}`);
  } catch (error) {
    console.log(`❌ Target: ${error}`);
  }

  try {
    const userProfileVersion = await UserProfile.extensionVersion();
    console.log(`✅ UserProfile: ${userProfileVersion}`);
  } catch (error) {
    console.log(`❌ UserProfile: ${error}`);
  }

  try {
    const assuranceVersion = await Assurance.extensionVersion();
    console.log(`✅ Assurance: ${assuranceVersion}`);
  } catch (error) {
    console.log(`❌ Assurance: ${error}`);
  }

  try {
    const campaignClassicVersion = await CampaignClassic.extensionVersion();
    console.log(`✅ CampaignClassic: ${campaignClassicVersion}`);
  } catch (error) {
    console.log(`❌ CampaignClassic: ${error}`);
  }

  console.log('==============================================');
};

function App() {
  React.useEffect(() => {
    logAllExtensionVersions();
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
