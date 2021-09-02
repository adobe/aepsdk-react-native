
# React Native AEP Identiity for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity)

## Usage

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://aep-sdks.gitbook.io/docs/getting-started/get-the-sdk#2-add-initialization-code). 

Example:
Objective-C
```objectivec
[AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileSignal.class, AEPMobileEdgeIdentity.class, AEPMobileEdge.class] completion:^{
          [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
```

JAVA
```java
  Identity.registerExtension();
```

```java
  Identity.registerExtension();
  Edge.registerExtension();
 //The syntax of registering Identity Edge Network extension with Core Identity extension in the same app
  com.adobe.marketing.mobile.edge.identity.Identity.registerExtension();
```

### [Identity for Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network)

#### Importing the extension:
```javascript
import {AEPIdentity} from '@adobe/react-native-aepedgeidentity';
```

#### Getting the extension version:

```javascript
AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdgeIdentity version: " + version));
```

