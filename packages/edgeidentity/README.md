
# React Native AEP Identity for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity)

`@adobe/react-native-aepedgeidentity` is a wrapper around the iOS and Android [AEP Identity for Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network) to allow for integration with React Native applications.

## Prerequisites

The AEP Identity for Edge Network extension has the following peer dependency, which must be installed prior to installing the messaging extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepedgeidentity` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgeidentity
```

## Usage

### [AEP Identity for Edge Network extension](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network)
Install the AEP Identity for Edge Network extension in your mobile property by following the steps in the [documentation](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network).

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

:information_source: When register the Identity and Identity for Edge Network extensions in the same app, follow the [FAQ documentation](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network/identity-faq#register-the-identity-and-identity-for-edge-network-extensions-with-mobile-core) here with registering the full package name.  

Example:

iOS
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdgeIdentity;
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];
  [AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileEdgeIdentity.class
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];

  return YES;
}

@end
```

Android
```java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.edge.identity;
  
...
import android.app.Application;
...
public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  public void on Create(){
    super.onCreate();
    ...
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.DEBUG);
    MobileCore.setWrapperType(WrapperType.REACT_NATIVE);

    try {
      Identity.registerExtension();
      Lifecycle.registerExtension();
      MobileCore.configureWithAppID("yourAppID");
      MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
          MobileCore.lifecycleStart(null);
        }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}     
```
### [Identity for Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network)

### Importing the extension:
In your React Native application, import the AEPEdgeIdentity extension as follows:
```javascript
import {AEPIdentity} from '@adobe/react-native-aepedgeidentity';
```

## API reference
### Extension version:
Returns the version of the AEPEdgeIdentity for Edge Network extension

**Syntax**

```javascript
static extensionVersion(): Promise<string>
```
**Example**
```javascript
AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdgeIdentity version: " + version));
```
### Get Experience Cloud ID:
This API retrieves the ECID that was generated when the app was initially launched.
This ID is preserved between app upgrades, is saved and restored during the standard application backup process, and is removed at uninstall. 
A promise method which will be invoked once the Experience Cloud ID is available or rejected if an unexpected error occurred or the request timed out.

**Syntax**
```javascript
getExperienceCloudId(): Promise<?string>
```

**Example**
```javascript
AEPIdentity.getExperienceCloudId().then(experienceCloudId => console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId));
```

### Get Identities:
Get all identities in the Identity for AEPEdgeIdentity extension, including customer identifiers which were previously added.
A promise method which will be invoked once the identities are available or rejected if an unexpected error occurred or the request timed out.

**Syntax**
```javascript
getIdentities(): Promise<AEPIdentityMap> 
```
**Example**
```javascript
AEPIdentity.getIdentities().then(identities => console.log("AdobeExperienceSDK: Get AEP Identities = " + JSON.stringify(identities)));
```

### Update Identities:
Update the currently known identities within the SDK. The Identity extension will merge the received identifiers with the previously saved ones in an additive manner, no identities are removed from this API.

Identities with an empty id or namespace are not allowed and are ignored.

Updating identities using a reserved namespace is not allowed using this API. The reserved namespaces are:
* ECID
* IDFA
* GAID

**Syntax**
```javascript
updateIdentities(identityMap: AEPIdentityMap)
```
**Example**
```javascript
var identityItem  = new AEPIdentityItem("user@example.com");
var map = new AEPIdentityMap();
map.addItem(identityItem, "Email");
AEPIdentity.updateIdentities(map);
```

### Remove Identities:
Remove the identity from the stored client-side IdentityMap. The Identity extension will stop sending the identifier to the Edge Network. Using this API does not remove the identifier from the server-side User Profile Graph or Identity Graph.

Identities with an empty id or namespace are not allowed and are ignored.

Removing identities using a reserved namespace is not allowed using this API. The reserved namespaces are:
* ECID
* IDFA
* GAID

**Syntax**
```javascript
removeIdentity(item: AEPIdentityItem, namespace: string) 
```
**Example**
```javascript
var identityItem  = new AEPIdentityItem("user@example.com");
AEPIdentity.removeIdentity(identityItem, "Email");
```

### Reset Identities:
Clears all identities stored in the Identity extension and generates a new Experience Cloud ID (ECID) . Using this API does not remove the identifiers from the server-side User Profile Graph or Identity Graph.

:information_source: The Identity for Edge Network extension does not read the Mobile SDK's privacy status and therefor setting the SDK's privacy status to opt-out will not clear the identities from the Identity for Edge Network extension.

Refer to [reset identities api](https://github.com/emdobrin/aepsdk-react-native/tree/consent/packages/core#reset-identities)

## Public Classes
### IdentityMap

Defines a map containing a set of end user identities, keyed on either namespace integration code or the namespace ID of the identity. The values of the map are an array, meaning that more than one identity of each namespace may be carried.
The format of the IdentityMap class is defined by the [XDM Identity Map Schema](https://github.com/adobe/xdm/blob/master/docs/reference/mixins/shared/identitymap.schema.md).

For more information, please read an overview of the [AEP Identity Service](https://experienceleague.adobe.com/docs/experience-platform/identity/home.html).

```
"identityMap" : {
    "Email" : [
      {
        "id" : "user@example.com",
        "authenticatedState" : "authenticated",
        "primary" : false
      }
    ],
    "Phone" : [
      {
        "id" : "1234567890",
        "authenticatedState" : "ambiguous",
        "primary" : false
      },
      {
        "id" : "5557891234",
        "authenticatedState" : "ambiguous",
        "primary" : false
      }
    ],
    "ECID" : [
      {
        "id" : "44809014977647551167356491107014304096",
        "authenticatedState" : "ambiguous",
        "primary" : true
      }
    ]
  }
