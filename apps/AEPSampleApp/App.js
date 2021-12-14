import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ProfileView from './extensions/ProfileView';
import MessagingView from './extensions/MessagingView';
import CoreView from './extensions/CoreView';
import IdentityView from './extensions/IdentityView';
import EdgeIdentity from './extensions/EdgeIdentity';
import ConsentView from './extensions/ConsentView';
import EdgeView from './extensions/EdgeView';
import Assurance from './extensions/Assurance';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        title="Messaging" />
      <Button
        onPress={() => navigation.navigate('EdgeView')}
        title="Edge"
      />
      <Button
        onPress={() => navigation.navigate('EdgeIdentity')}
        title="EdgeIdentity"
      />
      <Button
        onPress={() => navigation.navigate('ConsentView')}
        title="Consent"
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
        <Drawer.Screen name="CoreView" component={CoreView} />
        <Drawer.Screen name="ProfileView" component={ProfileView} />
        <Drawer.Screen name="IdentityView" component={IdentityView} />
        <Drawer.Screen name="MessagingView" component={MessagingView} />
<<<<<<< HEAD
        <Drawer.Screen name="Edge" component={Edge} />
=======
        <Drawer.Screen name="EdgeView" component={EdgeView} />
>>>>>>> 1e58375ea223f08ae3fa1ac7a2adb5768ce246a6
        <Drawer.Screen name="EdgeIdentity" component={EdgeIdentity} />
        <Drawer.Screen name="ConsentView" component={ConsentView} />
        <Drawer.Screen name="Assurance" component={Assurance} />
      </Drawer.Navigator >
    </NavigationContainer >
  );
}
