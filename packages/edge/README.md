
# React Native AEP Edge Network

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

## Usage

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://aep-sdks.gitbook.io/docs/getting-started/get-the-sdk#2-add-initialization-code). 

Example:

Objective-C
```objectivec
[AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileEdgeIdentity.class, AEPMobileEdge.class] completion:^{
          [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
```

JAVA
```java
  Edge.registerExtension();
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

#### Send an Experience Event with 

```javascript
AEPEdge.sendEvent(experienceEvent).then(eventHandle => console.log("AdobeExperienceSDK: AEPEdgeEventHandle = " + JSON.stringify(eventHandle)));
```
