
# React Native Adobe Experience Platform User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)

`@adobe/react-native-aepcore` is a wrapper around the iOS and Android [Adobe Experience Platform User Profile Extension](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/profile) to allow for integration with React Native applications.


## Prerequisites

The UserProfile extension has the following peer dependency, which must be installed prior to installing the UserProfile extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepuserprofile` package:

```bash
npm install @adobe/react-native-aepuserprofile
```

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

#### Importing the extension:
```javascript
import {UserProfile} from '@adobe/react-native-aepuserprofile';
```

## API reference

- #### extensionVersion

Returns the version of the User Profile extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
UserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: UserProfile version: " + version));
```

- #### getUserAttributes

Gets the user profile attributes with the given keys.

**Syntax**

```javascript
getUserAttributes(attributeNames: Array<string>): Promise<?{ string: any }> 
```

**Example**

```javascript
UserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: UserProfile getUserAttributes: " + map));
```

- #### removeUserAttributes

Removes the user profile attributes for the given keys.

**Syntax**

```javascript
removeUserAttributes(attributeNames: Array<string>)
```

**Example**

```javascript
UserProfile.removeUserAttributes(["mapKey1"]);
```

- #### updateUserAttributes

Sets the user profile attributes key and value.
It allows to create/update a batch of user profile attributes.

**Syntax**

```javascript
updateUserAttributes(attributeMap: { string: any })
```

**Example**

```javascript
let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
UserProfile.updateUserAttributes(attrMap);
```
