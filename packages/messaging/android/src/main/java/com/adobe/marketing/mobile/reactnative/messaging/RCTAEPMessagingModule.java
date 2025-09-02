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

import androidx.annotation.NonNull;

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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

public final class RCTAEPMessagingModule
    extends ReactContextBaseJavaModule implements PresentationDelegate {

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

  @ReactMethod
  public void handleJavascriptMessage(final String messageId, final String handlerName) {
    Presentable<?> presentable = presentableCache.get(messageId);
    if (presentable == null || !(presentable.getPresentation() instanceof InAppMessage)) {
      Log.w(TAG, "handleJavascriptMessage: No presentable found for messageId: " + messageId);
      return;
    }

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
}
