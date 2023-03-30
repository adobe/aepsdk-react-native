
# React Native Consent for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeconsent.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeconsent)](https://www.npmjs.com/package/@adobe/react-native-aepedgeconsent)

`@adobe/react-native-aepedgeconsent` is a wrapper for the iOS and Android [Consent for Edge Network extension](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network) to allow for integration with React Native applications.

## Prerequisites

The Consent for Edge Network extension has the following peer dependency, which must be installed prior to installing the Consent extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page. 

Install the `@adobe/react-native-aepedgeconsent` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgeconsent
```

## Usage

### Installing and registering the extension with the AEP Mobile Core
Install the Consent extension in your mobile property and configure the default consent preferences by following the steps in the [Consent for Edge Network extension documentation](https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network).

Then follow the same document for registering the Consent extension with the Mobile Core.
Note that initializing the SDK should be done in native code, additional documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

**Initialization Example**

iOS
```objc
// AppDelegate.h
@import AEPCore;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
...
@implementation AppDelegate

// AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // TODO: Set up the preferred Environment File ID from your mobile property configured in Data Collection UI
    NSString* ENVIRONMENT_FILE_ID = @"YOUR-APP-ID";

    NSArray *extensionsToRegister = @[AEPMobileEdgeIdentity.class, 
                                      AEPMobileEdge.class, 
                                      AEPMobileEdgeConsent.class
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
import com.adobe.marketing.mobile.edge.consent.Consent;
  
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
    Arrays.asList(Consent.EXTENSION, Identity.EXTENSION, Edge.EXTENSION),
    o -> Log.d("MainApp", "Adobe Experience Platform Mobile SDK was initialized")
    );
  }
}  
```

### Importing the extension
In your React Native application, import the Consent extension as follows:
```typescript
import {Consent} from "@adobe/react-native-aepedgeconsent";
```

## API reference

### extensionVersion
Returns the version of the Consent extension

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
Consent.extensionVersion().then(version => console.log("Consent.extensionVersion: " + version));
```

### getConsents
Retrieves the current consent preferences stored in the Consent extension and resolves the promise with the current consent preferences or rejects it if an unexpected error occurs or the request timed out. 
Output example: {"consents": {"collect": {"val": "y"}}}

**Syntax**
```typescript
getConsents(): Promise<Record<string, any>>
```

**Example**
```typescript
Consent.getConsents().then(consents => {
  console.log("AEPConsent.getConsents returned current consent preferences:  " + JSON.stringify(consents));
}).catch((error) => {
  console.warn("AEPConsent.getConsents returned error: ", error.message);
});
```

### update
Merges the existing consents with the given consents. Duplicate keys will take the value of those passed in the API.
Input example: {"consents": {"collect": {"val": "y"}}}

**Syntax**
```typescript
update(consents: Record<string, any>) 
```

**Example**
```typescript
var consents: {[keys: string]: any} = {"consents" : {"collect" : {"val": "y"}}};
Consent.update(consents);
```