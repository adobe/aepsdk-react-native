
# React Native Adobe Experience Platform Edge Bridge extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)

`@adobe/react-native-aepedgebridge` is a wrapper around the iOS and Android Adobe Experience Platform Edge Bridge to allow for integration with React Native applications.

The Adobe Experience Platform Edge Bridge mobile extension enables forwarding of Analytics track events to Experience Platform Edge Network when using the [Experience Platform Mobile SDK](https://developer.adobe.com/client-sdks) and the Edge Network extension. The complete ingestion process occurs in two main steps:

1. Edge Bridge forwards the track event data to Edge Network in a generic data format. 
2. The generic data is converted into the Experience Data Model (XDM) format, which is a standard experience-driven data schema for Adobe and partner solutions. 
   * This conversion mapping can be set in the Data Collection datastream associated with the application's mobile property using [Data Prep for Data Collection](https://experienceleague.adobe.com/docs/platform-learn/data-collection/edge-network/data-prep.html).
  
   * For more info, refer to [Data Prep for Data Collection](https://experienceleague.adobe.com/docs/experience-platform/data-prep/home.html).

> **Note**  
> For new implementations of the Adobe Experience Platform SDK, it's highly recommended to send event data that is already XDM formatted using the [`Edge.sendEvent`](../edge/README.md#api-reference) API instead of converting events from the `MobileCore.trackState` and `MobileCore.trackAction` APIs using Edge Bridge. 
> 
> However, in cases where it is not easy to refactor an existing application, the Edge Bridge extension exists as a drop-in solution to send converted `trackState` and `trackAction` events to the Edge Network.


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

Install the `Adobe Experience Platform Edge Network extension` in your mobile property and configure the default Datastream ID by following the steps in the [Edge Network extension documentation](https://developer.adobe.com/client-sdks/documentation/edge-network).

For sending the data to Analytics Report, Add Service `Adobe Analytics` to Datastreams when configurating. 

> **Note**  
> Experience Platform Edge Bridge does not have a corresponding extension card in the Data Collection UI; no changes to a Data Collection mobile property are required to use Edge Bridge.

Then registering the Edge Bridge extension with the Mobile Core.
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
import com.adobe.marketing.mobile.edge.bridge.EdgeBridge

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
      Arrays.asList(Identity.EXTENSION, Edge.EXTENSION, EdgeBridge.EXTENSION),
      o -> Log.d("MainApp", "Adobe Experience Platform Mobile SDK was initialized")
    );
  }
}  
```

### Importing the extension
In your React Native application, import the Edge extension as follows:
```typescript
import {EdgeBridge} from '@adobe/react-native-aepedgebridge';
```

### Validating and Data Prep Mapping

Refer to [Validating Event in Assurance tutorial](https://github.com/adobe/aepsdk-edgebridge-ios/blob/main/Documentation/tutorials/edge-bridge-tutorial.md#initial-validation-with-assurance) for Edge Bridge events examples.

Refer to [Data Prep Mapping tutorial](https://github.com/adobe/aepsdk-edgebridge-ios/blob/main/Documentation/tutorials/edge-bridge-tutorial.md#data-prep-mapping) for Data Prep Mapping examples.

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
