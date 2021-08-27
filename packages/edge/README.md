
# React Native AEP Edge Network

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

## Usage

### [Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/experience-platform-extension)

#### Importing the extension:
```javascript
import {AEPEdge} from '@adobe/react-native-aepedge';
```

##### Getting the extension version:

```javascript
AEPEdge.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdge version: " + version));
```
##### Create Experience Event from Dictionary:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = ExperienceEvent(xdmData);
```

##### Add free form data to the Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"free": "form", "data": "example"};
let experienceEvent = ExperienceEvent(xdmData, data);
```

##### Set the destination Dataset identifier to the current Experience event:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
let experienceEvent = ExperienceEvent(xdmData, null, datasetIdentifier: "datasetIdExample")
```

##### Create Experience Event with xdmdata, free form data and the destination Dataset identifier:

```javascript
var xdmData  = {"eventType" : "SampleXDMEvent"};
var data  = {"dataKey" : "dataValue"};
let experienceEvent = ExperienceEvent(xdmData, data, datasetIdentifier: "datasetIdExample")
```

#### Send an Experience Event:

```javascript
AEPEdge.sendEvent(ExperienceEvent)
```
