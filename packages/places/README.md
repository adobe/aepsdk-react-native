# React Native AEP Places Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepplaces.svg)](https://www.npmjs.com/package/@adobe/react-native-aepplaces)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepplaces)](https://www.npmjs.com/package/@adobe/react-native-aepplaces)

`@adobe/react-native-aepplaces` is a wrapper around the iOS and Android [Adobe Experience Platform Places Extension](https://developer.adobe.com/client-sdks/documentation/places) to allow for integration with React Native applications. Functionality to enable Adobe Places is provided entirely through JavaScript documented below.

## Peer Dependencies

The Adobe Experience Platform Optimize extension has the following peer dependency, which must be installed prior to installing the optimize extension:

- [Core](../core/README.md)
- [Edge](../edge/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepplaces` package:

NPM:

```bash
npm install @adobe/react-native-aepplaces
```

Yarn:

```bash
yarn add @adobe/react-native-aepplaces
```

## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension:

```typescript
import {
  Places,
  PlacesAuthStatus,
  PlacesGeofence,
  PlacesGeofenceTransitionType,
  PlacesLocation,
  PlacesPOI,
} from "@adobe/react-native-aepplaces";
```

## API reference

#### Getting the extension version:

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
const version = await Places.extensionVersion();
console.log(`AdobeExperienceSDK: Places version: ${version}`);
```

#### Get the nearby points of interest:

**Syntax**

```typescript
getNearbyPointsOfInterest(location, <limit>): Promise<Array<PlacesPOI>>
```

**Example**

```typescript
let location = new PlacesLocation(<latitude>, <longitude>, <optional altitude>, <optional speed>, <optional accuracy>);

try {
  const pois = await Places.getNearbyPointsOfInterest(location, <limit>);
  console.log(`AdobeExperienceSDK: Places pois: ${pois}`)
} catch(error) {
  console.log(`AdobeExperienceSDK: Places error: ${error}`
}
```

#### Process geofence:

**Syntax**

```typescript
processGeofence(geofence, <transitionType>): void
```

**Example**

```typescript
// create a geofence
let geofence = new PlacesGeofence("geofence Identifier", <latitude>, <longitude>, <radius>, <optional expiration-duration>);
Places.processGeofence(geofence, PlacesGeofenceTransitionType.ENTER);
Places.processGeofence(geofence, PlacesGeofenceTransitionType.EXIT);
```

#### Get the current point of interests:

**Syntax**

```typescript
getCurrentPointsOfInterest(): Promise<Array<PlacesPOI>>
```

**Example**

```typescript
const pois = await Places.getCurrentPointsOfInterest();
console.log('AdobeExperienceSDK: Places pois: ' + pois);
);
```

#### Get the last known location

**Syntax**

```typescript
getLastKnownLocation(): Promise<PlacesLocation>
```

**Example**

```typescript
const location = await Places.getLastKnownLocation();
console.log('AdobeExperienceSDK: Places location: ' + location)
);
```

#### Clear

**Syntax**

```typescript
clear(): void
```

**Example**

```typescript
Places.clear();
```

#### Set Authorization status:

**Syntax**

```typescript
setAuthorizationStatus(authStatus?: PlacesAuthStatus): void;
```

**Example**

```typescript
Places.setAuthorizationStatus(PlacesAuthStatus.ALWAYS);
Places.setAuthorizationStatus(PlacesAuthStatus.DENIED);
Places.setAuthorizationStatus(PlacesAuthStatus.RESTRICTED);
Places.setAuthorizationStatus(PlacesAuthStatus.WHEN_IN_USE);
Places.setAuthorizationStatus(PlacesAuthStatus.UNKNOWN);
```
