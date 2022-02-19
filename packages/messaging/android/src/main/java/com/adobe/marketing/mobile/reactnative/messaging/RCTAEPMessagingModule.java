/*
 Copyright 2021 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */
package com.adobe.marketing.mobile.reactnative.messaging;

import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.Messaging;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.services.ServiceProvider;
import com.adobe.marketing.mobile.services.ui.FullscreenMessage;
import com.adobe.marketing.mobile.services.ui.FullscreenMessageDelegate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

public final class RCTAEPMessagingModule extends ReactContextBaseJavaModule implements FullscreenMessageDelegate {

    private static final String TAG = "RCTAEPMessagingModule";
    private final Map<String, Message> messageCache;
    private final ReactApplicationContext reactContext;
    private boolean shouldSaveMessage;
    private boolean shouldShowMessage;
    private CountDownLatch latch = new CountDownLatch(1);

    public RCTAEPMessagingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.messageCache = new HashMap<>();
        this.shouldShowMessage = false;
        this.shouldSaveMessage = false;
    }

    @Override
    public String getName() {
        return "AEPMessaging";
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "extensionVersion is called");
        promise.resolve(Messaging.extensionVersion());
    }

    @ReactMethod
    public void refreshInAppMessages() {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "refreshInAppMessages is called");
        Messaging.refreshInAppMessages();
    }

    @ReactMethod
    public void setMessagingDelegate() {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "setMessagingDelegate is called");
        ServiceProvider.getInstance().setMessageDelegate(this);
    }

    @ReactMethod
    public void show(final String messageId) {
        if (messageId != null && messageCache.get(messageId) != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("show is called with message id: %s", messageId));
            messageCache.get(messageId).show();
        }
    }

    @ReactMethod
    public void dismiss(final String messageId, final boolean suppressAutoTrack) {
        if (messageId != null && messageCache.get(messageId) != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("dismiss is called with message id: %s and suppressAutoTrack: %b", messageId, suppressAutoTrack));
            messageCache.get(messageId).show();
        }
    }

    @ReactMethod
    public void track(final String messageId, final String interaction, final int eventType) {
        if (messageId != null && messageCache.get(messageId) != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("track is called with message id: %s, interaction: %s and eventType: %d", messageId, interaction, eventType));
            //TODO: Complete the track call.
//      messageCache.get(messageId).track();
        }
    }

    @ReactMethod
    public void handleJavascriptMessage(final String messageId, final String messageName, Promise promise) {
        if (messageId != null && messageCache.get(messageId) != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("handleJavascriptMessage is called with message id: %s and messageName: %s", messageId, messageName));
            //TODO call function handleJavascriptMessage
//      messageCache.get(messageId).handleJavascriptMessage();
//      promise.resolve(); || promise.reject();
        }
    }

    @ReactMethod
    public void clear(final String messageId) {
        if (messageId != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("clear is called with message id: %s", messageId));
            messageCache.remove(messageId);
        }
    }

    @ReactMethod
    public void setAutoTrack(final String messageId, final boolean autoTrack) {
        if (messageId != null && messageCache.get(messageId) != null) {
            MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("setAutoTrack is called with message id: %s and autoTrack: %b", messageId, autoTrack));
            messageCache.get(messageId).autoTrack = autoTrack;
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void shouldShowMessage(final boolean shouldShowMessage, final boolean shouldSaveMessage) {
        MobileCore.log(LoggingMode.VERBOSE, TAG, String.format("shouldShowMessage is called with message id: %b and shouldSaveMessage: %b", shouldShowMessage, shouldSaveMessage));
        this.shouldShowMessage = shouldShowMessage;
        this.shouldSaveMessage = shouldSaveMessage;
    }

    //Messaging Delegate functions
    @Override
    public void onShow(final FullscreenMessage fullscreenMessage) {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "onShow is called");
        final Message message = (Message) fullscreenMessage.getParent();
        if (message != null) {
            Map<String, String> data = new HashMap<>();
            data.put("id", message.messageId);
            data.put("autoTrack", message.autoTrack ? "true" : "false");
            emitEvent("onShow", data);
        }
    }

    @Override
    public void onDismiss(FullscreenMessage fullscreenMessage) {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "onDismiss is called");
        final Message message = (Message) fullscreenMessage.getParent();
        if (message != null) {
            Map<String, String> data = new HashMap<>();
            data.put("id", message.messageId);
            data.put("autoTrack", message.autoTrack ? "true" : "false");
            emitEvent("onDismiss", data);
        }
    }

    @Override
    public boolean shouldShowMessage(FullscreenMessage fullscreenMessage) {
        MobileCore.log(LoggingMode.VERBOSE, TAG, "shouldShowMessage is called");
        final Message message = (Message) fullscreenMessage.getParent();
        if (message != null) {
            Map<String, String> data = new HashMap<>();
            data.put("id", message.messageId);
            data.put("autoTrack", message.autoTrack ? "true" : "false");
            emitEvent("shouldShowMessage", data);
            //Latch stops the thread until the shouldShowMessage value is received from the JS side on thread dedicated to run JS code. The function called from JS that resumes the thread is "shouldShowMessage".
            MobileCore.log(LoggingMode.VERBOSE, TAG, "shouldShowMessage: Thread is locked.");
            try {
                latch.await();
            } catch (InterruptedException e) {
                MobileCore.log(LoggingMode.ERROR, TAG, String.format("CountDownLatch await Interrupted: (%s)", e.getLocalizedMessage()));
            }
            MobileCore.log(LoggingMode.VERBOSE, TAG, "shouldShowMessage: Thread is resumed.");
            if (shouldSaveMessage) {
                messageCache.put(message.messageId, message);
            }
        }
        return shouldShowMessage;
    }

    @Override
    public boolean overrideUrlLoad(FullscreenMessage fullscreenMessage, String s) {
        return false;
    }

    @Override
    public void onShowFailure() {
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
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(name, eventData);
    }
}
