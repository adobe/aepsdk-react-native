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

### Initializing and registering the extension

Initialization of the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS

```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPPlaces;

@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];
  [AEPMobileCore registerExtensions:@[AEPEdge.class, AEPMobilePlaces.class] completion:^{
  if (appState != UIApplicationStateBackground) {
     [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  }];
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
import com.adobe.marketing.mobile.Places;
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
    MobileCore.configureWithAppID("your-app-ID");
    List<Class<? extends Extension>> extensions = Arrays.asList(
                Edge.EXTENSION,
                Places.EXTENSION);
    MobileCore.registerExtensions(extensions, o -> {
      MobileCore.lifecycleStart(null);
    });
  }
}
```

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
