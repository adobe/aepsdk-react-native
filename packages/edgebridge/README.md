
# React Native Adobe Experience Platform Edge Bridge extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgebridge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgebridge)](https://www.npmjs.com/package/@adobe/react-native-aepedgebridge)

`@adobe/react-native-aepedgebridge` is a wrapper around the iOS and Android Adobe Experience Platform Edge Bridge to allow for integration with React Native applications.

The Edge Bridge mobile extension provides seamless routing of data to the Adobe Experience Platform Edge Network for existing SDK implementations. For applications which already make use of the [MobileCore.trackAction](../core/README.md#trackaction) and/or [MobileCore.trackState](../core/README.md#trackstate) APIs to send data to Adobe Analytics, this extension will automatically route those API calls to the Edge Network, making the data available for mapping to a user's XDM schema using the [Data Prep for Data Collection](https://experienceleague.adobe.com/docs/experience-platform/data-prep/home.html).

> [!IMPORTANT]
> Edge Bridge serves primarily as a migration aid for applications that are already using Adobe Analytics within their implementation. 
>
> For new applications being developed with the Adobe Experience Platform Mobile SDKs, it is strongly recommended to use the [`Edge.sendEvent`](../edge/README.md#api-reference) API of the Edge Network extension.

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

Install the Adobe Experience Platform Edge Network extension in your mobile property and configure the default Datastream ID by following the steps in the [Edge Network extension documentation](https://developer.adobe.com/client-sdks/documentation/edge-network).

> **Note**  
> Experience Platform Edge Bridge does not have a corresponding extension card in the Data Collection UI; no changes to a Data Collection mobile property are required to use Edge Bridge.

Then register the Edge Bridge extension with the Mobile Core.
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
In your React Native application, import the Edge Bridge extension as follows:
```typescript
import {EdgeBridge} from '@adobe/react-native-aepedgebridge';
```

### Edge Bridge tutorials

For tutorials on implementing Edge Bridge and Data Prep mapping, refer to the [Edge Bridge tutorials](https://github.com/adobe/aepsdk-edgebridge-ios/tree/main/Documentation/tutorials).

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
