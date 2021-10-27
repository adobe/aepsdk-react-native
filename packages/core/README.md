# React Native AEP Core Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore)

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

### [Core](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core)

##### Updating the SDK configuration:

```javascript
AEPCore.updateConfiguration({"yourConfigKey": "yourConfigValue"});
```

##### Getting the SDK version:
```javascript
AEPCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPCore version: " + version));
```

##### Getting the log level:
```javascript
AEPCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
```

##### Controlling the log level of the SDK:
```javascript
import {AEPMobileLogLevel} from '@adobe/react-native-aepcore';

AEPCore.setLogLevel(AEPMobileLogLevel.VERBOSE);
```

##### Using the AEP Logging API:
```javascript
import {AEPMobileLogLevel} from '@adobe/react-native-aepcore';

AEPCore.log(AEPMobileLogLevel.ERROR, "React Native Tag", "React Native Message");
```

Note: `AEPMobileLogLevel` contains the following getters:

```javascript
const ERROR = "AEP_LOG_LEVEL_ERROR";
const WARNING = "AEP_LOG_LEVEL_WARNING";
const DEBUG = "AEP_LOG_LEVEL_DEBUG";
const VERBOSE = "AEP_LOG_LEVEL_VERBOSE";
```

##### Getting the current privacy status:
```javascript
AEPCore.getPrivacyStatus().then(status => console.log("AdobeExperienceSDK: Privacy Status = " + status));
```

##### Setting the privacy status:
```javascript
import {AEPMobilePrivacyStatus} from '@adobe/react-native-aepcore';

AEPCore.setPrivacyStatus(AEPMobilePrivacyStatus.OPT_IN);
```

Note: `AEPMobilePrivacyStatus` contains the following getters:

```javascript
const OPT_IN = "AEP_PRIVACY_STATUS_OPT_IN";
const OPT_OUT = "AEP_PRIVACY_STATUS_OPT_OUT";
const UNKNOWN = "AEP_PRIVACY_STATUS_UNKNOWN";
```

##### Getting the SDK identities:
```javascript
AEPCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
```

##### Dispatching an Event Hub event:
```javascript
import {AEPExtensionEvent} from '@adobe/react-native-aepcore';

var event = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
AEPCore.dispatchEvent(event);
```

##### Dispatching an Event Hub event with callback:
```javascript
import {AEPExtensionEvent} from '@adobe/react-native-aepcore';

var event = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
AEPCore.dispatchEventWithResponseCallback(event).then(responseEvent => console.log("AdobeExperienceSDK: responseEvent = " + responseEvent));
```

##### Dispatching an Event Hub response event (Android Only): 
```javascript
import {AEPExtensionEvent} from '@adobe/react-native-aepcore';

var responseEvent = new AEPExtensionEvent("responseEvent", "eventType", "eventSource", {"testDataKey": "testDataValue"});
var requestEvent = new AEPExtensionEvent("requestEvent", "eventType", "eventSource", {"testDataKey": "testDataValue"});
AEPCore.dispatchResponseEvent(responseEvent, requestEvent);
```

##### Collecting PII:
```javascript
AEPCore.collectPii({"myPii": "data"});
```

##### Reset Identities:
```javascript
AEPCore.resetIdentities();
```


### [Identity](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/identity)

##### Getting the extension version:
```javascript
AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPIdentity version: " + version));
```

##### Sync Identifier:
```javascript
AEPIdentity.syncIdentifier("identifierType", "identifier", AEPMobileVisitorAuthenticationState.AUTHENTICATED);
```

##### Sync Identifiers:
```javascript
AEPIdentity.syncIdentifiers({"id1": "identifier1"});
```

##### Sync Identifiers with Authentication State:
```javascript
import {AEPMobileVisitorAuthenticationState} from '@adobe/react-native-aepcore';

AEPIdentity.syncIdentifiersWithAuthState({"id1": "identifier1"}, AEPMobileVisitorAuthenticationState.UNKNOWN);
```

Note: `AEPMobileVisitorAuthenticationState` contains the following getters:

```javascript
const AUTHENTICATED = "AEP_VISITOR_AUTH_STATE_AUTHENTICATED";
const LOGGED_OUT = "AEP_VISITOR_AUTH_STATE_LOGGED_OUT";
const UNKNOWN = "AEP_VISITOR_AUTH_STATE_UNKNOWN";
```

##### Setting the advertising identifier:

```javascript
AEPCore.setAdvertisingIdentifier("adID");
```

##### Append visitor data to a URL:

```javascript
AEPIdentity.appendVisitorInfoForURL("test.com").then(urlWithVisitorData => console.log("AdobeExperienceSDK: VisitorData = " + urlWithVisitorData));
```

##### Get visitor data as URL query parameter string:

```javascript
AEPIdentity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: UrlVariables = " + urlVariables));
```

##### Get Identifiers:

```javascript
AEPIdentity.getIdentifiers().then(identifiers => console.log("AdobeExperienceSDK: Identifiers = " + identifiers));
```

##### Get Experience Cloud IDs:
```javascript
AEPIdentity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
```

##### Setting the push identifier:
```javascript
AEPCore.setPushIdentifier("pushIdentifier");
```

##### VisitorID Class:
```javascript
import {AEPVisitorID} from '@adobe/react-native-aepcore';

var visitorId = new AEPVisitorID(idOrigin?: string, idType: string, id?: string, authenticationState?: AEPMobileVisitorAuthenticationState)
```

### [Lifecycle](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle)

> Note: Implementing Lifecycle via Javascript may lead to inaccurate Lifecycle metrics, therefore we recommend implementing Lifecycle in native [Android and iOS code](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle).

##### Getting the extension version:
```javascript
AEPLifecycle.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPLifecycle version: " + version));
```

### [Signal](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/signals)
##### Getting the extension version:
```javascript
AEPSignal.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPSignal version: " + version));
```
