# React Native AEP Places Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepplaces.svg)](https://www.npmjs.com/package/@adobe/react-native-aepplaces)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepplaces)](https://www.npmjs.com/package/@adobe/react-native-aepplaces)

`@adobe/react-native-aepplaces` is a wrapper around the iOS and Android [AEP Places SDK](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-places) to allow for integration with React Native applications. Functionality to enable Adobe Places is provided entirely through JavaScript documented below.

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your react native project. Before installing the Places extension it is recommended to begin by installing the [Core extension](https://github.com/adobe/react-native-aepcore).

> Note: If you are new to React Native we suggest you follow the [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) page before continuing.

### 1. Create React Native project

First create a React Native project:

```bash
react-native init MyReactApp
```

### 2. Install JavaScript packages

Install and link the `@adobe/react-native-aepplaces` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepplaces
```

or

```bash
yarn add @adobe/react-native-aepplaces
```

#### 2.1 Link

This package requires React Native 0.60+ to build which supports [CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) to link the modules while building the app.

_Note_ For `iOS` using `cocoapods`, run:

```bash
cd ios/ && pod install
```

## Tests

This project contains jest unit tests which are contained in the `__tests__` directory, to run the tests locally:

```
make run-tests-locally
```

## Usage

### [Places](https://aep-sdks.gitbook.io/docs/using-mobile-extensions/adobe-places)

##### Importing the extension:

```javascript
import { Places } from '@adobe/react-native-aepplaces';
```

##### Getting the extension version:

```javascript
const version = await Places.extensionVersion();
console.log('AdobeExperienceSDK: Places version: ' + version);
  
);
```

##### Registering the extension with AEPCore:

> Note: It is recommended to initialize the SDK via native code inside your AppDelegate and MainApplication in iOS and Android respectively.

##### **iOS**

```objective-c
#import <RCTAEPPlaces/AEPPlaces.h>

[AEPMobilePlaces registerExtension];
```

##### **Android:**

```java
import com.adobe.marketing.mobile.Places;

Places.registerExtension();
```

##### Get the nearby points of interest:

```javascript
let location = new PlacesLocation(<latitude>, <longitude>, <optional altitude>, <optional speed>, <optional accuracy>);


Places.getNearbyPointsOfInterest(location, <limit>).then(pois => console.log("AdobeExperienceSDK: Places pois: " + pois)).catch(error => console.log("AdobeExperienceSDK: Places error: " + error));
```

##### Process geofence:

```javascript
// create a geofence
let geofence = new PlacesGeofence("geofence Identifier", <latitude>, <longitude>, <radius>, <optional expiration-duration>);
Places.processGeofence(geofence, PlacesGeofenceTransitionType.ENTER);
Places.processGeofence(geofence, PlacesGeofenceTransitionType.EXIT);
```

##### Get the current point of interests:

```javascript
const pois = await Places.getCurrentPointsOfInterest();
console.log('AdobeExperienceSDK: Places pois: ' + pois);
);
```

##### Get the last known location

```javascript
const location = await Places.getLastKnownLocation();
console.log('AdobeExperienceSDK: Places location: ' + location)
);
```

##### Clear

```javascript
Places.clear();
```

##### Set Authorization status:

```javascript
Places.setAuthorizationStatus(PlacesAuthStatus.ALWAYS);
Places.setAuthorizationStatus(PlacesAuthStatus.DENIED);
Places.setAuthorizationStatus(PlacesAuthStatus.RESTRICTED);
Places.setAuthorizationStatus(PlacesAuthStatus.WHEN_IN_USE);
Places.setAuthorizationStatus(PlacesAuthStatus.UNKNOWN);
```