```
**Example**
```javascript
var map = new AEPIdentityMap();

// Add an item
var identityItem  = new AEPIdentityItem("user@example.com");
map.addItem(identityItem, "Email");

// Remove an item
var identityItem  = new AEPIdentityItem("user@example.com");
map.removeItem(identityItem, "Email");

//Get a list of items for a given namespace
var mamespacecheck = map.getIdentityItemsForNamespace("Email");

//Get a list of all namespaces used in current IdentityMap
var namespaces = map.getNamespaces();

//Check if IdentityMap has no identities
var hasNoIdentities = new Boolean(map.isEmpty());
```

### IdentityItem
Defines an identity to be included in an IdentityMap.

The format of the IdentityItem class is defined by the [XDM Identity Item Schema](https://experienceleague.adobe.com/docs/experience-platform/identity/home.html).

**Example**
```javascript

// Initialize
var item  = new AEPIdentityItem("identifier");

var item  = new AEPIdentityItem("identifier", AEPAuthenticatedState.AUTHENTICATED, false);

//Getters
var id = item.id;
var state = item.authenticatedState;
var primary = item.primary
```

### AuthenticatedState
Defines the state an Identity Item is authenticated for.

The possible authenticated states are:
* Ambiguous - the state is ambiguous or not defined
* Authenticated - the user is identified by a login or similar action
* LoggedOut - the user was identified by a login action at a previous time, but is not logged in now

//TO DO: Add Syntax


## Frequently Asked Questions (FAQ)
Q: What steps are needed to generate a new Experience Cloud ID (ECID) for a user when using both AEP Edge extensions and Adobe Solutions extensions?

A: Both identity extensions' ECID must be regenerated in sequence to avoid linking the old and new ECIDs in Adobe Experience Platform.

```javascript
AEPCore.setPrivacyStatus(AEPMobilePrivacyStatus.OPT_OUT)
AEPCore.resetIdentities();
AEPIdentity.getExperienceCloudId().then(experienceCloudId =>  console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId));
AEPCore.setPrivacyStatus(AEPMobilePrivacyStatus.OPT_IN)
```
More FQA refer to [identity-faq](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network/identity-faq#a-both-identity-extensions-ecid-must-be-regenerated-in-sequence-to-avoid-linking-the-old-and-new-eci)