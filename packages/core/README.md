# React Native Adobe Experience Platform Mobile Core Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore)

`@adobe/react-native-aepcore` is a wrapper around the iOS and Android [Adobe Experience Platform Mobile Core Extension](https://developer.adobe.com/client-sdks/documentation/mobile-core) to allow for integration with React Native applications.

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
```typescript
import { MobileCore, Lifecycle, Signal, LogLevel, PrivacyStatus, Event } from '@adobe/react-native-aepcore'
```

## API reference

### [Core](https://developer.adobe.com/client-sdks/documentation/mobile-core/api-reference)

- #### collectPii
The `collectPii` function lets the SDK to collect sensitive or personally identifiable information (PII).

**Syntax**

```typescript
collectPii(data: Record<string, string>)
```

**Example**

```typescript
MobileCore.collectPii({"myPii": "data"});
```

- #### dispatchEvent
Dispatch an event for other extensions or the internal SDK to consume.

**Syntax**

```typescript
dispatchEvent(event: Event): Promise<boolean>
```

**Example**

```typescript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEvent(event);
```

- #### dispatchEventWithResponseCallback

**Syntax**

```typescript
dispatchEventWithResponseCallback(event: Event): Promise<Event>
```

**Example**

```typescript
import {Event} from '@adobe/react-native-aepcore';

var event = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
MobileCore.dispatchEventWithResponseCallback(event).then(responseEvent => console.log("AdobeExperienceSDK: responseEvent = " + responseEvent));
```

- #### extensionVersion
Returns the version of the Core extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
MobileCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: MobileCore version: " + version));
```
- #### getLogLevel

This function gets the current log level being used in the SDK.

**Syntax**

```typescript
getLogLevel(): Promise<LogLevel>
```

**Example**

```typescript
MobileCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
```

- #### getSdkIdentities

This function gets all of the user's identities known by the SDK.

**Syntax**

```typescript
getSdkIdentities(): Promise<string>
```

**Example**

```typescript
MobileCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
```

- #### getPrivacyStatus

Get the current Adobe Mobile Privacy Status

**Syntax**

```typescript
getPrivacyStatus(): Promise<string>
```

**Example**

```typescript
MobileCore.getPrivacyStatus().then(status => console.log("AdobeExperienceSDK: Privacy Status = " + status));
```


- #### log

This is the API used to log from the SDK.

**Syntax**

```typescript
log(logLevel: LogLevel, tag: string, message: string)
```

**Example**

```typescript
import {LogLevel} from '@adobe/react-native-aepcore';

MobileCore.log(LogLevel.ERROR, "React Native Tag", "React Native Message");
```

Note: `LogLevel` contains the following getters:

```typescript
const ERROR = "ERROR";
const WARNING = "WARNING";
const DEBUG = "DEBUG";
const VERBOSE = "VERBOSE";
```

- #### resetIdentities

The `resetIdentities` method requests that each extension resets the identities it owns and each extension responds to this request uniquely.

**Syntax**

```typescript
resetIdentities()
```

**Example**

```typescript
MobileCore.resetIdentities();
```

- #### setPrivacyStatus

Set the Adobe Mobile Privacy status

**Syntax**

```typescript
setPrivacyStatus(privacyStatus: string) 
```

**Example**

```typescript
import {PrivacyStatus} from '@adobe/react-native-aepcore';

MobileCore.setPrivacyStatus(PrivacyStatus.OPT_IN);
```

Note: `PrivacyStatus` contains the following getters:

```typescript
const OPT_IN = "OPT_IN";
const OPT_OUT = "OPT_OUT";
const UNKNOWN = "UNKNOWN";
```

- #### setLogLevel

Set the logging level of the SDK

**Syntax**

```typescript
setLogLevel(mode: LogLevel)
```

**Example**

```typescript
import {LogLevel} from '@adobe/react-native-aepcore';

MobileCore.setLogLevel(LogLevel.VERBOSE);
```

- #### trackAction

> [!IMPORTANT]  
> trackAction is supported through [Edge Bridge](../edgebridge) and [Edge Network](../edge) extensions. 

Track event actions that occur in your application.

**Syntax**

```typescript
trackAction(action?: string, contextData?: Record<string, string>)
```

**Example**

```typescript
MobileCore.trackAction("loginClicked", {"customKey": "value"});
```

- #### trackState

> [!IMPORTANT]  
> trackState is supported through [Edge Bridge](../edgebridge) and [Edge Network](../edge) extensions.  

Track states that represent screens or views in your application. 

**Syntax**

```typescript
trackState(state?: string, contextData?: Record<string, string>)
```

**Example**

```typescript
MobileCore.trackState("homePage", {"customKey": "value"});
```

- #### updateConfiguration

Update the configuration programmatically by passing configuration keys and values to override the existing configuration.

**Syntax**

```typescript
updateConfiguration(configMap?: Record<string, any>)
```

**Example**

```typescript
MobileCore.updateConfiguration({"yourConfigKey": "yourConfigValue"});
```

- #### clearUpdatedConfiguration

You can clear any programmatic updates made to the configuration via the `clearUpdatedConfiguration` API.

**Syntax**

```typescript
clearUpdatedConfiguration()
```

**Example**

```typescript
MobileCore.clearUpdatedConfiguration();
```

### [Identity](https://developer.adobe.com/client-sdks/documentation/mobile-core/identity)

- #### appendVisitorInfoForURL

This function appends Adobe visitor information to the query component of the specified URL.

**Syntax**

```typescript
appendVisitorInfoForURL(baseURL?: String): Promise<string> 
```

**Example**

```typescript
Identity.appendVisitorInfoForURL("test.com").then(urlWithVisitorData => console.log("AdobeExperienceSDK: VisitorData = " + urlWithVisitorData));
```

- #### extensionVersion

Returns the version of the Identity extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
Identity.extensionVersion().then(version => console.log("AdobeExperienceSDK: Identity version: " + version));
```

- #### getUrlVariables

This function returns an appropriately formed string that contains the Experience Cloud Identity Service URL variables.

**Syntax**

```typescript
getUrlVariables(): Promise<string>
```

**Example**

```typescript
Identity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: UrlVariables = " + urlVariables));
```

- #### getIdentifiers

This function returns all customer identifiers that were previously synced with the Adobe Experience Cloud Identity Service.

**Syntax**

```typescript
getIdentifiers(): Promise<Array<VisitorID>>
```

**Example**

```typescript
Identity.getIdentifiers().then(identifiers => console.log("AdobeExperienceSDK: Identifiers = " + identifiers));
```

- #### getExperienceCloudId

This function retrieves the Adobe Experience Cloud ID (ECID) that was generated when the app was initially launched and is stored in the Adobe Experience Cloud Identity Service.

**Syntax**

```typescript
getExperienceCloudId(): Promise<string>
```

**Example**

```typescript
Identity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
```

- #### syncIdentifier

The `syncIdentifier`, `syncIdentifiers` and `syncIdentifiersWithAuthState` functions update the specified customer IDs with the Adobe Experience Cloud Identity Service.

**Syntax**

```typescript
 syncIdentifier(identifierType: String, identifier: String, authenticationState: MobileVisitorAuthenticationState) 
```

**Example**
```typescript
Identity.syncIdentifier("identifierType", "identifier", MobileVisitorAuthenticationState.AUTHENTICATED);
```

- #### syncIdentifiers

**Syntax**

```typescript
syncIdentifiers(identifiers?: Record<string, string>)
```

**Example**

```typescript
Identity.syncIdentifiers({"id1": "identifier1"});
```

- #### syncIdentifiersWithAuthState

**Syntax**

```typescript
syncIdentifiersWithAuthState(identifiers: Record<string, string> | null, authenticationState: MobileVisitorAuthenticationState)
```

**Example**

```typescript
import {MobileVisitorAuthenticationState} from '@adobe/react-native-aepcore';

Identity.syncIdentifiersWithAuthState({"id1": "identifier1"}, MobileVisitorAuthenticationState.UNKNOWN);
```

Note: `MobileVisitorAuthenticationState` contains the following getters:

```typescript
const AUTHENTICATED = "VISITOR_AUTH_STATE_AUTHENTICATED";
const LOGGED_OUT = "VISITOR_AUTH_STATE_LOGGED_OUT";
const UNKNOWN = "VISITOR_AUTH_STATE_UNKNOWN";
```

- #### setAdvertisingIdentifier

Submits a generic event containing the provided IDFA with event type `generic.identity`.

**Syntax**

```typescript
setAdvertisingIdentifier(advertisingIdentifier?: string)
```

**Example**

```typescript
MobileCore.setAdvertisingIdentifier("adID");
```

- #### setPushIdentifier

Submits a generic event containing the provided push token with event type `generic.identity`.

**Syntax**

```typescript
setPushIdentifier(pushIdentifier?: string) 
```

**Example**

```typescript
MobileCore.setPushIdentifier("pushIdentifier");
```

- #### VisitorID Class:

```typescript
import {VisitorID} from '@adobe/react-native-aepcore';

var visitorId = new VisitorID(idOrigin?: string, idType: string, id?: string, authenticationState?: MobileVisitorAuthenticationState)
```

### [Lifecycle](https://developer.adobe.com/client-sdks/documentation/mobile-core/lifecycle)

> Note: Implementing Lifecycle via Javascript may lead to inaccurate Lifecycle metrics, therefore we recommend implementing Lifecycle in native [Android and iOS code](https://developer.adobe.com/client-sdks/documentation/mobile-core/lifecycle).

> To enable Lifecycle metrics for the Edge workflows, see (Lifecycle for Edge Network) (https://developer.adobe.com/client-sdks/documentation/lifecycle-for-edge-network).

- #### extensionVersion

Returns the version of the Lifecycle extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
Lifecycle.extensionVersion().then(version => console.log("AdobeExperienceSDK: Lifecycle version: " + version));
```

### [Signal](https://developer.adobe.com/client-sdks/documentation/mobile-core/signal)

- #### extensionVersion

Returns the version of the Signal extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
Signal.extensionVersion().then(version => console.log("AdobeExperienceSDK: Signal version: " + version));
```
