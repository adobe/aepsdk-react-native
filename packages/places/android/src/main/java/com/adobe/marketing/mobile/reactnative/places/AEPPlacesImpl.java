package com.adobe.marketing.mobile.reactnative.places;

import android.location.Location;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.Places;
import com.adobe.marketing.mobile.places.PlacesPOI;
import com.adobe.marketing.mobile.places.PlacesRequestError;
import com.facebook.react.bridge.*;
import androidx.annotation.Nullable;

import java.util.List;

public class AEPPlacesImpl {

    private final ReactApplicationContext reactContext;
    public static final String NAME = "AEPPlaces";

    public AEPPlacesImpl(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    public String getName() {
        return "AEPPlaces";
    }

    public void extensionVersion(final Promise promise) {
        promise.resolve(Places.extensionVersion());
    }

    public void getNearbyPointsOfInterest(final ReadableMap locationMap, final double limit, final Promise promise) {
        Location location = RCTAEPPlacesDataBridge.locationFromMap(locationMap);
        Places.getNearbyPointsOfInterest(location, (int)limit, new AdobeCallback<List<PlacesPOI>>() {
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

    public void processGeofence(final ReadableMap geofence, final double transitionType) {
        Places.processGeofence(RCTAEPPlacesDataBridge.geofenceFromMap(geofence, (int)transitionType), (int)transitionType);
    }

    public void getCurrentPointsOfInterest(final Promise promise) {
        Places.getCurrentPointsOfInterest(new AdobeCallback<List<PlacesPOI>>() {
            @Override
            public void call(List<PlacesPOI> placesPOIS) {
                promise.resolve(RCTAEPPlacesDataBridge.writableArrayFromListPOIs(placesPOIS));
            }
        });
    }

    public void getLastKnownLocation(final Promise promise) {
        Places.getLastKnownLocation(new AdobeCallback<Location>() {
            @Override
            public void call(Location location) {
                promise.resolve(RCTAEPPlacesDataBridge.mapFromLocation(location));
            }
        });
    }

    public void clear() {
        Places.clear();
    }

    public void setAuthorizationStatus(@Nullable String authStatus) {
        Places.setAuthorizationStatus(RCTAEPPlacesDataBridge.placesAuthorizationStatusFromString(authStatus));
    }
}
