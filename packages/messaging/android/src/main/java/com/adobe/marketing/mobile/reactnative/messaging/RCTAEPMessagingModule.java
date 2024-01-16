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

import android.app.Activity;
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.Messaging;
import com.adobe.marketing.mobile.MessagingEdgeEventType;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.messaging.MessagingProposition;
import com.adobe.marketing.mobile.messaging.Surface;
import com.adobe.marketing.mobile.services.MessagingDelegate;
import com.adobe.marketing.mobile.services.ui.FullscreenMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

public final class RCTAEPMessagingModule
    extends ReactContextBaseJavaModule implements MessagingDelegate {

  private static final String TAG = "RCTAEPMessagingModule";
  private final Map<String, Message> messageCache = new HashMap<>();
  private final ReactApplicationContext reactContext;
  private boolean shouldSaveMessage = false;
  private boolean shouldShowMessage = false;
  private CountDownLatch latch = new CountDownLatch(1);
  private Message latestMessage = null;

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
    MobileCore.log(LoggingMode.VERBOSE, TAG, "extensionVersion is called");
    promise.resolve(Messaging.extensionVersion());
  }

  @ReactMethod
  public void getCachedMessages(final Promise promise) {
    promise.resolve(
        RCTAEPMessagingUtil.convertMessagesToJS(this.messageCache.values()));
  }

  @ReactMethod
  public void getLatestMessage(final Promise promise) {
    promise.resolve(this.latestMessage);
  }

  @ReactMethod
  public void getPropositionsForSurfaces(ReadableArray surfaces,
                                         final Promise promise) {
    String bundleId = this.reactContext.getPackageName();
    Messaging.getPropositionsForSurfaces(
        RCTAEPMessagingUtil.convertSurfaces(surfaces),
        new AdobeCallbackWithError<Map<Surface, List<MessagingProposition>>>() {
          @Override
          public void fail(final AdobeError adobeError) {
            promise.reject(adobeError.getErrorName(),
                           "Unable to get Propositions");
          }

          @Override
          public void call(
              Map<Surface, List<MessagingProposition>> propositionsMap) {
            promise.resolve(RCTAEPMessagingUtil.convertSurfacePropositions(
                propositionsMap, bundleId));
          }
        });
  }

  @ReactMethod
  public void refreshInAppMessages() {
    MobileCore.log(LoggingMode.VERBOSE, TAG, "refreshInAppMessages is called");
    Messaging.refreshInAppMessages();
  }

  @ReactMethod
  public void setMessagingDelegate() {
    MobileCore.log(LoggingMode.VERBOSE, TAG, "setMessagingDelegate is called");
    MobileCore.setMessagingDelegate(this);
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
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format("clear is called with message id: %s", messageId));
      messageCache.remove(messageId);
    }
  }

  @ReactMethod
  public void dismiss(final String messageId, final boolean suppressAutoTrack) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format(
              "dismiss is called with message id: %s and suppressAutoTrack: %b",
              messageId, suppressAutoTrack));
      messageCache.get(messageId).dismiss(suppressAutoTrack);
    }
  }

  @ReactMethod
  public void handleJavascriptMessage(final String messageId,
                                      final String messageName,
                                      final Promise promise) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format(
              "handleJavascriptMessage is called with message id: %s and messageName: %s",
              messageId, messageName));
      messageCache.get(messageId).handleJavascriptMessage(
          messageName, new AdobeCallback<String>() {
            @Override
            public void call(final String s) {
              if (s != null) {
                promise.resolve(s);
              } else {
                promise.reject("error", "error in handling javascriptMessage " +
                                            messageName);
              }
            }
          });
    }
  }

  @ReactMethod
  public void setAutoTrack(final String messageId, final boolean autoTrack) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format(
              "setAutoTrack is called with message id: %s and autoTrack: %b",
              messageId, autoTrack));
      messageCache.get(messageId).setAutoTrack(autoTrack);
    }
  }

  @ReactMethod
  public void show(final String messageId) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format("show is called with message id: %s", messageId));
      messageCache.get(messageId).show();
    }
  }

  @ReactMethod
  public void track(final String messageId, final String interaction,
                    final int eventType) {
    if (messageId != null && messageCache.get(messageId) != null) {
      MobileCore.log(
          LoggingMode.VERBOSE, TAG,
          String.format(
              "track is called with message id: %s, interaction: %s and eventType: %d",
              messageId, interaction, eventType));
      MessagingEdgeEventType edgeEventType =
          RCTAEPMessagingUtil.getEventType(eventType);
      if (edgeEventType != null) {
        messageCache.get(messageId).track(interaction, edgeEventType);
      } else {
        MobileCore.log(
            LoggingMode.DEBUG, TAG,
            String.format(
                "Unable to track interaction (%s) because edgeEventType (%d) is invalid ",
                interaction, eventType));
      }
    }
  }

  // Messaging Delegate functions
  @Override
  public void onShow(final FullscreenMessage fullscreenMessage) {
    MobileCore.log(LoggingMode.VERBOSE, TAG, "onShow is called");
    final Message message = (Message)fullscreenMessage.getParent();
    if (message != null) {
      Map<String, String> data =
          RCTAEPMessagingUtil.convertMessageToMap(message);
      emitEvent("onShow", data);
    }
  }

  @Override
  public void onDismiss(final FullscreenMessage fullscreenMessage) {
    MobileCore.log(LoggingMode.VERBOSE, TAG, "onDismiss is called");
    final Message message = (Message)fullscreenMessage.getParent();
    if (message != null) {
      Map<String, String> data =
          RCTAEPMessagingUtil.convertMessageToMap(message);
      emitEvent("onDismiss", data);
    }
  }

  @Override
  public boolean shouldShowMessage(final FullscreenMessage fullscreenMessage) {
    MobileCore.log(LoggingMode.VERBOSE, TAG, "shouldShowMessage is called");
    final Message message = (Message)fullscreenMessage.getParent();
    if (message != null) {
      Map<String, String> data =
          RCTAEPMessagingUtil.convertMessageToMap(message);
      emitEvent("shouldShowMessage", data);
      // Latch stops the thread until the shouldShowMessage value is received
      // from the JS side on thread dedicated to run JS code. The function
      // called from JS that resumes the thread is "shouldShowMessage".
      MobileCore.log(LoggingMode.VERBOSE, TAG,
                     "shouldShowMessage: Thread is locked.");
      try {
        latch.await();
      } catch (final InterruptedException e) {
        MobileCore.log(LoggingMode.ERROR, TAG,
                       String.format("CountDownLatch await Interrupted: (%s)",
                                     e.getLocalizedMessage()));
      }
      MobileCore.log(LoggingMode.VERBOSE, TAG,
                     "shouldShowMessage: Thread is resumed.");
    }

    if (shouldShowMessage) {
      this.latestMessage = message;
    }

    if (shouldSaveMessage) {
      messageCache.put(message.getId(), message);
    }

    return shouldShowMessage;
  }

  @Override
  public void urlLoaded(String url, FullscreenMessage fullscreenMessage) {
    MobileCore.log(
        LoggingMode.VERBOSE, TAG,
        String.format("overrideUrlLoad is called with url: (%s)", url));
    final Message message = (Message)fullscreenMessage.getParent();
    if (message != null) {
      Map data = new HashMap<>();
      data.put("message", RCTAEPMessagingUtil.convertMessageToMap(message));
      data.put("url", url);
      emitEvent("urlLoaded", data);
    }
  }

  // Messaging Delegate Callback
  @ReactMethod(isBlockingSynchronousMethod = true)
  public void setMessageSettings(final boolean shouldShowMessage,
                                 final boolean shouldSaveMessage) {
    MobileCore.log(
        LoggingMode.VERBOSE, TAG,
        String.format(
            "shouldShowMessage is called with message id: %b and shouldSaveMessage: %b",
            shouldShowMessage, shouldSaveMessage));
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
}
