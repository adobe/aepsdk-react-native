
# React Native Adobe Experience Platform Identity for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity)

`@adobe/react-native-aepedgeidentity` is a wrapper around the iOS and Android [Adobe Experience Platform Identity for Edge Network Extension](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network) to allow for integration with React Native applications.

## Prerequisites

The Adobe Experience Platform Identity for Edge Network extension has the following peer dependency, which must be installed prior to installing the identity extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepedgeidentity` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgeidentity
```

## Usage

### Installing and registering the extension with the AEP Mobile Core

The Identity for Edge Network is required for providing the identity information to the Edge Network extension when sending Experience events.

Install the Identity extension in your mobile property by following the steps in the [Identity for Edge Network extension documentation](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network).

Then follow the same document for registering the Identity extension with the Mobile Core.
Note that initializing the SDK should be done in native code, additional documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).


**Initialization Example**

iOS
```objc
// AppDelegate.h
@import AEPCore;
@import AEPEdge;
@import AEPEdgeIdentity;
...
@implementation AppDelegate

// AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    // TODO: Set up the preferred Environment File ID from your mobile property configured in Data Collection UI
    NSString* ENVIRONMENT_FILE_ID = @"YOUR-APP-ID";

    NSArray *extensionsToRegister = @[AEPMobileEdgeIdentity.class, 
                                    AEPMobileEdge.class
                                    ];

    [AEPMobileCore registerExtensions:extensionsToRegister completion:^{
    [AEPMobileCore configureWithAppId: ENVIRONMENT_FILE_ID];  
    ...   
  }]; 
   return YES;   
 } 

@end
```

Android
```java
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.identity.Identity;  
...
import android.app.Application;
...
public class MainApplication extends Application implements ReactApplication {
  ...
  // TODO: Set up the preferred Environment File ID from your mobile property configured in Data Collection UI
  private final String ENVIRONMENT_FILE_ID = "YOUR-APP-ID";

  @Override
  public void on Create(){
    super.onCreate();
    ...
    MobileCore.setApplication(this);
    MobileCore.configureWithAppID(ENVIRONMENT_FILE_ID);

    MobileCore.registerExtensions(
     Arrays.asList(Identity.EXTENSION, Edge.EXTENSION),
     o -> Log.d("MainApp", "Adobe Experience Platform Mobile SDK was initialized")
    );
  }
}  
```

