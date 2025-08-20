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

 import android.util.Log;

 import com.adobe.marketing.mobile.Message;
 import com.adobe.marketing.mobile.MessagingEdgeEventType;
 import com.adobe.marketing.mobile.messaging.Proposition;
 import com.adobe.marketing.mobile.messaging.PropositionItem;
 import com.adobe.marketing.mobile.messaging.Surface;
 import com.facebook.react.bridge.Arguments;
 import com.facebook.react.bridge.ReadableArray;
 import com.facebook.react.bridge.ReadableMap;
 import com.facebook.react.bridge.ReadableMapKeySetIterator;
 import com.facebook.react.bridge.ReadableType;
 import com.facebook.react.bridge.WritableArray;
 import com.facebook.react.bridge.WritableMap;
 import com.facebook.react.bridge.WritableNativeArray;
 import com.facebook.react.bridge.WritableNativeMap;
 import java.util.ArrayList;
 import java.util.Collection;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.concurrent.atomic.AtomicLong;
 import java.util.UUID;
 import java.nio.charset.StandardCharsets;
 
 /**
  * Utility class for converting data models to {@link
  * com.facebook.react.bridge.WritableMap}
  */
 
 class RCTAEPMessagingUtil {
 
   private static final String TAG = "RCTAEPMessaging";
     private static final AtomicLong GLOBAL_UUID_COUNTER = new AtomicLong(0L);
     @SuppressWarnings("unchecked")
     private static String extractActivityIdFromPropositionEventData(final Proposition p) {
         try {
             final Map<String, Object> ed = p.toEventData();
             if (ed == null) return null;
             final Object sd = ed.get("scopeDetails");
             if (!(sd instanceof Map)) return null;
             final Object act = ((Map<String, Object>) sd).get("activity");
             if (!(act instanceof Map)) return null;
             final Object id = ((Map<String, Object>) act).get("id");
             return (id instanceof String) ? (String) id : null;
         } catch (Exception ignored) {
             return null;
         }
     }

     private static String generateItemUuid(final String activityId, final long counter) {
         final String key = (activityId != null ? activityId : "") + "#" + counter;
         return UUID.nameUUIDFromBytes(key.getBytes(StandardCharsets.UTF_8)).toString();
     }
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


     public static WritableMap convertPropositionItem(final PropositionItem item) {
         WritableMap map = Arguments.createMap();
         try {
             // Core fields (public getters only)
             map.putString("id", item.getItemId());
             if (item.getSchema() != null) {
                 map.putString("schema", item.getSchema().toString());
             }

             // Data payload
             if (item.getItemData() != null && !item.getItemData().isEmpty()) {
                 map.putMap("data", toWritableMap(item.getItemData()));
             }

             // Optional convenience fields (schema-derived)
             Map<String, Object> jsonMap = item.getJsonContentMap();
             if (jsonMap != null) {
                 map.putMap("jsonContentMap", toWritableMap(jsonMap));
             }

             List<Map<String, Object>> jsonArr = item.getJsonContentArrayList();
             if (jsonArr != null) {
                 map.putArray("jsonContentArray", toWritableArray(jsonArr));
             }

             String html = item.getHtmlContent();
             if (html != null) {
                 map.putString("htmlContent", html);
             }
         } catch (Exception e) {
             Log.w("RCTAEPMessagingUtil", "Error converting PropositionItem: " + e.getMessage());
         }
         return map;
     }

     public static WritableMap convertSingleProposition(final Proposition p, final String bundleId) {
         WritableMap map = Arguments.createMap();

         // 1) Start from Proposition's own event data (Proposition.toEventData is public)
         try {
             Map<String, Object> eventData = p.toEventData();
             if (eventData != null) {
                 map = toWritableMap(eventData);
             }
         } catch (Exception ignored) {}

         // 2) Ensure scopeDetails.activity is present & writable
         WritableMap scopeDetails = Arguments.createMap();
         if (map.hasKey("scopeDetails") && map.getType("scopeDetails") == ReadableType.Map) {
             scopeDetails.merge(map.getMap("scopeDetails"));
         }
         WritableMap activity = Arguments.createMap();
         if (scopeDetails.hasKey("activity") && scopeDetails.getType("activity") == ReadableType.Map) {
             activity.merge(scopeDetails.getMap("activity"));
         }
         scopeDetails.putMap("activity", activity);
         map.putMap("scopeDetails", scopeDetails);

         // 3) Extract activityId for UUID generation (safe only if present)
         String activityId = null;
         if (activity.hasKey("id") && activity.getType("id") == ReadableType.String) {
             activityId = activity.getString("id");
         }

         // 4) Build items array from actual PropositionItems and inject uuid
         WritableArray itemsArr = Arguments.createArray();
         try {
             List<PropositionItem> items = p.getItems();
             if (items != null) {
                 for (final PropositionItem item : items) {
                     WritableMap itemMap = convertPropositionItem(item);
                     String uuid = generateItemUuid(activityId, GLOBAL_UUID_COUNTER.incrementAndGet());
                     itemMap.putString("uuid", uuid); // <-- inject UUID here
                     itemsArr.pushMap(itemMap);
                 }
             }
         } catch (Exception e) {
             Log.w("RCTAEPMessagingUtil", "Error building items with UUID: " + e.getMessage());
         }
         map.putArray("items", itemsArr);

         return map;
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
         //propositions.pushMap(toWritableMap(iterator.next().toEventData()));
           Proposition nextProp = iterator.next();
           propositions.pushMap(convertSingleProposition(nextProp, packageName));
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

    static List<Object> convertReadableArrayToList(final ReadableArray readableArray) {
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
