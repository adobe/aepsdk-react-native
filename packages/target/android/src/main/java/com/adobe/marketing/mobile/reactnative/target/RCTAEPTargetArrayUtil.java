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
package com.adobe.marketing.mobile.reactnative.target;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RCTAEPTargetArrayUtil {

    public static Object[] toObjectArray(ReadableArray readableArray) {
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
                    array[i] = RCTAEPTargetMapUtil.toMap(readableArray.getMap(i));
                    break;
                case Array:
                    array[i] = RCTAEPTargetArrayUtil.toObjectArray(readableArray.getArray(i));
                    break;
            }
        }

        return array;
    }

    public static List<String> toStringArray(ReadableArray readableArray) {
        if (readableArray == null) {
            return null;
        }

        ArrayList<String> list = new ArrayList<>();

        for(int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);
            if (type == ReadableType.String) {
                list.add(readableArray.getString(i));
            }
        }

        return list;
    }

    public static WritableArray toWritableArray(Object[] array) {
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
                writableArr.pushMap(RCTAEPTargetMapUtil.toWritableMap((Map<String, Object>) value));
            } else if (value.getClass().isArray()) {
                writableArr.pushArray(RCTAEPTargetArrayUtil.toWritableArray((Object[]) value));
            }
        }

        return writableArr;
    }

}
