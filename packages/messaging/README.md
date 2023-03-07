# React Native Adobe Experience Platform Messaging Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)

`@adobe/react-native-aepmessaging` is a wrapper around the iOS and Android [Adobe Journey Optimizer Messaging](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer) extension to allow for integration with React Native applications.

## Prerequisites

The messaging extension has the following peer dependenices, which must be installed prior to installing the messaging extension:

- [Core](../core/README.md)
- [Edge](../edge/README.md)
- [Edge Identity](../edgeidentity/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepmessaging` package:

NPM:

```bash
npm install @adobe/react-native-aepmessaging
```

Yarn:

```bash
yarn add @adobe/react-native-aepmessaging
```

## Usage

### [Messaging](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer)

### Installing and registering the extension with the AEP Mobile Core

### Initialization

Initializing the SDK should be done in native code, additional documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS

```objectivec
@import AEPCore;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPMessaging;

...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelTrace];
  [AEPMobileCore registerExtensions: @[AEPMobileEdgeIdentity.class, AEPMobileEdge.class, AEPMobileMessaging.class] completion:^{
    [AEPMobileCore configureWithAppId:@"yourAppID"];
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
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.identity.Identity;
import com.adobe.marketing.mobile.Messaging;

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
    MobileCore.configureWithAppID("yourAppID");
    List<Class<? extends Extension>> extensions = Arrays.asList(
                Edge.EXTENSION,
                Identity.EXTENSION,
                Messaging.EXTENSION);
    MobileCore.registerExtensions(extensions, o -> {
      MobileCore.lifecycleStart(null);
    });
  }
}
```

### Importing the extension:

```javascript
import {
  Messaging,
  MessagingDelegate,
  MessagingEdgeEventType,
  Message,
} from "@adobe/react-native-aepmessaging";
```

## API reference

### extensionVersion

Returns the version of the AEPMessaging extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
Messaging.extensionVersion().then((version) =>
  console.log("AdobeExperienceSDK: Messaging version: " + version)
);
```

## Configure Adobe Journey Optimizer

