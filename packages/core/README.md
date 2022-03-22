# React Native Adobe Experience Platform Mobile Core Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore)

`@adobe/react-native-aepcore` is a wrapper around the iOS and Android [Adobe Experience Platform Mobile Core Extension](https://aep-sdks.gitbook.io/docs/foundation-extensions/mobile-core) to allow for integration with React Native applications.

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepcore` package:

```bash
npm install @adobe/react-native-aepcore
```

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).


### Importing the Mobile Core package:
In your React Native application, import the core/lifecycle/signal/identity extension as follows:
```javascript
import { MobileCore, Lifecycle, Signal, LogLevel, PrivacyStatus, Event } from '@adobe/react-native-aepcore'
```

## API reference

### [Core](https://aep-sdks.gitbook.io/docs/foundation-extensions/mobile-core/mobile-core-api-reference)

- #### collectPii
The `collectPii` function lets the SDK to collect sensitive or personally identifiable information (PII).

**Syntax**

```javascript
collectPii(data: { string: string })
```

**Example**

```javascript
MobileCore.collectPii({"myPii": "data"});
```

- #### dispatchEvent
Dispatch an event for other extensions or the internal SDK to consume.

**Syntax**

```javascript
dispatchEvent(event: Event): Promise<boolean>
```

**Example**

```javascript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEvent(event);
```

- #### dispatchEventWithResponseCallback

**Syntax**

```javascript
dispatchEventWithResponseCallback(event: Event): Promise<Event>
```

**Example**

```javascript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEventWithResponseCallback(event).then(responseEvent => console.log("AdobeExperienceSDK: responseEvent = " + responseEvent));
```

- #### extensionVersion
Returns the version of the Core extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
MobileCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: MobileCore version: " + version));
```
- #### getLogLevel

This function gets the current log level being used in the SDK.

**Syntax**

```javascript
getLogLevel(): Promise<string> 
```

**Example**

```javascript
MobileCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
```

- #### getSdkIdentities

This function gets all of the user's identities known by the SDK.

**Syntax**

```javascript
getSdkIdentities(): Promise<?string>
```

**Example**

```javascript
MobileCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
```

- #### getPrivacyStatus

Get the current Adobe Mobile Privacy Status

**Syntax**

```javascript
getPrivacyStatus(): Promise<string>
```

**Example**

```javascript
MobileCore.getPrivacyStatus().then(status => console.log("AdobeExperienceSDK: Privacy Status = " + status));
```


- #### log

This is the API used to log from the SDK.

**Syntax**

```javascript
log(logLevel: string, tag: string, message: string)
```

**Example**

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

- #### resetIdentities

The `resetIdentities` method requests that each extension resets the identities it owns and each extension responds to this request uniquely.

**Syntax**

```javascript
resetIdentities()
```

**Example**

```javascript
MobileCore.resetIdentities();
```

- #### setPrivacyStatus

Set the Adobe Mobile Privacy status

**Syntax**

```javascript
setPrivacyStatus(privacyStatus: string) 
```

**Example**

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

- #### setLogLevel

Set the logging level of the SDK

**Syntax**

```javascript
setLogLevel(mode: string)
```

**Example**

```javascript
import {LogLevel} from '@adobe/react-native-aepcore';

MobileCore.setLogLevel(LogLevel.VERBOSE);
```

- #### updateConfiguration

Update the configuration programmatically by passing configuration keys and values to override the existing configuration.

**Syntax**

```javascript
updateConfiguration(configMap?: { string: any })
```

**Example**

```javascript
MobileCore.updateConfiguration({"yourConfigKey": "yourConfigValue"});
```

### [Identity](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/identity)

- #### appendVisitorInfoForURL

This function appends Adobe visitor information to the query component of the specified URL.

**Syntax**

```javascript
appendVisitorInfoForURL(baseURL?: String): Promise<?string> 
```

**Example**

```javascript
Identity.appendVisitorInfoForURL("test.com").then(urlWithVisitorData => console.log("AdobeExperienceSDK: VisitorData = " + urlWithVisitorData));
```

- #### extensionVersion

Returns the version of the Identity extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
Identity.extensionVersion().then(version => console.log("AdobeExperienceSDK: Identity version: " + version));
```

- #### getUrlVariables

This function returns an appropriately formed string that contains the Experience Cloud Identity Service URL variables.

**Syntax**

```javascript
getUrlVariables(): Promise<?string>
```

**Example**

```javascript
Identity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: UrlVariables = " + urlVariables));
```

- #### getIdentifiers

This function returns all customer identifiers that were previously synced with the Adobe Experience Cloud Identity Service.

**Syntax**

```javascript
getIdentifiers(): Promise<Array<?VisitorID>>
```

**Example**

```javascript
Identity.getIdentifiers().then(identifiers => console.log("AdobeExperienceSDK: Identifiers = " + identifiers));
```

- #### getExperienceCloudId

This function retrieves the Adobe Experience Cloud ID (ECID) that was generated when the app was initially launched and is stored in the Adobe Experience Cloud Identity Service.

**Syntax**

```javascript
getExperienceCloudId(): Promise<?string>
```

**Example**

```javascript
Identity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
```

- #### syncIdentifier

The `syncIdentifier`, `syncIdentifiers` and `syncIdentifiersWithAuthState` functions update the specified customer IDs with the Adobe Experience Cloud Identity Service.

**Syntax**

```javascript
 syncIdentifier(identifierType: String, identifier: String, authenticationState: string) 
```

**Example**
```javascript
Identity.syncIdentifier("identifierType", "identifier", MobileVisitorAuthenticationState.AUTHENTICATED);
```

- #### syncIdentifiers

**Syntax**

```javascript
syncIdentifiers(identifiers?: { string: string })
```

**Example**

```javascript
Identity.syncIdentifiers({"id1": "identifier1"});
```

- #### syncIdentifiersWithAuthState

**Syntax**

```javascript
syncIdentifiersWithAuthState(identifiers?: { string: string }, authenticationState: string) 
```

**Example**

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

- #### setAdvertisingIdentifier

Submits a generic event containing the provided IDFA with event type `generic.identity`.

**Syntax**

```javascript
setAdvertisingIdentifier(advertisingIdentifier?: String)
```

**Example**

```javascript
MobileCore.setAdvertisingIdentifier("adID");
```

- #### setPushIdentifier

Submits a generic event containing the provided push token with event type `generic.identity`.

**Syntax**

```javascript
setPushIdentifier(pushIdentifier?: String) 
```

**Example**

```javascript
MobileCore.setPushIdentifier("pushIdentifier");
```

- #### VisitorID Class:

```javascript
import {VisitorID} from '@adobe/react-native-aepcore';

var visitorId = new VisitorID(idOrigin?: string, idType: string, id?: string, authenticationState?: MobileVisitorAuthenticationState)
```

### [Lifecycle](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle)

> Note: Implementing Lifecycle via Javascript may lead to inaccurate Lifecycle metrics, therefore we recommend implementing Lifecycle in native [Android and iOS code](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/lifecycle).

- #### extensionVersion

Returns the version of the Lifecycle extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
Lifecycle.extensionVersion().then(version => console.log("AdobeExperienceSDK: Lifecycle version: " + version));
```

### [Signal](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/mobile-core/signals)

- #### extensionVersion

Returns the version of the Signal extension

**Syntax**

```javascript
extensionVersion(): Promise<string>
```

**Example**

```javascript
Signal.extensionVersion().then(version => console.log("AdobeExperienceSDK: Signal version: " + version));
```
