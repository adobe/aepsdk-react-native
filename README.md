# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## About this project

This repository is a monorepo and contains a collection of React Native modules for Adobe Experience Platform Mobile SDK as listed below. These modules can be found in the [packages](./packages) directory.
| Package Name | Latest Version | Native Extension |
| ---- | ---- | ---- |
| [@adobe/react-native-aepcore (required)](./packages/core) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) | [Mobile Core](https://developer.adobe.com/client-sdks/documentation/mobile-core)
| [@adobe/react-native-aepuserprofile](./packages/userprofile) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)| [Profile](https://developer.adobe.com/client-sdks/documentation/profile)
| [@adobe/react-native-aepedge](./packages/edge) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge) | [Edge](https://developer.adobe.com/client-sdks/documentation/edge-network)
| [@adobe/react-native-aepedgeidentity](./packages/edgeidentity) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) |[EdgeIdentity](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network)
| [@adobe/react-native-aepedgeconsent](./packages/edgeconsent) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) | [EdgeConsent](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network)
| [@adobe/react-native-aepmessaging](./packages/messaging) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) | [Messaging](https://developer.adobe.com/client-sdks/documentation/iam/)
| [@adobe/react-native-aepassurance](./packages/assurance) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) | [Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance-sdk)
| [@adobe/react-native-aepoptimize](./packages/optimize) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepoptimize.svg)](https://www.npmjs.com/package/@adobe/react-native-aepoptimize) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepoptimize) | [Optimize](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer-decisioning)
| [@adobe/react-native-aepplaces](./packages/places) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepplaces.svg)](https://www.npmjs.com/package/@adobe/react-native-aepplaces) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepplaces) | [Places](https://developer.adobe.com/client-sdks/documentation/places)
| [@adobe/react-native-aeptarget](./packages/target) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aeptarget.svg)](https://www.npmjs.com/package/@adobe/react-native-aeptarget) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aeptarget) | [Target](https://developer.adobe.com/client-sdks/documentation/adobe-target)
| [@adobe/react-native-aepcampaignclassic](./packages/campaignclassic) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcampaignclassic.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcampaignclassic)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) |[CampaignClassic](https://developer.adobe.com/client-sdks/documentation/adobe-campaign-classic)

> Warning: Please always use the latest major versions of the above libraries to avoid incompatible issues.

## Requirements

Requires React Native >= v0.60.0

> React Native v0.60.0 and above supports [CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) which links the module while building the app.

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
    "react-native": "0.64.2",
    "@adobe/react-native-aepcore": "^2.0.0", //core is required and includes aepcore, aepsignal, aeplifecycle, aepidentity libraries
    "@adobe/react-native-aepedge": "^2.0.0",
    "@adobe/react-native-aepedgeidentity": "^2.0.0",
    "@adobe/react-native-aepedgeconsent": "^2.0.0",
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

###### **iOS**

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
  [AEPMobileCore registerExtensions: @[
      AEPMobileLifecycle.class,
      AEPMobileSignal.class,
      AEPMobileEdge.class,
      AEPMobileEdgeIdentity.class,
      AEPMobileEdgeConsent.class,
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
    //enable this for Lifecycle. See Note for collecting Lifecycle metrics.
  }
  ];

  return YES;
}

@end

```

> To enable the Lifecycle metrics, [implement the Lifecycle APIs](./packages/core/README.md#lifecycle)

> Hint : While running iOS application after Adobe Experience Platform SDK installation. If you have build error that states:
> "ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'"
> This is because Adobe Experience Platform SDK now requires the app uses swift interfaces. Add a dummy .swift file to your project to embed the swift standard libs. See the SampleApp presented in this repo for example.

###### **Android:**

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

> To enable the Lifecycle metrics, [implement the Lifecycle APIs](./packages/core/README.md#lifecycle)

## Migration guide

See [migration.md](./docs/migration.md) for guidance on migrating from ACP React Native libraries.

## Contributing

Contributions are welcomed! See [CONTRIBUTING](CONTRIBUTING.md) and [development.md](./docs/development.md) guides for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
