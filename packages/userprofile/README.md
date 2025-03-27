# React Native Adobe Experience Platform User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)

`@adobe/react-native-aepcore` is a wrapper around the iOS and Android [Adobe Experience Platform User Profile Extension](https://developer.adobe.com/client-sdks/documentation/profile) to allow for integration with React Native applications.

## Prerequisites

The UserProfile extension has the following peer dependency, which must be installed prior to installing the UserProfile extension:

- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepuserprofile` package:

NPM:

```bash
npm install @adobe/react-native-aepuserprofile
```

Yarn:

```bash
yarn add @adobe/react-native-aepuserprofile
```

## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension:

In your React Native application, import the UserProfile extension as follows:

```typescript
import { UserProfile } from "@adobe/react-native-aepuserprofile";
```

## API reference

### extensionVersion

Returns the version of the User Profile extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
UserProfile.extensionVersion().then((version) =>
  console.log("AdobeExperienceSDK: UserProfile version: " + version)
);
```

### getUserAttributes

Gets the user profile attributes with the given keys.

**Syntax**

```typescript
getUserAttributes(attributeNames: Array<string>): Promise<Record<string, any>>
```

**Example**

```typescript
UserProfile.getUserAttributes(["mapKey", "mapKey1"]).then((map) =>
  console.log("AdobeExperienceSDK: UserProfile getUserAttributes: " + map)
);
```

### removeUserAttributes

Removes the user profile attributes for the given keys.

**Syntax**

```typescript
removeUserAttributes(attributeNames: Array<string>)
```

**Example**

```typescript
UserProfile.removeUserAttributes(["mapKey1"]);
```

### updateUserAttributes

Sets the user profile attributes key and value.
It allows to create/update a batch of user profile attributes.

**Syntax**

```typescript
updateUserAttributes(attributeMap: Record<string, any>)
```

**Example**

```typescript
let attrMap = { mapKey: "mapValue", mapKey1: "mapValue1" };
UserProfile.updateUserAttributes(attrMap);
```
