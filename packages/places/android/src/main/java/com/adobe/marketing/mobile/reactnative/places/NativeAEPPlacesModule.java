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

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Delegates to RCTAEPPlacesUtil, shared with the legacy module.
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
    RCTAEPPlacesUtil.extensionVersion(promise);
  }

  @Override
  public void getNearbyPointsOfInterest(final ReadableMap locationMap, final double limit, final Promise promise) {
    RCTAEPPlacesUtil.getNearbyPointsOfInterest(locationMap, (int) limit, promise);
  }

  @Override
  public void processGeofence(final ReadableMap geofence, final double transitionType) {
    RCTAEPPlacesUtil.processGeofence(geofence, (int) transitionType);
  }

  @Override
  public void getCurrentPointsOfInterest(final Promise promise) {
    RCTAEPPlacesUtil.getCurrentPointsOfInterest(promise);
  }

  @Override
  public void getLastKnownLocation(final Promise promise) {
    RCTAEPPlacesUtil.getLastKnownLocation(promise);
  }

  @Override
  public void clear() {
    RCTAEPPlacesUtil.clear();
  }

  @Override
  public void setAuthorizationStatus(@Nullable String authStatus) {
    RCTAEPPlacesUtil.setAuthorizationStatus(authStatus);
  }
}
