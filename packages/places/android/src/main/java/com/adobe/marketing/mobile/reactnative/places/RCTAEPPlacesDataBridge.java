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

import com.adobe.marketing.mobile.places.PlacesAuthorizationStatus;
import com.adobe.marketing.mobile.places.PlacesPOI;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.location.Geofence;

import java.util.List;

public class RCTAEPPlacesDataBridge {


  // @{link PlacesAuthorizationStatus}
  public final static String AEP_PLACES_AUTH_STATUS_DENIED = "PLACES_AUTH_STATUS_DENIED";
  public final static String AEP_PLACES_AUTH_STATUS_ALWAYS = "PLACES_AUTH_STATUS_ALWAYS";
  public final static String AEP_PLACES_AUTH_STATUS_UNKNOWN = "PLACES_AUTH_STATUS_UNKNOWN";
  public final static String AEP_PLACES_AUTH_STATUS_RESTRICTED = "PLACES_AUTH_STATUS_RESTRICTED";
  public final static String AEP_PLACES_AUTH_STATUS_WHEN_IN_USE = "PLACES_AUTH_STATUS_WHEN_IN_USE";

  // Location
  private final static String AEP_PLACES_LOCATION_LATITUDE = "latitude";
  private final static String AEP_PLACES_LOCATION_LONGITUDE = "longitude";

  // PlacesPOI
  private final static String AEP_PLACES_POI_IDENTIFIER = "identifier";
  private final static String AEP_PLACES_POI_NAME = "name";
  private final static String AEP_PLACES_POI_LATITUDE = "latitude";
  private final static String AEP_PLACES_POI_LONGITUDE = "longitude";
  private final static String AEP_PLACES_POI_RADIUS = "radius";
  private final static String AEP_PLACES_POI_USER_IS_WITHIN = "userIsWithin";
  private final static String AEP_PLACES_POI_LIBRARY = "library";
  private final static String AEP_PLACES_POI_WEIGHT = "weight";
  private final static String AEP_PLACES_POI_METADATA = "metadata";

  // GeoFence
  private final static String AEP_PLACES_GEOFENCE_LATITUDE = "latitude";
  private final static String AEP_PLACES_GEOFENCE_LONGITUDE = "longitude";
  private final static String AEP_PLACES_GEOFENCE_IDENTIFIER = "identifier";
  private final static String AEP_PLACES_GEOFENCE_RADIUS = "radius";
  private final static String AEP_PLACES_GEOFENCE_EXPIRATION_DURATION = "expirationDuration";

  public static PlacesAuthorizationStatus placesAuthorizationStatusFromString(final String placesAuthStatus) {
    if (placesAuthStatus == null) {
      return PlacesAuthorizationStatus.UNKNOWN;
    }

    if (placesAuthStatus.equals(AEP_PLACES_AUTH_STATUS_DENIED)) {
      return PlacesAuthorizationStatus.DENIED;
    } else if (placesAuthStatus.equals(AEP_PLACES_AUTH_STATUS_ALWAYS)) {
      return PlacesAuthorizationStatus.ALWAYS;
    } else if (placesAuthStatus.equals(AEP_PLACES_AUTH_STATUS_RESTRICTED)) {
      return PlacesAuthorizationStatus.RESTRICTED;
    } else if (placesAuthStatus.equals(AEP_PLACES_AUTH_STATUS_WHEN_IN_USE)) {
      return PlacesAuthorizationStatus.WHEN_IN_USE;
    }

    return PlacesAuthorizationStatus.UNKNOWN;
  }

