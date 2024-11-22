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

package com.adobe.marketing.mobile.reactnative.optimize;

import android.util.Log;

import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.optimize.DecisionScope;
import com.adobe.marketing.mobile.optimize.Offer;
import com.adobe.marketing.mobile.optimize.OptimizeProposition;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utility class for converting data models to {@link com.facebook.react.bridge.WritableMap}
 */

class RCTAEPOptimizeUtil {

    private static final String TAG = "RCTAEPOptimize";

    private RCTAEPOptimizeUtil() {}

    static WritableMap convertPropositionToWritableMap(final OptimizeProposition proposition) {
        final WritableMap propositionWritableMap = new WritableNativeMap();
        if (proposition == null) {
            return propositionWritableMap;
        }
        propositionWritableMap.putString("id", proposition.getId());
        propositionWritableMap.putString("scope", proposition.getScope());
        propositionWritableMap.putMap("scopeDetails", convertMapToWritableMap(proposition.getScopeDetails()));
        WritableArray offersWritableArray = new WritableNativeArray();
        for (final Offer offer : proposition.getOffers()) {
            offersWritableArray.pushMap(convertOfferToWritableMap(offer));
        }
        propositionWritableMap.putArray("items", offersWritableArray);

        return propositionWritableMap;
    }

    static WritableMap convertOfferToWritableMap(final Offer offer) {
        final WritableMap offerWritableMap = new WritableNativeMap();
        if (offer == null) {
            return offerWritableMap;
        }
        offerWritableMap.putString("id", offer.getId());
        if (offer.getEtag() != null) {
            offerWritableMap.putString("etag", offer.getEtag());
        }
        offerWritableMap.putString("schema", offer.getSchema());
        if (offer.getMeta() != null) {
            offerWritableMap.putMap("meta", convertMapToWritableMap(new HashMap<String, Object>(offer.getMeta())));
        }
        offerWritableMap.putInt("score", (int) offer.getScore());

        final WritableMap dataWritableMap = new WritableNativeMap();
        dataWritableMap.putString("id", offer.getId());
        dataWritableMap.putString("format", offer.getType().toString());
        dataWritableMap.putString("content", offer.getContent());
        if (offer.getLanguage() != null) {
            dataWritableMap.putArray("language", convertListToWritableArray(new ArrayList<Object>(offer.getLanguage())));
        }

        if (offer.getCharacteristics() != null) {
            dataWritableMap.putMap("characteristics", convertMapToWritableMap(new HashMap<String, Object>(offer.getCharacteristics())));
        }

        offerWritableMap.putMap("data", dataWritableMap);
        return offerWritableMap;
    }

    static WritableArray convertListToWritableArray(final List<Object> objectList) {
        final WritableArray writableArray = new WritableNativeArray();
        for (final Object object : objectList) {
            if (object instanceof Map) {
                writableArray.pushMap(convertMapToWritableMap((Map<String, Object>) object));
            } else if (object instanceof List) {
                writableArray.pushArray(convertListToWritableArray((List<Object>) object));
            } else if (object instanceof String) {
                writableArray.pushString((String) object);
            } else if (object instanceof Boolean) {
                writableArray.pushBoolean((Boolean) object);
            } else if (object instanceof Integer) {
                writableArray.pushInt((Integer) object);
            } else if (object instanceof Double) {
                writableArray.pushDouble((Double) object);
            }
        }
        return writableArray;
    }

    static WritableMap convertMapToWritableMap(final Map<String, Object> map) {
        final WritableMap writableMap = new WritableNativeMap();
        for (final Map.Entry<String, Object> entry : map.entrySet()) {
            final Object value = entry.getValue();
            if (value instanceof Map) {
                writableMap.putMap(entry.getKey(), convertMapToWritableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableMap.putArray(entry.getKey(), convertListToWritableArray((List<Object>) value));
            } else if (value instanceof String) {
                writableMap.putString(entry.getKey(), (String) value);
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(entry.getKey(), (Boolean) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(entry.getKey(), (Integer) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(entry.getKey(), (Double) value);
            }
        }
        return writableMap;
    }

    static List<DecisionScope> createDecisionScopes(final ReadableArray decisionScopesArray) {
        final List<DecisionScope> decisionScopeList = new ArrayList<>(decisionScopesArray.size());
        for (int i = 0; i < decisionScopesArray.size(); i++) {
            String decisionScopeName = decisionScopesArray.getString(i);
            if (decisionScopeName != null && !decisionScopeName.isEmpty()) {
                decisionScopeList.add(new DecisionScope(decisionScopeName));
            }
        }
        return decisionScopeList;
    }

    /**
     * Converts {@link ReadableMap} Map to {@link Map}
     *
     * @param readableMap instance of {@code ReadableMap}
     * @return instance of {@code Map}
     */
    static Map<String, Object> convertReadableMapToMap(final ReadableMap readableMap) {
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        Map<String, Object> map = new HashMap<>();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);
            switch (type) {
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    map.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Map:
                    map.put(key, convertReadableMapToMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, convertReadableArrayToList(readableMap.getArray(key)));
                    break;
                default:
                    break;
            }

        }
        return map;
    }

    private static List<Object> convertReadableArrayToList(final ReadableArray readableArray) {
        final List<Object> list = new ArrayList<>(readableArray.size());
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType indexType = readableArray.getType(i);
            switch(indexType) {
                case Boolean:
                    list.add(i, readableArray.getBoolean(i));
                    break;
                case Number:
                    list.add(i, readableArray.getDouble(i));
                    break;
                case String:
                    list.add(i, readableArray.getString(i));
                    break;
                case Map:
                    list.add(i, convertReadableMapToMap(readableArray.getMap(i)));
                    break;
                case Array:
                    list.add(i, convertReadableArrayToList(readableArray.getArray(i)));
                    break;
                default:
                    break;
            }
        }
        return list;
    }
}
