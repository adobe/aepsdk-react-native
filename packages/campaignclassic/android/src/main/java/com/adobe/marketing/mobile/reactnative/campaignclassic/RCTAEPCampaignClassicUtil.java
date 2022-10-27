/*
    Copyright 2022 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
 */

package com.adobe.marketing.mobile.reactnative.campaignclassic;

import android.util.Log;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
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
 * Utility class for converting data models to {@link
 * com.facebook.react.bridge.WritableMap}
 */

class RCTAEPCampaignClassicUtil {

  private static final String TAG = "RCTAEPCampaignClassic";

  private RCTAEPCampaignClassicUtil() {}

  static Map<String, String>
  convertTrackInfoToMap(final ReadableMap readableMap) {
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
    Map<String, String> map = new HashMap<>();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      map.put(key, readableMap.getString(key));
    }
    return map;
  }

  /**
   * Converts {@link ReadableMap} Map to {@link Map}
   *
   * @param readableMap instance of {@code ReadableMap}
   * @return instance of {@code Map}
   */
  static Map<String, Object>
  convertReadableMapToMap(final ReadableMap readableMap) {
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

  private static List<Object>
  convertReadableArrayToList(final ReadableArray readableArray) {
    final List<Object> list = new ArrayList<>(readableArray.size());
    for (int i = 0; i < readableArray.size(); i++) {
      ReadableType indexType = readableArray.getType(i);
      switch (indexType) {
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
