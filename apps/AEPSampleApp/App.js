import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './extensions/Profile';
import CoreView from './extensions/CoreView';
import IdentityView from './extensions/IdentityView';
import Messaging from './extensions/Messaging';
import EdgeIdentity from './extensions/EdgeIdentity';
import Edge from './extensions/Edge';
import Assurance from './extensions/Assurance';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Core')}
        title="Core/Lifecycle/Signal"
      />
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="UserProfile"
      />
      <Button
        onPress={() => navigation.navigate('Identity')}
        title="Identity"
      />
      <Button
        onPress={() => navigation.navigate('Messaging')}
        title="Messaging" />
      <Button
        onPress={() => navigation.navigate('Edge')}
        title="Edge"
      />
      <Button
        onPress={() => navigation.navigate('EdgeIdentity')}
        title="EdgeIdentity"
      />
      <Button
        onPress={() => navigation.navigate('Assurance')}
        title="Assurance"
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Core" component={CoreView} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Identity" component={IdentityView} />
        <Drawer.Screen name="Messaging" component={Messaging} />
        <Drawer.Screen name="EdgeIdentity" component={EdgeIdentity} />
        <Drawer.Screen name="Edge" component={Edge} />
        <Drawer.Screen name="Assurance" component={Assurance} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
