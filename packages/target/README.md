
# React Native AEP Target Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aeptarget.svg)](https://www.npmjs.com/package/@adobe/react-native-aeptarget) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aeptarget)](https://www.npmjs.com/package/@adobe/react-native-aeptarget)

`@adobe/react-native-aeptarget` is a wrapper around the iOS and Android [AEP Target SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-target) to allow for integration with React Native applications. Functionality to enable Adobe Target is provided entirely through JavaScript documented below.


## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your react native project. Before installing the Target extension it is recommended to begin by installing the [Core extension](https://www.npmjs.com/package/react-native-aep-mobile-core).

> Note: If you are new to React Native we suggest you follow the [React Native Getting Started](<https://facebook.github.io/react-native/docs/getting-started.html>) page before continuing.

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aeptarget` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aeptarget
```

## Usage

### [Target](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-target)

#### Importing the extension:
```javascript
import {Target} from '@adobe/react-native-aeptarget';
```

#### Getting the extension version:

```javascript
Target.extensionVersion().then(version => console.log("AdobeExperienceSDK: ACPTarget version: " + version));
```

#### Registering the extension with AEPCore:

> Note: It is recommended to initialize the SDK via native code inside your AppDelegate and MainApplication in iOS and Android respectively.

##### **iOS**
```objective-c
#import <RCTAEPTarget/AEPTarget.h>

[ACPTarget registerExtension];
```

##### **Android:**
```java
import com.adobe.marketing.mobile.Target;

Target.registerExtension();
```

#### Get custom visitor IDs:

```javascript
Target.getThirdPartyId().then(id => console.log("AdobeExperienceSDK: Third Party ID: " + id));
```

#### Set custom visitor IDs:

```javascript
Target.setThirdPartyId("thirdPartyId");
```

#### Reset user experience:

```javascript
Target.resetExperience();
```

#### Get Target user identifier:

```javascript
Target.getTntId().then(id => console.log("AdobeExperienceSDK: TNT ID " + id));
```

#### Load Target requests:

```javascript
var mboxParameters1 = {"status": "platinum"};
var mboxParameters2 = {"userType": "Paid"};
var purchaseIDs = ["34","125"];

var targetOrder = new TargetOrder("ADCKKIM", 344.30, purchaseIDs);
var targetProduct = new TargetProduct("24D3412", "Books");
var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
var request1 = new TargetRequestObject("mboxName2", parameters1, "defaultContent1", (error, content) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Adobe content:" + content);
  }
});

var parameters2 = new TargetParameters(mboxParameters1, {"profileParameters": "parameterValue"}, targetProduct, targetOrder);
var request2 = new TargetRequestObject("mboxName2", parameters2, "defaultContent2", (error, content) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Adobe content:" + content);
  }
});

var locationRequests = [request1, request2];
var profileParameters1 = {"ageGroup": "20-32"};

var parameters = new TargetParameters({"parameters": "parametervalue"}, profileParameters1, targetProduct, targetOrder);
Target.retrieveLocationContent(locationRequests, parameters);
```

#### Using the prefetch APIs:

```javascript
var mboxParameters1 = {"status": "platinum"};
var mboxParameters2 = {"userType": "Paid"};
var purchaseIDs = ["34","125"];

var targetOrder = new TargetOrder("ADCKKIM", 344.30, purchaseIDs);
var targetProduct = new TargetProduct("24D3412", "Books");
var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
var prefetch1 = new TargetPrefetchObject("mboxName2", parameters1);

var parameters2 = new TargetParameters(mboxParameters1, {"profileParameters": "parameterValue"}, targetProduct, targetOrder);
var prefetch2 = new TargetPrefetchObject("mboxName2", parameters2);

var prefetchList = [prefetch1, prefetch2];
var profileParameters1 = {"ageGroup": "20-32"};

var parameters = new TargetParameters({"parameters": "parametervalue"}, profileParameters1, targetProduct, targetOrder);
Target.prefetchContent(prefetchList, parameters).then(success => console.log(success)).catch(err => console.log(err));
```

#### Set preview restart deep link:

```javascript
Target.setPreviewRestartDeeplink("https://www.adobe.com");
```

#### Send an mbox click notification:

```javascript
var purchaseIDs = ["34","125"];

var targetOrder = new TargetOrder("ADCKKIM", 344.30, purchaseIDs);
var targetProduct = new TargetProduct("24D3412", "Books");
var profileParameters1 = {"ageGroup": "20-32"};
var parameters = new TargetParameters({"parameters": "parametervalue"}, profileParameters1, targetProduct, targetOrder);

Target.locationClickedWithName("locationName", parameters);
```

#### Send an mbox location displayed notification:
```javascript
var purchaseIDs = ["34","125"];

var targetOrder = new TargetOrder("ADCKKIM", 344.30, purchaseIDs);
var targetProduct = new TargetProduct("24D3412", "Books");
var profileParameters1 = {"ageGroup": "20-32"};
var parameters = new TargetParameters({"parameters": "parametervalue"}, profileParameters1, targetProduct, targetOrder);

Target.locationsDisplayed(["locationName", "locationName1"], parameters);
```

#### TargetPrefetchObject:
The Target extension exports a class `TargetPrefetchObject`.

```javascript
constructor(name?: string, targetParameters?: TargetParameters);
```


#### TargetRequestObject:
The Target extension exports a class `TargetRequestObject`, which extends `TargetPrefetchObject`.
```javascript
constructor(name: string, targetParameters: TargetParameters, defaultContent: string);
```

#### TargetOrder:
The Target extension exports a class `TargetOrder`.
```javascript
constructor(orderId: string, total?: number, purchasedProductIds: Array<string>);
```

#### TargetProduct:
The Target extension exports a class `TargetOrder`.
```javascript
constructor(productId: string, categoryId: string);
```

#### TargetParameters:
The Target extension exports a class `TargetParameters`.
```javascript
constructor(parameters?: {string: string}, profileParameters?: {string: string}, product?: TargetProduct, order?: TargetOrder);
```
