
# React Native AEP User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)

## Prerequisites

The UserProfile extension has the following peer dependency, which must be installed prior to installing the UserProfile extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

### [User Profile](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/profile)

#### Importing the extension:
```javascript
import {UserProfile} from '@adobe/react-native-aepuserprofile';
```

#### Getting the extension version:

```javascript
UserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: UserProfile version: " + version));
```

#### Update user attributes:

```javascript
let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
UserProfile.updateUserAttributes(attrMap);
```

#### Remove user attributes:

```javascript
UserProfile.removeUserAttributes(["mapKey1"]);
```

#### Get user attributes:

```javascript
UserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: UserProfile getUserAttributes: " + map));
```