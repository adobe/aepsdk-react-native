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
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;

import java.util.List;
import java.util.Map;

public final class RCTAEPEdgeIdentityDataBridge {

    //Identity Item
    final private static String ID_KEY = "id";
    final private static String IS_PRIMARY_KEY = "primary";
    private static final String AEP_AUTH_STATE_KEY = "authenticatedState";

    //Authenticated State
    private static final String AEP_AUTH_STATE_AUTHENTICATED = "authenticated";
    private static final String AEP_AUTH_STATE_LOGGED_OUT = "loggedOut";

    public static WritableMap mapFromIdentityMap(final IdentityMap map) {
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

    public static AuthenticatedState authenticatedStateFromString(final String authenticatedStateString) {
        if (authenticatedStateString == null) {
            return AuthenticatedState.AMBIGUOUS;
        }

        if (authenticatedStateString.equals(AEP_AUTH_STATE_AUTHENTICATED)) {
            return AuthenticatedState.AUTHENTICATED;
        } else if (authenticatedStateString.equals(AEP_AUTH_STATE_LOGGED_OUT)) {
            return AuthenticatedState.LOGGED_OUT;
        }

        return AuthenticatedState.AMBIGUOUS;
    }

    public static IdentityMap mapToIdentityMap(final ReadableMap map) {
        String idValue = "";
        Boolean isPrimary = false;
        AuthenticatedState authState = AuthenticatedState.AMBIGUOUS;

        if (map == null) {
            return null;
        }

        IdentityMap identityMapFromReadableMap = new IdentityMap();
        ReadableMap mapValue = map.getMap("items");

        ReadableMapKeySetIterator iterator =  mapValue.keySetIterator();

        //iterate namespaces list
        while (iterator.hasNextKey()){
            String namespace  = iterator.nextKey();
            ReadableArray namespaceArray  = mapValue.getArray(namespace);

            //iterate items
            for (int i = 0; i < namespaceArray.size(); i++) {
                Map<String, Object> itemsInMap =  RCTAEPEdgeIdentityMapUtil.toMap(namespaceArray.getMap(i));

                //extra id, authenticateState and isprimary values
                for (Map.Entry<String,Object> entry : itemsInMap.entrySet()) {
                   if (entry.getKey().equals(ID_KEY)) {
                      idValue = (String) entry.getValue();
                   }
                   if (entry.getKey().equals(AEP_AUTH_STATE_KEY)) {
                      String state = (String) entry.getValue();
                      authState = authenticatedStateFromString(state);
                   }
                   if (entry.getKey().equals(IS_PRIMARY_KEY)) {
                      String primary = (String) entry.getValue();
                      isPrimary = Boolean.parseBoolean(primary);
                   }
                }

                IdentityItem items = new IdentityItem(idValue, authState, isPrimary);
                identityMapFromReadableMap.addItem(items, namespace);
            }
        }

        return identityMapFromReadableMap;
    }

    public static IdentityItem mapToIdentityItem(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new IdentityItem(getNullableString(map, ID_KEY), AuthenticatedState.fromString(AEP_AUTH_STATE_KEY), Boolean.parseBoolean(IS_PRIMARY_KEY));
    }

    // Helper methods

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static Boolean getNullableBoolean(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getBoolean(key) : null;
    }
}
