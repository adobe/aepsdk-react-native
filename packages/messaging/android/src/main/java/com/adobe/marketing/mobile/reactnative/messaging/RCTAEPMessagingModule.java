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

import androidx.annotation.Nullable;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

/**
 * Legacy bridge module (old architecture / USE_INTEROP_ROOT=true). All logic lives in
 * {@link RCTAEPMessagingUtil}, shared with the Turbo module.
 */
public final class RCTAEPMessagingModule extends ReactContextBaseJavaModule {

  public static final String NAME = "NativeAEPMessaging";

  private final RCTAEPMessagingState state;
  private final RCTAEPMessagingPresentationDelegate presentationDelegate;

  public RCTAEPMessagingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.state = new RCTAEPMessagingState(reactContext);
    this.presentationDelegate = new RCTAEPMessagingPresentationDelegate(state);
  }

  @Override
  public String getName() {
    return NAME;
  }

  // Required for rn built in EventEmitter Calls.
  @ReactMethod
  public void addListener(String eventName) {}

  @ReactMethod
  public void removeListeners(Integer count) {}

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPMessagingUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void getCachedMessages(final Promise promise) {
    RCTAEPMessagingUtil.getCachedMessages(state, promise);
  }

  @ReactMethod
  public void getLatestMessage(final Promise promise) {
    RCTAEPMessagingUtil.getLatestMessage(state, promise);
  }

  @ReactMethod
  public void getPropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
    RCTAEPMessagingUtil.getPropositionsForSurfaces(state, surfaces, promise);
  }

  @ReactMethod
  public void refreshInAppMessages() {
    RCTAEPMessagingUtil.refreshInAppMessages();
  }

  @ReactMethod
  public void setMessagingDelegate() {
    RCTAEPMessagingUtil.setMessagingDelegate(presentationDelegate);
  }

  @ReactMethod
  public void updatePropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
    RCTAEPMessagingUtil.updatePropositionsForSurfaces(state, surfaces, promise);
  }

  // Message Methods

  @ReactMethod
  public void clear(final String messageId) {
    RCTAEPMessagingUtil.clear(state, messageId);
  }

  // suppressAutoTrack is accepted for parity with iOS and ignored on Android.
  @ReactMethod
  public void dismiss(final String messageId, final boolean suppressAutoTrack) {
    RCTAEPMessagingUtil.dismiss(state, messageId);
  }

  @ReactMethod
  public void setAutoTrack(final String messageId, final boolean autoTrack) {
    RCTAEPMessagingUtil.setAutoTrack(state, messageId, autoTrack);
  }

  @ReactMethod
  public void show(final String messageId) {
    RCTAEPMessagingUtil.show(state, messageId);
  }

  @ReactMethod
  public void track(final String messageId, final String interaction, final int eventType) {
    RCTAEPMessagingUtil.track(state, messageId, interaction, eventType);
  }

  @ReactMethod
  public void handleJavascriptMessage(final String messageId, final String handlerName) {
    RCTAEPMessagingUtil.handleJavascriptMessage(state, messageId, handlerName);
  }

  @ReactMethod
  public void evaluateJavascript(final String messageId, final String javascriptString) {
    RCTAEPMessagingUtil.evaluateJavascript(state, messageId, javascriptString);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean setMessageSettings(final boolean shouldShowMessage,
                                    final boolean shouldSaveMessage) {
    RCTAEPMessagingUtil.setMessageSettings(state, shouldShowMessage, shouldSaveMessage);
    return true;
  }

  @ReactMethod
  public void trackContentCardDisplay(ReadableMap propositionMap, ReadableMap contentCardMap) {
    RCTAEPMessagingUtil.trackContentCardDisplay(propositionMap, contentCardMap);
  }

  @ReactMethod
  public void trackContentCardInteraction(ReadableMap propositionMap,
                                          ReadableMap contentCardMap) {
    RCTAEPMessagingUtil.trackContentCardInteraction(propositionMap, contentCardMap);
  }

  @ReactMethod
  public void trackPropositionItem(String uuid, @Nullable String interaction, int eventType,
                                   @Nullable ReadableArray tokens, final Promise promise) {
    RCTAEPMessagingUtil.trackPropositionItem(state, uuid, interaction, eventType, tokens,
                                             promise);
  }

  @ReactMethod
  public void getInboxState(String activityId, final Promise promise) {
    RCTAEPMessagingUtil.getInboxState(state.reactContext, activityId, promise);
  }

  @ReactMethod
  public void setInboxState(String activityId, String stateJson, final Promise promise) {
    RCTAEPMessagingUtil.setInboxState(state.reactContext, activityId, stateJson, promise);
  }
}
