/*
Copyright 2026 Adobe. All rights reserved.
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

import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Places;
import com.adobe.marketing.mobile.places.PlacesPOI;
import com.adobe.marketing.mobile.places.PlacesRequestError;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

import java.util.List;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Behavior mirrors RCTAEPPlacesModule (the legacy bridge module).
 */
public final class NativeAEPPlacesModule extends NativeAEPPlacesSpec {

  public NativeAEPPlacesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NativeAEPPlaces";
  }

  @Override
  public void extensionVersion(final Promise promise) {
    promise.resolve(Places.extensionVersion());
  }

  @Override
  public void getNearbyPointsOfInterest(final ReadableMap locationMap, final double limit, final Promise promise) {
    Location location = RCTAEPPlacesDataBridge.locationFromMap(locationMap);
    Places.getNearbyPointsOfInterest(location, (int) limit, new AdobeCallback<List<PlacesPOI>>() {
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

  @Override
  public void processGeofence(final ReadableMap geofence, final double transitionType) {
    Places.processGeofence(RCTAEPPlacesDataBridge.geofenceFromMap(geofence, (int) transitionType), (int) transitionType);
  }

  @Override
  public void getCurrentPointsOfInterest(final Promise promise) {
    Places.getCurrentPointsOfInterest(new AdobeCallback<List<PlacesPOI>>() {
      @Override
      public void call(List<PlacesPOI> placesPOIS) {
        promise.resolve(RCTAEPPlacesDataBridge.writableArrayFromListPOIs(placesPOIS));
      }
    });
  }

  @Override
  public void getLastKnownLocation(final Promise promise) {
    Places.getLastKnownLocation(new AdobeCallback<Location>() {
      @Override
      public void call(Location location) {
        promise.resolve(RCTAEPPlacesDataBridge.mapFromLocation(location));
      }
    });
  }

  @Override
  public void clear() {
    Places.clear();
  }

  @Override
  public void setAuthorizationStatus(@Nullable String authStatus) {
    Places.setAuthorizationStatus(RCTAEPPlacesDataBridge.placesAuthorizationStatusFromString(authStatus));
  }
}
