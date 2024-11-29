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

import React,{useEffect} from 'react';
import { View, Button , NativeModules} from 'react-native';
import { useNavigation } from 'expo-router';

const logNativeModules = () => {
  try {
    if (!NativeModules) {
      console.error("NativeModules is not available.ss");
      return;
    }

    const moduleKeys = Object.keys(NativeModules);

    if (moduleKeys.length === 0) {
      console.log("No modules found in NativeModules.");
    } else {
      console.log("Listing all NativeModules available:");
      moduleKeys.forEach((moduleName) => {
        console.log(`Module: ${moduleName}`);
      });
      console.log("Finished listing NativeModules.");
    }
  } catch (error) {
    console.error("Error while accessing NativeModules:", error);
  }
};

export default function HomeScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    logNativeModules();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('CoreView')} title="Core/Lifecycle/Signal" />
     <Button onPress={() => navigation.navigate('ProfileView')} title="UserProfile" />
      <Button onPress={() => navigation.navigate('EdgeView')} title="Edge" />
      <Button onPress={() => navigation.navigate('EdgeIdentityView')} title="EdgeIdentity" />
      <Button onPress={() => navigation.navigate('ConsentView')} title="Consent" />
      <Button onPress={() => navigation.navigate('EdgeBridgeView')} title="Edge Bridge" />
      <Button onPress={() => navigation.navigate('AssuranceView')} title="Assurance" />
      <Button
        onPress={() => navigation.navigate('MessagingView')}
        title="Messaging"
      />
       <Button
        onPress={() => navigation.navigate('OptimizeView')}
        title="Optimize"
      />
         <Button
        onPress={() => navigation.navigate('IdentityView')}
        title="Identity"
      />

    </View>
  );
}
