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

import android.util.Log;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Places;
import com.adobe.marketing.mobile.places.PlacesPOI;
import com.adobe.marketing.mobile.places.PlacesRequestError;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import android.location.Location;

import java.util.List;

public class RCTAEPPlacesModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RCTAEPPlacesModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPPlaces";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(Places.extensionVersion());
  }

  @ReactMethod
  public void getNearbyPointsOfInterest(final ReadableMap locationMap, final int limit, final Promise promise) {
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

  @ReactMethod
  public void processGeofence(final ReadableMap geofence, final int transitionType) {
    Places.processGeofence(RCTAEPPlacesDataBridge.geofenceFromMap(geofence, transitionType), transitionType);
  }

  @ReactMethod
  public void getCurrentPointsOfInterest(final Promise promise) {
    Places.getCurrentPointsOfInterest(new AdobeCallback<List<PlacesPOI>>() {
      @Override
      public void call(List<PlacesPOI> placesPOIS) {
        promise.resolve(RCTAEPPlacesDataBridge.writableArrayFromListPOIs(placesPOIS));
      }
    });
  }

  @ReactMethod
  public void getLastKnownLocation(final Promise promise) {
    Places.getLastKnownLocation(new AdobeCallback<Location>() {
      @Override
      public void call(Location location) {
        promise.resolve(RCTAEPPlacesDataBridge.mapFromLocation(location));
      }
    });
  }

  @ReactMethod
  public void clear() {
    Places.clear();
  }

  @ReactMethod
  public void setAuthorizationStatus(String authStatus) {
    Places.setAuthorizationStatus(RCTAEPPlacesDataBridge.placesAuthorizationStatusFromString(authStatus));
  }
}
