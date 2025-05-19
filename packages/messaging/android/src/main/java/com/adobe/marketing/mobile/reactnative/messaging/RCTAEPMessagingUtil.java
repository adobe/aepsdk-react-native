/*
    Copyright 2023 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
 */

 package com.adobe.marketing.mobile.reactnative.messaging;

 import com.adobe.marketing.mobile.Message;
 import com.adobe.marketing.mobile.MessagingEdgeEventType;
 import com.adobe.marketing.mobile.messaging.Proposition;
 import com.adobe.marketing.mobile.messaging.Surface;
 import com.facebook.react.bridge.Arguments;
 import com.facebook.react.bridge.ReadableArray;
 import com.facebook.react.bridge.ReadableMap;
 import com.facebook.react.bridge.WritableArray;
 import com.facebook.react.bridge.WritableMap;
 import com.facebook.react.bridge.WritableNativeArray;
 import com.facebook.react.bridge.WritableNativeMap;
 import java.util.ArrayList;
 import java.util.Collection;
 import java.util.Collections;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 /**
  * Utility class for converting data models to {@link
  * com.facebook.react.bridge.WritableMap}
  */
 
 class RCTAEPMessagingUtil {
 
   private static final String TAG = "RCTAEPMessaging";
 
   private RCTAEPMessagingUtil() {}
 
   // From React Native
   static MessagingEdgeEventType getEventType(final int eventType) {
     switch (eventType) {
     case 0:
       return MessagingEdgeEventType.DISMISS;
     case 1:
       return MessagingEdgeEventType.INTERACT;
     case 2:
       return MessagingEdgeEventType.TRIGGER;
     case 3:
       return MessagingEdgeEventType.DISPLAY;
     case 4:
       return MessagingEdgeEventType.PUSH_APPLICATION_OPENED;
     case 5:
       return MessagingEdgeEventType.PUSH_CUSTOM_ACTION;
     default:
       return null;
     }
   }
 
   static List<Surface> convertSurfaces(final ReadableArray rawSurfaces) {
     List<Surface> surfaces = new ArrayList<>();
 
     for (int i = 0; i < rawSurfaces.size(); i++) {
       surfaces.add(new Surface(rawSurfaces.getString(i)));
     }
 
     return surfaces;
   }
 
   // To React Native
   static WritableMap toWritableMap(Map<String, Object> map) {
     if (map == null) {
       return null;
     }
 
     WritableMap writableMap = Arguments.createMap();
     Iterator iterator = map.entrySet().iterator();
 
     while (iterator.hasNext()) {
       Map.Entry pair = (Map.Entry)iterator.next();
       Object value = pair.getValue();
 
       if (value == null) {
         writableMap.putNull((String)pair.getKey());
       } else if (value instanceof Boolean) {
         writableMap.putBoolean((String)pair.getKey(), (Boolean)value);
       } else if (value instanceof Double) {
         writableMap.putDouble((String)pair.getKey(), (Double)value);
       } else if (value instanceof Integer) {
         writableMap.putInt((String)pair.getKey(), (Integer)value);
       } else if (value instanceof String) {
         writableMap.putString((String)pair.getKey(), (String)value);
       } else if (value instanceof Map) {
         writableMap.putMap((String)pair.getKey(),
                            toWritableMap((Map<String, Object>)value));
       } else if (value instanceof List) {
         writableMap.putArray((String)pair.getKey(),
                              toWritableArray((List)value));
       } else if (value.getClass() != null && value.getClass().isArray()) {
         writableMap.putArray((String)pair.getKey(),
                              toWritableArray((Object[])value));
       }
     }
 
     return writableMap;
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
         writableArr.pushBoolean((Boolean)value);
       } else if (value instanceof Double) {
         writableArr.pushDouble((Double)value);
       } else if (value instanceof Integer) {
         writableArr.pushInt((Integer)value);
       } else if (value instanceof String) {
         writableArr.pushString((String)value);
       } else if (value instanceof Map) {
         writableArr.pushMap(toWritableMap((Map<String, Object>)value));
       } else if (value instanceof List) {
         writableArr.pushArray(toWritableArray((List)value));
       } else if (value.getClass().isArray()) {
         writableArr.pushArray(toWritableArray((Object[])value));
       }
     }
 
     return writableArr;
   }
 
   static WritableArray toWritableArray(List array) {
     if (array == null) {
       return null;
     }
     WritableArray writableArr = Arguments.createArray();
 
     for (Object value : array) {
       if (value == null) {
         writableArr.pushNull();
       } else if (value instanceof Boolean) {
         writableArr.pushBoolean((Boolean)value);
       } else if (value instanceof Double) {
         writableArr.pushDouble((Double)value);
       } else if (value instanceof Integer) {
         writableArr.pushInt((Integer)value);
       } else if (value instanceof String) {
         writableArr.pushString((String)value);
       } else if (value instanceof Map) {
         writableArr.pushMap(toWritableMap((Map<String, Object>)value));
       } else if (value instanceof List) {
         writableArr.pushArray(toWritableArray((List)value));
       } else if (value.getClass().isArray()) {
         writableArr.pushArray(toWritableArray((Object[])value));
       }
     }
 
     return writableArr;
   }
 
   static Map<String, String> convertMessageToMap(final Message message) {
     Map<String, String> data = new HashMap<>();
     data.put("id", message.getId());
     data.put("autoTrack", String.valueOf(message.getAutoTrack()));
     return data;
   }
 
   static ReadableArray convertMessagesToJS(final Collection<Message> messages) {
     WritableArray result = new WritableNativeArray();
 
       for (Message message : messages) {
           result.pushMap(convertToReadableMap(convertMessageToMap(message)));
       }
 
     return result;
   }
 
   static WritableMap convertSurfacePropositions(
       final Map<Surface, List<Proposition>> propositionMap,
       String packageName) {
     WritableMap data = new WritableNativeMap();
 
     for (Map.Entry<Surface, List<Proposition>> entry :
          propositionMap.entrySet()) {
       String key = entry.getKey().getUri().replace(
           "mobileapp://" + packageName + "/", "");
       WritableArray propositions = new WritableNativeArray();
 
       for (Iterator<Proposition> iterator = entry.getValue().iterator();
            iterator.hasNext();) {
         propositions.pushMap(toWritableMap(iterator.next().toEventData()));
       }
 
       data.putArray(key, propositions);
     }
 
     return data;
   }
 
   static ReadableMap convertToReadableMap(Map<String, String> map) {
     WritableMap writableMap = Arguments.createMap();
 
     for (Map.Entry<String, String> entry : map.entrySet()) {
       writableMap.putString(entry.getKey(), entry.getValue());
     }
     return writableMap;
   }
 
   // Helper method to convert ReadableMap to Map<String, Object>
   static Map<String, Object> convertReadableMapToMap(ReadableMap readableMap) {
     if (readableMap == null) {
       return Collections.emptyMap();
     }
     Map<String, Object> map = new HashMap<>();
     com.facebook.react.bridge.ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
     while (iterator.hasNextKey()) {
       String key = iterator.nextKey();
       com.facebook.react.bridge.ReadableType type = readableMap.getType(key);
       switch (type) {
         case Null:
           map.put(key, null);
           break;
         case Boolean:
           map.put(key, readableMap.getBoolean(key));
           break;
         case Number:
           // Can be int or double
           double numberValue = readableMap.getDouble(key);
           if (numberValue == (int) numberValue) {
             map.put(key, (int) numberValue);
           } else {
             map.put(key, numberValue);
           }
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
       }
     }
     return map;
   }
 
   // Helper method to convert ReadableArray to List<Object>
   static List<Object> convertReadableArrayToList(ReadableArray readableArray) {
     if (readableArray == null) {
       return Collections.emptyList();
     }
     List<Object> list = new ArrayList<>(readableArray.size());
     for (int i = 0; i < readableArray.size(); i++) {
       com.facebook.react.bridge.ReadableType type = readableArray.getType(i);
       switch (type) {
         case Null:
           list.add(null);
           break;
         case Boolean:
           list.add(readableArray.getBoolean(i));
           break;
         case Number:
           double numberValue = readableArray.getDouble(i);
           if (numberValue == (int) numberValue) {
             list.add((int) numberValue);
           } else {
             list.add(numberValue);
           }
           break;
         case String:
           list.add(readableArray.getString(i));
           break;
         case Map:
           list.add(convertReadableMapToMap(readableArray.getMap(i)));
           break;
         case Array:
           list.add(convertReadableArrayToList(readableArray.getArray(i)));
           break;
       }
     }
     return list;
   }
 
   // Helper method to convert ReadableArray to List<String>, assuming all elements are strings
   static List<String> convertReadableArrayToStringList(ReadableArray readableArray) {
     if (readableArray == null) {
       return Collections.emptyList();
     }
     List<String> list = new ArrayList<>(readableArray.size());
     for (int i = 0; i < readableArray.size(); i++) {
       com.facebook.react.bridge.ReadableType type = readableArray.getType(i);
       if (type == com.facebook.react.bridge.ReadableType.String) {
         list.add(readableArray.getString(i));
       } else {
         // Handle error or skip non-string elements if necessary
         // For now, skipping non-string elements
       }
     }
     return list;
   }
 }