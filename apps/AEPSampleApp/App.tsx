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
import {Button, View, Text, TextInput, ScrollView, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import OptimizeView from './extensions/OptimizeView';
import ProfileView from './extensions/ProfileView';
import MessagingView from './extensions/MessagingView';
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
import { MobileCore, LogLevel } from '@adobe/react-native-aepcore';
import { useState, useEffect, createContext, useContext } from 'react';

const DEFAULT_APP_ID = '3149c49c3910/7d2ab2dc04a6/launch-d8cf4c819bb7-development';

export const AppContext = createContext({
  appId: DEFAULT_APP_ID,
  initSDK: (_id: string) => {},
});

function HomeScreen({navigation}: NavigationProps) {
  const { appId, initSDK } = useContext(AppContext);
  const [inputAppId, setInputAppId] = useState(appId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

  const initSDK = (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setAppId(trimmed);
    MobileCore.setLogLevel(LogLevel.VERBOSE);
    MobileCore.initializeWithAppId(trimmed)
      .then(() => console.log('AEP SDK Initialized with:', trimmed))
      .catch((error) => console.error('AEP SDK Initialization error:', error));
  };

  useEffect(() => {
    initSDK(appId);
  }, []);

  return (
    <AppContext.Provider value={{ appId, initSDK }}>
      <NavigationContainer>
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
