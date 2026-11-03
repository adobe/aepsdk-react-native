/*
    Copyright 2026 Adobe. All rights reserved.
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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Business logic lives in {@link RCTAEPMessagingUtil},
 * shared with the legacy {@link RCTAEPMessagingModule}.
 */
public final class NativeAEPMessagingModule extends NativeAEPMessagingSpec {

  public static final String NAME = "NativeAEPMessaging";

  private final RCTAEPMessagingState state;
  private final RCTAEPMessagingPresentationDelegate presentationDelegate;

  public NativeAEPMessagingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.state = new RCTAEPMessagingState(reactContext);
    this.presentationDelegate = new RCTAEPMessagingPresentationDelegate(state);
  }

  @Override
  public String getName() {
    return NAME;
  }

  // Kept for NativeEventEmitter compatibility; Android events go through DeviceEventEmitter.
  @Override
  public void addListener(String eventName) {}

  @Override
  public void removeListeners(double count) {}

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPMessagingUtil.extensionVersion(promise);
  }

  @Override
  public void getCachedMessages(final Promise promise) {
    RCTAEPMessagingUtil.getCachedMessages(state, promise);
  }

  @Override
  public void getLatestMessage(final Promise promise) {
    RCTAEPMessagingUtil.getLatestMessage(state, promise);
  }

  @Override
  public void getPropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
    RCTAEPMessagingUtil.getPropositionsForSurfaces(state, surfaces, promise);
  }

  @Override
  public void refreshInAppMessages() {
    RCTAEPMessagingUtil.refreshInAppMessages();
  }

  @Override
  public void setMessagingDelegate() {
    RCTAEPMessagingUtil.setMessagingDelegate(presentationDelegate);
  }

  @Override
  public void updatePropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
    RCTAEPMessagingUtil.updatePropositionsForSurfaces(state, surfaces, promise);
  }

  @Override
  public void clear(final String messageId) {
    RCTAEPMessagingUtil.clear(state, messageId);
  }

  // suppressAutoTrack is accepted for parity with iOS and ignored on Android.
  @Override
  public void dismiss(final String messageId, final boolean suppressAutoTrack) {
    RCTAEPMessagingUtil.dismiss(state, messageId);
  }

  @Override
  public void setAutoTrack(final String messageId, final boolean autoTrack) {
    RCTAEPMessagingUtil.setAutoTrack(state, messageId, autoTrack);
  }

  @Override
  public void show(final String messageId) {
    RCTAEPMessagingUtil.show(state, messageId);
  }

  @Override
  public void track(final String messageId, final String interaction, final double eventType) {
    RCTAEPMessagingUtil.track(state, messageId, interaction, (int)eventType);
  }

  @Override
  public void handleJavascriptMessage(final String messageId, final String handlerName) {
    RCTAEPMessagingUtil.handleJavascriptMessage(state, messageId, handlerName);
  }

  @Override
  public void evaluateJavascript(final String messageId, final String javascriptString) {
    RCTAEPMessagingUtil.evaluateJavascript(state, messageId, javascriptString);
  }

  @Override
  public void setMessageSettings(final boolean shouldShowMessage,
                                 final boolean shouldSaveMessage) {
    RCTAEPMessagingUtil.setMessageSettings(state, shouldShowMessage, shouldSaveMessage);
  }

  @Override
  public void trackContentCardDisplay(ReadableMap propositionMap, ReadableMap contentCardMap) {
    RCTAEPMessagingUtil.trackContentCardDisplay(propositionMap, contentCardMap);
  }

  @Override
  public void trackContentCardInteraction(ReadableMap propositionMap,
                                          ReadableMap contentCardMap) {
    RCTAEPMessagingUtil.trackContentCardInteraction(propositionMap, contentCardMap);
  }

  @Override
  public void trackPropositionItem(String itemId, @Nullable String interaction,
                                   double eventType, @Nullable ReadableArray tokens,
                                   final Promise promise) {
    RCTAEPMessagingUtil.trackPropositionItem(state, itemId, interaction, (int)eventType,
                                             tokens, promise);
  }

  @Override
  public void getInboxState(String activityId, final Promise promise) {
    RCTAEPMessagingUtil.getInboxState(state.reactContext, activityId, promise);
  }

  @Override
  public void setInboxState(String activityId, String stateJson, final Promise promise) {
    RCTAEPMessagingUtil.setInboxState(state.reactContext, activityId, stateJson, promise);
  }
}
