
# React Native Adobe Experience Platform Edge Bridge extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)

`@adobe/react-native-aepedgebridge` is a wrapper around the iOS and Android Adobe Experience Platform Edge Bridge to allow for integration with React Native applications.

The Edge Bridge mobile extension provides seamless routing of data to the Adobe Experience Platform Edge Network for existing SDK implementations. For applications which already make use of the [MobileCore.trackAction](../core/README.md#trackaction) and/or [MobileCore.trackState](../core/README.md#trackstate) APIs to send data to Adobe Analytics, this extension will automatically route those API calls to the Edge Network, making the data available for mapping to a user's XDM schema using the [Data Prep for Data Collection](https://experienceleague.adobe.com/docs/experience-platform/data-prep/home.html).

> [!IMPORTANT]
> Edge Bridge serves primarily as a migration aid for applications that are already using Adobe Analytics within their implementation. 
>
> For new applications being developed with the Adobe Experience Platform Mobile SDKs, it is strongly recommended to use the [`Edge.sendEvent`](../edge/README.md#api-reference) API of the Edge Network extension.

## Prerequisites

The Edge Bridge extension has the following peer dependencies, which must be installed prior to installing the Edge Bridge extension:
- [Core](../core/README.md)
- [Edge Network](../edge/README.md)
- [Identity for Edge Network](../edgeidentity/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepedgebridge` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgebridge
```
## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension
In your React Native application, import the Edge Bridge extension as follows:
```typescript
import {EdgeBridge} from '@adobe/react-native-aepedgebridge';
```

### Edge Bridge tutorials

For tutorials on implementing Edge Bridge and Data Prep mapping, refer to the [Edge Bridge tutorials](https://github.com/adobe/aepsdk-edgebridge-ios/tree/main/Documentation/tutorials).

### Validation

Validating Edge Bridge events through Edge workflow using the [Event Transations](https://developer.adobe.com/client-sdks/edge/edge-network/validation/#use-the-event-transactions-view) view or [Analytics Events 2.0](https://experienceleague.adobe.com/en/docs/experience-platform/assurance/view/adobe-analytics-edge) view in Assurance.

## API reference
### extensionVersion
Returns the version of the client-side Edge Bridge extension.

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
EdgeBridge.extensionVersion().then(version => console.log("AdobeExperienceSDK: Edge Bridge version: " + version));
```
