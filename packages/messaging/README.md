
# React Native AEPMessaging Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)

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
##### Configuring Edge and Launch  
To configure the Launch and Edge for the Messaging follow [Configure Ege and Launch](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/EdgeAndLaunchConfiguration.md#configuring-edge--launch)

##### **Push Notification Setup**  
Push notification has to be setup at the native side in you React native project. For push notification setup at the native side read the instructions
[iOS push notification setup](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns)  
[Android push notification setup](https://firebase.google.com/docs/cloud-messaging/android/client)

##### **Messaging SDK API usage**  
Messaging SDK API's has to be called from the native code of you React Native project.  
**iOS API usage**
[iOS API usage](https://github.com/adobe/aepsdk-messaging-ios/blob/main/Documentation/APIUsage.md)

**Android API usage**
[Android API usage](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/APIUsage.md)
[MessagingPushPayload](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/push/MessagingPushPayload.md#messagingpushpayload-usage) can be used for getting the notification attributes like title, body, action etc. for creating the push notification.
