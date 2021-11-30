
# React Native AEP Assurance Extension

[![npm version](https://img.shields.io/npm/v/@adobe/react-native-aepassurance/alpha?color=green&label=npm%20package)](https://www.npmjs.com/package/@adobe/react-native-aepassurance/v/3.0.0-alpha.1)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance/v/3.0.0-alpha.1)

`@adobe/react-native-aepassurance` is a wrapper around the iOS and Android [AEPAssurance SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-experience-platform-assurance) to allow for integration with React Native applications. Functionality to start Assurance session is provided through JavaScript documented below.

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your react native project. Before installing the Assurance extension it is recommended to begin by installing the [Core extension](../core/README.md).

### Install npm package

> Requires `@adobe/react-native-aepcore` to be installed.

Install the `@adobe/react-native-aepassurance` alpha package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepassurance@3.0.0-alpha.2
```

For iOS development, after installing the plugins from npm, download the pod dependencies by running the following command:
`cd ios && pod install && cd ..`
To update native dependencies to latest available versions, run the following command:
`cd ios && pod update && cd ..`

### Link

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.

## Usage

### [Assurance](https://aep-sdks.gitbook.io/docs/beta/project-griffon/using-project-griffon)


##### Registering the extension with AEPCore:

Initialize the SDK via native code inside your AppDelegate and MainApplication in iOS and Android respectively.

###### **iOS**
```objective-c
@import AEPAssurance;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  [AEPMobileCore configureWithAppId:@"your-app-ID"];
  [AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileAssurance.class] completion:^{
          [AEPMobileCore lifecycleStart:nil];
  }];
  return YES;
}

```

To connect to a griffon session by scanning the QR code. Follow [Apple developer](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) documentation to set custom URL scheme for your application. Finally, implement the `openURL` delegate method and pass the deeplink URL to startSessionWithURL API.

```objective-c
-(BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  [AEPMobileAssurance startSessionWithUrl:url];
  return true;
}
```


###### **Android:**
```java
import com.adobe.marketing.mobile.Assurance;

public class MainApplication extends Application implements ReactApplication {

  @Override
  public void onCreate() {
    super.onCreate();

    MobileCore.setApplication(this);
    try {
        Identity.registerExtension();
        Lifecycle.registerExtension();
        Assurance.registerExtension();
        MobileCore.configureWithAppID("your-app-ID");
        MobileCore.start(null);
      } catch (InvalidInitException e) {
        // handle exception
      }
    }
}    
```

To connect to a griffon session by scanning the QR code. Follow the [Android documentation](https://developer.android.com/training/app-links/deep-linking) on information about how to setup a deeplink.

##### Start Assurance session:

```javascript
import {Assurance} from '@adobe/react-native-aepassurance';
Assurance.startSession("{your-assurance-session-url}");
```
