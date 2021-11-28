# React Native AEP Core Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore)

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

### [Core](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core)

##### Updating the SDK configuration:

```javascript
MobileCore.updateConfiguration({"yourConfigKey": "yourConfigValue"});
```

##### Getting the SDK version:
```javascript
MobileCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: MobileCore version: " + version));
```

##### Getting the log level:
```javascript
MobileCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
```

##### Controlling the log level of the SDK:
```javascript
import {LogLevel} from '@adobe/react-native-aepcore';

MobileCore.setLogLevel(LogLevel.VERBOSE);
```

##### Using the AEP Logging API:
```javascript
import {LogLevel} from '@adobe/react-native-aepcore';

MobileCore.log(LogLevel.ERROR, "React Native Tag", "React Native Message");
```

Note: `LogLevel` contains the following getters:

```javascript
const ERROR = "ERROR";
const WARNING = "WARNING";
const DEBUG = "DEBUG";
const VERBOSE = "VERBOSE";
```

##### Getting the current privacy status:
```javascript
MobileCore.getPrivacyStatus().then(status => console.log("AdobeExperienceSDK: Privacy Status = " + status));
```

##### Setting the privacy status:
```javascript
import {PrivacyStatus} from '@adobe/react-native-aepcore';

MobileCore.setPrivacyStatus(PrivacyStatus.OPT_IN);
```

Note: `PrivacyStatus` contains the following getters:

```javascript
const OPT_IN = "OPT_IN";
const OPT_OUT = "OPT_OUT";
const UNKNOWN = "UNKNOWN";
```

##### Getting the SDK identities:
```javascript
MobileCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
```

##### Dispatching an Event Hub event:
```javascript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEvent(event);
```

##### Dispatching an Event Hub event with callback:
```javascript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEventWithResponseCallback(event).then(responseEvent => console.log("AdobeExperienceSDK: responseEvent = " + responseEvent));
```

##### Dispatching an Event Hub response event (Android Only): 
```javascript
import {Event} from '@adobe/react-native-aepcore';

var responseEvent = new Event("responseEvent", "eventType", "eventSource", {"testDataKey": "testDataValue"});
var requestEvent = new Event("requestEvent", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchResponseEvent(responseEvent, requestEvent);
```

##### Collecting PII:
```javascript
MobileCore.collectPii({"myPii": "data"});
```

##### Reset Identities:
```javascript
MobileCore.resetIdentities();
```


### [Identity](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/identity)

##### Getting the extension version:
```javascript
Identity.extensionVersion().then(version => console.log("AdobeExperienceSDK: Identity version: " + version));
```

##### Sync Identifier:
```javascript
Identity.syncIdentifier("identifierType", "identifier", MobileVisitorAuthenticationState.AUTHENTICATED);
```

##### Sync Identifiers:
```javascript
Identity.syncIdentifiers({"id1": "identifier1"});
```

##### Sync Identifiers with Authentication State:
```javascript
import {MobileVisitorAuthenticationState} from '@adobe/react-native-aepcore';

Identity.syncIdentifiersWithAuthState({"id1": "identifier1"}, MobileVisitorAuthenticationState.UNKNOWN);
```

Note: `MobileVisitorAuthenticationState` contains the following getters:

```javascript
const AUTHENTICATED = "VISITOR_AUTH_STATE_AUTHENTICATED";
const LOGGED_OUT = "VISITOR_AUTH_STATE_LOGGED_OUT";
const UNKNOWN = "VISITOR_AUTH_STATE_UNKNOWN";
```

##### Setting the advertising identifier:

```javascript
MobileCore.setAdvertisingIdentifier("adID");
```

##### Append visitor data to a URL:

```javascript
Identity.appendVisitorInfoForURL("test.com").then(urlWithVisitorData => console.log("AdobeExperienceSDK: VisitorData = " + urlWithVisitorData));
```

##### Get visitor data as URL query parameter string:

```javascript
Identity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: UrlVariables = " + urlVariables));
```

##### Get Identifiers:

```javascript
Identity.getIdentifiers().then(identifiers => console.log("AdobeExperienceSDK: Identifiers = " + identifiers));
```

##### Get Experience Cloud IDs:
```javascript
Identity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
```

##### Setting the push identifier:
```javascript
MobileCore.setPushIdentifier("pushIdentifier");
```

##### VisitorID Class:
```javascript
import {VisitorID} from '@adobe/react-native-aepcore';

var visitorId = new VisitorID(idOrigin?: string, idType: string, id?: string, authenticationState?: MobileVisitorAuthenticationState)
```

### [Lifecycle](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle)

> Note: Implementing Lifecycle via Javascript may lead to inaccurate Lifecycle metrics, therefore we recommend implementing Lifecycle in native [Android and iOS code](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle).

##### Getting the extension version:
```javascript
Lifecycle.extensionVersion().then(version => console.log("AdobeExperienceSDK: Lifecycle version: " + version));
```

### [Signal](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/signals)
##### Getting the extension version:
```javascript
Signal.extensionVersion().then(version => console.log("AdobeExperienceSDK: Signal version: " + version));
```
