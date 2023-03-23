
# React Native Adobe Experience Platform Edge Bridge extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)

`@adobe/react-native-aepedgebridge` is a wrapper around the iOS and Android Adobe Experience Platform Edge Bridge to allow for integration with React Native applications.

## Prerequisites

The Edge Bridge extension has the following peer dependencies, which must be installed prior to installing the Edge Bridge extension:
- [Core](../core/README.md)
- [Edge Network](../edge/README.md)
- [Identity for Edge Network](../edgeidentity/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepedgebridge` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgebridge
```
## Usage

### Installing and registering the extension with the AEP Mobile Core

https://github.com/adobe/aepsdk-edgebridge-android/blob/main/Documentation/getting-started.md
https://github.com/adobe/aepsdk-edgebridge-ios/blob/main/README.md

Install the Adobe Experience Platform Edge Network extension in your mobile property and configure the default Datastream ID by following the steps in the [Edge Bridge extension documentation](https://developer.adobe.com/client-sdks/documentation/edge-network).

Then follow the same document for registering the Edge extension with the Mobile Core.
Note that initializing the SDK should be done in native code, additional documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).


**Initialization Example**

iOS
```objc
// AppDelegate.h
@import AEPCore;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeBridge;
...
@implementation AppDelegate

// AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

   // TODO: Set up the preferred Environment File ID from your mobile property configured in Data Collection UI
   NSString* ENVIRONMENT_FILE_ID = @"YOUR-APP-ID";

   NSArray *extensionsToRegister = @[AEPMobileEdgeIdentity.class, 
                                     AEPMobileEdge.class,
                                     AEPMobileEdgeBridge.class
                                     ];

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
import com.adobe.marketing.mobile.EdgeBridge;

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
    MobileCore.configureWithAppID("yourAppID");

    MobileCore.registerExtensions(
      Arrays.asList(Identity.EXTENSION, Edge.EXTENSION, EdgeBridge.EXTENSION),
      o -> Log.d("MainApp", "Adobe Experience Platform Mobile SDK was initialized")
    );
  }
}  
```

### Importing the extension
In your React Native application, import the Edge extension as follows:
```typescript
import {EdgeBridge} from '@adobe/react-native-aepedgebrdige';
```

## API reference
### extensionVersion
Returns the version of the client-side Edge Bridge extension.

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
EdgeBridge.extensionVersion().then(version => console.log("AdobeExperienceSDK: Edge Bridge version: " + version));
```
