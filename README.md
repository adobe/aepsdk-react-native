# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## About this project

This repository is a monorepo and contains a collection of React Native modules for Adobe Experience Platform Mobile SDK as listed below. These modules can be found in the [packages](./packages) directory.
| Package Name | Latest Version |
| ---- | ---- |
|  [@adobe/react-native-aepcore (required)](./packages/core)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) |
|  [@adobe/react-native-aepuserprofile](./packages/userprofile)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)   
|  [@adobe/react-native-aepedge](./packages/edge)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge) |
|  [@adobe/react-native-aepedgeidentity](./packages/edgeidentity)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) |
|  [@adobe/react-native-aepedgeconsent](./packages/edgeconsent)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) |
|  [@adobe/react-native-aepmessaging](./packages/messaging)  |  [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)  |
|  [@adobe/react-native-aepassurance](./packages/assurance)    |  [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)  |

> Note: @adobe/react-native-aepassurance <=2.0 is not compatible with  @adobe/react-native-aepcore. Please use @adobe/react-native-aepassurance [3.x or above](./packages/assurance#install-npm-package).

## Requirements

Requires React Native >= v0.60.0

> React Native v0.60.0 and above supports [CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.

## Installation

You need to install Adobe Experience Platform Mobile SDK with [npm](#install-npm-package) command or as [dependencies in package.json](#install-as-dependencies-in-packagejson), and configure the native Android/iOS project in your React Native project.

> Note: If you are new to React Native, we suggest you follow the [React Native Getting Started](<https://reactnative.dev>) page before continuing.

### Install npm package
Adobe Experience Platform Mobile SDK packages can be installed from [npm](https://www.npmjs.com/) command.

> Note: `@adobe/react-native-aepcore` is required to be installed.

Install the `@adobe/react-native-aep{extension}` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aep{extension}
```

See [note](#ios-development) for iOS development.

### Install as dependencies in package.json
Adobe Experience Platform Mobile SDK packages can be installed with app's package.json.

Include the react native packages in the dependencies of an app's package.json.
> Note: `@adobe/react-native-aepcore` is required.

The following code snippet shows an example of adding libraries in package.json, only include the libraries you need for the app.

```bash
...
"dependencies": {
    "react-native": "0.64.2",
    "@adobe/react-native-aepcore": "^1.0.0", //includes aepcore, aepsignal, aeplifecycle, aepidentity libraries
    "@adobe/react-native-aepedge": "^1.0.0", //or replace  with the latest extension version
    "@adobe/react-native-aepedgeidentity": "^1.0.0", //or replace  with the latest extension version
    "@adobe/react-native-aepedgeconsent": "^1.0.0", //or replace  with the latest extension version
    "@adobe/react-native-aepuserprofile": "^1.0.0", //or replace  with the latest extension version
    "@adobe/react-native-aepassurance": "^3.0.0", //or replace  with the latest extension 
    "@adobe/react-native-aepmessaging": "^1.0.0-beta.1", //or replace  with the latest extension version
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

Initializing the SDK should be done in native code inside your `AppDelegate` (iOS) and `MainApplication` (Android). The following code snippets demonstrate how to `import` and `register` the Mobile Core, Signal, Lifecycle, Edge Network, EdgeIdentity and EdgeConsent extensions. For documentation on how to initialize each extension can be found in ./packages/{extension}/README.md

###### **iOS**
```objective-c
//AppDelegate.h
// must import AEPCore
@import AEPCore;
@import AEPServices;
@import AEPSignal;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
@import AEPLifecycle; 
//@import AEPMessaging; //enable this extension if you installed @adobe/react-native-aepmessaging
//@import AEPUserProfile; //enable this extension for store user profile attributes
//@import AEPAssurance;  //enable this extension for inspecting and validating the app
//@import AEPIdentity; //enable for Adobe solution Identity extension 
...
```
```objective-c
//AppDelegate.m
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];
  [AEPMobileCore registerExtensions: @[
      AEPMobileLifecycle.class,
      AEPMobileSignal.class,
      AEPMobileEdge.class,
      AEPMobileEdgeIdentity.class,
      AEPMobileEdgeConsent.class,
      //AEPMobileMessaging.class, //enable this extension for using messaging functionalities
      //AEPMobileUserProfile.class, //enable this extension for store user profile attributes
      //AEPMobileAssurance.class, //enable this extension for inspecting and validating the app
      //AEPMobileIdentity.class, //enable for Adobe solution Identity extension 
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}]; 
    //enable this for Lifecycle. See Note for getting Lifecycle metrics.
  }
  ];

  return YES;
}

@end

```
> Note: For getting Lifecycle metrics, enable Lifecycle with [native platforms code](https://github.com/cacheung/aepsdk-react-native/tree/readme/packages/core#lifecycle)

> Hint : While running iOS application after Adobe Experience Platform SDK installation. If you have build error that states:
>  "ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'"
> This is because Adobe Experience Platform SDK now requires the app uses swift interfaces. Add a dummy .swift file to your project to embed the swift standard libs. See the SampleApp presented in this repo for example.

###### **Android:**
```java
//MainApplication.java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.consent.Consent;
//import com.adobe.marketing.mobile.Messaging; //enable this extension if you installed @adobe/react-native-aepmessaging
//import com.adobe.marketing.mobile.UserProfile; //enable this extension for store user profile attributes
//import com.adobe.marketing.mobile.Assurance; //enable this extension for inspecting and validating the app
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
   try {
          Signal.registerExtension();
          Lifecycle.registerExtension();
          Edge.registerExtension();
          com.adobe.marketing.mobile.edge.identity.Identity.registerExtension();
          Consent.registerExtension();
          //Messaging.registerExtension(); //enable this extension for using messaging functionalities
          //UserProfile.registerExtension(); //enable this extension for store user profile attributes
          //Assurance.registerExtension(); //enable this extension for inspecting and validating the app
          //com.adobe.marketing.mobile.Identity.registerExtension(); //enable for Adobe solution Identity extension 

      MobileCore.configureWithAppID("yourAppID");
      MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
          MobileCore.lifecycleStart(null);
          //enable this for Lifecycle. See Note for getting Lifecycle metrics.
        }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}   
```
> Note: For getting Lifecycle metrics, enable Lifecycle with [native platforms code](https://github.com/cacheung/aepsdk-react-native/tree/readme/packages/core#lifecycle)

## Migration guide

See [migration.md](./docs/migration.md) for guidance on migrating from ACP React Native libraries.

## Contributing
Contributions  are welcomed! See [CONTRIBUTING](CONTRIBUTING.md) and [development.md](./docs/development.md) guides  for more information.

## Licensing
This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
