import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';

import { useColorScheme } from '@/hooks/useColorScheme';
import { MobileCore } from '@adobe/react-native-aepcore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

MobileCore.initializeWithAppId("94f571f308d5/cbd0aa0847bc/launch-10aaa7").then(()=>{
  console.log("i am in the callback")
}).catch((error)=>{ 
  console.log("error", error)
})
export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer>
        <Drawer.Screen name="index" options={{ title: 'Home' }} />
        <Drawer.Screen name="CoreView" options={{ title: 'CoreView' }} />
        <Drawer.Screen name="AssuranceView" options={{ title: 'AssuranceView' }} />
        <Drawer.Screen name="ConsentView" options={{ title: 'ConsentView' }} />
        <Drawer.Screen name="EdgeBridgeView" options={{ title: 'EdgeBridgeView' }} />
        <Drawer.Screen name="EdgeView" options={{ title: 'EdgeView' }} />
        <Drawer.Screen name="EdgeIdentityView" options={{ title: 'EdgeIdentityView' }} />
        <Drawer.Screen name="IdentityView" options={{ title: 'IdentityView' }} />
        <Drawer.Screen name="MessagingView" options={{ title: 'MessagingView' }} />
        <Drawer.Screen name="OptimizeView" options={{ title: 'OptimizeView' }} />
        <Drawer.Screen name="PlacesView" options={{ title: 'PlacesView' }} />
        <Drawer.Screen name="ProfileView" options={{ title: 'ProfileView' }} />
        <Drawer.Screen name="TargetView" options={{ title: 'TargetView' }} />
      </Drawer>
    </ThemeProvider>
  );
}