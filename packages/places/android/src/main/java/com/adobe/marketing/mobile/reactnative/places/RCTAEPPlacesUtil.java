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

package com.adobe.marketing.mobile.reactnative.places;

import android.location.Location;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Places;
import com.adobe.marketing.mobile.places.PlacesPOI;
import com.adobe.marketing.mobile.places.PlacesRequestError;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import java.util.List;

/** Shared logic used by both the legacy and the TurboModule implementations. */
final class RCTAEPPlacesUtil {

  private RCTAEPPlacesUtil() {}

  static void extensionVersion(final Promise promise) {
    promise.resolve(Places.extensionVersion());
  }

  static void getNearbyPointsOfInterest(final ReadableMap locationMap, final int limit, final Promise promise) {
    Location location = RCTAEPPlacesDataBridge.locationFromMap(locationMap);
    Places.getNearbyPointsOfInterest(location, limit, new AdobeCallback<List<PlacesPOI>>() {
      @Override
      public void call(List<PlacesPOI> placesPOIS) {
        promise.resolve(RCTAEPPlacesDataBridge.writableArrayFromListPOIs(placesPOIS));
      }
    }, new AdobeCallback<PlacesRequestError>() {
      @Override
      public void call(PlacesRequestError placesRequestError) {
        promise.reject(String.valueOf(placesRequestError.getValue()), placesRequestError.name());
      }
    });
  }

  static void processGeofence(final ReadableMap geofence, final int transitionType) {
    Places.processGeofence(RCTAEPPlacesDataBridge.geofenceFromMap(geofence, transitionType), transitionType);
  }

  static void getCurrentPointsOfInterest(final Promise promise) {
    Places.getCurrentPointsOfInterest(new AdobeCallback<List<PlacesPOI>>() {
      @Override
      public void call(List<PlacesPOI> placesPOIS) {
        promise.resolve(RCTAEPPlacesDataBridge.writableArrayFromListPOIs(placesPOIS));
      }
    });
  }

  static void getLastKnownLocation(final Promise promise) {
    Places.getLastKnownLocation(new AdobeCallback<Location>() {
      @Override
      public void call(Location location) {
        promise.resolve(RCTAEPPlacesDataBridge.mapFromLocation(location));
      }
    });
  }

  static void clear() {
    Places.clear();
  }

  static void setAuthorizationStatus(final String authStatus) {
    Places.setAuthorizationStatus(RCTAEPPlacesDataBridge.placesAuthorizationStatusFromString(authStatus));
  }
}
