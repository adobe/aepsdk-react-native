
# React Native Consent for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent)

`@adobe/react-native-aepedgeconsent` is a wrapper for the iOS and Android [Consent for Edge Network extension](https://aep-sdks.gitbook.io/docs/foundation-extensions/consent-for-edge-network) to allow for integration with React Native applications.

## Prerequisites

The Consent for Edge Network extension has the following peer dependency, which must be installed prior to installing the Consent extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepedgeconsent` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgeconsent
```

## Usage

### Install and register this extension with the AEP Mobile Core
Install the Consent extension in your mobile property and configure the default consent preferences by following the steps in the [Consent for Edge Network extension documentation](https://aep-sdks.gitbook.io/docs/foundation-extensions/consent-for-edge-network).

Then follow the same document for registering the Consent extension with the Mobile Core.
Note that initializing the SDK should be done in native code, additional documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

In your React Native application, import the AEPConsent extension as follows:
```javascript
import {AEPConsent} from '@adobe/react-native-aepedgeconsent';
```

### API reference

#### extensionVersion
Returns the version of the AEPConsent extension

**Syntax**
```javascript
extensionVersion(): Promise<string>
```

**Example**
```javascript
AEPConsent.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPConsent version: " + version));
```

#### getConsents
Retrieves the current consent preferences stored in the Consent extension and resolves the promise with the current consent preferences or rejects it if an unexpected error occurs or the request timed out 
Output example: {"consents": {"collect": {"val": "y"}}}

**Syntax**
```javascript
getConsents(): Promise<{string: any}>
```

**Example**
```javascript
AEPConsent.getConsents().then(currentConsents => {
  let consentsStr = JSON.stringify(currentConsents);
  setConsents(consentsStr);
  console.log("AdobeExperienceSDK: AEPConsent.getConsents returned current consent preferences:  " + consentsStr);
}).catch((error) => {
  console.warn("AdobeExperienceSDK: AEPConsent.getConsents returned error: ", error);
});
```

#### update
Merges the existing consents with the given consents. Duplicate keys will take the value of those passed in the API
Input example: {"consents": {"collect": {"val": "y"}}}
**Syntax**
```javascript
update(consents: {string: any})
```

**Example**
```javascript
var consents: {[keys: string]: any} = {"consents" : {"collect" : {"val": "y"}}};
AEPConsent.update(consents);
```