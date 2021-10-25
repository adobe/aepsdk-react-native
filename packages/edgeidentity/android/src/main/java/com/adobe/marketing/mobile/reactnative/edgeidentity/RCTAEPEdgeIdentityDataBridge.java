/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
package com.adobe.marketing.mobile.reactnative.edgeidentity;

import com.adobe.marketing.mobile.edge.identity.AuthenticatedState;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class RCTAEPEdgeIdentityDataBridge {

    //Identity Map
    final private static String IDENTITY_MAP_KEY = "identityMap";
    final private static String ID_KEY = "id";
    final private static String IS_PRIMARY_KEY = "primary";
    private static final String AEP_AUTH_STATE_KEY = "authenticationState";

    public static WritableMap mapFromIdentityMap(final IdentityMap map) {
        if (map == null) {
            return null;
        }

        if (map.isEmpty()){
            return new WritableNativeMap();
        }

        WritableMap identityItemsAsWriteableMap = new WritableNativeMap();
        WritableMap identityMapAsWritableMap = new WritableNativeMap();


            for (String namespace : map.getNamespaces()) {
                List<IdentityItem> items = map.getIdentityItemsForNamespace(namespace);
                WritableArray itemsAsArray = new WritableNativeArray();

                for (IdentityItem item : items) {
                    WritableMap itemAsWritableMap = new WritableNativeMap();

                    itemAsWritableMap.putString("id", item.getId());
                    itemAsWritableMap.putString(AEP_AUTH_STATE_KEY, item.getAuthenticatedState().getName());
                    itemAsWritableMap.putBoolean(IS_PRIMARY_KEY, item.isPrimary());

                    itemsAsArray.pushMap(itemAsWritableMap);
                }

                if (itemsAsArray.size() != 0) {
                    identityItemsAsWriteableMap.putArray(namespace, itemsAsArray);
                    identityMapAsWritableMap.putMap(IDENTITY_MAP_KEY, identityItemsAsWriteableMap);
                }
            }

      return identityMapAsWritableMap;
    }


    public static IdentityItem mapToIdentityItem(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new IdentityItem(getNullableString(map, ID_KEY), AuthenticatedState.fromString(AEP_AUTH_STATE_KEY), getNullableBoolean(map, IS_PRIMARY_KEY));
    }

    public static IdentityMap mapToIdentityMap(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new IdentityMap();
    }

    // Helper methods

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static ReadableMap getNullableMap(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getMap(key) : null;
    }

    private static Boolean getNullableBoolean(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getBoolean(key) : null;
    }

    private static ReadableArray getNullableArray(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getArray(key) : null;
    }

    private static Double getNullableDouble(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getDouble(key) : null;
    }


}
