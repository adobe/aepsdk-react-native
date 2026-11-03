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

import static com.adobe.marketing.mobile.reactnative.messaging.RCTAEPMessagingUtil.convertMessageToMap;

import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.messaging.MessagingUtils;
import com.adobe.marketing.mobile.services.ui.InAppMessage;
import com.adobe.marketing.mobile.services.ui.Presentable;
import com.adobe.marketing.mobile.services.ui.PresentationDelegate;
import java.util.Map;

/**
 * Presentation delegate registered with the UI service. It is shared by the legacy and Turbo
 * modules: each module creates one instance bound to its own {@link RCTAEPMessagingState}.
 */
final class RCTAEPMessagingPresentationDelegate implements PresentationDelegate {

  private final RCTAEPMessagingState state;

  RCTAEPMessagingPresentationDelegate(final RCTAEPMessagingState state) {
    this.state = state;
  }

  @Override
  public void onShow(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage))
      return;
    Message message = MessagingUtils.getMessageForPresentable(
        (Presentable<InAppMessage>)presentable);
    state.presentableCache.put(message.getId(), presentable);

    if (message != null) {
      Map<String, String> data = convertMessageToMap(message);
      RCTAEPMessagingUtil.emitEvent(state.reactContext, "onShow", data);
    }
  }

  @Override
  public void onDismiss(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage))
      return;
    Message message = MessagingUtils.getMessageForPresentable(
        (Presentable<InAppMessage>)presentable);
    state.presentableCache.remove(message.getId());

    if (message != null) {
      Map<String, String> data = convertMessageToMap(message);
      RCTAEPMessagingUtil.emitEvent(state.reactContext, "onDismiss", data);
    }
  }

  @Override
  public void onHide(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage))
      return;
    Message message = MessagingUtils.getMessageForPresentable(
        (Presentable<InAppMessage>)presentable);
    if (message != null) {
      Map<String, String> data = convertMessageToMap(message);
      RCTAEPMessagingUtil.emitEvent(state.reactContext, "onHide", data);
    }
  }

  @Override
  public boolean canShow(final Presentable<?> presentable) {
    if (!(presentable.getPresentation() instanceof InAppMessage))
      return false;
    Message message = MessagingUtils.getMessageForPresentable(
        (Presentable<InAppMessage>)presentable);
    if (message != null) {
      Map<String, String> data = convertMessageToMap(message);
      RCTAEPMessagingUtil.emitEvent(state.reactContext, "shouldShowMessage", data);
      // Latch stops the thread until the shouldShowMessage value is received
      // from the JS side on thread dedicated to run JS code. The function
      // called from JS that resumes the thread is "setMessageSettings".
      try {
        state.latch.await();
      } catch (final InterruptedException e) {
      }
    }

    if (state.shouldShowMessage) {
      state.latestMessage = message;
    }

    if (state.shouldSaveMessage) {
      state.messageCache.put(message.getId(), message);
    }
    return state.shouldShowMessage;
  }

  public void onContentLoaded(final Presentable<?> presentable,
                              PresentationContent presentationContent) {
    if (!(presentable.getPresentation() instanceof InAppMessage))
      return;
    Message message = MessagingUtils.getMessageForPresentable(
        (Presentable<InAppMessage>)presentable);
    if (message != null) {
      Map<String, String> data = convertMessageToMap(message);
      RCTAEPMessagingUtil.emitEvent(state.reactContext, "onContentLoaded", data);
    }
  }
}
