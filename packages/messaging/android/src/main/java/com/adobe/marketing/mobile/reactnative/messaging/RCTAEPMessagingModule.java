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
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.Messaging;
import com.adobe.marketing.mobile.MessagingEdgeEventType;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.messaging.MessagingUtils;
import com.adobe.marketing.mobile.messaging.Proposition;
import com.adobe.marketing.mobile.messaging.PropositionItem;
import com.adobe.marketing.mobile.messaging.Surface;
import com.adobe.marketing.mobile.services.ServiceProvider;
import com.adobe.marketing.mobile.services.ui.InAppMessage;
import com.adobe.marketing.mobile.services.ui.Presentable;
import com.adobe.marketing.mobile.services.ui.PresentationDelegate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
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

  private static final String TAG = "RCTAEPMessagingModule";
  private final Map<String, Message> messageCache = new HashMap<>();
  private final ReactApplicationContext reactContext;
  private boolean shouldSaveMessage = false;
  private boolean shouldShowMessage = false;
  private CountDownLatch latch = new CountDownLatch(1);
  private Message latestMessage = null;

  // Cache to store PropositionItem objects by their ID for unified tracking
  private final Map<String, PropositionItem> propositionItemCache = new ConcurrentHashMap<>();
  // Cache to store the parent Proposition for each PropositionItem
  private final Map<String, Proposition> propositionCache = new ConcurrentHashMap<>();

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
            
            // Cache PropositionItems for unified tracking when propositions are retrieved
            for (Map.Entry<Surface, List<Proposition>> entry : propositionsMap.entrySet()) {
              List<Proposition> propositions = entry.getValue();
              if (propositions != null) {
                cachePropositionsItems(propositions);
              }
            }
            
            promise.resolve(RCTAEPMessagingUtil.convertSurfacePropositions(
                propositionsMap, bundleId));
          }
        });
  }

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

  // Messaging Delegate functions
  @Override
  public void onShow(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage)) return;
    Message message = MessagingUtils.getMessageForPresentable((Presentable<InAppMessage>) presentable);
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
   * @param itemId The unique identifier of the PropositionItem
   * @param interaction A custom string value to be recorded in the interaction (nullable)
   * @param eventType The MessagingEdgeEventType numeric value
   * @param tokens Array containing the sub-item tokens for recording interaction (nullable)
   */
  @ReactMethod
  public void trackPropositionItem(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens) {
    Log.d(TAG, "trackPropositionItem called with itemId: " + itemId + ", interaction: " + interaction + ", eventType: " + eventType);

    try {
      // Convert eventType int to MessagingEdgeEventType enum
      MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
      if (edgeEventType == null) {
        Log.d(TAG, "Invalid eventType provided: " + eventType + " for itemId: " + itemId);
        return;
      }

      Log.d(TAG, "Converted eventType " + eventType + " to MessagingEdgeEventType: " + edgeEventType.name());

      // Find the PropositionItem by ID
      PropositionItem propositionItem = findPropositionItemById(itemId);

      if (propositionItem == null) {
        Log.d(TAG, "PropositionItem not found in cache for itemId: " + itemId);
        return;
      }

      Log.d(TAG, "Found PropositionItem in cache for itemId: " + itemId);

      // Convert ReadableArray to List<String> if provided
      List<String> tokenList = null;
      if (tokens != null) {
        tokenList = new ArrayList<>();
        for (int i = 0; i < tokens.size(); i++) {
          tokenList.add(tokens.getString(i));
        }
        Log.d(TAG, "Converted tokens array to list with " + tokenList.size() + " items for itemId: " + itemId);
      } else {
        Log.d(TAG, "No tokens provided for itemId: " + itemId);
      }

      // Call the appropriate track method based on provided parameters
      if (interaction != null && tokenList != null) {
        // Track with interaction and tokens
        Log.d(TAG, "Tracking PropositionItem with interaction '" + interaction + "' and " + tokenList.size() + " tokens for itemId: " + itemId);
        propositionItem.track(interaction, edgeEventType, tokenList);
      } else if (interaction != null) {
        // Track with interaction only
        Log.d(TAG, "Tracking PropositionItem with interaction '" + interaction + "' for itemId: " + itemId);
        propositionItem.track(interaction, edgeEventType, null);
      } else {
        // Track with event type only
        Log.d(TAG, "Tracking PropositionItem with eventType only for itemId: " + itemId);
        propositionItem.track(edgeEventType);
      }

      Log.d(TAG, "Successfully tracked PropositionItem for itemId: " + itemId);

    } catch (Exception e) {
      Log.d(TAG, "Error tracking PropositionItem: " + itemId + ", error: " + e.getMessage(), e);
    }
  }
  /**
   * Generates XDM data for PropositionItem interactions.
   * This method is used by the React Native PropositionItem.generateInteractionXdm() method.
   * 
   * @param itemId The unique identifier of the PropositionItem
   * @param interaction A custom string value to be recorded in the interaction (nullable)
   * @param eventType The MessagingEdgeEventType numeric value
   * @param tokens Array containing the sub-item tokens for recording interaction (nullable)
   * @param promise Promise to resolve with XDM data for the proposition interaction
   */
  @ReactMethod
  public void generatePropositionInteractionXdm(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens, Promise promise) {
    try {
      // Convert eventType int to MessagingEdgeEventType enum
      MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
      if (edgeEventType == null) {
        promise.reject("InvalidEventType", "Invalid eventType: " + eventType);
        return;
      }
      
      // Find the PropositionItem by ID
      PropositionItem propositionItem = findPropositionItemById(itemId);
      
      if (propositionItem == null) {
        promise.reject("PropositionItemNotFound", "No PropositionItem found with ID: " + itemId);
        return;
      }

      // Convert ReadableArray to List<String> if provided
      List<String> tokenList = null;
      if (tokens != null) {
        tokenList = new ArrayList<>();
        for (int i = 0; i < tokens.size(); i++) {
          tokenList.add(tokens.getString(i));
        }
      }

      // Generate XDM data using the appropriate method
      Map<String, Object> xdmData;
      if (interaction != null && tokenList != null) {
        xdmData = propositionItem.generateInteractionXdm(interaction, edgeEventType, tokenList);
      } else if (interaction != null) {
        xdmData = propositionItem.generateInteractionXdm(interaction, edgeEventType, null);
      } else {
        xdmData = propositionItem.generateInteractionXdm(edgeEventType);
      }

      if (xdmData != null) {
        // Convert Map to WritableMap for React Native
        WritableMap result = RCTAEPMessagingUtil.toWritableMap(xdmData);
        promise.resolve(result);
      } else {
        promise.reject("XDMGenerationFailed", "Failed to generate XDM data for PropositionItem: " + itemId);
      }

    } catch (Exception e) {
//      Log.error(TAG, "Error generating XDM data for PropositionItem: " + itemId + ", error: " + e.getMessage());
      promise.reject("XDMGenerationError", "Error generating XDM data: " + e.getMessage(), e);
    }
  }

  /**
   * Caches a PropositionItem and its parent Proposition for later tracking.
   * This method should be called when PropositionItems are created from propositions.
   * 
   * @param propositionItem The PropositionItem to cache
   * @param parentProposition The parent Proposition containing this item
   */
  public void cachePropositionItem(PropositionItem propositionItem, Proposition parentProposition) {
    if (propositionItem != null && propositionItem.getItemId() != null) {
      String itemId = propositionItem.getItemId();
      
      // Cache the PropositionItem
      propositionItemCache.put(itemId, propositionItem);
      
      // Cache the parent Proposition
      if (parentProposition != null) {
        propositionCache.put(itemId, parentProposition);
        
        // Set the proposition reference in the PropositionItem if possible
        try {
          // Use reflection to set the proposition reference
          java.lang.reflect.Field propositionRefField = propositionItem.getClass().getDeclaredField("propositionReference");
          propositionRefField.setAccessible(true);
          propositionRefField.set(propositionItem, new java.lang.ref.SoftReference<>(parentProposition));
        } catch (Exception e) {

        }
      }
      
    }
  }

  /**
   * Caches multiple PropositionItems from a list of propositions.
   * This is a convenience method for caching all items from multiple propositions.
   * 
   * @param propositions List of propositions containing items to cache
   */
  public void cachePropositionsItems(List<Proposition> propositions) {
    if (propositions != null) {
      for (Proposition proposition : propositions) {
        if (proposition.getItems() != null) {
          for (PropositionItem item : proposition.getItems()) {
            cachePropositionItem(item, proposition);
          }
        }
      }
    }
  }

  /**
   * Finds a cached PropositionItem by its ID.
   * 
   * @param itemId The ID of the PropositionItem to find
   * @return The PropositionItem if found, null otherwise
   */
  private PropositionItem findPropositionItemById(String itemId) {
    return propositionItemCache.get(itemId);
  }

  /**
   * Finds a cached parent Proposition by PropositionItem ID.
   * 
   * @param itemId The ID of the PropositionItem whose parent to find
   * @return The parent Proposition if found, null otherwise
   */
  private Proposition findPropositionByItemId(String itemId) {
    return propositionCache.get(itemId);
  }

  /**
   * Clears the PropositionItem cache.
   * This should be called when propositions are refreshed or when memory cleanup is needed.
   */
  @ReactMethod
  public void clearPropositionItemCache() {
    propositionItemCache.clear();
    propositionCache.clear();
  }

  /**
   * Gets the current size of the PropositionItem cache.
   * Useful for debugging and monitoring.
   * 
   * @param promise Promise that resolves with the cache size
   */
  @ReactMethod
  public void getPropositionItemCacheSize(Promise promise) {
    promise.resolve(propositionItemCache.size());
  }

  /**
   * Checks if a PropositionItem exists in the cache.
   * 
   * @param itemId The ID of the PropositionItem to check
   * @param promise Promise that resolves with boolean indicating if item exists
   */
  @ReactMethod
  public void hasPropositionItem(String itemId, Promise promise) {
    promise.resolve(propositionItemCache.containsKey(itemId));
  }
}
