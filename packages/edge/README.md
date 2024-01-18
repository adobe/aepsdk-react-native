
# React Native Adobe Experience Platform Edge Network extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

`@adobe/react-native-aepedge` is a wrapper around the iOS and Android [Adobe Experience Platform Edge Network](https://developer.adobe.com/client-sdks/documentation/edge-network) to allow for integration with React Native applications.

## Prerequisites

The Edge Network extension has the following peer dependencies, which must be installed prior to installing the Edge extension:
- [Core](../core/README.md)
- [Identity for Edge Network](../edgeidentity/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepedge` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedge
```
## Usage

### Installing and registering the extension with the AEP Mobile Core

Install the Adobe Experience Platform Edge Network extension in your mobile property and configure the default Datastream ID by following the steps in the [Edge Network extension documentation](https://developer.adobe.com/client-sdks/documentation/edge-network).

Then follow the same document for registering the Edge extension with the Mobile Core.
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

### Importing the extension
In your React Native application, import the Edge extension as follows:
```typescript
import {Edge, ExperienceEvent} from '@adobe/react-native-aepedge';
```

## API reference
### extensionVersion
Returns the version of the client-side Edge extension.

**Syntax**
```typescript
extensionVersion(): Promise<string>
```

**Example**
```typescript
Edge.extensionVersion().then(version => console.log("AdobeExperienceSDK: Edge version: " + version));
```
### getLocationHint
Gets the Edge Network location hint used in requests to the Adobe Experience Platform Edge Network. The Edge Network location hint may be used when building the URL for Adobe Experience Platform Edge Network requests to hint at the server cluster to use.

**Syntax**
```typescript
getLocationHint(): Promise<string|null>
```

**Example**
```typescript
Edge.getLocationHint().then(hint =>
    console.log('AdobeExperienceSDK: location hint = ' + hint),
);
```

### setLocationHint
Sets the Edge Network location hint used in requests to the Adobe Experience Platform Edge Network. Passing null or an empty string clears the existing location hint. Edge Network responses may overwrite the location hint to a new value when necessary to manage network traffic.

>Warning: Use caution when setting the location hint. Only use location hints for the "EdgeNetwork" scope. An incorrect location hint value will cause all Edge Network requests to fail with 404 response code.

**Syntax**
```typescript
setLocationHint(hint?: string)
```

**Example**
```typescript
Edge.setLocationHint('va6');
```

### resetIdentity
Resets current state of the AEP Edge extension and clears previously cached content related to current identity, if any.
See [MobileCore.resetIdentities](../core/README.md#resetidentities) for more details.

### sendEvent

Sends an Experience event to Edge Network.

Starting with **@adobe/react-native-aepedge v5.1.0**, the sendEvent API supports optional Datastream overrides. This allows you to adjust your datastreams without the need for new ones or modifications to existing settings. The process involves two steps:

1. Define your Datastream configuration overrides on the [datastream configuration page](https://experienceleague.adobe.com/docs/experience-platform/datastreams/configure.html).
2. Send these overrides to the Edge Network using the sendEvent API.

>Note: You can find a tutorial for Datastream config overrides using rules [here](https://developer.adobe.com/client-sdks/edge/edge-network/tutorials/datastream-config-override-rules/).

**Syntax**
```typescript
sendEvent(experienceEvent: ExperienceEvent): Promise<Array<EdgeEventHandle>>
```

**Example**
```typescript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new ExperienceEvent({xdmData: xdmData , data: data});

// send ExperienceEvent ignoring the promise
Edge.sendEvent(experienceEvent);

// send ExperienceEvent with promise
Edge.sendEvent(experienceEvent).then(eventHandles => console.log("Edge.sentEvent returned EdgeEventHandles = " + JSON.stringify(eventHandles)));
```

**Example with Datastream ID override**
```typescript
var xdmData  = {"eventType" : "SampleXDMEvent"};

let experienceEvent = new ExperienceEvent({xdmData: xdmData, datastreamIdOverride: 'datastreamId'});

// send ExperienceEvent ignoring the promise
Edge.sendEvent(experienceEvent);
```

**Example with Datastream config override**
```typescript
var xdmData = { eventType: 'SampleXDMEvent' };
let configOverrides = {
    com_adobe_experience_platform: {
      datasets: {
        event: {
          datasetId: 'SampleEventDatasetIdOverride',
        },
      },
    },
    com_adobe_analytics: {
      reportSuites: ['sampleRSID'],
    }
   };

let experienceEvent = new ExperienceEvent({xdmData: xdmData, datastreamConfigOverride: configOverrides});


// send ExperienceEvent ignoring the promise
Edge.sendEvent(experienceEvent);
```

### Public classes

#### EdgeEventHandle
The EdgeEventHandle is a response fragment from Adobe Experience Platform Edge Network for a sent XDM Experience Event. One event can receive none, one or multiple EdgeEventHandle(s) as response.

```typescript
class EdgeEventHandle {
  type?: string;
  payload?: Array<Record<string, any>>;

  constructor(type?: string, payload?: Array<Record<string, any>>) {
    this.type = type;
    this.payload = payload;
  }
}

export default EdgeEventHandle;
```

#### ExperienceEvent

Experience Event is the event to be sent to Adobe Experience Platform Edge Network. The XDM data is required for any Experience Event being sent using the Edge extension.

**Usage**
```typescript
  //Experience Event setting with objects, recommended way to create experience event
  ExperienceEvent({xdmData: xdmData, data: data, datasetIdentifier: datasetIdentifier});
  ExperienceEvent({xdmData: xdmData, data: data, datastreamIdOverride: datastreamIdOverride});
  ExperienceEvent({xdmData: xdmData, data: data, datastreamConfigOverride: datastreamConfigOverride});

  //Experience Event setting with parameters, previously supported
  ExperienceEvent(xdmData: xdmData, data: data, datasetIdentifier: datasetIdentifier);
```

**Example**
```typescript
//Example 1
// set free form data to the Experience event
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};

let experienceEvent = new ExperienceEvent({xdmData: xdmData, data: data});
```
```typescript
//Example 2
// Set free form data and datastream id override to the current Experience event:
var xdmData = { eventType: 'SampleXDMEvent' };
var data  = {"free": "form", "data": "example"};

let experienceEvent = new ExperienceEvent({xdmData: xdmData, data: data, datastreamIdOverride: 'datastreamId'});
```

```typescript
//Example 3
// Set datastream config override to the current Experience event:
var xdmData = { eventType: 'SampleXDMEvent' };
let configOverrides = {
    com_adobe_experience_platform: {
      datasets: {
        event: {
          datasetId: 'SampleEventDatasetIdOverride',
        },
      },
    },
    com_adobe_analytics: {
      reportSuites: ['sampleRSID'],
    }
   };

let experienceEvent = new ExperienceEvent({xdmData: xdmData, datastreamConfigOverride: configOverrides});
```

## Next steps - Schemas setup and validation with Assurance
For examples on XDM schemas and datasets setup and tips on validating with Assurance, refer to the [Edge Network tutorial](https://github.com/adobe/aepsdk-edge-ios/blob/main/Documentation/Tutorials).
