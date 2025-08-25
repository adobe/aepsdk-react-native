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

import static com.adobe.marketing.mobile.reactnative.messaging.RCTAEPMessagingUtil.convertMessageToMap;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.Messaging;
import com.adobe.marketing.mobile.MessagingEdgeEventType;
import com.adobe.marketing.mobile.messaging.MessagingUtils;
import com.adobe.marketing.mobile.messaging.Proposition;
import com.adobe.marketing.mobile.messaging.PropositionItem;
import com.adobe.marketing.mobile.messaging.Surface;
import com.adobe.marketing.mobile.services.ServiceProvider;
import com.adobe.marketing.mobile.services.ui.InAppMessage;
import com.adobe.marketing.mobile.services.ui.message.InAppMessageEventHandler;
import com.adobe.marketing.mobile.services.ui.Presentable;
import com.adobe.marketing.mobile.services.ui.PresentationDelegate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ConcurrentHashMap;



public final class RCTAEPMessagingModule
    extends ReactContextBaseJavaModule implements PresentationDelegate {
  private final Map<String, Proposition> propositionItemByUuid = new ConcurrentHashMap<>();

  @SuppressWarnings("unchecked")
  private String extractActivityId(Proposition proposition) {
    try {
      Map<String, Object> eventData = proposition.toEventData();
      if (eventData == null) return null;
      Object sd = eventData.get("scopeDetails");
      if (!(sd instanceof Map)) return null;
      Object act = ((Map<?, ?>) sd).get("activity");
      if (!(act instanceof Map)) return null;
      Object id = ((Map<?, ?>) act).get("id");
      return (id instanceof String) ? (String) id : null;
    } catch (Exception e) {
      return null;
    }
  }
  private static final String TAG = "RCTAEPMessagingModule";
  private final Map<String, Message> messageCache = new HashMap<>();
  private final ReactApplicationContext reactContext;
  private boolean shouldSaveMessage = false;
  private boolean shouldShowMessage = false;
  private CountDownLatch latch = new CountDownLatch(1);
  private Message latestMessage = null;
  private final Map<String, Presentable<?>> presentableCache = new HashMap<>();

  public RCTAEPMessagingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPMessaging";
  }

  // Required for rn built in EventEmitter Calls.
  @ReactMethod
  public void addListener(String eventName) {}

  @ReactMethod
  public void removeListeners(Integer count) {}

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(Messaging.extensionVersion());
  }

  @ReactMethod
  public void getCachedMessages(final Promise promise) {
    promise.resolve(
        RCTAEPMessagingUtil.convertMessagesToJS(this.messageCache.values()));
  }

  @ReactMethod
  public void getLatestMessage(final Promise promise) {
    if (this.latestMessage != null) {
      promise.resolve(RCTAEPMessagingUtil.convertToReadableMap(convertMessageToMap(this.latestMessage)));
    } else {
      promise.resolve(null);
    }
  }

  @ReactMethod
  public void getPropositionsForSurfaces(ReadableArray surfaces,
                                         final Promise promise) {
    String bundleId = this.reactContext.getPackageName();
    Messaging.getPropositionsForSurfaces(
            RCTAEPMessagingUtil.convertSurfaces(surfaces),
            new AdobeCallbackWithError<Map<Surface, List<Proposition>>>() {
              @Override
              public void fail(final AdobeError adobeError) {
                promise.reject(adobeError.getErrorName(),
                        "Unable to get Propositions");
              }

              @Override
              public void call(
                      Map<Surface, List<Proposition>> propositionsMap) {
                propositionItemByUuid.clear();
                // Build UUID->Proposition map keyed by scopeDetails.activity.activityID when available
                try {
                  for (Map.Entry<Surface, List<Proposition>> entry : propositionsMap.entrySet()) {
                    List<Proposition> propositions = entry.getValue();
                    if (propositions == null) continue;
                    for (Proposition p : propositions) {
                      try {
                        Map<String, Object> eventData = p.toEventData();
                        if (eventData == null) continue;
                        Object sd = eventData.get("scopeDetails");
                        String key = null;
                        if (sd instanceof Map) {
                          Object act = ((Map<?, ?>) sd).get("activity");
                          if (act instanceof Map) {
                            Object activityID = ((Map<?, ?>) act).get("activityID");
                            if (activityID instanceof String) {
                              key = (String) activityID;
                            } else {
                              Object id = ((Map<?, ?>) act).get("id");
                              if (id instanceof String) key = (String) id;
                            }
                          }
                        }
                        if (key == null) key = extractActivityId(p);
                        if (key != null) {
                          propositionItemByUuid.put(key, p);
                        }
                      } catch (Throwable ignore) {}
                    }
                  }
                } catch (Throwable ignore) {}

                promise.resolve(RCTAEPMessagingUtil.convertSurfacePropositions(
                        propositionsMap, bundleId));
              }
            });
  }