To configure Adobe Journey Optimizer Messaging in Launch follow the steps in [Configure Adobe Journey Optimizer](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer/#setup-adobe-journey-optimizer-extension)

## Push Notification Setup

Handling push notifications must be done in native (Android/iOS) code for the React Native app. To configure push notifications in the native project, follow the instructions provided for their respective platforms:

- [Apple - iOS push notification setup](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns)
- [Google - Android push notification setup](https://firebase.google.com/docs/cloud-messaging/android/client)

## Push Messaging APIs usage

The AEPMessaging extension's push messaging APIs must be called from the native Android/iOS project of React Native app.

###### [iOS API usage](https://github.com/adobe/aepsdk-messaging-ios/blob/main/Documentation/sources/usage.md)

##### [Android API usage](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/sources/api-usage.md)

In Android, [MessagingPushPayload](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/sources/messaging-push-payload.md#messagingpushpayload-usage) can be used for getting the notification attributes like title, body, and action. These are useful for push notification creation.

## In-app messages API reference

### refreshInAppMessages

Initiates a network call to retrieve remote in-app message definitions.

**Syntax**

```javascript
refreshInAppMessages()
```

**Example**

```javascript
Messaging.refreshInAppMessages()
```

### setMessagingDelegate

Sets a custom `MessagingDelegate` in AEPCore to listen for Message lifecycle events.

**Syntax**

```javascript
setMessagingDelegate(delegate: MessagingDelegate)
```

**Example**

```javascript
const messagingDelegate = {
  onShow(message: Message) {
    // Action after message is displayed.
  },

  onDismiss(message: Message) {
    // Action after message is dismissed.
  },

  shouldShowMessage(message: Message) {
    return true; //Return true to show the Message else return false
  },

  urlLoaded(url: string, message: Message) {
    // Action after message loads an URL
  },
};

Messaging.setMessagingDelegate(messagingDelegate)
```

### saveMessage

Natively caches the provided `Message` object in-memory. Cached `Message` objects can used at a later time to show the cached `Message` or perform other actions on the `Message` object. This function should be called from the `shouldShowMessage` function of the custom `MessagingDelegate`.

**Syntax**

```javascript
saveMessage(message: Message)
```

**Example**

```javascript
const messagingDelegate = {
  
  shouldShowMessage(message: Message) {
    Messaging.saveMessage(message)
    return false;
  },
  
};
```

## Handling In App Messages using Message Object

The `Message` object passed to the `MessagingDelegate` contains the following functions to handle a message:

### show

Signals to the `UIService` that the message should be shown.

**Syntax**

```javascript
show()
```

**Example**

```javascript
var message: Message
message.show()
```

### dismiss

Signals to the `UIService` that the message should be dismissed.

**Syntax**

```javascript
dismiss(((suppressAutoTrack: ?boolean) = false))
```

**Example**

```javascript
var message: Message
message.dismiss(true)
```

### track

Generates an Edge Event for the provided interaction and event type.

**Syntax**

```javascript
track(interaction: ?string, eventType: MessagingEdgeEventType)
```

**Example**

```javascript
var message: Message;
message.track("sample text", MessagingEdgeEventType.IN_APP_DISMISS)
```

### handleJavascriptMessage

Adds a handler for Javascript messages sent from the message's webview.

**Syntax**

```javascript
handleJavascriptMessage(name: string) : Promise<?any>
```

**Example**

```javascript
var message: Message;
message.handleJavascriptMessage("test").then((data) => {})
```

### setAutoTrack

Enables/Disables autotracking for message events.

**Syntax**

```javascript
setAutoTrack(autoTrack: boolean)
```

**Example**

```javascript
var message: Message;
message.setAutoTrack(true)
```

### clear

Clears the reference to the in-memory cached `Message` object. This function must be called if a message was saved by calling `Messaging.saveMessage` but no longer needed. Failure to call this function leads to memory leaks.

**Syntax**

```javascript
clear()
```

**Example**

```javascript
var message: Message
message.clear()
```

## Programatically control the display of in-app messages

App developers can now create a type `MessagingDelegate` in order to be alerted when specific events occur during the lifecycle of an in-app message.

Definition of type `MessagingDelegate` is:

```javascript
type MessagingDelegate = {
  onShow(message: Message): void,

  onDismiss(message: Message): void,

  shouldShowMessage(message: Message): boolean,

  urlLoaded(url: string, message: Message): void,
};
```

Objects of type `MessagingDelegate` can be created as shown below:

```javascript
const messagingDelegate = {
  onShow(message: Message) {
    // Action after message is displayed.
  },

  onDismiss(message: Message) {
    // Action after message is dismissed.
  },

  shouldShowMessage(message: Message) {
    return true; //Return true to show the Message else return false
  },

  urlLoaded(url: string, message: Message) {
    // Action after message loads an URL
  },
};
```

### Controlling when the message should be shown to the end user.

If a `MessagingDelegate` has been set, the delegate's `shouldShowMessage` function will be called prior to displaying an in-app message for which the end user has qualified. The developer is responsible for returning true if the message should be shown, or false if the message should be suppressed.

Below is an example of when the developer may choose to suppress an in-app message due to the status of some other workflow within the app:

```javascript
function shouldShowMessage(message: Message): boolean {
  if (someOtherWorkflowStatus == "inProgress") {
    return false;
  }

  return true;
}
```

Another option for the developer is to store a reference to the `Message` object, and call the `show` function on it at a later time. To use this functionality, app developers can call `Messaging.saveMessage(message)` from the `shouldShowMessage` of the `MessagingDelegate` for caching the Message on the native side of the RN AEPMessaging package.
Continuing with the above example, the developer has stored the message that was triggered initially, and chooses to show it upon completion of the other workflow:

```javascript
var cachedMessage: Message;

function otherWorkflowFinished() {
  anotherWorkflowStatus = "complete";
  cachedMessage.show();
}

function shouldShowMessage(message: Message): boolean {
  if (anotherWorkflowStatus === "inProgress") {
    // store the current message for later use
    Messaging.saveMessage(message);
    cachedMessage = message;
    return false;
  }

  return true;
}
```

**Important:** If the cached message is no longer needed after being used, free up the references to the `Message` object by calling `message.clearMessage()` to prevent memory leaks. In above example after displaying the in app message using cached message object if it is no longer needed then it should be cleared as shown below.

```javascript
function otherWorkflowFinished() {
  anotherWorkflowStatus = "complete";
  currentMessage.show();
  currentMessage.clearMessage();
}
```
