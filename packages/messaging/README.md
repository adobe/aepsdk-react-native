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

### Initializing with SDK:

To initialize the SDK, use the following methods:

- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

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

###### [iOS API usage](https://github.com/adobe/aepsdk-messaging-ios/blob/main/Documentation/sources/push-messaging/developer-documentation/api-usage.md)

##### [Android API usage](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/sources/api-usage.md)

In Android, [MessagingPushPayload](https://github.com/adobe/aepsdk-messaging-android/blob/main/Documentation/sources/push-notification/manual-handling-and-tracking.md) can be used for getting the notification attributes like title, body, and action. These are useful for push notification creation.

## In-app messages API reference

### refreshInAppMessages

Initiates a network call to retrieve remote in-app message definitions.

**Syntax**

```javascript
refreshInAppMessages();
```

**Example**

```javascript
Messaging.refreshInAppMessages();
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

Messaging.setMessagingDelegate(messagingDelegate);
```

**Example**

```javascript
const messagingDelegate = {
  shouldShowMessage(message: Message) {
    Messaging.saveMessage(message);
    return false;
  },
};
```

### updatePropositionsForSurfaces

Dispatches an event to fetch propositions for the provided surfaces from remote.

**Syntax**

```javascript
updatePropositionsForSurfaces(surfaces: string[])
```

**Example**

```javascript
Messaging.updatePropositionsForSurfaces(["mobileapp://my-surface"]);
```

### getPropositionsForSurfaces

Retrieves the previously fetched (and cached) feeds content from the SDK for the provided surfaces. If the feeds content for one or more surfaces isn't previously cached in the SDK, it will not be retrieved from Adobe Journey Optimizer via the Experience Edge network. This can be used in order to retrieve code based experiences, content
cards and other proposition types.

**Syntax**

```javascript
getPropositionsForSurfaces(surfaces: string[])
```

**Example**

```javascript
const propositions = Messaging.getPropositionsForSurfaces(["my-surface"]);
console.log(propositions);
```

Once propositions have been retrieved, their items will be typed to allow you to easily figure out what type they are using their schema property

```javascript
for (let item in proposition.items) {
  if (item.schema === PersonalizationSchema.CONTENT_CARD) {
    // Proposition Item is a content card, and will be fully typed
    console.log(item.data.content);
  }
}
```


### PropositionItem.track

A unified tracking API is available for any proposition item (Content Cards, HTML, JSON, code-based items). You can use the same track() method regardless of content type, making your code more consistent and maintainable.

#### Using PropositionItem.track (recommended)

**Syntax**

```javascript
// Track display event
propositionItem.track(MessagingEdgeEventType.DISPLAY);

// Track interaction with custom data + event + optional tokens
propositionItem.track(
  interaction /* string | null */, 
  MessagingEdgeEventType.INTERACT /* enum value */, 
  [/* tokens */] /* string[] | null */
);
```

When using `getPropositionsForSurfaces`, the returned objects are already `MessagingProposition` instances with typed items and convenient tracking via `PropositionItem.track(...)`.

```javascript
import { Messaging, MessagingProposition, MessagingEdgeEventType } from '@adobe/react-native-aepmessaging';

const SURFACES = ['mobileapp://my-surface'];
const messages = await Messaging.getPropositionsForSurfaces(SURFACES);

for (const surface of SURFACES) {
  const propositions = messages[surface] || [];
  for (const proposition of propositions) {
    for (const propositionItem of proposition.items) {
      // Track interaction with custom data
      propositionItem.track('content_card_clicked', MessagingEdgeEventType.INTERACT, null);
      // Track with tokens for sub-item tracking
      propositionItem.track('button_click', MessagingEdgeEventType.INTERACT, ['token-1', 'token-2']);
    }
  }
}
```

### getLatestMessage

Retrieves the most recently displayed message object

**Syntax**

```javascript
Messaging.getLatestMessage();
```

**Example**

```javascript
const message = Messaging.getLatestMessage();
console.log(message.id);
```

### getCachedMessages

Retrieves a list of all messages that have been cached in-memory

**Syntax**

```javascript
Messaging.getCachedMessages();
```

**Example**

```javascript
const messages = Messaging.getCachedMessages();
messages.forEach((message) => message.clear());
```

### setMessageSettings

Allows setting a global setting for `shouldSaveMessage` and `shouldShowMessage`. Use a messaging delegate defined in the `setMessagingDelegate` method for more fine-grained control of message settings

**Syntax**

```javascript
Messaging.setMessageSettings(shouldShowMessage: boolean, shouldSaveMessage: boolean)
```

**Example**

```javascript
Messaging.setMessageSettings(true, false);
```

## Handling In App Messages using Message Object

The `Message` object passed to the `MessagingDelegate` contains the following functions to handle a message:

### show

Signals to the `UIService` that the message should be shown.

**Syntax**

```javascript
show();
```

**Example**

```javascript
var message: Message;
message.show();
```

### dismiss

Signals to the `UIService` that the message should be dismissed.

**Syntax**

```javascript
dismiss(((suppressAutoTrack: ?boolean) = false))
```

**Example**

```javascript
var message: Message;
message.dismiss(true);
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
message.track("sample text", MessagingEdgeEventType.IN_APP_DISMISS);
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
message.setAutoTrack(true);
```

### clear

Clears the reference to the in-memory cached `Message` object. This function must be called if a message was saved by calling `Messaging.saveMessage` but no longer needed. Failure to call this function leads to memory leaks.

**Syntax**

```javascript
clear();
```

**Example**

```javascript
var message: Message;
message.clear();
```

### handleJavascriptMessage

Registers a javascript interface for the provided handler name to the WebView associated with the InAppMessage presentation to handle Javascript messages. When the registered handlers are executed via the HTML the result will be passed back to the associated handler.

**Syntax**

```typescript
handleJavascriptMessage(handlerName: string, handler: (content: string) => void);
```

**Example**

It can be used for the native handling of JavaScript events. Please refer to the [tutorial](./tutorials/In-App%20Messaging.md#native-handling-of-javascript-events) for more information.

## Programmatically control the display of in-app messages

App developers can now create a type `MessagingDelegate` in order to be alerted when specific events occur during the lifecycle of an in-app message.

Definition of type `MessagingDelegate` is:

```javascript
type MessagingDelegate = {
  onShow(message: Message): void,

  onDismiss(message: Message): void,

  shouldShowMessage(message: Message): boolean,

  urlLoaded(url: string, message: Message): void, // iOS Only

  onContentLoaded(message: Message): void, // Android Only
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

  onContentLoaded(message: Message) {
    // Action after message loads content
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

## Tracking interactions with content cards

### trackContentCardDisplay

Deprecated in 7.2.0: Use `Proposition.track(...)` instead. This API will be removed in a future release.

Tracks a Display interaction with the given ContentCard

**Syntax**

```javascript
Messaging.trackContentCardDisplay(proposition, contentCard);
```

### trackContentCardInteraction

Deprecated in 7.2.0: Use `Proposition.track(...)` instead. This API will be removed in a future release.

Tracks a Click interaction with the given ContentCard

**Syntax**

```javascript
Messaging.trackContentCardInteraction(proposition, contentCard);
```

## Tutorials
[Native handling of Javascript Events](./tutorials/In-App%20Messaging.md)
