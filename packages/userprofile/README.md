
# React Native AEP User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-acpuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-acpuserprofile) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-acpuserprofile)](https://www.npmjs.com/package/@adobe/react-native-acpuserprofile)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/react-native-acpuserprofile/main.svg?logo=circleci)](https://circleci.com/gh/adobe/workflows/react-native-acpuserprofile) 
[![license](https://img.shields.io/npm/l/@adobe/react-native-acpuserprofile.svg)](https://github.com/adobe/react-native-acpuserprofile/blob/main/LICENSE)

`@adobe/react-native-aepuserprofile` is a wrapper around the iOS and Android [AEP User Profile SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/profile) to allow for integration with React Native applications. Functionality to enable Adobe User Profile is provided entirely through JavaScript documented below.


## Installation

Requires `@adobe/react-native-aepcore` to be installed.

### Install npm package

Install the `@adobe/react-native-aepuserprofile` package:

```bash
npm install @adobe/react-native-aepuserprofile
```

#### Link

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.

## Usage

### [User Profile](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/profile)

#### Importing the extension:
```javascript
import {AEPUserProfile} from '@adobe/react-native-aepuserprofile';
```

#### Getting the extension version:

```javascript
AEPUserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPUserProfile version: " + version));
```

#### Update user attributes:

```javascript
let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
AEPUserProfile.updateUserAttributes(attrMap);
```

#### Remove user attributes:

```javascript
AEPUserProfile.removeUserAttributes(["mapKey1"]);
```

#### Get user attributes:

```javascript
AEPUserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: AEPUserProfile getUserAttributes: " + map));
```
