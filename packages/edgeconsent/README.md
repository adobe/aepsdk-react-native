
# React Native Consent for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent)

`@adobe/react-native-aepedgeconsent` is a wrapper for the iOS and Android [Consent for Edge Network extension](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network) to allow for integration with React Native applications.

## Prerequisites

The Consent for Edge Network extension has the following peer dependency, which must be installed prior to installing the Consent extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page. 

Install the `@adobe/react-native-aepedgeconsent` package:

NPM:

```bash
npm install @adobe/react-native-aepedgeconsent
```

Yarn:

```bash
yarn add @adobe/react-native-aepedgeconsent
```

## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension
In your React Native application, import the Consent extension as follows:
```typescript
import {Consent} from "@adobe/react-native-aepedgeconsent";
```

## API reference

### extensionVersion
Returns the version of the Consent extension

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
Consent.extensionVersion().then(version => console.log("Consent.extensionVersion: " + version));
```

### getConsents
Retrieves the current consent preferences stored in the Consent extension and resolves the promise with the current consent preferences or rejects it if an unexpected error occurs or the request timed out. 
Output example: {"consents": {"collect": {"val": "y"}}}

**Syntax**
```typescript
getConsents(): Promise<Record<string, any>>
```

**Example**
```typescript
Consent.getConsents().then(consents => {
  console.log("AEPConsent.getConsents returned current consent preferences:  " + JSON.stringify(consents));
}).catch((error) => {
  console.warn("AEPConsent.getConsents returned error: ", error.message);
});
```

### update
Merges the existing consents with the given consents. Duplicate keys will take the value of those passed in the API.
Input example: {"consents": {"collect": {"val": "y"}}}

**Syntax**
```typescript
update(consents: Record<string, any>) 
```

**Example**
```typescript
var consents: {[keys: string]: any} = {"consents" : {"collect" : {"val": "y"}}};
Consent.update(consents);
```
