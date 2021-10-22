package com.adobe.marketing.mobile.reactnative.optimize;

import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.optimize.Offer;
import com.adobe.marketing.mobile.optimize.Proposition;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
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

    private RCTAEPOptimizeUtil() {
    }

    static WritableMap convertPropositionToWritableMap(final Proposition proposition) {
        final WritableMap propositionWritableMap = new WritableNativeMap();
        if (proposition == null) {
            MobileCore.log(LoggingMode.DEBUG, "RCTAEPOptimize", "Unable to convert Proposition to WritableMap. Passed Proposition is null.");
            return propositionWritableMap;
        }
        propositionWritableMap.putString("id", proposition.getId());
        WritableArray offersWritableArray = new WritableNativeArray();
        for (final Offer offer : proposition.getOffers()) {
            offersWritableArray.pushMap(convertOfferToWritableMap(offer));
        }
        propositionWritableMap.putArray("offers", offersWritableArray);
        propositionWritableMap.putString("scope", proposition.getScope());
        return propositionWritableMap;
    }

    static WritableMap convertOfferToWritableMap(final Offer offer) {
        final WritableMap offerWritableMap = new WritableNativeMap();
        if (offer == null) {
            MobileCore.log(LoggingMode.DEBUG, "RCTAEPOptimize", "Unable to convert Offer to WritableMap. Passed Offer is null.");
            return offerWritableMap;
        }
        offerWritableMap.putString("id", offer.getId());
        offerWritableMap.putString("etag", offer.getEtag());
        offerWritableMap.putString("schema", offer.getSchema());
        offerWritableMap.putString("type", offer.getType().toString());
        offerWritableMap.putArray("language", convertListToWritableArray(new ArrayList<Object>(offer.getLanguage())));
        offerWritableMap.putString("content", offer.getContent());
        offerWritableMap.putMap("characteristics", convertMapToWritableMap(new HashMap<String, Object>(offer.getCharacteristics())));
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
        WritableMap writableMap = new WritableNativeMap();
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

    static Map<String, Object> convertReadableMapToMap(final ReadableMap readableMap) {
        if (readableMap == null) {
            MobileCore.log(LoggingMode.DEBUG, "RCTAEPOptimize", "Unable to convert ReadableMap to Map. Passed ReadableMap is null.");
            return null;
        }
        final Map<String, Object> map = new HashMap<>();
        while (readableMap.keySetIterator().hasNextKey()) {
            final String key = readableMap.keySetIterator().nextKey();
            switch (readableMap.getType(key)) {
                case Map:
                    map.put(key, convertReadableMapToMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, convertReadableArrayToList(readableMap.getArray(key)));
                    break;
                case Number:
                    int value = readableMap.getInt(key);
                    if (value == readableMap.getDouble(key)) { //Check of the Number is Double or Integer
                        map.put(key, value);
                    } else {
                        map.put(key, readableMap.getDouble(key));
                    }
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                default:
                    break;
            }
        }

        return map;
    }

    static List<Object> convertReadableArrayToList(final ReadableArray readableArray) {
        final List<Object> list = new ArrayList<>();
        if(readableArray == null){
            MobileCore.log(LoggingMode.DEBUG, "RCTAEPOptimize", "Unable to convert ReadableArray to List. Passed ReadableArray is null.");
            return list;
        }
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Array:
                    list.add(convertReadableArrayToList(readableArray.getArray(i)));
                    break;
                case Map:
                    list.add(convertReadableMapToMap(readableArray.getMap(i)));
                    break;
                case String:
                    list.add(readableArray.getString(i));
                    break;
                case Number:
                    int value = readableArray.getInt(i);
                    if (value == readableArray.getDouble(i)) {
                        list.add(Integer.valueOf(value));
                    } else {
                        list.add(Double.valueOf(readableArray.getDouble(i)));
                    }
                    break;
                default:
                    break;
            }
        }
        return list;
    }
}
