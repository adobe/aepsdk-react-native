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

package com.adobe.marketing.mobile.reactnative.edgeconsent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

class RCTAEPEdgeConsentUtils {

    static Map<String, Object> toMap(ReadableMap readableMap) {
        if (readableMap == null) {
            return null;
        }

        Map<String, Object> map = new HashMap<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);

            switch (type) {
                case Null:
                    map.put(key, null);
                    break;
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
                    map.put(key, toMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, toObjectArray(readableMap.getArray(key)));
                    break;
            }
        }

        return map;
    }

    static WritableMap toWritableMap(Map<String, Object> map) {
        if (map == null) {
            return null;
        }

        WritableMap writableMap = Arguments.createMap();
        Iterator iterator = map.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry pair = (Map.Entry) iterator.next();
            Object value = pair.getValue();

            if (value == null) {
                writableMap.putNull((String) pair.getKey());
            } else if (value instanceof Boolean) {
                writableMap.putBoolean((String) pair.getKey(), (Boolean) value);
            } else if (value instanceof Double) {
                writableMap.putDouble((String) pair.getKey(), (Double) value);
            } else if (value instanceof Integer) {
                writableMap.putInt((String) pair.getKey(), (Integer) value);
            } else if (value instanceof String) {
                writableMap.putString((String) pair.getKey(), (String) value);
            } else if (value instanceof Map) {
                writableMap.putMap((String) pair.getKey(), toWritableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableMap.putArray((String) pair.getKey(), toWritableArray((List) value));
            } else if (value.getClass() != null && value.getClass().isArray()) {
                writableMap.putArray((String) pair.getKey(), toWritableArray((Object[]) value));
            }
            iterator.remove();
        }

        return writableMap;
    }

    static Object[] toObjectArray(ReadableArray readableArray) {
        if (readableArray == null) {
            return null;
        }

        Object[] array = new Object[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);

            switch (type) {
                case Null:
                    array[i] = null;
                    break;
                case Boolean:
                    array[i] = readableArray.getBoolean(i);
                    break;
                case Number:
                    array[i] = readableArray.getDouble(i);
                    break;
                case String:
                    array[i] = readableArray.getString(i);
                    break;
                case Map:
                    array[i] = toMap(readableArray.getMap(i));
                    break;
                case Array:
                    array[i] = toObjectArray(readableArray.getArray(i));
                    break;
            }
        }

        return array;
    }

    static WritableArray toWritableArray(Object[] array) {
        if (array == null) {
            return null;
        }
        WritableArray writableArr = Arguments.createArray();

        for (int i = 0; i < array.length; i++) {
            Object value = array[i];

            if (value == null) {
                writableArr.pushNull();
            } else if (value instanceof Boolean) {
                writableArr.pushBoolean((Boolean) value);
            } else if (value instanceof Double) {
                writableArr.pushDouble((Double) value);
            } else if (value instanceof Integer) {
                writableArr.pushInt((Integer) value);
            } else if (value instanceof String) {
                writableArr.pushString((String) value);
            } else if (value instanceof Map) {
                writableArr.pushMap(toWritableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableArr.pushArray(toWritableArray((List) value));
            } else if (value.getClass().isArray()) {
                writableArr.pushArray(toWritableArray((Object[]) value));
            }
        }

        return writableArr;
    }

    public static WritableArray toWritableArray(List array) {
        if (array == null) {
            return null;
        }
        WritableArray writableArr = Arguments.createArray();

        for (Object value : array) {
            if (value == null) {
                writableArr.pushNull();
            } else if (value instanceof Boolean) {
                writableArr.pushBoolean((Boolean) value);
            } else if (value instanceof Double) {
                writableArr.pushDouble((Double) value);
            } else if (value instanceof Integer) {
                writableArr.pushInt((Integer) value);
            } else if (value instanceof String) {
                writableArr.pushString((String) value);
            } else if (value instanceof Map) {
                writableArr.pushMap(toWritableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableArr.pushArray(toWritableArray((List) value));
            } else if (value.getClass().isArray()) {
                writableArr.pushArray(toWritableArray((Object[]) value));
            }
        }

        return writableArr;
    }
}