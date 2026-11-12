/*
 Copyright 2022 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or
 agreed to in writing, software distributed under the License is distributed on
 an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, either
 express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
package com.adobe.marketing.mobile.reactnative.campaignclassic;

import com.adobe.marketing.mobile.CampaignClassic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/**
 * Legacy bridge module (old architecture / USE_INTEROP_ROOT=true). All logic
 * lives in {@link RCTAEPCampaignClassicUtil}, shared with the Turbo module.
 */
public class RCTAEPCampaignClassicModule extends ReactContextBaseJavaModule {

  public static final String NAME = "NativeAEPCampaignClassic";

  public RCTAEPCampaignClassicModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPCampaignClassicUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void registerDeviceWithToken(final String deviceToken,
                                      final String userKey,
                                      final ReadableMap additionalParams) {
    RCTAEPCampaignClassicUtil.registerDeviceWithToken(deviceToken, userKey,
                                                      additionalParams);
  }

  @ReactMethod
  public void handleRemoteMessage(final ReadableMap data, final Promise promise) {
    RCTAEPCampaignClassicUtil.handleRemoteMessage(
        getReactApplicationContext().getApplicationContext(), data, promise);
  }

  @ReactMethod
  public void trackNotificationReceiveWithUserInfo(final ReadableMap trackInfo) {
    RCTAEPCampaignClassicUtil.trackNotificationReceiveWithUserInfo(trackInfo);
  }

  @ReactMethod
  public void trackNotificationClickWithUserInfo(final ReadableMap trackInfo) {
    RCTAEPCampaignClassicUtil.trackNotificationClickWithUserInfo(trackInfo);
  }
}