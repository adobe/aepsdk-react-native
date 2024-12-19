# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## About this project

This repository is a monorepo and contains a collection of React Native modules for Adobe Experience Platform Mobile SDK as listed below. These modules can be found in the [packages](./packages) directory.

| Package Name | Latest Version | Native Extension | Testing Status |
| ---- | ---- | ---- | ---- |
| [@adobe/react-native-aepcore (required)](./packages/core) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) | [Mobile Core](https://developer.adobe.com/client-sdks/documentation/mobile-core) | Tested |
| [@adobe/react-native-aepuserprofile](./packages/userprofile) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)| [Profile](https://developer.adobe.com/client-sdks/documentation/profile) | Tested |
| [@adobe/react-native-aepedge](./packages/edge) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge) | [Edge](https://developer.adobe.com/client-sdks/documentation/edge-network) | Tested |
| [@adobe/react-native-aepedgeidentity](./packages/edgeidentity) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) | [EdgeIdentity](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network) | Tested |
| [@adobe/react-native-aepedgeconsent](./packages/edgeconsent) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) | [EdgeConsent](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network) | Tested |
| [@adobe/react-native-aepedgebridge](./packages/edgebridge) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge) | EdgeBridge | Tested |
| [@adobe/react-native-aepmessaging](./packages/messaging) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) | [Messaging](https://developer.adobe.com/client-sdks/documentation/iam/) | Tested |
| [@adobe/react-native-aepassurance](./packages/assurance) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) | [Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance-sdk) | Tested |
| [@adobe/react-native-aepoptimize](./packages/optimize) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepoptimize.svg)](https://www.npmjs.com/package/@adobe/react-native-aepoptimize) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepoptimize) | [Optimize](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer-decisioning) | Tested |
| [@adobe/react-native-aepplaces](./packages/places) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepplaces.svg)](https://www.npmjs.com/package/@adobe/react-native-aepplaces) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepplaces) | [Places](https://developer.adobe.com/client-sdks/documentation/places) | PR have raised and Places has been tested works fine |
| [@adobe/react-native-aeptarget](./packages/target) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aeptarget.svg)](https://www.npmjs.com/package/@adobe/react-native-aeptarget) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aeptarget) | [Target](https://developer.adobe.com/client-sdks/documentation/adobe-target) | Tested |
| [@adobe/react-native-aepcampaignclassic](./packages/campaignclassic) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcampaignclassic.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcampaignclassic)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) | [CampaignClassic](https://developer.adobe.com/client-sdks/documentation/adobe-campaign-classic) | Pending |

Let me know if any further adjustments are needed!

> [!NOTE]   
> Since version 5.0.0 of the Adobe React Native SDK, all React Native libraries that share the same major version are compatible with each other.

> [!NOTE]  
> The React Native libraries within this repository are specifically designed to support the Android and iOS platforms only.


## Requirements

- React Native

Requires React Native (0.60.0 and above)

- Xcode

To submit iOS apps to the App Store, you must build them using Xcode 15 or later, as required by [Apple](https://developer.apple.com/ios/submit/).

## iOS Privacy Manifest

> [!IMPORTANT]  
> Adobe Experience Platform React Native **6.x** libraries now depend on Experience Platform iOS 5.x SDKs, which have been updated to align with Apple's latest guidelines on [privacy manifest](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files). For further details on how Apple's privacy-related announcements affect the Adobe mobile SDK for iOS, please refer to this [document](https://developer.adobe.com/client-sdks/resources/privacy-manifest/).

## React Native New Architecture Support

React Native 0.7x introduced support for a new architecture. We don't yet support the new architecture.

## Expo Support

Please refer to the [Expo Integration](./docs/expo.md) document for guidance on integrating the SDK with Expo projects.

## Installation

You need to install Adobe Experience Platform Mobile SDK with [npm](https://www.npmjs.com/) packages and configure the native Android/iOS project in your React Native project.

> Note: If you are new to React Native, we suggest you follow the [React Native Getting Started](https://reactnative.dev) page before continuing.

### Install AEP npm packages

Adobe Experience Platform Mobile SDK packages can be installed from [npm](https://www.npmjs.com/) command.

> Note: `@adobe/react-native-aepcore` is required to be installed.

Install the `@adobe/react-native-aep{extension}` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aep{extension}
```

Alternatively, include the Adobe Experience Platform npm packages as dependencies in the app’s package.json.

The following code snippet shows for Mobile Core and Edge Network extensions as an example in package.json:

```bash
...
"dependencies": {
    "react-native": "0.72.5",
    "@adobe/react-native-aepcore": "^6.0.0", //core is required and includes aepcore, aepsignal, aeplifecycle, aepidentity libraries
    "@adobe/react-native-aepedge": "^6.0.0",
    "@adobe/react-native-aepedgeidentity": "^6.0.0",
    "@adobe/react-native-aepedgeconsent": "^6.0.0",
...
},
```

Inside of the app directory, run

```bash
#if using node package manager
npm install
```

or

```bash
#if using yarn package manager
yarn install
```

##### ios development

For iOS development, after installing the plugins from npm, download the pod dependencies by running the following command:

```bash
cd ios && pod install && cd ..
```

To update native dependencies to latest available versions, run the following command:

```bash
cd ios && pod update && cd ..
```

## Initializing

Initializing the SDK should be done in native code inside your `AppDelegate` (iOS) and `MainApplication` (Android). The following code snippets demonstrate how to install and register the AEP Mobile Core and Edge Network extensions. Documentation on how to initialize each extension can be found in _./packages/{extension}/README.md_.

##### **iOS**

```objective-c
//AppDelegate.h
@import AEPCore;
@import AEPServices;
@import AEPLifecycle;
@import AEPSignal;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
...
```

```objective-c
//AppDelegate.m
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];

  const UIApplicationState appState = application.applicationState;

  [AEPMobileCore registerExtensions: @[
      AEPMobileLifecycle.class,
      AEPMobileSignal.class,
      AEPMobileEdge.class,
      AEPMobileEdgeIdentity.class,
      AEPMobileEdgeConsent.class,
  ] completion:^{
    if (appState != UIApplicationStateBackground) {
       [AEPMobileCore lifecycleStart:nil}];
    }
  }];
  return YES;
}

@end

```

> To enable the Lifecycle metrics, [implement the Lifecycle APIs](./packages/core/README.md#lifecycle)

> Hint : While running iOS application after Adobe Experience Platform SDK installation. If you have build error that states:
> "ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'"
> This is because Adobe Experience Platform SDK now requires the app uses swift interfaces. Add a dummy .swift file to your project to embed the swift standard libs. See the SampleApp presented in this repo for example.

##### **Android:**

###### **Java:**

```java
//MainApplication.java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Extension;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.consent.Consent;
...
import android.app.Application;
```

```java
...
public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  public void on Create(){
    super.onCreate();
    ...
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.DEBUG);
    MobileCore.configureWithAppID("yourAppID");
    List<Class<? extends Extension>> extensions = Arrays.asList(
                Lifecycle.EXTENSION,
                Signal.EXTENSION,
                Edge.EXTENSION,
                com.adobe.marketing.mobile.edge.identity.Identity.EXTENSION,
                Consent.EXTENSION);
    MobileCore.registerExtensions(extensions, o -> {
      Log.d(LOG_TAG, "AEP Mobile SDK is initialized");
      MobileCore.lifecycleStart(null);
      //enable this for Lifecycle. See Note for collecting Lifecycle metrics.
    });
  }
}
```

###### **Kotlin:**

```kotlin
 // MainApplication.kt
import com.adobe.marketing.mobile.Edge
import com.adobe.marketing.mobile.Lifecycle
import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.MobileCore
import com.adobe.marketing.mobile.MobileCore.getApplication
import com.adobe.marketing.mobile.edge.consent.Consent
import com.adobe.marketing.mobile.edge.identity.Identity
```

```kotlin
// MainApplication.kt
 class MainApplication : Application(), ReactApplication {
   ...
 override fun onCreate() {
    super.onCreate()
    
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.DEBUG)
    MobileCore.configureWithAppID("YOUR-APP-ID");
    MobileCore.registerExtensions(
      listOf(
        Lifecycle.EXTENSION,
        Edge.EXTENSION,
        Identity.EXTENSION,
        Consent.EXTENSION
      ),
    ) {
      Log.d("MainApp", "Adobe Experience Platform Mobile SDK was initialized")
    }

    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }
```

```kotlin
// MainActivity.kt

import android.app.Activity
import android.app.Application.ActivityLifecycleCallbacks
import com.adobe.marketing.mobile.MobileCore

// Implementing global lifecycle callbacks
override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null)

    application.registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
        override fun onActivityResumed(activity: Activity) {
            MobileCore.setApplication(application)
            MobileCore.lifecycleStart(null)
        }

        override fun onActivityPaused(activity: Activity) {
            MobileCore.lifecyclePause()
        }

        // the following methods aren't needed for our lifecycle purposes, but are
        // required to be implemented by the ActivityLifecycleCallbacks object
        override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}
        override fun onActivityStarted(activity: Activity) {}
        override fun onActivityStopped(activity: Activity) {}
        override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
        override fun onActivityDestroyed(activity: Activity) {}
    })
  }
```

> For further details on Lifecycle implementation, please refer to the [Lifecycle API documentation](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#lifecycle).

## Migration guide

See [migration.md](./docs/migration.md) for guidance on migrating from ACP React Native libraries.

## Troubleshooting and Known issues

1. Getting error when building on iOS Xcode

```xcode
Use of '@import' when C++ modules are disabled, consider using -fmodules and -fcxx-modules
```
Refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/247#issuecomment-1642944117).

2. Getting error when building on iOS

```xcode
Underlying Objective-C module 'AEPRulesEngine' not found
```
Refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/263#issuecomment-1498393770).

## Contributing

Contributions are welcomed! See [CONTRIBUTING](CONTRIBUTING.md) and [development.md](./docs/development.md) guides for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
