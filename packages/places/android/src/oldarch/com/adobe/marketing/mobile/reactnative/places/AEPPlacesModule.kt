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

package com.adobe.marketing.mobile.reactnative.places;

import com.facebook.react.bridge.*;

class AEPPlacesModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val placesImpl = AEPPlacesImpl(reactContext)
    override fun getName(): String {
        return AEPPlacesImpl.NAME
    }

    @ReactMethod
    fun extensionVersion(promise: Promise) {
        placesImpl.extensionVersion(promise)
    }

    @ReactMethod
    fun getNearbyPointsOfInterest(locationMap: ReadableMap, limit: Double, promise: Promise) {
        placesImpl.getNearbyPointsOfInterest(locationMap, limit, promise)
    }

    @ReactMethod
    fun processGeofence(geofence: ReadableMap, transitionType: Double) {
        placesImpl.processGeofence(geofence, transitionType)
    }

    @ReactMethod
    fun getCurrentPointsOfInterest(promise: Promise) {
        placesImpl.getCurrentPointsOfInterest(promise)
    }

    @ReactMethod
    fun getLastKnownLocation(promise: Promise) {
        placesImpl.getLastKnownLocation(promise)
    }

    @ReactMethod
    fun clear() {
        placesImpl.clear()
    }

    @ReactMethod
    fun setAuthorizationStatus(authStatus: String?) {
        placesImpl.setAuthorizationStatus(authStatus)
    }
}
