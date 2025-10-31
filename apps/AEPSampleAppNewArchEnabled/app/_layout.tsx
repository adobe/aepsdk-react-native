import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';


import { useColorScheme } from '@/hooks/useColorScheme';
import { MobileCore , LogLevel} from '@adobe/react-native-aepcore';
import { Messaging } from '@adobe/react-native-aepmessaging';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();

  setTimeout(() => {
    SplashScreen.hideAsync();
  }, 3000);
  
  useEffect(() => {
    // If you need more customization, you can use the initOptions object and MobileCore.initialize() method.
  
    // const initOptions = {
    //   appId: "YOUR-APP-ID", //optional,
    //   lifecycleAutomaticTrackingEnabled: true, //optional
    //   lifecycleAdditionalContextData: { "contextDataKey": "contextDataValue" }, //optional
    //   appGroupIOS: "group.com.your.app.identifier" //optional, for iOS app groups
    // };
  
    // MobileCore.initialize(initOptions).then(() => {  
    //   console.log("AEP SDK Initialized");
    // }).catch((error) => { 
    //   console.log("AEP SDK Initialization error", error);            
    // });
  
    // Initialize SDK once in App.tsx or the entry file.
    // For functional components, use useEffect with an empty dependency array.
    // For class components, call initializeWithAppId inside componentDidMount.
    MobileCore.setLogLevel(LogLevel.DEBUG);
    MobileCore.initializeWithAppId("3149c49c3910/1724d170a674/launch-95e3b932cf04")
      .then(() => {
        console.log("AEP SDK Initialized", "3149c49c3910/1724d170a674/launch-95e3b932cf04");

        if (__DEV__) {
          MobileCore.updateConfiguration({"messaging.useSandbox": true});
        }

        // // Set up messaging delegate after SDK initialization
        // const unsubscribe = Messaging.setMessagingDelegate({
        //   onDismiss: (message) => {
        //     console.log('Message dismissed:', message);
        //   },
        //   onShow: (message) => {
        //     console.log('Message shown:', message);
        //   },
        //   shouldShowMessage: (message) => {
        //     console.log('Should show message:', message);
        //     return true; // Always show messages in sample app
        //   },
        //   shouldSaveMessage: (message) => {
        //     console.log('Should save message:', message);
        //     return true; // Always save messages in sample app
        //   },
        //   urlLoaded: (url, message) => {
        //     console.log('URL loaded:', url, 'for message:', message);
        //   },
        // });
        
        // console.log("Messaging delegate set up successfully");
        
        // Store unsubscribe function if needed for cleanup
        // You could return it from useEffect if you need to clean up on unmount
      })
      .catch((error) => {
        console.error("AEP SDK Initialization error:", error);
      });
      

  }, []);

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
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