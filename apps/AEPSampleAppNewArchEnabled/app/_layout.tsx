import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { MobileCore, LogLevel } from "@adobe/react-native-aepcore";
import { useEffect } from "react";
import { Messaging } from '@adobe/react-native-aepmessaging';

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
    MobileCore.setLogLevel(LogLevel.VERBOSE);

    const STAGING_APP_ID = "staging/1b50a869c4a2/bcd1a623883f/launch-e44d085fc760-development";
    const PRODUCTION_APP_ID = "3149c49c3910/473386a6e5b0/launch-6099493a8c97-development";

    const STAGING = true; // set to false for production

     if (STAGING) {
      // For staging: Initialize with staging app ID and set edge environment
      MobileCore.initializeWithAppId(STAGING_APP_ID)
        .then(() => {
          console.log("AEP SDK Initialized with Staging App ID");
          
          // Set edge environment to "int" AFTER initialization
          MobileCore.updateConfiguration({
            "edge.environment": "int"
          });
          console.log("Edge environment set to 'int'");
        })
        .catch((error: any) => {
          console.error("AEP SDK Initialization error:", error);
        });
    } else {
      // For production: Initialize with production app ID (no edge config needed)
      MobileCore.initializeWithAppId(PRODUCTION_APP_ID)
        .then(() => {
          console.log("AEP SDK Initialized with Production App ID");
        })
        .catch((error: any) => {
          console.error("AEP SDK Initialization error:", error);
        });
    }
  }, []);

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer>
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="CoreView" options={{ title: "CoreView" }} />
        <Drawer.Screen
          name="AssuranceView"
          options={{ title: "AssuranceView" }}
        />
        <Drawer.Screen name="ConsentView" options={{ title: "ConsentView" }} />
        <Drawer.Screen
          name="ContentCardsView"
          options={{ title: "ContentCardsView" }}
        />
        <Drawer.Screen
          name="EdgeBridgeView"
          options={{ title: "EdgeBridgeView" }}
        />
        <Drawer.Screen name="EdgeView" options={{ title: "EdgeView" }} />
        <Drawer.Screen
          name="EdgeIdentityView"
          options={{ title: "EdgeIdentityView" }}
        />
        <Drawer.Screen
          name="IdentityView"
          options={{ title: "IdentityView" }}
        />
        <Drawer.Screen
          name="MessagingView"
          options={{ title: "MessagingView" }}
        />
        <Drawer.Screen
          name="OptimizeView"
          options={{ title: "OptimizeView" }}
        />
        <Drawer.Screen name="PlacesView" options={{ title: "PlacesView" }} />
        <Drawer.Screen name="ProfileView" options={{ title: "ProfileView" }} />
        <Drawer.Screen name="TargetView" options={{ title: "TargetView" }} />
      </Drawer>
    </ThemeProvider>
  );
}