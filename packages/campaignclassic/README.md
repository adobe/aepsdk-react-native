# React Native AEP Campaign Classic Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcampaignclassic.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcampaignclassic)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic)

`@adobe/react-native-aepcampaignclassic` is a wrapper around the iOS and Android [Adobe Experience Platform Campaign Classic Extension](https://developer.adobe.com/client-sdks/documentation/adobe-campaign-classic) to allow for integration with React Native applications.

## Peer Dependencies

The Adobe Experience Platform Campaign Classic extension has the following peer dependency, which must be installed prior to installing the optimize extension:

- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepcampaignclassic` package:

NPM:

```bash
npm install @adobe/react-native-aepcampaignclassic
```

Yarn:

```bash
yarn add @adobe/react-native-aepcampaignclassic
```

## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension:

```typescript
import { CampaignClassic } from "@adobe/react-native-aepcampaignclassic";
```

## API reference

### Getting the SDK version:

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
const version = await CampaignClassic.extensionVersion();
console.log(`AdobeExperienceSDK: Campaign Classic version: ${version}`);
```

### Register Device with Campaign Classic:

This API dispatches a Campaign request content event containing registration information (device token, user key, and additional parameters).
**Syntax**

```typescript
registerDeviceWithToken(
    token: string,
    userKey: string,
    additionalParameters?: Record<string, any>
): void
```

**Example**

```typescript
CampaignClassic.registerDeviceWithToken('myToken', 'myUserKey')
);
```

### Tracking Notification Click:

Dispatch event containing tracking notification from notification click.

**Syntax**

```typescript
trackNotificationClickWithUserInfo(userInfo: Record<string, any>): void
```

**Example**

```typescript
CampaignClassic.trackNotificationClickWithUserInfo({
  _mId: "testId",
  _dId: "testId",
});
```

### Tracking Notification Receive:

Dispatch event containing tracking notification from notification receive.

**Syntax**

```typescript
CampaignClassic.trackNotificationReceiveWithUserInfo(userInfo: Record<string, any>): void;
```

**Example**

```typescript
CampaignClassic.trackNotificationReceiveWithUserInfo({
  _mId: "testId",
  _dId: "testId",
});
```

### Handling a remote message (Android only):

Builds and displays an out-of-the-box Campaign Classic push notification from an FCM data payload, and sends the notification-receive tracking request. Resolves `true` if the extension handled the message. If it returns `true`, do not also call `trackNotificationReceiveWithUserInfo` or `trackNotificationClickWithUserInfo` for the same message. On iOS this is a no-op that resolves `false`.

This runs through the React Native bridge, so it only works while the JS runtime is running. It also needs `com.google.firebase:firebase-messaging` in your app (your app owns the Firebase setup; this package does not bundle it). Without it the promise rejects with a message saying so. On Android 13 and later the app needs the `POST_NOTIFICATIONS` permission to show the notification. For messages that arrive while the app is in the background or killed, call `AEPMessagingService.handleRemoteMessage(context, remoteMessage)` from your app's native `FirebaseMessagingService.onMessageReceived`. The `AEPPushTemplateBroadcastReceiver` and `CampaignPushTrackerActivity` classes are Android manifest components and have no JavaScript API.

**Syntax**

```typescript
CampaignClassic.handleRemoteMessage(data: Record<string, string>): Promise<boolean>;
```

**Example**

```typescript
const handled = await CampaignClassic.handleRemoteMessage(remoteMessage.data);
```
