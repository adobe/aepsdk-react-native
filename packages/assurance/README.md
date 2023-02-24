# React Native Adobe Experience Platform Assurance Extension

[![npm version](https://img.shields.io/npm/v/@adobe/react-native-aepassurance/alpha?color=green&label=npm%20package)](https://www.npmjs.com/package/@adobe/react-native-aepassurance/v/3.0.0-alpha.1)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance/v/3.0.0-alpha.1)

`@adobe/react-native-aepassurance` is a wrapper around the iOS and Android [Adobe Experience Platform Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance) to allow for integration with React Native applications. Functionality to start Assurance session is provided through JavaScript documented below.

## Prerequisites

The Adobe Experience Platform Assurance extension has the following peer dependency, which must be installed prior to installing the identity extension:

- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepassurance` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepassurance
```

## Usage

### [Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance/tutorials)

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS

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

Android

```java
import com.adobe.marketing.mobile.Assurance;

public class MainApplication extends Application implements ReactApplication {

  @Override
  public void onCreate() {
    super.onCreate();

    MobileCore.setApplication(this);
    MobileCore.configureWithAppID("your-app-ID");
    List<Class<? extends Extension>> extensions = Arrays.asList(
                Lifecycle.EXTENSION,
                Assurance.EXTENSION);
    MobileCore.registerExtensions(extensions, o -> {
      Log.d(LOG_TAG, "Adobe Experience Platform Mobile SDK is initialized");
      MobileCore.lifecycleStart(null);
      //enable this for Lifecycle. See Note for collecting Lifecycle metrics.
    });
  }
}
```

To connect to a griffon session by scanning the QR code. Follow the [Android documentation](https://developer.android.com/training/app-links/deep-linking) on information about how to setup a deeplink.

##### Start Assurance session:

```typescript
import { Assurance } from "@adobe/react-native-aepassurance";
Assurance.startSession("{your-assurance-session-url}");
```
