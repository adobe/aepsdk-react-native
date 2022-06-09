/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import PlacesAuthStatus from './models/PlacesAuthStatus';
import PlacesGeofence from './models/PlacesGeofence';
import PlacesLocation from './models/PlacesLocation';
import PlacesPOI from './models/PlacesPOI';

interface IPlaces {
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

const AEPPlaces: IPlaces = NativeModules.AEPPlaces;

const Places: IPlaces = {
  /**
   * Returns the current version of the AEPPlaces Extension.
   * @param  {string} Promise a promise that resolves with the extension version
   */
  async extensionVersion(): Promise<string> {
    return await AEPPlaces.extensionVersion();
  },

  /**
   * @brief Requests a list of nearby Points of Interest (POI) and returns them in a {Array<PlacesPOI>} Promise.
   *
   * @param location a PlacesLocation object represent the current location of the device
   * @param limit a non-negative number representing the number of nearby POI to return from the request
   * @param {Array<PlacesPOI>} Promise a promise that resolves with array of {@link PlacesPOI} objects that represent the nearest POI to the device
   * and rejects with error if there was an error encountered while getting POIs
   */
  getNearbyPointsOfInterest(
    location: PlacesLocation,
    limit: number
  ): Promise<Array<PlacesPOI>> {
    return AEPPlaces.getNearbyPointsOfInterest(location, limit);
  },

  /**
   * @brief Passes a geofence and event type to be processed by the SDK
   *
   * Calling this method will result in an Event being dispatched in the SDK, allowing for rules to be processed
   * as a result of the triggering event.
   *
   * @param geofence the {@link PlacesGeofence} object that triggered the event
   * @param transitionType {@link PlacesGeofenceTransitionType} value indicating whether the device entered or exited the provided region
   */
  processGeofence(geofence: PlacesGeofence, transitionType: number): void {
    AEPPlaces.processGeofence(geofence, transitionType);
  },

  /**
   * @brief Returns all Points of Interest (POI) in which the device is currently known to be within.
   *
   * @param {Array<PlacesPOI>} Promise a promise that resolves with array of {@link PlacesPOI} objects that represent the user-within POIs
   * called with an array of PlacesPoi objects that represent the user-within POIs
   */
  getCurrentPointsOfInterest(): Promise<Array<PlacesPOI>> {
    return AEPPlaces.getCurrentPointsOfInterest();
  },

  /**
   * @brief Returns the last latitude and longitude provided to the Places Extension.
   *
   * @discussion If the Places Extension does not have a valid last known location for the user, the CLLocation
   * object returned in the callback will have lat/lon values of 999.999. The CLLocation object returned by this
   * method will only ever contain valid data for latitude and longitude, and is not meant to be used for plotting
   * course, speed, altitude, etc.
   *
   * @param {PlacesLocation} Promise a promise that resolves with {@link PlacesLocation} object representing the last known lat/lon provided to the extension
   */
  getLastKnownLocation(): Promise<PlacesLocation> {
    return AEPPlaces.getLastKnownLocation();
  },

  /**
   * Clears out the client-side data for Places in shared state, local storage, and in-memory.
   */
  clear() {
    AEPPlaces.clear();
  },

  /**
   * @brief Sets the authorization status in the Places extension.
   *
   * The status provided is stored in the Places shared state, and is for reference only.
   * Calling this method does not impact the actual location authorization status for this device.
   *
   * @param authStatus the {@link PlacesAuthStatus} to be set for this device
   */
  setAuthorizationStatus(authStatus?: PlacesAuthStatus) {
    AEPPlaces.setAuthorizationStatus(authStatus);
  }
};

export default Places;
