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

import android.annotation.SuppressLint;
import android.util.Log;

import com.adobe.marketing.mobile.edge.identity.AuthenticatedState;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;

import java.util.List;
import java.util.Map;

final class RCTAEPEdgeIdentityDataBridge {

    //Identity Item
    private static final String ID_KEY = "id";
    private static final String IS_PRIMARY_KEY = "primary";
    private static final String AEP_AUTH_STATE_KEY = "authenticatedState";
    private static final String ITEMS = "items";

    private static final String TAG = "RCTAEPEdgeIdentityDataBridge";

    static WritableMap mapFromIdentityMap(final IdentityMap map) {
        if (map == null) {
            return null;
        }

        if (map.isEmpty()){
            return new WritableNativeMap();
        }

        WritableMap identityMapAsWritableMap = new WritableNativeMap();

            for (String namespace : map.getNamespaces()) {
                List<IdentityItem> items = map.getIdentityItemsForNamespace(namespace);
                WritableArray itemsAsArray = new WritableNativeArray();

                for (IdentityItem item : items) {
                    WritableMap itemAsWritableMap = new WritableNativeMap();

                    itemAsWritableMap.putString(ID_KEY, item.getId());
                    itemAsWritableMap.putString(AEP_AUTH_STATE_KEY, item.getAuthenticatedState().getName());
                    itemAsWritableMap.putBoolean(IS_PRIMARY_KEY, item.isPrimary());

                    itemsAsArray.pushMap(itemAsWritableMap);
                }

                if (itemsAsArray.size() != 0) {
                    identityMapAsWritableMap.putArray(namespace, itemsAsArray);
                }
            }
        return identityMapAsWritableMap;
    }

    static IdentityMap mapToIdentityMap(final ReadableMap map) {

        if (map == null) {
            return null;
        }

        IdentityMap identityMapFromReadableMap = new IdentityMap();
        ReadableMap mapValue = map.getMap(ITEMS);

        ReadableMapKeySetIterator iterator =  mapValue.keySetIterator();

        //iterate namespaces list
        while (iterator.hasNextKey()){
            String namespace  = iterator.nextKey();
            ReadableArray namespaceArray  = mapValue.getArray(namespace);

            //iterate items
            for (int i = 0; i < namespaceArray.size(); i++) {

                ReadableMap itemsAsMap = namespaceArray.getMap(i);

                IdentityItem item = mapToIdentityItem(itemsAsMap);
                if (item != null)

                identityMapFromReadableMap.addItem(item, namespace);
            }
        }

        return identityMapFromReadableMap;
    }

    @SuppressLint("LongLogTag")

    static IdentityItem mapToIdentityItem(ReadableMap map) {
        if (map == null) {
            return null;
        }

        String id = getNullableString(map, ID_KEY);
        // verify id is not null as this is not an accepted value for ids
        if (id == null) {
            return null;
        }

        return new IdentityItem(id, getAuthenticatedState(map, AEP_AUTH_STATE_KEY), getBooleanOrDefaultFalse(map, IS_PRIMARY_KEY));
    }

    // Helper methods

    private static AuthenticatedState getAuthenticatedState(final ReadableMap data, final String key) {
        return AuthenticatedState.fromString(data.hasKey(key) ? data.getString(key) : null);
    }

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static Boolean getBooleanOrDefaultFalse(final ReadableMap data, final String key) {
        return data.hasKey(key) && data.getType(key) == ReadableType.Boolean && data.getBoolean(key);
    }
}