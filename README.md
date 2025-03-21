# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## About this project

This repository is a monorepo and contains a collection of React Native modules for Adobe Experience Platform Mobile SDK as listed below. These modules can be found in the [packages](./packages) directory.
| Package Name | Latest Version | Native Extension | New Architecture Compatibility |
| ---- | ---- | ---- | ---- |
| [@adobe/react-native-aepcore (required)](./packages/core) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) | [Mobile Core](https://developer.adobe.com/client-sdks/documentation/mobile-core) | Supported |
| [@adobe/react-native-aepuserprofile](./packages/userprofile) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)| [Profile](https://developer.adobe.com/client-sdks/documentation/profile) | Supported |
| [@adobe/react-native-aepedge](./packages/edge) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge) | [Edge](https://developer.adobe.com/client-sdks/documentation/edge-network) | Supported |
| [@adobe/react-native-aepedgeidentity](./packages/edgeidentity) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) |[EdgeIdentity](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network) | Supported |
| [@adobe/react-native-aepedgeconsent](./packages/edgeconsent) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) | [EdgeConsent](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network) | Supported |
| [@adobe/react-native-aepedgebridge](./packages/edgebridge) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge) | EdgeBridge | Supported |
| [@adobe/react-native-aepmessaging](./packages/messaging) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) | [Messaging](https://developer.adobe.com/client-sdks/documentation/iam/) | Supported |
| [@adobe/react-native-aepassurance](./packages/assurance) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepassurance.svg)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepassurance)](https://www.npmjs.com/package/@adobe/react-native-aepassurance) | [Assurance](https://developer.adobe.com/client-sdks/documentation/platform-assurance-sdk) | Supported |
| [@adobe/react-native-aepoptimize](./packages/optimize) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepoptimize.svg)](https://www.npmjs.com/package/@adobe/react-native-aepoptimize) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepoptimize) | [Optimize](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer-decisioning) | Supported |
| [@adobe/react-native-aepplaces](./packages/places) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepplaces.svg)](https://www.npmjs.com/package/@adobe/react-native-aepplaces) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepplaces) | [Places](https://developer.adobe.com/client-sdks/documentation/places) | Supported |
| [@adobe/react-native-aeptarget](./packages/target) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aeptarget.svg)](https://www.npmjs.com/package/@adobe/react-native-aeptarget) ![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aeptarget) | [Target](https://developer.adobe.com/client-sdks/documentation/adobe-target) | Supported |
| [@adobe/react-native-aepcampaignclassic](./packages/campaignclassic) | [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcampaignclassic.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcampaignclassic)](https://www.npmjs.com/package/@adobe/react-native-aepcampaignclassic) |[CampaignClassic](https://developer.adobe.com/client-sdks/documentation/adobe-campaign-classic) | Not Supported |

> [!NOTE]   
> Since version 5.0.0 of the Adobe React Native SDK, all React Native libraries that share the same major version are compatible with each other.

> [!NOTE]  
> The React Native libraries within this repository are specifically designed to support the Android and iOS platforms only.

> [!IMPORTANT]  
> The Adobe React Native SDK utilizes the React Native interop layer to ensure compatibility with new architecture.

## Requirements 

- React Native

Requires React Native (0.60.0 and above)

- Xcode

To submit iOS apps to the App Store, you must build them using Xcode 15 or later, as required by [Apple](https://developer.apple.com/ios/submit/).

## iOS Privacy Manifest

> [!IMPORTANT]  
> Adobe Experience Platform React Native **6.x** libraries now depend on Experience Platform iOS 5.x SDKs, which have been updated to align with Apple's latest guidelines on [privacy manifest](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files). For further details on how Apple's privacy-related announcements affect the Adobe mobile SDK for iOS, please refer to this [document](https://developer.adobe.com/client-sdks/resources/privacy-manifest/).

## Expo Support

Please refer to the [Expo Integration](./docs/expo.md) document for guidance on integrating the SDK with Expo projects.

## Installation

You need to install Adobe Experience Platform Mobile SDK with [npm](https://www.npmjs.com/) packages and configure the native Android/iOS project in your React Native project.

> Note: If you are new to React Native, we suggest you follow the [React Native Getting Started](https://reactnative.dev) page before continuing.

### Install AEP npm packages

Adobe Experience Platform Mobile SDK packages can be installed from [npm](https://www.npmjs.com/) command.

> Note: `@adobe/react-native-aepcore` is required to be installed.

Install the `@adobe/react-native-aep{extension}` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aep{extension}
```

Alternatively, include the Adobe Experience Platform npm packages as dependencies in the app’s package.json.

The following code snippet shows for Mobile Core and Edge Network extensions as an example in package.json:

```bash
...
"dependencies": {
    "react-native": "0.72.5",
    "@adobe/react-native-aepcore": "^7.0.0", //core is required and includes aepcore, aepsignal, aeplifecycle, aepidentity libraries
    "@adobe/react-native-aepedge": "^7.0.0",
    "@adobe/react-native-aepedgeidentity": "^7.0.0",
    "@adobe/react-native-aepedgeconsent": "^7.0.0",
...
},
```

Inside of the app directory, run

```bash
#if using node package manager
npm install
```

or

```bash
#if using yarn package manager
yarn install
```

##### ios development

For iOS development, after installing the plugins from npm, download the pod dependencies by running the following command:

```bash
cd ios && pod install && cd ..
```

To update native dependencies to latest available versions, run the following command:

```bash
cd ios && pod update && cd ..
```

## Initializing

Then, initialize the SDK using the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

> [!NOTE]  
> Starting from Adobe Experience Platform React native **7.x**,  there is no longer a need to initialize the SDK on the [native platforms](https://github.com/adobe/aepsdk-react-native/tree/main#initializing), as was required in earlier versions.

> [!NOTE] 
> The [link here](https://github.com/adobe/aepsdk-react-native/tree/main#initializing) is for users who want to refer back to the old registering instructions for Adobe Experience Platform React Native **6.x**.

## Importing the extension:
In your React Native application, import the core/lifecycle/signal/identity extension as follows:
```typescript
import { MobileCore, Lifecycle, Signal, LogLevel, PrivacyStatus, Event } from '@adobe/react-native-aepcore'
import {Edge, ExperienceEvent} from '@adobe/react-native-aepedge';
import {EdgeBridge} from '@adobe/react-native-aepedgebridge';
import {Consent} from "@adobe/react-native-aepedgeconsent";
import {Identity} from '@adobe/react-native-aepedgeidentity';
import {
  Messaging,
  MessagingDelegate,
  MessagingEdgeEventType,
  Message
} from '@adobe/react-native-aepmessaging';
import {
  Optimize,
  Offer,
  Proposition,
  DecisionScope,
} from "@adobe/react-native-aepoptimize";
import {
  Places,
  PlacesAuthStatus,
  PlacesGeofence,
  PlacesGeofenceTransitionType,
  PlacesLocation,
  PlacesPOI,
} from "@adobe/react-native-aepplaces";
import {
  Target,
  TargetOrder,
  TargetParameters,
  TargetPrefetchObject,
  TargetProduct,
  TargetRequestObject,
} from "@adobe/react-native-aeptarget";
import { UserProfile } from "@adobe/react-native-aepuserprofile";
import { Assurance } from "@adobe/react-native-aepassurance";
import { CampaignClassic } from "@adobe/react-native-aepcampaignclassic";
```

## Migration guide

See [migration.md](./docs/migration.md) for guidance on migrating from ACP React Native libraries.

## Troubleshooting and Known issues

1. Getting error when building on iOS Xcode

```xcode
Use of '@import' when C++ modules are disabled, consider using -fmodules and -fcxx-modules
```
Refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/247#issuecomment-1642944117).

2. Getting error when building on iOS

```xcode
Underlying Objective-C module 'AEPRulesEngine' not found
```
Refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/263#issuecomment-1498393770).

## Sample Apps
Refer to the [sample apps](https://github.com/adobe/aepsdk-react-native/tree/main/apps) for example implementations.

## Contributing

Contributions are welcomed! See [CONTRIBUTING](CONTRIBUTING.md) and [development.md](./docs/development.md) guides for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
