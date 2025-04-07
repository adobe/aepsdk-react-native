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

import com.facebook.react.bridge.*

class AEPPlacesModule(reactContext: ReactApplicationContext): NativeAEPPlacesSpec(reactContext) {
    val placesImpl = AEPPlacesImpl(reactContext)

    companion object {
        const val NAME = "AEPPlaces"
    }

    override fun getName(): String {
        return AEPPlacesImpl.NAME
    }

    override fun extensionVersion(promise: Promise) {
        placesImpl.extensionVersion(promise)
    }

    override fun getNearbyPointsOfInterest(locationMap: ReadableMap, limit: Double, promise: Promise) {
        placesImpl.getNearbyPointsOfInterest(locationMap, limit, promise)
    }

    override fun processGeofence(geofence: ReadableMap, transitionType: Double) {
        placesImpl.processGeofence(geofence, transitionType)
    }

    override fun getCurrentPointsOfInterest(promise: Promise) {
        placesImpl.getCurrentPointsOfInterest(promise)
    }

    override fun getLastKnownLocation(promise: Promise) {
        placesImpl.getLastKnownLocation(promise)
    }

    override fun clear() {
        placesImpl.clear()
    }

    override fun setAuthorizationStatus(authStatus: String?) {
        placesImpl.setAuthorizationStatus(authStatus)
    }   
}
