import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './extensions/Profile';
import Core from './extensions/Core';
import Identity from './extensions/Identity';

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
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Core" component={Core} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Identity" component={Identity} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}