/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import * as React from 'react';
import {Button, View, Text, TextInput, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import OptimizeView from './extensions/OptimizeView';
import ProfileView from './extensions/ProfileView';
import MessagingView from './extensions/MessagingView';
import InboxView from './extensions/InboxView';
import CoreView from './extensions/CoreView';
import IdentityView from './extensions/IdentityView';
import ConsentView from './extensions/ConsentView';
import EdgeBridgeView from './extensions/EdgeBridgeView';
import EdgeView from './extensions/EdgeView';
import AssuranceView from './extensions/AssuranceView';
import EdgeIdentityView from './extensions/EdgeIdentityView';
import TargetView from './extensions/TargetView';
import PlacesView from './extensions/PlacesView';
import {NavigationProps} from './types/props';
import CampaignClassicView from './extensions/CampaignClassicView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileCore, LogLevel } from '@adobe/react-native-aepcore';
import { useState, useEffect, createContext, useContext } from 'react';

declare global {
  // RN 0.76+ — true when bridgeless/new-arch runtime is active
  // eslint-disable-next-line no-var
  var RN$Bridgeless: boolean | undefined;
}

const STORAGE_KEY = 'aep_app_id';

const DEFAULT_APP_ID = '3149c49c3910/0f12baf27522/launch-0d096c129660-development';

export const AppContext = createContext({
  appId: DEFAULT_APP_ID,
  initSDK: (_id: string) => {},
  rnArchLabel: 'checking…',
});

function getRnArchLabel(): string {
  return global.RN$Bridgeless === true
    ? 'bridgeless / new-arch runtime'
    : 'classic bridge (old arch)';
}

function HomeScreen({navigation}: NavigationProps) {
  const { appId, initSDK, rnArchLabel } = useContext(AppContext);
  const [inputAppId, setInputAppId] = useState(appId);

  // Sync input when persisted appId is loaded on startup.
  useEffect(() => { setInputAppId(DEFAULT_APP_ID); }, [DEFAULT_APP_ID]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.archLabel}>RN runtime: {rnArchLabel}</Text>
      <Text style={styles.label}>App ID</Text>
      <TextInput
        style={styles.input}
        value={inputAppId}
        onChangeText={setInputAppId}
        placeholder="Enter App ID"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.currentId} numberOfLines={2}>Active: {appId}</Text>
      <Button title="Initialize SDK" onPress={() => initSDK(inputAppId)} />

      <View style={styles.divider} />

      <Button onPress={() => navigation.navigate('CoreView')} title="Core/Lifecycle/Signal" />
      <Button onPress={() => navigation.navigate('ProfileView')} title="UserProfile" />
      <Button onPress={() => navigation.navigate('IdentityView')} title="Identity" />
      <Button onPress={() => navigation.navigate('MessagingView')} title="Messaging" />
      <Button onPress={() => navigation.navigate('InboxView')} title="Message Inbox" />
      <Button onPress={() => navigation.navigate('OptimizeView')} title="Optimize" />
      <Button onPress={() => navigation.navigate('EdgeView')} title="Edge" />
      <Button onPress={() => navigation.navigate('EdgeIdentityView')} title="EdgeIdentity" />
      <Button onPress={() => navigation.navigate('ConsentView')} title="Consent" />
      <Button onPress={() => navigation.navigate('EdgeBridgeView')} title="Edge Bridge" />
      <Button onPress={() => navigation.navigate('AssuranceView')} title="Assurance" />
      <Button onPress={() => navigation.navigate('TargetView')} title="Target" />
      <Button onPress={() => navigation.navigate('PlacesView')} title="Places" />
      <Button onPress={() => navigation.navigate('CampaignClassicView')} title="Campaign Classic" />
    </ScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [appId, setAppId] = useState(DEFAULT_APP_ID);
  const [rnArchLabel, setRnArchLabel] = useState(getRnArchLabel());

  const initSDK = (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setAppId(trimmed);
    AsyncStorage.setItem(STORAGE_KEY, trimmed);
    MobileCore.setLogLevel(LogLevel.VERBOSE);
    MobileCore.initializeWithAppId(trimmed)
      .then(() => console.log('AEP SDK Initialized with:', trimmed))
      .catch((error) => console.error('AEP SDK Initialization error:', error));
  };

  useEffect(() => {
    const bridgeless = global.RN$Bridgeless;
    const label = getRnArchLabel();
    setRnArchLabel(label);
    console.log('[BareSampleApp] Bridgeless:', bridgeless);
    console.log('[BareSampleApp] RN arch hint:', label);

    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      initSDK(stored ?? DEFAULT_APP_ID);
    });
  }, []);

  return (
    <AppContext.Provider value={{ appId, initSDK, rnArchLabel }}>
      <NavigationContainer theme={useColorScheme() === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="CoreView" component={CoreView} />
          <Drawer.Screen name="AssuranceView" component={AssuranceView} />
          <Drawer.Screen name="CampaignClassicView" component={CampaignClassicView} />
          <Drawer.Screen name="ConsentView" component={ConsentView} />
          <Drawer.Screen name="EdgeBridgeView" component={EdgeBridgeView} />
          <Drawer.Screen name="EdgeView" component={EdgeView} />
          <Drawer.Screen name="EdgeIdentityView" component={EdgeIdentityView} />
          <Drawer.Screen name="IdentityView" component={IdentityView} />
          <Drawer.Screen name="MessagingView" component={MessagingView} />
          <Drawer.Screen name="InboxView" component={InboxView} />
          <Drawer.Screen name="OptimizeView" component={OptimizeView} />
          <Drawer.Screen name="PlacesView" component={PlacesView} />
          <Drawer.Screen name="ProfileView" component={ProfileView} />
          <Drawer.Screen name="TargetView" component={TargetView} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = {
  container: {
    alignItems: 'center' as const,
    padding: 16,
  },
  archLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#0a6',
    marginBottom: 12,
    alignSelf: 'flex-start' as const,
  },
  label: {
    alignSelf: 'flex-start' as const,
    fontWeight: '600' as const,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    width: '100%' as const,
    fontSize: 13,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  currentId: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
    alignSelf: 'flex-start' as const,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%' as const,
    marginVertical: 12,
  },
};
