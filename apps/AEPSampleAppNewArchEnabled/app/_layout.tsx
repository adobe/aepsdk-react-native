import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CoreView from './CoreView';
import {Button, View} from 'react-native';
import {NavigationProps} from '../types/props';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


// function HomeScreen({navigation}: NavigationProps) {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Button
//         onPress={() => navigation.navigate('CoreView')}
//         title="Core/Lifecycle/Signal"
//       />
//       <Button
//         onPress={() => navigation.navigate('ProfileView')}
//         title="UserProfile"
//       />
//       <Button
//         onPress={() => navigation.navigate('IdentityView')}
//         title="Identity"
//       />

//       <Button
//         onPress={() => navigation.navigate('MessagingView')}
//         title="Messaging"
//       />

//       <Button
//         onPress={() => navigation.navigate('OptimizeView')}
//         title="Optimize"
//       />

//       <Button onPress={() => navigation.navigate('EdgeView')} title="Edge" />
//       <Button
//         onPress={() => navigation.navigate('EdgeIdentityView')}
//         title="EdgeIdentity"
//       />
//       <Button
//         onPress={() => navigation.navigate('ConsentView')}
//         title="Consent"
//       />
//        <Button
//         onPress={() => navigation.navigate('EdgeBridgeView')}
//         title="Edge Bridge"
//       />
//       <Button
//         onPress={() => navigation.navigate('AssuranceView')}
//         title="Assurance"
//       />
//       <Button
//         onPress={() => navigation.navigate('TargetView')}
//         title="Target"
//       />
//       <Button
//         onPress={() => navigation.navigate('PlacesView')}
//         title="Places"
//       />
//       <Button
//         onPress={() => navigation.navigate('CampaignClassicView')}
//         title="Campaign Classic"
//       />
//     </View>
//   );
// }

export default function RootLayout() {  
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Drawer>
      <Drawer.Screen name="Home" options={{ title: 'Home Screen' }} />
      <Drawer.Screen name="CoreView" options={{ title: 'Core/Lifecycle/Signal' }} />
      {/* <Drawer.Screen name="ProfileView" options={{ title: 'UserProfile' }} />
      <Drawer.Screen name="IdentityView" options={{ title: 'Identity' }} />
      <Drawer.Screen name="MessagingView" options={{ title: 'Messaging' }} />
      <Drawer.Screen name="OptimizeView" options={{ title: 'Optimize' }} />
      <Drawer.Screen name="EdgeView" options={{ title: 'Edge' }} />
      <Drawer.Screen name="EdgeIdentityView" options={{ title: 'EdgeIdentity' }} />
      <Drawer.Screen name="ConsentView" options={{ title: 'Consent' }} />
      <Drawer.Screen name="EdgeBridgeView" options={{ title: 'Edge Bridge' }} />
      <Drawer.Screen name="AssuranceView" options={{ title: 'Assurance' }} />
      <Drawer.Screen name="TargetView" options={{ title: 'Target' }} />
      <Drawer.Screen name="PlacesView" options={{ title: 'Places' }} />
      <Drawer.Screen name="CampaignClassicView" options={{ title: 'Campaign Classic' }} /> */}
    </Drawer>
  </ThemeProvider>
  );
}