//  public void getPropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
//    final String bundleId = this.reactContext.getPackageName();
//
//    Messaging.getPropositionsForSurfaces(
//            RCTAEPMessagingUtil.convertSurfaces(surfaces),
//            new AdobeCallbackWithError<Map<Surface, List<Proposition>>>() {
//              @Override
//              public void fail(final AdobeError adobeError) {
//                Log.d(TAG, "getPropositionsForSurfaces: fail: " + adobeError.getErrorName());
//                promise.reject(adobeError.getErrorName(), "Unable to get Propositions");
//              }
//
//              @Override
//              public void call(Map<Surface, List<Proposition>> propositionsMap) {
//                try {
//                  // Optional: clear UUID cache per fetch to avoid stale entries
//                  propositionItemByUuid.clear();
//
//                  WritableMap out = Arguments.createMap();
//
//                  for (Map.Entry<Surface, List<Proposition>> entry : propositionsMap.entrySet()) {
//                    final String surfaceKey = (entry.getKey() != null)
//                            ? entry.getKey().getUri().replace("mobileapp://" + bundleId + "/", "")
//                            : "unknown";
//                    final List<Proposition> propositions = entry.getValue();
//                    final WritableArray jsProps = Arguments.createArray();
//
//                    Log.d(TAG, "Surface [" + surfaceKey + "] propCount=" + (propositions != null ? propositions.size() : 0));
//
//                    if (propositions != null) {
//                      for (Proposition p : propositions) {
//                        try {
//                          // Start from SDK map for proposition to keep full parity
//                          WritableMap pMap = RCTAEPMessagingUtil.toWritableMap(p.toEventData());
//
//                          // Derive activityId for UUID generation
//                          final String activityId = extractActivityId(p);
//                          Log.d(TAG, "activityId=" + activityId);
//
//                          // If SDK already included items, we'll replace them with UUID-injected ones
//                          final WritableArray newItems = Arguments.createArray();
//
//                          final List<PropositionItem> items = p.getItems();
//                          if (items != null && !items.isEmpty()) {
//                            Log.d(TAG, "items.size=" + items.size());
//
//                            // If you want to "overlay" UUIDs on top of SDK's item maps, fetch them:
//                            ReadableArray sdkItems = null;
//                            if (pMap.hasKey("items") && pMap.getType("items") == ReadableType.Array) {
//                              sdkItems = pMap.getArray("items");
//                            }
//
//                            for (int i = 0; i < items.size(); i++) {
//                              final PropositionItem item = items.get(i);
//
//                              // Base item map: prefer SDK's item map at same index; fallback to manual conversion
//                              WritableMap itemMap = Arguments.createMap();
//                              try {
//                                if (sdkItems != null && i < sdkItems.size() && sdkItems.getType(i) == ReadableType.Map) {
//                                  itemMap.merge(sdkItems.getMap(i)); // like JS spread
//                                } else {
//                                  itemMap = RCTAEPMessagingUtil.convertPropositionItem(item);
//                                }
//                              } catch (Throwable t) {
//                                Log.d(TAG, "Fallback to manual item conversion (index " + i + "): " + t.getMessage());
//                                itemMap = RCTAEPMessagingUtil.convertPropositionItem(item);
//                              }
//
//                              // Inject UUID and cache native item for future tracking
//                              final String uuid = activityId;
//                              itemMap.putString("uuid", uuid);
//                              // Use scopeDetails.activity.activityID as the map key when available
//                              try {
//                                Map<String, Object> eventData = p.toEventData();
//                                Map<String, Object> scopeDetails = (Map<String, Object>) eventData.get("scopeDetails");
//                                Map<String, Object> activity = scopeDetails != null ? (Map<String, Object>) scopeDetails.get("activity") : null;
//                                String activityID = activity != null ? (String) activity.get("activityID") : null;
//                                String key = activityID != null ? activityID : uuid;
//                                propositionItemByUuid.put(key, p);
//                              } catch (Throwable ignore) {
//                                propositionItemByUuid.put(uuid, p);
//                              }
//
//                              // Helpful log
//                              try { Log.d(TAG, "itemId=" + item.getItemId() + " uuid=" + uuid); } catch (Throwable ignore) {}
//
//                              newItems.pushMap(itemMap);
//                            }
//                          } else {
//                            Log.d(TAG, "Proposition has no items.");
//                          }
//
//                          // Overwrite items with UUID-injected array
//                          pMap.putArray("items", newItems);
//
//                          jsProps.pushMap(pMap);
//                        } catch (Throwable propEx) {
//                          Log.d(TAG, "Error building proposition payload, falling back to SDK map: " + propEx.getMessage());
//                          // Fallback: push SDK's raw proposition if something went wrong
//                          jsProps.pushMap(RCTAEPMessagingUtil.toWritableMap(p.toEventData()));
//                        }
//                      }
//                    }
//
//                    // (Optional) per-surface payload log (size only to keep logs light)
//                    Log.d(TAG, "Surface [" + surfaceKey + "] payload size=" + jsProps.size());
//
//                    out.putArray(surfaceKey, jsProps);
//                  }
//
//                  // Log the full 'out' map lightly (size of top-level keys)
//                  try {
//                    Map<String, Object> outSnapshot = RCTAEPMessagingUtil.convertReadableMapToMap(out);
//                    Log.d(TAG, "OUT keys=" + outSnapshot.keySet());
//                  } catch (Throwable e) {
//                    Log.d(TAG, "OUT log failed: " + e.getMessage());
//                  }
//
//                  promise.resolve(out);
//                } catch (Throwable topEx) {
//                  Log.d(TAG, "Top-level error building propositions: " + topEx.getMessage());
//                  // As a last resort, mirror the previous behavior:
//                  try {
//                    String pkg = bundleId;
//                    WritableMap fallback = RCTAEPMessagingUtil.convertSurfacePropositions(propositionsMap, pkg);
//                    promise.resolve(fallback);
//                  } catch (Throwable finalEx) {
//                    promise.reject("BuildError", "Failed to build propositions", finalEx);
//                  }
//                }
//              }
//            });
//  }




  @ReactMethod
  public void refreshInAppMessages() {
    Messaging.refreshInAppMessages();
  }

  @ReactMethod
  public void setMessagingDelegate() {
    ServiceProvider.getInstance().getUIService().setPresentationDelegate(this);
  }

  @ReactMethod
  public void updatePropositionsForSurfaces(ReadableArray surfaces) {
    Messaging.updatePropositionsForSurfaces(
        RCTAEPMessagingUtil.convertSurfaces(surfaces));
  }

  // Message Methods

  @ReactMethod
  public void clear(final String messageId) {
    if (messageId != null) {
      messageCache.remove(messageId);
    }
  }

  @ReactMethod
  public void dismiss(final String messageId) {
    if (messageId != null && messageCache.get(messageId) != null) {
      messageCache.get(messageId).dismiss();
    }
  }

  @ReactMethod
  public void setAutoTrack(final String messageId, final boolean autoTrack) {
    if (messageId != null && messageCache.get(messageId) != null) {
      messageCache.get(messageId).setAutoTrack(autoTrack);
    }
  }

  @ReactMethod
  public void show(final String messageId) {
    if (messageId != null && messageCache.get(messageId) != null) {
      messageCache.get(messageId).show();
    }
  }

  @ReactMethod
  public void track(final String messageId, final String interaction,
                    final int eventType) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MessagingEdgeEventType edgeEventType =
          RCTAEPMessagingUtil.getEventType(eventType);
      if (edgeEventType != null) {
        messageCache.get(messageId).track(interaction, edgeEventType);
      }
    }
  }

  @ReactMethod
  public void handleJavascriptMessage(final String messageId, final String handlerName) {
    Presentable<?> presentable = presentableCache.get(messageId);
    if (presentable == null || !(presentable.getPresentation() instanceof InAppMessage)) return;

    Presentable<InAppMessage> inAppMessagePresentable = (Presentable<InAppMessage>) presentable;
    InAppMessageEventHandler eventHandler = inAppMessagePresentable.getPresentation().getEventHandler();

    eventHandler.handleJavascriptMessage(handlerName, content -> {
      Map<String, String> params = new HashMap<>();
      params.put(RCTAEPMessagingConstants.MESSAGE_ID_KEY, messageId);
      params.put(RCTAEPMessagingConstants.HANDLER_NAME_KEY, handlerName);
      params.put(RCTAEPMessagingConstants.CONTENT_KEY, content);
      emitEvent(RCTAEPMessagingConstants.ON_JAVASCRIPT_MESSAGE_EVENT, params);
    });
  }
 
  // Messaging Delegate functions
  @Override
  public void onShow(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
    presentableCache.put(message.getId(), presentable);
    if (message != null) {
      Map<String, String> data =
          convertMessageToMap(message);
      emitEvent("onShow", data);
    }
  }

  @Override
  public void onDismiss(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
    presentableCache.remove(message.getId());
    if (message != null) {
      Map<String, String> data =
          convertMessageToMap(message);
      emitEvent("onDismiss", data);
    }
  }

  @Override
  public void onHide(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
    if (message != null) {
      Map<String, String> data =
              convertMessageToMap(message);
      emitEvent("onHide", data);
    }
  }

  @Override
  public boolean canShow(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return false;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
    if (message != null) {
      Map<String, String> data =
          convertMessageToMap(message);
      emitEvent("shouldShowMessage", data);
      // Latch stops the thread until the shouldShowMessage value is received
      // from the JS side on thread dedicated to run JS code. The function
      // called from JS that resumes the thread is "shouldShowMessage".
      try {
        latch.await();
      } catch (final InterruptedException e) {
      }
    }

    if (shouldShowMessage) {
      this.latestMessage = message;
    }

    if (shouldSaveMessage) {
      Log.d("MessageCache", "Saving message with ID: " + message.getId()
              + ", Content: " + message);

      messageCache.put(message.getId(), message);
    }
    return shouldShowMessage;
  }

  public void onContentLoaded(final Presentable<?> presentable, PresentationContent presentationContent) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
    if (message != null) {
      Map<String, String> data =
              convertMessageToMap(message);
      emitEvent("onContentLoaded", data);
    }
  }

  // Messaging Delegate Callback
  @ReactMethod(isBlockingSynchronousMethod = true)
  public void setMessageSettings(final boolean shouldShowMessage,
                                 final boolean shouldSaveMessage) {
    this.shouldShowMessage = shouldShowMessage;
    this.shouldSaveMessage = shouldSaveMessage;
    latch.countDown();
  }

  /**
   * Emits an event along with data to be handled by the Javascript
   *
   * @param name event name
   * @param data data sent along with event
   */
  private void emitEvent(final String name, final Map<String, String> data) {
    WritableMap eventData = Arguments.createMap();
    for (final Map.Entry<String, String> entry : data.entrySet()) {
      eventData.putString(entry.getKey(), entry.getValue());
    }
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(name, eventData);
  }

  @ReactMethod
  public void trackContentCardDisplay(ReadableMap propositionMap, ReadableMap contentCardMap) {
    final Map<String, Object> eventData = RCTAEPMessagingUtil.convertReadableMapToMap(propositionMap);
    final Proposition proposition = Proposition.fromEventData(eventData);
    for (PropositionItem item : proposition.getItems()) {
      if (item.getItemId().equals(contentCardMap.getString("id"))) {
        item.track(MessagingEdgeEventType.DISPLAY);
        break;
      }
    }
  }

  @ReactMethod
  public void trackContentCardInteraction(ReadableMap propositionMap, ReadableMap contentCardMap) {
    final Map<String, Object> eventData = RCTAEPMessagingUtil.convertReadableMapToMap(propositionMap);
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
   * This method is used by the React Native PropositionItem.track() method.
   * 
   * @param interaction A custom string value to be recorded in the interaction (nullable)
   * @param eventType The MessagingEdgeEventType numeric value
   * @param tokens Array containing the sub-item tokens for recording interaction (nullable)
   */
  @ReactMethod
  public void trackPropositionItem(String uuid, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens) {
    Log.d(TAG, "trackPropositionItem called with uuid: " + uuid + ", interaction: " + interaction + ", eventType: " + eventType);

    try {
      // Convert eventType int to MessagingEdgeEventType enum
      final MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
      if (edgeEventType == null) {
        Log.d(TAG, "Invalid eventType provided: " + eventType + " for uuid: " + uuid);
        return;
      }
      Log.d(TAG, "Converted eventType " + eventType + " to " + edgeEventType.name());

      // Resolve PropositionItem strictly by UUID
      if (uuid == null) {
        Log.d(TAG, "UUID is null; cannot track.");
        return;
      }
      final Proposition proposition = propositionItemByUuid.get(uuid);

      if (proposition == null) {
        Log.d(TAG, "PropositionItem not found in uuid cache for uuid: " + uuid);
        return;

      }
      final List<PropositionItem> items = proposition.getItems();
      if (items == null || items.isEmpty()) {
        Log.d(TAG, "Proposition has no items for uuid: " + uuid);
        return;
      }
      final PropositionItem propositionItem = items.get(0);

      Log.d(TAG, "Found PropositionItem in uuid cache for uuid: " + uuid);

      // Convert ReadableArray tokens -> List<String>
      List<String> tokenList = null;
      if (tokens != null) {
        tokenList = new ArrayList<>();
        for (int i = 0; i < tokens.size(); i++) {
          tokenList.add(tokens.getString(i));
        }
        Log.d(TAG, "Converted tokens array to list with " + tokenList.size() + " items for uuid: " + uuid);
      } else {
        Log.d(TAG, "No tokens provided for uuid: " + uuid);
      }

      // Track
      if (interaction != null && tokenList != null) {
        Log.d(TAG, "Tracking PropositionItem with interaction '" + interaction + "' and " + tokenList.size() + " tokens for uuid: " + uuid);
        propositionItem.track(interaction, edgeEventType, tokenList);
      } else if (interaction != null) {
        Log.d(TAG, "Tracking PropositionItem with interaction '" + interaction + "' for uuid: " + uuid);
        propositionItem.track(interaction, edgeEventType, null);
      } else {
        Log.d(TAG, "Tracking PropositionItem with eventType only for uuid: " + uuid);
        propositionItem.track(edgeEventType);
      }

      Log.d(TAG, "Successfully tracked PropositionItem for uuid: " + uuid);

    } catch (Exception e) {
      Log.d(TAG, "Error tracking PropositionItem for uuid: " + uuid + ", error: " + e.getMessage(), e);
    }
  }

}
