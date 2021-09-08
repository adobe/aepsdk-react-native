
# React Native AEPMessaging Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)

`@adobe/react-native-aepmessaging` is a wrapper around the iOS and Android [AEPMessaging SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-journey-optimizer) to allow for integration with React Native applications.

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your React Native project. Before installing the Messaging extension it is recommended to begin by installing the peer dependencies [Core extension](../core/README.md), [Edge extension](../edge/README.md) and [EdgeIdentity extension](../edge/README.md).

## Usage

### [Messaging](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-journey-optimizer)

### Initialization  
Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).  

Example:  

iOS  
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPEdgeIdentity;
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];
  [AEPMobileCore registerExtensions: @[AEPMobileEdge.class, AEPMobileEdgeIdentity.class, AEPMobileMessaging.class] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];

  return YES;
}

@end
```

Android  
```java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.identity;
  
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
    MobileCore.setWrapperType(WrapperType.REACT_NATIVE);

    try {
      Edge.registerExtension();
      EdgeIdentity.registerExtension();
      Messaging.registerExtension();
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

### Importing the extension:

```javascript
import {AEPMessaging} from '@adobe/react-native-aepmessaging';
```

##### Getting the extension version:
```javascript
AEPMessaging.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPMessaging version: " + version));
```

## Configure Adobe Journey Optimizer 
To configure Adobe Journey optimizer Messaging in Launch follow steps in [Configure Adobe Journey optimizer](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-journey-optimizer#setup-adobe-journey-optimizer-extension)

## **Push Notification Setup**  
The configuration for handling push notifications has to be done in the native Android/iOS project of React Native app. For setting up push notification in the native project follow the instructions    
[iOS push notification setup](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns)  
[Android push notification setup](https://firebase.google.com/docs/cloud-messaging/android/client)

## **Messaging SDK API usage**  
Messaging SDK API's has to be called from the native Android/iOS project of React Native app.  

###### [iOS API usage](https://github.com/adobe/aepsdk-messaging-ios/blob/main/Documentation/APIUsage.md)  

##### [Android API usage](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/APIUsage.md)
In Android, [MessagingPushPayload](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/push/MessagingPushPayload.md#messagingpushpayload-usage) can be used for getting the notification attributes like title, body, action etc. for creating push notification.
