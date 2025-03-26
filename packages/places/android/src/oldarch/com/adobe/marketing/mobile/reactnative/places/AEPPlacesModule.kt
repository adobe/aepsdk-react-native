package com.adobe.marketing.mobile.reactnative.places;

import com.facebook.react.bridge.*;

class AEPPlacesModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val placesImpl = AEPPlacesModule(reactContext)
    override fun getName(): String {
        return AEPPlacesImpl.NAME
    }

    @ReactMethod
    fun extensionVersion(promise: Promise) {
        placesImpl.extensionVersion(promise)
    }

    @ReactMethod
    fun getNearbyPointsOfInterest(locationMap: ReadableMap, limit: Int, promise: Promise) {
        placesImpl.getNearbyPointsOfInterest(locationMap, limit, promise)
    }

    @ReactMethod
    fun processGeofence(geofence: ReadableMap, transitionType: Int) {
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
    fun setAuthorizationStatus(authStatus: String) {
        placesImpl.setAuthorizationStatus(authStatus)
    }
}