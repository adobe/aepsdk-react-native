# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## BETA ACKNOWLEDGEMENT

The React Native modules contained in this repository are currently in Beta. Use of this code is by invitation only and not otherwise supported by Adobe. Please contact your Adobe Customer Success Manager to learn more.

By using the Beta, you hereby acknowledge that the Beta is provided "as is" without warranty of any kind. Adobe shall have no obligation to maintain, correct, update, change, modify or otherwise support the Beta. You are advised to use caution and not to rely in any way on the correct functioning or performance of such Beta and/or accompanying materials.

## About this project

This repository is a monorepo. It contains a collection of Adobe Experience Platform Mobile SDK React Native modules listed below. These modules can be found in the [packages](./packages) directory.
| Package Name | Latest Version |
| ---- | ---- |
|  [@adobe/react-native-aepcore (required)](./packages/core)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) |
|  [@adobe/react-native-aepuserprofile](./packages/userprofile)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)   
|  [@adobe/react-native-aepedge](./packages/edge)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge) |
|  [@adobe/react-native-aepedgeidentity](./packages/edgeidentity)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) |
|  [@adobe/react-native-aepedgeconsent](./packages/edgeconsent)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) |
|  [@adobe/react-native-aepmessaging](./packages/messaging)  |  [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)  |
|  [@adobe/react-native-aepassurance](./packages/assurance)    |  [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)  |

`@adobe/react-native-aep{extension}` is a wrapper around the iOS and Android [AEP SDK](https://aep-sdks.gitbook.io/docs/) to allow for integration with React Native applications.

> Note: @adobe/react-native-aepassurance <=2.0 is not compatible with  @adobe/react-native-aepcore. Please use @adobe/react-native-aepassurance [3.x alpha versions or above](./packages/assurance#install-npm-package)

## Requirements

- React Native >= v0.60.0

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your React Native project.

> Note: If you are new to React Native, we suggest you follow the [React Native Getting Started](<https://reactnative.dev>) page before continuing.

### Install npm package

> Requires `@adobe/react-native-aepcore` to be installed.

Install the `@adobe/react-native-aep{extension}` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aep{extension}
```

For iOS development, after installing the plugins from npm, download the pod dependencies by running the following command:
`cd ios && pod install && cd ..`
To update native dependencies to latest available versions, run the following command:
`cd ios && pod update && cd ..`

### Link

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.

### Initializing

Initializing the SDK should be done in native code inside your `AppDelegate` (iOS) and `MainApplication` (Android). The following code snippets demonstrate how to import and register the Mobile Core, Identity, Lifecycle, Signal, and Profile extensions. For other extensions, the documentation on how to initialize the extension can be found in `./packages/{extension}/README.md`

###### **iOS**
```objective-c
@import AEPCore;
@import AEPServices;
@import AEPSignal;
@import AEPLifecycle;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
//@import AEPMessaging;
//@import AEPUserProfile;
//@import AEPAssurance;
//@import AEPIdentity;
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
      //AEPMobileIdentity.class,
      //AEPMobileUserProfile.class,
      //AEPMobileMessaging.class,
      //AEPMobileAssurance.class,
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];

  return YES;
}

@end

```

> Note : While running iOS application after AEPSDK installation. If you have build error that states:
>  "ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'"
> This is because AEPSDK now requires the app uses swift interfaces. Add a dummy .swift file to your project to embed the swift standard libs. See the SampleApp presented in this repo for example.

###### **Android:**
```java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.consent.Consent;
//import com.adobe.marketing.mobile.Messaging;
//import com.adobe.marketing.mobile.UserProfile;
//import com.adobe.marketing.mobile.Assurance;
...
import android.app.Application;
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
          Lifecycle.registerExtension();
          Signal.registerExtension();
          com.adobe.marketing.mobile.edge.identity.Identity.registerExtension();
          Edge.registerExtension();
          Consent.registerExtension();
          //Messaging.registerExtension();
          //Assurance.registerExtension();
          //UserProfile.registerExtension();
          //com.adobe.marketing.mobile.Identity.registerExtension();
      MobileCore.configureWithAppID("yourAppID");
      MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
          MobileCore.lifecycleStart(null);
        }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}   
```


## Development

See [development.md](./docs/development.md) for development docs.


## Contributing
See [CONTRIBUTING](CONTRIBUTING.md)

## License
See [LICENSE](LICENSE)
