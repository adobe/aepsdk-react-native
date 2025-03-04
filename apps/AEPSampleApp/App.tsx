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
import {Button, View} from 'react-native';
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
import { MobileCore } from '@adobe/react-native-aepcore';

function HomeScreen({navigation}: NavigationProps) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => navigation.navigate('CoreView')}
        title="Core/Lifecycle/Signal"
      />
      <Button
        onPress={() => navigation.navigate('ProfileView')}
        title="UserProfile"
      />
      <Button
        onPress={() => navigation.navigate('IdentityView')}
        title="Identity"
      />

      <Button
        onPress={() => navigation.navigate('MessagingView')}
        title="Messaging"
      />

      <Button
        onPress={() => navigation.navigate('OptimizeView')}
        title="Optimize"
      />

      <Button onPress={() => navigation.navigate('EdgeView')} title="Edge" />
      <Button
        onPress={() => navigation.navigate('EdgeIdentityView')}
        title="EdgeIdentity"
      />
      <Button
        onPress={() => navigation.navigate('ConsentView')}
        title="Consent"
      />
       <Button
        onPress={() => navigation.navigate('EdgeBridgeView')}
        title="Edge Bridge"
      />
      <Button
        onPress={() => navigation.navigate('AssuranceView')}
        title="Assurance"
      />
      <Button
        onPress={() => navigation.navigate('TargetView')}
        title="Target"
      />
      <Button
        onPress={() => navigation.navigate('PlacesView')}
        title="Places"
      />
      <Button
        onPress={() => navigation.navigate('CampaignClassicView')}
        title="Campaign Classic"
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {


// If you need more customization, you can use the initOptions object and MobileCore.initialize() method.

// const initOptions = {
//   appId: "YOUR-APP-ID", //optional,
//   lifecycleAutomaticTrackingEnabled: true, //optional
//   lifecycleAdditionalContextData: { "contextDataKey": "contextDataValue" }, //optional
// };

// MobileCore.initialize(initOptions).then(() => {  
//   console.log("AEP SDK Initialized");

// }).catch((error) => { 
//   console.log("AEP SDK Initialization error", error);            
// });

MobileCore.initializeWithAppId ("YOUR-APP-ID").then(() => {
  console.log("AEP SDK Initialized");
}).catch((error) => {  
  console.log("AEP SDK Initialization error", error);
 });

  
  return (
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
  );
}
