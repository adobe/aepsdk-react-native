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

 import com.adobe.marketing.mobile.AdobeCallbackWithError;
 import com.adobe.marketing.mobile.AdobeError;
 import com.adobe.marketing.mobile.Message;
 import com.adobe.marketing.mobile.Messaging;
 import com.adobe.marketing.mobile.MessagingEdgeEventType;
 import com.adobe.marketing.mobile.messaging.Proposition;
 import com.adobe.marketing.mobile.messaging.PropositionItem;
 import com.adobe.marketing.mobile.messaging.Surface;
 import com.adobe.marketing.mobile.services.ServiceProvider;
 import com.adobe.marketing.mobile.services.ui.InAppMessage;
 import com.adobe.marketing.mobile.services.ui.Presentable;
 import com.adobe.marketing.mobile.services.ui.PresentationDelegate;
 import com.adobe.marketing.mobile.services.ui.message.InAppMessageEventHandler;
 import com.facebook.react.bridge.Arguments;
 import com.facebook.react.bridge.Promise;
 import com.facebook.react.bridge.ReactApplicationContext;
 import com.facebook.react.bridge.ReadableArray;
 import com.facebook.react.bridge.ReadableMap;
 import com.facebook.react.bridge.ReadableMapKeySetIterator;
 import com.facebook.react.bridge.ReadableType;
 import com.facebook.react.bridge.WritableArray;
 import com.facebook.react.bridge.WritableMap;
 import com.facebook.react.bridge.WritableNativeArray;
 import com.facebook.react.bridge.WritableNativeMap;
 import com.facebook.react.modules.core.DeviceEventManagerModule;
 import android.content.Context;
 import android.content.SharedPreferences;
 import android.util.Log;
 import androidx.annotation.Nullable;
 import java.util.ArrayList;
 import java.util.Collection;
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

   private static final String INBOX_PREFS = "AEPMessagingInbox";
   private static final String INBOX_KEY_PREFIX = "aep_messaging_inbox_";

   // ---- Shared module logic (used by both the legacy and the Turbo module) ----

   static void extensionVersion(final Promise promise) {
     promise.resolve(Messaging.extensionVersion());
   }

   static void getCachedMessages(final RCTAEPMessagingState state, final Promise promise) {
     promise.resolve(convertMessagesToJS(state.messageCache.values()));
   }

   static void getLatestMessage(final RCTAEPMessagingState state, final Promise promise) {
     if (state.latestMessage != null) {
       promise.resolve(convertToReadableMap(convertMessageToMap(state.latestMessage)));
     } else {
       promise.resolve(null);
     }
   }

   static void getPropositionsForSurfaces(final RCTAEPMessagingState state,
                                          final ReadableArray surfaces,
                                          final Promise promise) {
     final String bundleId = state.reactContext.getPackageName();
     Messaging.getPropositionsForSurfaces(
         convertSurfaces(surfaces),
         new AdobeCallbackWithError<Map<Surface, List<Proposition>>>() {
           @Override
           public void fail(final AdobeError adobeError) {
             promise.reject(adobeError.getErrorName(), "Unable to get Propositions");
           }

           @Override
           public void call(Map<Surface, List<Proposition>> propositionsMap) {
             // Build UUID->Proposition map keyed by scopeDetails.activity.id
             try {
               for (Map.Entry<Surface, List<Proposition>> entry : propositionsMap.entrySet()) {
                 List<Proposition> propositions = entry.getValue();
                 if (propositions == null) continue;
                 for (Proposition proposition : propositions) {
                   try {
                     String key = extractActivityId(proposition);
                     if (key != null) {
                       state.propositionItemByUuid.put(key, proposition);
                     }
                   } catch (Throwable ignore) {}
                 }
               }
             } catch (Throwable ignore) {}

             promise.resolve(convertSurfacePropositions(propositionsMap, bundleId));
           }
         });
   }

   static void refreshInAppMessages() {
     Messaging.refreshInAppMessages();
   }

   static void setMessagingDelegate(final PresentationDelegate delegate) {
     ServiceProvider.getInstance().getUIService().setPresentationDelegate(delegate);
   }

   static void setMessageSettings(final RCTAEPMessagingState state,
                                  final boolean shouldShowMessage,
                                  final boolean shouldSaveMessage) {
     state.shouldShowMessage = shouldShowMessage;
     state.shouldSaveMessage = shouldSaveMessage;
     state.latch.countDown();
   }

   static void updatePropositionsForSurfaces(final RCTAEPMessagingState state,
                                             final ReadableArray surfaces,
                                             final Promise promise) {
     Messaging.updatePropositionsForSurfaces(convertSurfaces(surfaces));
     state.propositionItemByUuid.clear();
     promise.resolve(null);
   }

   static void clear(final RCTAEPMessagingState state, final String messageId) {
     if (messageId != null) {
       state.messageCache.remove(messageId);
     }
   }

   static void dismiss(final RCTAEPMessagingState state, final String messageId) {
     if (messageId != null && state.messageCache.get(messageId) != null) {
       state.messageCache.get(messageId).dismiss();
     }
   }

   static void setAutoTrack(final RCTAEPMessagingState state, final String messageId,
                            final boolean autoTrack) {
     if (messageId != null && state.messageCache.get(messageId) != null) {
       state.messageCache.get(messageId).setAutoTrack(autoTrack);
     }
   }

   static void show(final RCTAEPMessagingState state, final String messageId) {
     if (messageId != null && state.messageCache.get(messageId) != null) {
       state.messageCache.get(messageId).show();
     }
   }

   static void track(final RCTAEPMessagingState state, final String messageId,
                     final String interaction, final int eventType) {
     if (messageId != null && state.messageCache.get(messageId) != null) {
       MessagingEdgeEventType edgeEventType = getEventType(eventType);
       if (edgeEventType != null) {
         state.messageCache.get(messageId).track(interaction, edgeEventType);
       }
     }
   }

   static void handleJavascriptMessage(final RCTAEPMessagingState state,
                                       final String messageId,
                                       final String handlerName) {
     Presentable<?> presentable = state.presentableCache.get(messageId);
     if (presentable == null || !(presentable.getPresentation() instanceof InAppMessage)) {
       Log.w(TAG, "handleJavascriptMessage: No presentable found for messageId: " + messageId);
       return;
     }

     Presentable<InAppMessage> inAppMessagePresentable = (Presentable<InAppMessage>)presentable;
     InAppMessageEventHandler eventHandler =
         inAppMessagePresentable.getPresentation().getEventHandler();

     eventHandler.handleJavascriptMessage(handlerName, content -> {
       Map<String, String> params = new HashMap<>();
       params.put(RCTAEPMessagingConstants.MESSAGE_ID_KEY, messageId);
       params.put(RCTAEPMessagingConstants.HANDLER_NAME_KEY, handlerName);
       params.put(RCTAEPMessagingConstants.CONTENT_KEY, content);
       emitEvent(state.reactContext, RCTAEPMessagingConstants.ON_JAVASCRIPT_MESSAGE_EVENT, params);
     });
   }

   static void evaluateJavascript(final RCTAEPMessagingState state, final String messageId,
                                  final String javascriptString) {
     Presentable<?> presentable = state.presentableCache.get(messageId);
     if (presentable == null || !(presentable.getPresentation() instanceof InAppMessage)) {
       Log.w(TAG, "evaluateJavascript: No presentable found for messageId: " + messageId);
       return;
     }

     Presentable<InAppMessage> inAppMessagePresentable = (Presentable<InAppMessage>)presentable;
     InAppMessageEventHandler eventHandler =
         inAppMessagePresentable.getPresentation().getEventHandler();
     eventHandler.evaluateJavascript(javascriptString, result -> {
       Map<String, String> params = new HashMap<>();
       params.put(RCTAEPMessagingConstants.MESSAGE_ID_KEY, messageId);
       params.put(RCTAEPMessagingConstants.JAVASCRIPT_STRING_KEY, javascriptString);
       params.put(RCTAEPMessagingConstants.RESULT_KEY, result);
       emitEvent(state.reactContext, RCTAEPMessagingConstants.ON_JAVASCRIPT_RESULT_EVENT, params);
     });
   }

   static void trackContentCardDisplay(final ReadableMap propositionMap,
                                       final ReadableMap contentCardMap) {
     final Map<String, Object> eventData = convertReadableMapToMap(propositionMap);
     final Proposition proposition = Proposition.fromEventData(eventData);
     for (PropositionItem item : proposition.getItems()) {
       if (item.getItemId().equals(contentCardMap.getString("id"))) {
         item.track(MessagingEdgeEventType.DISPLAY);
         break;
       }
     }
   }

   static void trackContentCardInteraction(final ReadableMap propositionMap,
                                           final ReadableMap contentCardMap) {
     final Map<String, Object> eventData = convertReadableMapToMap(propositionMap);
     final Proposition proposition = Proposition.fromEventData(eventData);
     for (PropositionItem item : proposition.getItems()) {
       if (item.getItemId().equals(contentCardMap.getString("id"))) {
         item.track("click", MessagingEdgeEventType.INTERACT, null);
         break;
       }
     }
   }

   /**
    * Tracks interactions with a PropositionItem using the provided interaction and event type.
    * Used by the React Native PropositionItem.track() method.
    */
   static void trackPropositionItem(final RCTAEPMessagingState state, final String uuid,
                                    @Nullable final String interaction, final int eventType,
                                    @Nullable final ReadableArray tokens,
                                    final Promise promise) {
     try {
       // Convert eventType int to MessagingEdgeEventType enum
       final MessagingEdgeEventType edgeEventType = getEventType(eventType);
       if (edgeEventType == null) {
         return;
       }
       // Resolve PropositionItem by UUID
       if (uuid == null) {
         Log.d(TAG, "[MessagingBridge] Null uuid provided");
         return;
       }
       final Proposition proposition = state.propositionItemByUuid.get(uuid);
       if (proposition == null) {
         Log.d(TAG, "[MessagingBridge] No cached proposition for uuid=" + uuid);
         return;
       }
       final List<PropositionItem> items = proposition.getItems();
       if (items == null || items.isEmpty()) {
         return;
       }
       final PropositionItem propositionItem = items.get(0);

       // Convert ReadableArray tokens -> List<String> (empty list if none)
       List<String> tokenList = new ArrayList<>();
       if (tokens != null) {
         for (int i = 0; i < tokens.size(); i++) {
           tokenList.add(tokens.getString(i));
         }
       }
       Log.d(TAG, "[MessagingBridge] Tracking (direct) uuid=" + uuid + ", interaction="
                      + interaction + ", tokens=" + tokenList
                      + ", eventType=" + edgeEventType.name());
       propositionItem.track(interaction, edgeEventType, tokenList);

     } catch (Exception e) {
       Log.d(TAG, "Error tracking PropositionItem for uuid: " + uuid + ", error: "
                      + e.getMessage(), e);
     } finally {
       promise.resolve(null);
     }
   }

   static void getInboxState(final Context context, final String activityId,
                             final Promise promise) {
     try {
       if (activityId == null || activityId.isEmpty()) {
         promise.resolve(null);
         return;
       }
       SharedPreferences prefs = context.getSharedPreferences(INBOX_PREFS, Context.MODE_PRIVATE);
       promise.resolve(prefs.getString(INBOX_KEY_PREFIX + activityId, null));
     } catch (Exception e) {
       Log.e(TAG, "[MessagingBridge] getInboxState error: " + e.getMessage(), e);
       promise.resolve(null);
     }
   }

   static void setInboxState(final Context context, final String activityId,
                             final String stateJson, final Promise promise) {
     try {
       if (activityId == null || activityId.isEmpty()) {
         promise.resolve(null);
         return;
       }
       SharedPreferences prefs = context.getSharedPreferences(INBOX_PREFS, Context.MODE_PRIVATE);
       prefs.edit().putString(INBOX_KEY_PREFIX + activityId, stateJson).apply();
       promise.resolve(null);
     } catch (Exception e) {
       Log.e(TAG, "[MessagingBridge] setInboxState error: " + e.getMessage(), e);
       promise.reject("setInboxState", e.getMessage(), e);
     }
   }

   /**
    * Emits an event along with data to be handled by the Javascript.
    *
    * @param name event name
    * @param data data sent along with event
    */
   static void emitEvent(final ReactApplicationContext reactContext, final String name,
                         final Map<String, String> data) {
     WritableMap eventData = Arguments.createMap();
     for (final Map.Entry<String, String> entry : data.entrySet()) {
       eventData.putString(entry.getKey(), entry.getValue());
     }
     reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
         .emit(name, eventData);
   }

   /**
    * Parses the given Proposition and extracts the activity ID.
    *
    * Expected location: scopeDetails.activity.id in the proposition's event data.
    * Returns null when any of the nested structures are missing or the id is not a String.
    */
   static String extractActivityId(final Proposition proposition) {
     try {
       Map<String, Object> eventData = proposition.toEventData();
       if (eventData == null) {
         Log.d(TAG, "[MessagingBridge] Proposition toEventData() returned null; cannot extract activity.id");
         return null;
       }
       Object scopeDetailsObj = eventData.get("scopeDetails");
       if (!(scopeDetailsObj instanceof Map)) return null;
       Map<String, Object> scopeDetails = (Map<String, Object>) scopeDetailsObj;
       Object activityObj = scopeDetails.get("activity");
       if (!(activityObj instanceof Map)) {
         Log.d(TAG, "[MessagingBridge] Missing activity under scopeDetails; cannot extract activity.id");
         return null;
       }
       Map<String, Object> activity = (Map<String, Object>) activityObj;
       Object id = activity.get("id");
       if (id instanceof String) {
         return (String) id;
       }
       Log.d(TAG, "[MessagingBridge] Missing activity.id or not a String; skipping uuid cache mapping");
       return null;
     } catch (Exception e) {
       Log.d(TAG, "[MessagingBridge] Exception extracting activity.id: " + e.getMessage(), e);
       return null;
     }
   }
 
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