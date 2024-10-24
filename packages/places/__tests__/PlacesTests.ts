/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import {
  Places,
  PlacesGeofence,
  PlacesGeofenceTransitionType,
  PlacesLocation
} from '../src';

describe('Places', () => {
  test('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPPlaces, 'extensionVersion');
    await Places.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  test('getNearbyPointsOfInterest is called', async () => {
    const spy = jest.spyOn(
      NativeModules.AEPPlaces,
      'getNearbyPointsOfInterest'
    );
    let placesLocation = new PlacesLocation(37.33, -121.89, 0, 0, 0);
    await Places.getNearbyPointsOfInterest(placesLocation, 10);
    expect(spy).toHaveBeenCalled();
  });

  test('processGeofence is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPPlaces, 'processGeofence');
    let geofence = new PlacesGeofence('newId', 37.33, -121.89, 10, 10);
    await Places.processGeofence(geofence, PlacesGeofenceTransitionType.ENTER);
    expect(spy).toHaveBeenCalled();
  });

  test('getCurrentPointsOfInterest is called', async () => {
    const spy = jest.spyOn(
      NativeModules.AEPPlaces,
      'getCurrentPointsOfInterest'
    );
    await Places.getCurrentPointsOfInterest();
    expect(spy).toHaveBeenCalled();
  });

  test('getLastKnownLocation is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPPlaces, 'getLastKnownLocation');
    await Places.getLastKnownLocation();
    expect(spy).toHaveBeenCalled();
  });

  test('clear is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPPlaces, 'clear');
    await Places.clear();
    expect(spy).toHaveBeenCalled();
  });

  test('setAuthorizationStatus is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPPlaces, 'setAuthorizationStatus');
    await Places.setAuthorizationStatus();
    expect(spy).toHaveBeenCalled();
  });
});
