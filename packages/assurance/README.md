
# React Native AEP Assurance Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)

`@adobe/react-native-aepassurance` is a wrapper around the iOS and Android [AEPAssurance SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-experience-platform-assurance) to allow for integration with React Native applications. Functionality to start Assurance session is provided through JavaScript documented below.

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your react native project. Before installing the Assurance extension it is recommended to begin by installing the [Core extension](../core/README.md).


## Usage

### [Assurance](https://aep-sdks.gitbook.io/docs/beta/project-griffon/using-project-griffon)

##### Importing the extension:
```javascript
import {AEPAssurance} from '@adobe/react-native-aepassurance';
```

##### Getting the extension version:

```javascript
AEPAssurance.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPAssurance version: " + version));
```

##### Registering the extension with AEPCore:

Initialize the SDK via native code inside your AppDelegate and MainApplication in iOS and Android respectively.

###### **iOS**
```objective-c
@import AEPAssurance;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  [AEPMobileCore configureWithAppId:@"your-appId"];
  [AEPMobileCore registerExtensions: @[AEPMobileIdentity.class, AEPMobileLifecycle.class, AEPMobileAssurance.class] completion:^{
          [AEPMobileCore lifecycleStart:nil];
  }];
  return YES;
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

##### Start Assurance session:

```javascript
import {AEPAssurance} from '@adobe/react-native-aepassurance';
AEPAssurance.startSession("{your-assurance-session-url}");
```
