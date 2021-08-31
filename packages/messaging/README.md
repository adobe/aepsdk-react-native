
# React Native AEPMessaging Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepmessaging.svg)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepmessaging)](https://www.npmjs.com/package/@adobe/react-native-aepmessaging)

## Usage

### [Messaging](https://github.com/adobe/aepsdk-messaging-ios#adobe-experience-platform---messaging-extension-for-ios)

#### Importing the extension:
```javascript
import {AEPMessaging} from '@adobe/react-native-aepmessaging';
```

#### Getting the extension version:

```javascript
AEPMessaging.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPMessaging version: " + version));
```