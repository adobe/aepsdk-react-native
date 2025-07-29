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

import React from 'react';
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => router.push('/CoreView')} title="Core/Lifecycle/Signal" />
      <Button onPress={() => router.push('/ProfileView')} title="UserProfile" />
      <Button
        onPress={() => router.push('/IdentityView')}
        title="Identity"
      />
      <Button
        onPress={() => router.push('/MessagingView')}
        title="Messaging"
      />
      <Button
        onPress={() => router.push('/OptimizeView')}
        title="Optimize"
      />
      <Button onPress={() => router.push('/EdgeView')} title="Edge" />
      <Button onPress={() => router.push('/EdgeIdentityView')} title="EdgeIdentity" />
      <Button onPress={() => router.push('/ConsentView')} title="Consent" />
      <Button onPress={() => router.push('/ContentCardView')} title="Content Card & Container" />
      <Button onPress={() => router.push('/EdgeBridgeView')} title="Edge Bridge" />
      <Button onPress={() => router.push('/AssuranceView')} title="Assurance" />
      <Button
        onPress={() => router.push('/TargetView')}
        title="Target"
      />

      <Button
        onPress={() => router.push('/PlacesView')}
        title="Places"
      />

    </View>
  );
}
