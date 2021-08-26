
# React Native AEP User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)

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
