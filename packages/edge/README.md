
# React Native Adobe Experience Platform Edge Network extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

`@adobe/react-native-aepedge` is a wrapper around the iOS and Android [Adobe Experience Platform Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/experience-platform-extension) to allow for integration with React Native applications.

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

Install the Adobe Experience Platform Edge Network extension in your mobile property and configure the default Datastream ID by following the steps in the [Edge Network extension documentation](https://aep-sdks.gitbook.io/docs/foundation-extensions/experience-platform-extension).

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
    [AEPMobileCore setWrapperType: AEPWrapperTypeReactNative];
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
import com.adobe.marketing.mobile.WrapperType;
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
    MobileCore.setWrapperType(WrapperType.REACT_NATIVE);
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
```javascript
import {Edge, ExperienceEvent} from '@adobe/react-native-aepedge';
```

## API reference
### extensionVersion

**Syntax**
```javascript
extensionVersion(): Promise<string>;
```

**Example**
```javascript
Edge.extensionVersion().then(version => console.log("AdobeExperienceSDK: Edge version: " + version));
```

### sendEvent

**Syntax**
```javascript
sendEvent(experienceEvent: ExperienceEvent): Promise<Array<EdgeEventHandle>>;
```

**Example**
```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new ExperienceEvent(xdmData, data);

// send ExperienceEvent ignoring the promise
Edge.sendEvent(experienceEvent);

// send ExperienceEvent with promise
Edge.sendEvent(experienceEvent).then(eventHandles => console.log("Edge.sentEvent returned EdgeEventHandles = " + JSON.stringify(eventHandles)));
```

### Public classes
#### ExperienceEvent

##### Create Experience Event from Dictionary:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = new ExperienceEvent(xdmData);
```

##### Add free form data to the Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new ExperienceEvent(xdmData, data);
```

##### Set the destination Dataset identifier to the current Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = new ExperienceEvent(xdmData, null, "datasetIdExample")
```

##### Create Experience Event with xdmdata, free form data and the destination Dataset identifier:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"dataKey" : "dataValue"};
let experienceEvent = new ExperienceEvent(xdmData, data, "datasetIdExample")
```