
# React Native AEP Edge Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedge.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedge) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedge)](https://www.npmjs.com/package/@adobe/react-native-aepedge)

## Usage

### [Edge](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/edge)

#### Importing the extension:
```javascript
import {AEPEdge} from '@adobe/react-native-aepedge';
```

#### Getting the extension version:

```javascript
AEPEdge.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdge version: " + version));
```
#### Create Experience Event from Dictionary:

```javascript
var xdmData : [String: Any] = ["eventType" : "SampleXDMEvent",
                              "sample": "data"]
let experienceEvent = ExperienceEvent(xdm: xdmData)
```

#### Add free form data to the Experience event:

```javascript
let experienceEvent = ExperienceEvent(xdm: xdmData, data: ["free": "form", "data": "example"])
```

#### Set the destination Dataset identifier to the current Experience event:

```javascript
let experienceEvent = ExperienceEvent(xdm: xdmData, datasetIdentifier: "datasetIdExample")
```

#### Send an Experience Event:

```javascript

AEPEdge.sendEvent(experienceEvent: experienceEvent)
```
