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

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RCTAEPPlacesModule extends ReactContextBaseJavaModule {

  public RCTAEPPlacesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NativeAEPPlaces";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPPlacesUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void getNearbyPointsOfInterest(final ReadableMap locationMap, final int limit, final Promise promise) {
    RCTAEPPlacesUtil.getNearbyPointsOfInterest(locationMap, limit, promise);
  }

  @ReactMethod
  public void processGeofence(final ReadableMap geofence, final int transitionType) {
    RCTAEPPlacesUtil.processGeofence(geofence, transitionType);
  }

  @ReactMethod
  public void getCurrentPointsOfInterest(final Promise promise) {
    RCTAEPPlacesUtil.getCurrentPointsOfInterest(promise);
  }

  @ReactMethod
  public void getLastKnownLocation(final Promise promise) {
    RCTAEPPlacesUtil.getLastKnownLocation(promise);
  }

  @ReactMethod
  public void clear() {
    RCTAEPPlacesUtil.clear();
  }

  @ReactMethod
  public void setAuthorizationStatus(String authStatus) {
    RCTAEPPlacesUtil.setAuthorizationStatus(authStatus);
  }
}
