
# React Native AEP Edge Network

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

## Usage

### Install npm package

> Requires `@adobe/react-native-aepcore` to be installed. - [Core](../core/README.md)
Install peer dependency `@adobe/react-native-aepedgeidentity` package. - [Edge Identity](../edgeidentity/README.md)

Install the `@adobe/react-native-aepedge` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedge
```

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing). 

Example:

iOS
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPEdgeIdentity;
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"your-app-ID"];
  [AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileEdge.class, AEPMobileEdgeIdentity.class
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
import com.adobe.marketing.mobile.Edge;
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
      Edge.registerExtension();
      Identity.registerExtension();
      Lifecycle.registerExtension();
      MobileCore.configureWithAppID("your-app-ID");
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

### [Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/experience-platform-extension)

#### Importing the extension:
```javascript
import {AEPEdge, AEPExperienceEvent} from '@adobe/react-native-aepedge';
```

##### Getting the extension version:

```javascript
AEPEdge.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdge version: " + version));
```
##### Create Experience Event from Dictionary:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = new AEPExperienceEvent(xdmData);
```

##### Add free form data to the Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = new AEPExperienceEvent(xdmData, data);
```

##### Set the destination Dataset identifier to the current Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = new AEPExperienceEvent(xdmData, null, "datasetIdExample")
```

##### Create Experience Event with xdmdata, free form data and the destination Dataset identifier:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"dataKey" : "dataValue"};
let experienceEvent = new AEPExperienceEvent(xdmData, data, "datasetIdExample")
```

#### Send an Experience Event:

```javascript
AEPEdge.sendEvent(experienceEvent)
```

#### Send an Experience Event with Event Handle Promise:

```javascript
AEPEdge.sendEvent(experienceEvent).then(eventHandle => console.log("AdobeExperienceSDK: AEPEdgeEventHandle = " + JSON.stringify(eventHandle)));
```