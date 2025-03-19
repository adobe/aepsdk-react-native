# React Native Adobe Experience Platform Assurance Extension

[![npm version](https://img.shields.io/npm/v/@adobe/react-native-aepassurance?color=green&label=npm%20package)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance)

`@adobe/react-native-aepassurance` is a wrapper around the iOS and Android [Adobe Experience Platform Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance) to allow for integration with React Native applications. Functionality to start Assurance session is provided through JavaScript documented below.

## Prerequisites

The Adobe Experience Platform Assurance extension has the following peer dependency, which must be installed prior to installing the identity extension:

- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepassurance` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepassurance
```

## Usage

### [Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance/tutorials)

### Initializing with SDK:

Then, initialize the SDK using the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/docs-v7/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk_flutter/tree/main/plugins/flutter_aepcore#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

To connect to an Assurance session by scanning the QR code, follow the [Android documentation](https://developer.android.com/training/app-links/deep-linking) for more information about how to setup a deeplink.

##### Start Assurance session:

```typescript
import { Assurance } from "@adobe/react-native-aepassurance";
Assurance.startSession("{your-assurance-session-url}");
```
