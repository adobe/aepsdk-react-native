/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

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
