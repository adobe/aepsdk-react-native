# React Native AEP Target Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aeptarget.svg)](https://www.npmjs.com/package/@adobe/react-native-aeptarget)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aeptarget)](https://www.npmjs.com/package/@adobe/react-native-aeptarget)

`@adobe/react-native-aeptarget` is a wrapper around the iOS and Android [AEP Target SDK](https://developer.adobe.com/client-sdks/documentation/adobe-target) to allow integration with React Native applications.

## Peer Dependencies

The Adobe Experience Platform Target extension has the following peer dependency, which must be installed prior to installing the target extension:

- [Core](../core/README.md)
- [Edge](../edge/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aeptarget` package:

NPM:

```bash
npm install @adobe/react-native-aeptarget
```

Yarn:

```bash
yarn add @adobe/react-native-aeptarget
```

## Usage

### Initializing and registering the extension

Initialization of the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS

```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPTarget;

@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelTrace];
  [AEPMobileCore registerExtensions: @[AEPMobileEdge.class, AEPMobileTarget.class] completion:^{
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
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.Target;

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
      Edge.registerExtension();
      Target.registerExtension();
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
import {
  Target,
  TargetOrder,
  TargetParameters,
  TargetPrefetchObject,
  TargetProduct,
  TargetRequestObject
} from '@adobe/react-native-aeptarget';
```

## API Reference

### Getting the extension version:

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
const version = await Target.extensionVersion();
console.log('AdobeExperienceSDK: AEPTarget version: ' + version);
```

### Get custom visitor IDs:

**Syntax**
```typescript
getThirdPartyId(): Promise<string>
```

**Example**
```typescript
const id = await Target.getThirdPartyId();
console.log('AdobeExperienceSDK: Third Party ID: ' + id);
```

### Set custom visitor IDs:

**Syntax**
```typescript
setThirdPartyId(<id>): void
```

**Example**
```typescript
Target.setThirdPartyId('thirdPartyId');
```

### Reset user experience:

**Syntax**
```typescript
resetExperience(): void
```

**Example**
```typescript
Target.resetExperience();
```

### Get Target Session ID:

**Syntax**
```typescript
getSessionId(): Promise<string>
```

**Example**
```typescript
const id = await Target.getSessionId();
console.log('AdobeExperienceSDK: Session ID ' + id);
```

### Get Target user identifier:

**Syntax**
```typescript
getTntId(): Promise<string>
```

**Example**
```typescript
const id = await Target.getTntId();
console.log('AdobeExperienceSDK: TNT ID ' + id);
```

### Load Target requests:

**Syntax**
```typescript
retrieveLocationContent(Array<TargetRequestObject>, <TargetParameters>): void
```

**Example**
```typescript
var mboxParameters1 = { status: 'platinum' };
var mboxParameters2 = { userType: 'Paid' };
var purchaseIDs = ['34', '125'];

var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
var targetProduct = new TargetProduct('24D3412', 'Books');
var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
var request1 = new TargetRequestObject(
  'mboxName2',
  parameters1,
  'defaultContent1',
  (error, content) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Adobe content:' + content);
    }
  }
);

var parameters2 = new TargetParameters(
  mboxParameters1,
  { profileParameters: 'parameterValue' },
  targetProduct,
  targetOrder
);
var request2 = new TargetRequestObject(
  'mboxName2',
  parameters2,
  'defaultContent2',
  (error, content) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Adobe content:' + content);
    }
  }
);

var locationRequests = [request1, request2];
var profileParameters1 = { ageGroup: '20-32' };

var parameters = new TargetParameters(
  { parameters: 'parametervalue' },
  profileParameters1,
  targetProduct,
  targetOrder
);
Target.retrieveLocationContent(locationRequests, parameters);
```

### Using the prefetch APIs:

**Syntax**
```typescript
prefetchContent(Array<TargetPrefetchObject>, <TargetParameters>): Promise<any>
```

**Example**
```typescript
var mboxParameters1 = { status: 'platinum' };
var mboxParameters2 = { userType: 'Paid' };
var purchaseIDs = ['34', '125'];

var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
var targetProduct = new TargetProduct('24D3412', 'Books');
var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
var prefetch1 = new TargetPrefetchObject('mboxName2', parameters1);

var parameters2 = new TargetParameters(
  mboxParameters1,
  { profileParameters: 'parameterValue' },
  targetProduct,
  targetOrder
);
var prefetch2 = new TargetPrefetchObject('mboxName2', parameters2);

var prefetchList = [prefetch1, prefetch2];
var profileParameters1 = { ageGroup: '20-32' };

var parameters = new TargetParameters(
  { parameters: 'parametervalue' },
  profileParameters1,
  targetProduct,
  targetOrder
);
Target.prefetchContent(prefetchList, parameters)
  .then((success) => console.log(success))
  .catch((err) => console.log(err));
```

### Set Session ID

**Syntax**
```typescript
Target.setSessionId(<sessionId>): void
```

**Example**
```typescript
Target.setSessionId('sessionId');
```

### Set TNT ID

**Syntax**
```typescript
Target.setTntId(<tntId>): void
```

**Example**
```typescript
Target.setTntId('tntId');
```

### Set preview restart deep link:

**Syntax**
```typescript
setPreviewRestartDeeplink(<deeplink>): void;
```

**Example**
```typescript
Target.setPreviewRestartDeeplink('https://www.adobe.com');
```

### Send an mbox click notification:

**Syntax**
```typescript
clickedLocation(<locationName>, <TargetParameters>): void;
```

**Example**
```typescript
var purchaseIDs = ['34', '125'];

var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
var targetProduct = new TargetProduct('24D3412', 'Books');
var profileParameters1 = { ageGroup: '20-32' };
var parameters = new TargetParameters(
  { parameters: 'parametervalue' },
  profileParameters1,
  targetProduct,
  targetOrder
);

Target.clickedLocation('locationName', parameters);
```

### Send an mbox location displayed notification:

**Syntax**
```typescript
displayedLocations(Array<string>, <TargetParameters>): void;
```

**Example**
```typescript
var purchaseIDs = ['34', '125'];

var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
var targetProduct = new TargetProduct('24D3412', 'Books');
var profileParameters1 = { ageGroup: '20-32' };
var parameters = new TargetParameters(
  { parameters: 'parametervalue' },
  profileParameters1,
  targetProduct,
  targetOrder
);

Target.displayedLocations(['locationName', 'locationName1'], parameters);
```

### TargetPrefetchObject:

The Target extension exports a class `TargetPrefetchObject`.

```typescript
constructor(name?: string, targetParameters?: TargetParameters);
```

### TargetRequestObject:

The Target extension exports a class `TargetRequestObject`, which extends `TargetPrefetchObject`.

```typescript
constructor(name: string, targetParameters: TargetParameters, defaultContent: string);
```

### TargetOrder:

The Target extension exports a class `TargetOrder`.

```typescript
constructor(orderId: string, total?: number, purchasedProductIds: Array<string>);
```

### TargetProduct:

The Target extension exports a class `TargetOrder`.

```typescript
constructor(productId: string, categoryId: string);
```

### TargetParameters:

The Target extension exports a class `TargetParameters`.

```typescript
constructor(parameters?: Record<string, string>, profileParameters?: Record<string, string>, product?: TargetProduct, order?: TargetOrder);
```