:information_source: If your use-case covers both Edge Network and Adobe Experience Cloud Solutions extensions, you need to register Identity for Edge Network and Identity from Mobile Core for Experience Cloud Identity Service extensions. For more details, see the [Frequently asked questions](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network/faq/#q-i-am-using-aep-edge-and-adobe-solutions-extensions-which-identity-extension-should-i-install-and-register).


### [Identity for Edge Network](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network)

### Importing the extension:
In your React Native application, import the Identity extension as follows:
```typescript
import {Identity} from '@adobe/react-native-aepedgeidentity';
```

## API reference
### extensionVersion:
Returns the version of the Identity for Edge Network extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```
**Example**

```typescript
Identity.extensionVersion().then(version => console.log("AdobeExperienceSDK: EdgeIdentity version: " + version));
```
### getExperienceCloudId:
This API retrieves the ECID that was generated when the app was initially launched.
This ID is preserved between app upgrades, is saved and restored during the standard application backup process, and is removed at uninstall. 
A promise method which will be invoked once the Experience Cloud ID is available or rejected if an unexpected error occurred or the request timed out.

**Syntax**
```typescript
getExperienceCloudId(): Promise<string>
```

**Example**
```typescript
Identity.getExperienceCloudId().then(experienceCloudId => console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId));
```

### getIdentities:
Get all the identities in the Identity for Edge Network extension, including customer identifiers which were previously added.
A promise method which will be invoked once the identities are available or rejected if an unexpected error occurred or the request timed out.

**Syntax**
```typescript
getIdentities(): Promise<IdentityMap>
```
**Example**
```typescript
Identity.getIdentities().then(identities => console.log("AdobeExperienceSDK: Get Identities = " + JSON.stringify(identities)));
```

### getUrlVariables:
Returns the identifiers in a URL's query parameters for consumption in hybrid mobile applications. The response will not return any leading & or ?, since the caller is responsible for placing the variables in the resulting URL in the correct locations. If an error occurs while retrieving the URL variables, the callback handler will return a null value. Otherwise, the encoded string is returned.
An example of an encoded string is as follows: "adobe_mc=TS%3DTIMESTAMP_VALUE%7CMCMID%3DYOUR_ECID%7CMCORGID%3D9YOUR_EXPERIENCE_CLOUD_ID"

* MCID: This is also known as the Experience Cloud ID (ECID).
* MCORGID: This is also known as the Experience Cloud Organization ID.
* TS: The timestamp that is taken when the request was made.

**Syntax**
```typescript
getUrlVariables(): Promise<string>
```

**Example**
```typescript
Identity.getUrlVariables().then(urlVariables => console.log("AdobeExperienceSDK: URL Variables = " + urlVariables));
```

### removeIdentity:
Remove the identity from the stored client-side IdentityMap. The Identity extension will stop sending the identifier to the Edge Network. Using this API does not remove the identifier from the server-side User Profile Graph or Identity Graph.

Identities with an empty id or namespace are not allowed and are ignored.

Removing identities using a reserved namespace is not allowed using this API. The reserved namespaces are:
* ECID
* IDFA
* GAID

**Syntax**
```typescript
removeIdentity(item: IdentityItem, namespace: string)
```
**Example**
```typescript
let identityItem  = new IdentityItem("user@example.com");
Identity.removeIdentity(identityItem, "Email");
```

### resetIdentity:
Clears all identities stored in the Identity extension and generates a new Experience Cloud ID (ECID) . Using this API does not remove the identifiers from the server-side User Profile Graph or Identity Graph.

:information_source: The Identity for Edge Network extension does not read the Mobile SDK's privacy status and therefor setting the SDK's privacy status to opt-out will not clear the identities from the Identity for Edge Network extension.

For more details, see the[MobileCore.resetIdentities API](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#reset-identities).

### setAdvertisingIdentifier:
When this API is called with a valid advertising identifier, the Identity for Edge Network extension includes the advertising identifier in the XDM Identity Map using the namespace GAID (Google Advertising ID) in Android and IDFA (Identifier for Advertisers) in iOS. If the API is called with the empty string (""), null/nil, or the all-zeros UUID string values, the advertising identifier is removed from the XDM Identity Map (if previously set).
The advertising identifier is preserved between app upgrades, is saved and restored during the standard application backup process, and is removed at uninstall.

**Syntax**

```typescript
setAdvertisingIdentifier(advertisingIdentifier?: string)
```

**Example**

```typescript
MobileCore.setAdvertisingIdentifier("adID");
```

### updateIdentities:

Update the currently known identities within the SDK. The Identity extension will merge the received identifiers with the previously saved ones in an additive manner, no identities are removed from this API.

Identities with an empty id or namespace are not allowed and are ignored.

Updating identities using a reserved namespace is not allowed using this API. The reserved namespaces are:

* ECID
* IDFA
* GAID

**Syntax**

```typescript
updateIdentities(identityMap: IdentityMap)
```

**Example**

```typescript
let identityItem  = new IdentityItem("user@example.com");
let map = new IdentityMap();
map.addItem(identityItem, "Email");
Identity.updateIdentities(map);
```

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
```typescript
let map = new IdentityMap();

// Add an item
let identityItem  = new IdentityItem("user@example.com");
map.addItem(identityItem, "Email");

// Remove an item
let identityItem  = new IdentityItem("user@example.com");
map.removeItem(identityItem, "Email");

//Get a list of items for a given namespace
let namespacecheck = map.getIdentityItemsForNamespace("Email");

//Get a list of all namespaces used in current IdentityMap
let namespaces = map.getNamespaces();

//Check if IdentityMap has no identities
let hasNoIdentities = map.isEmpty();
```

### IdentityItem
Defines an identity to be included in an [IdentityMap](README.md#IdentityMap).

The format of the IdentityItem class is defined by the [XDM Identity Item Schema](https://experienceleague.adobe.com/docs/experience-platform/identity/home.html).

**Example**

```typescript
// Initialize
let item  = new IdentityItem("identifier");

let item  = new IdentityItem("identifier", AuthenticatedState.AUTHENTICATED, false);

//Getters
let id = item.id;
let state = item.authenticatedState;
let primary = item.primary
```

### AuthenticatedState
Defines the state an [Identity Item](README.md#IdentityItem) is authenticated for.

The possible authenticated states are:
* Ambiguous - the state is ambiguous or not defined
* Authenticated - the user is identified by a login or similar action
* LoggedOut - the user was identified by a login action at a previous time, but is not logged in now

**Syntax**

```typescript
 export enum AuthenticatedState {
   AUTHENTICATED = 'authenticated',
   LOGGED_OUT = 'loggedOut',
   AMBIGUOUS = 'ambiguous'
 }
```


## Frequently Asked Questions (FAQ)
For more details, refer to the [frequently asked questions page](https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network/faq)