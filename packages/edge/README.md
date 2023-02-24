
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
    [AEPMobileCore setLogLevel: AEPLogLevelDebug];
    [AEPMobileCore registerExtensions:@[AEPMobileEdgeIdentity.class, 
                                        AEPMobileEdge.class] completion:^{
        [AEPMobileCore configureWithAppId:@"yourAppID"];  
    ...   
   }]; 
   return YES;   
 } 

@end
```

Android
```java
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
  
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
    MobileCore.configureWithAppID("yourAppID");
    Edge.registerExtension();
    com.adobe.marketing.mobile.edge.identity.Identity.registerExtension();
    MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
        
        }});
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
extensionVersion(): Promise<string>;
```

**Example**
```typescript
Edge.extensionVersion().then(version => console.log("AdobeExperienceSDK: Edge version: " + version));
```
### resetIdentity
Resets current state of the AEP Edge extension and clears previously cached content related to current identity, if any.
See [MobileCore.resetIdentities](../core/README.md#resetidentities) for more details.

### sendEvent

**Syntax**
```typescript
sendEvent(experienceEvent: ExperienceEvent): Promise<Array<EdgeEventHandle>>;
```

**Example**
```typescript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new ExperienceEvent(xdmData, data);

// send ExperienceEvent ignoring the promise
Edge.sendEvent(experienceEvent);

// send ExperienceEvent with promise
Edge.sendEvent(experienceEvent).then(eventHandles => console.log("Edge.sentEvent returned EdgeEventHandles = " + JSON.stringify(eventHandles)));
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

**Syntax**
```typescript
class ExperienceEvent {
  xdmData?: Record<string, any>;
  data?: Record<string, any>;
  datasetIdentifier?: string;

  constructor(
    xdmData?: Record<string, any>,
    data?: Record<string, any>,
    datasetIdentifier?: string
  ) {
    this.xdmData = xdmData;
    this.data = data;
    this.datasetIdentifier = datasetIdentifier;
  }
}

export default ExperienceEvent;
```

**Example**
```typescript
//Example 1
// set freeform data to the Experience event
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new ExperienceEvent(xdmData, data);
```
```typescript
//Example 2
// Set the destination Dataset identifier to the current Experience event:
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = new ExperienceEvent(xdmData, null, "datasetIdExample")
```