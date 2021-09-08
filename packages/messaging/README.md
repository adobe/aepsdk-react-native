
# React Native AEPMessaging Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)

`@adobe/react-native-aepmessaging` is a wrapper around the iOS and Android [AEPMessaging SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-journey-optimizer) to allow for integration with React Native applications.

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your React Native project. Before installing the Messaging extension it is recommended to begin by installing the peer dependencies [Core extension](../core/README.md), [Edge extension](../edge/README.md) and [EdgeIdentity extension](../edge/README.md).

## Usage

### [Messaging](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-journey-optimizer)

##### Importing the extension:

```javascript
import {AEPMessaging} from '@adobe/react-native-aepmessaging';
```
##### Registering the extension with AEPCore
Initialize the Messaging SDK via native code inside Appdelegate and MainApplication for iOS and Android respectively.

##### **iOS**
```objective-c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  [AEPMobileCore configureWithAppId:@"your-app-ID"];
  [AEPMobileCore registerExtensions: @[ AEPMobileMessaging.class ] completion:^{
          
  }];
  return YES;
```

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    MobileCore.registerExtensions([ Messaging.self ]) {
            MobileCore.configureWith(appId: "<appid>")            
        }    
```

##### **Android**
```java
Messaging.registerExtension();        
MobileCore.start(new AdobeCallback() {
    @Override
    public void call(Object o) {
        MobileCore.configureWithAppID("<appId>")                        
    }
});
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