  public static String stringFromPlacesAuthorizationStatus(final PlacesAuthorizationStatus placesAuthorizationStatus) {
    if (placesAuthorizationStatus == null) {
      return AEP_PLACES_AUTH_STATUS_UNKNOWN;
    }

    if (placesAuthorizationStatus == PlacesAuthorizationStatus.DENIED) {
      return AEP_PLACES_AUTH_STATUS_DENIED;
    } else if (placesAuthorizationStatus == PlacesAuthorizationStatus.ALWAYS) {
      return AEP_PLACES_AUTH_STATUS_ALWAYS;
    } else if (placesAuthorizationStatus == PlacesAuthorizationStatus.WHEN_IN_USE) {
      return AEP_PLACES_AUTH_STATUS_WHEN_IN_USE;
    } else if (placesAuthorizationStatus == PlacesAuthorizationStatus.RESTRICTED) {
      return AEP_PLACES_AUTH_STATUS_RESTRICTED;
    }

    return AEP_PLACES_AUTH_STATUS_UNKNOWN;
  }

  public static WritableMap mapFromLocation(final Location location) {
    if (location == null) {
      return null;
    }

    WritableMap locationMap = new WritableNativeMap();
    locationMap.putDouble(AEP_PLACES_LOCATION_LATITUDE, location.getLatitude());
    locationMap.putDouble(AEP_PLACES_LOCATION_LONGITUDE, location.getLatitude());

    return locationMap;
  }

  public static Location locationFromMap(final ReadableMap locationMap) {
    if (locationMap == null) {
      return null;
    }

    Location location = new Location("rn-location-provider");
    location.setLatitude(locationMap.getDouble("latitude"));
    location.setLongitude(locationMap.getDouble("longitude"));

    return location;
  }

  public static WritableMap mapFromPlacesPOI(final PlacesPOI placesPOI) {
    if (placesPOI == null) {
      return null;
    }

    WritableMap locationMap = new WritableNativeMap();
    locationMap.putString(AEP_PLACES_POI_IDENTIFIER, placesPOI.getIdentifier());
    locationMap.putString(AEP_PLACES_POI_NAME, placesPOI.getName());
    locationMap.putDouble(AEP_PLACES_POI_LATITUDE, placesPOI.getLatitude());
    locationMap.putDouble(AEP_PLACES_POI_LONGITUDE, placesPOI.getLongitude());
    locationMap.putDouble(AEP_PLACES_POI_RADIUS, placesPOI.getRadius());
    locationMap.putBoolean(AEP_PLACES_POI_USER_IS_WITHIN, placesPOI.containsUser());
    locationMap.putString(AEP_PLACES_POI_LIBRARY, placesPOI.getLibrary());
    locationMap.putInt(AEP_PLACES_POI_WEIGHT, placesPOI.getWeight());
    locationMap.putMap(AEP_PLACES_POI_METADATA, RCTAEPMapUtil.toWritableMap(placesPOI.getMetadata()));

    return locationMap;
  }

  public static WritableArray writableArrayFromListPOIs(List<PlacesPOI> placesPOIS) {
    WritableArray arr = new WritableNativeArray();

    for (PlacesPOI poi : placesPOIS) {
      arr.pushMap(RCTAEPPlacesDataBridge.mapFromPlacesPOI(poi));
    }
    return arr;
  }

  public static Geofence geofenceFromMap(ReadableMap geofenceMap, int transitionType) {
    if (geofenceMap == null) {
      return null;
    }

    final Geofence.Builder builder = new Geofence.Builder()
      .setRequestId(geofenceMap.getString(AEP_PLACES_GEOFENCE_IDENTIFIER))
      .setCircularRegion(geofenceMap.getDouble(AEP_PLACES_GEOFENCE_LATITUDE), geofenceMap.getDouble(AEP_PLACES_GEOFENCE_LONGITUDE), geofenceMap.getInt(AEP_PLACES_GEOFENCE_RADIUS));

    if (geofenceMap.hasKey(AEP_PLACES_GEOFENCE_EXPIRATION_DURATION)) {
      builder.setExpirationDuration(geofenceMap.getInt(AEP_PLACES_GEOFENCE_EXPIRATION_DURATION));
    } else {
      builder.setExpirationDuration(Geofence.NEVER_EXPIRE);
    }

    builder.setTransitionTypes(transitionType);

    return builder.build();
  }

  // Helper methods

  public static String getNullableString(final ReadableMap data, final String key) {
    return data.hasKey(key) ? data.getString(key) : null;
  }
}
