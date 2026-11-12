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

package com.adobe.marketing.mobile.reactnative.campaignclassic;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Business logic lives in {@link RCTAEPCampaignClassicUtil},
 * shared with the legacy {@link RCTAEPCampaignClassicModule}.
 */
public final class NativeAEPCampaignClassicModule extends NativeAEPCampaignClassicSpec {

  public static final String NAME = "NativeAEPCampaignClassic";

  public NativeAEPCampaignClassicModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPCampaignClassicUtil.extensionVersion(promise);
  }

  @Override
  public void registerDeviceWithToken(final String token,
                                      final String userKey,
                                      final ReadableMap additionalParameters) {
    RCTAEPCampaignClassicUtil.registerDeviceWithToken(token, userKey,
                                                      additionalParameters);
  }

  @Override
  public void handleRemoteMessage(final ReadableMap data, final Promise promise) {
    RCTAEPCampaignClassicUtil.handleRemoteMessage(
        getReactApplicationContext().getApplicationContext(), data, promise);
  }

  @Override
  public void trackNotificationClickWithUserInfo(final ReadableMap userInfo) {
    RCTAEPCampaignClassicUtil.trackNotificationClickWithUserInfo(userInfo);
  }

  @Override
  public void trackNotificationReceiveWithUserInfo(final ReadableMap userInfo) {
    RCTAEPCampaignClassicUtil.trackNotificationReceiveWithUserInfo(userInfo);
  }
}
