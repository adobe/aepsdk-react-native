import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// Create type definitions for codegen
type CodegenPlacesLocation = {
  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;
  accuracy: number;
};

type CodegenPlacesPOI = {
  identifier: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  userIsWithin: boolean;
  library: string;
  weight: number;
  metadata: { [key: string]: string };
};

type CodegenPlacesGeofence = {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  expirationDuration: number;
};

type CodegenPlacesAuthStatus = 
  'PLACES_AUTH_STATUS_ALWAYS' |
  'PLACES_AUTH_STATUS_DENIED' |
  'PLACES_AUTH_STATUS_RESTRICTED' |
  'PLACES_AUTH_STATUS_UNKNOWN' |
  'PLACES_AUTH_STATUS_WHEN_IN_USE';


export interface Spec extends TurboModule {
  extensionVersion: () => Promise<string>;  

  getNearbyPointsOfInterest: (
    location: CodegenPlacesLocation, 
    limit: number
  ) => Promise<Array<CodegenPlacesPOI>>;
  
  processGeofence: (
    geofence: CodegenPlacesGeofence, 
    transitionType: number
  ) => void;
  
  getCurrentPointsOfInterest: () => Promise<Array<CodegenPlacesPOI>>;
  
  getLastKnownLocation: () => Promise<CodegenPlacesLocation>;
  
  clear: () => void;
  
  setAuthorizationStatus: (authStatus?: CodegenPlacesAuthStatus) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AEPPlaces');
