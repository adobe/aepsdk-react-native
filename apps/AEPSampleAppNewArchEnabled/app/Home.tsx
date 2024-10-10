import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('CoreView')} title="Core/Lifecycle/Signal" />
      {/* <Button onPress={() => navigation.navigate('ProfileView')} title="UserProfile" />
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
      <Button onPress={() => navigation.navigate('CampaignClassicView')} title="Campaign Classic" /> */}
    </View>
  );
}
