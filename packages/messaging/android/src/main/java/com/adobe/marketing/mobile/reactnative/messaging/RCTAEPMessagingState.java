/*
 Copyright 2026 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */

package com.adobe.marketing.mobile.reactnative.messaging;

import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.messaging.Proposition;
import com.adobe.marketing.mobile.services.ui.Presentable;
import com.facebook.react.bridge.ReactApplicationContext;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;

/**
 * Per-module-instance state shared by {@link RCTAEPMessagingUtil} and {@link
 * RCTAEPMessagingPresentationDelegate}. The legacy and Turbo modules each own one instance.
 */
final class RCTAEPMessagingState {

  final ReactApplicationContext reactContext;

  // We cache uuid -> Proposition (not PropositionItem) for iOS parity: storing items on iOS lost
  // weak parent references. Propositions currently contain a single item, so using the first item
  // for tracking is valid.
  final Map<String, Proposition> propositionItemByUuid = new ConcurrentHashMap<>();
  final Map<String, Message> messageCache = new HashMap<>();
  final Map<String, Presentable<?>> presentableCache = new HashMap<>();
  final CountDownLatch latch = new CountDownLatch(1);

  volatile boolean shouldSaveMessage = false;
  volatile boolean shouldShowMessage = false;
  volatile Message latestMessage = null;

  RCTAEPMessagingState(final ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }
}
