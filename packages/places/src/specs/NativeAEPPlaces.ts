import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import PlacesAuthStatus from './../models/PlacesAuthStatus';
import PlacesGeofence from './../models/PlacesGeofence';
import PlacesLocation from './../models/PlacesLocation';
import PlacesPOI from './../models/PlacesPOI';

export interface Spec extends TurboModule {
    extensionVersion: () => Promise<string>;
    getNearbyPointsOfInterest: (
      location: PlacesLocation,
      limit: number
    ) => Promise<Array<PlacesPOI>>;
    processGeofence: (geofence: PlacesGeofence, transitionType: number) => void;
    getCurrentPointsOfInterest: () => Promise<Array<PlacesPOI>>;
    getLastKnownLocation: () => Promise<PlacesLocation>;
    clear: () => void;
    setAuthorizationStatus: (authStatus?: PlacesAuthStatus) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'AEPPlaces',
);