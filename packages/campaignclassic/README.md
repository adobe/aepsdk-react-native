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

### Initializing and registering the extension

Initialization of the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS

```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPCampaignClassic;

@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelTrace];
  [AEPMobileCore registerExtensions: @[ AEPCampaignClassic.class] completion:^{
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
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.CampaignClassic;

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
      CampaignClassic.registerExtension();
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

```typescript
import { CampaignClassic } from '@adobe/react-native-AEPCampaignClassic';
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
CampaignClassic.trackNotificationClickWithUserInfo({ _mId: 'testId', _dId: 'testId' });
```

### Tracking Notification Receive:

Dispatch event containing tracking notification from notification receive.

**Syntax**

```typescript
CampaignClassic.trackNotificationReceiveWithUserInfo(userInfo: Record<string, any>): void;
```

**Example**

```typescript
CampaignClassic.trackNotificationReceiveWithUserInfo({ _mId: 'testId', _dId: 'testId' });
```
