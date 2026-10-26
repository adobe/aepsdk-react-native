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

import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.CampaignClassic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Behavior mirrors RCTAEPCampaignClassicModule (the legacy bridge module).
 */
public final class NativeAEPCampaignClassicModule extends NativeAEPCampaignClassicSpec {

  public NativeAEPCampaignClassicModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NativeAEPCampaignClassic";
  }

  @Override
  public void extensionVersion(final Promise promise) {
    promise.resolve(CampaignClassic.extensionVersion());
  }

  @Override
  public void registerDeviceWithToken(final String deviceToken,
                                      @Nullable final String userKey,
                                      @Nullable final ReadableMap additionalParameters) {
    final Map<String, Object> additionalParamsMap =
        additionalParameters != null
            ? RCTAEPCampaignClassicUtil.convertReadableMapToMap(additionalParameters)
            : null;
    CampaignClassic.registerDevice(deviceToken, userKey, additionalParamsMap);
  }

  @Override
  public void trackNotificationReceiveWithUserInfo(final ReadableMap userInfo) {
    CampaignClassic.trackNotificationReceive(
        RCTAEPCampaignClassicUtil.convertTrackInfoToMap(userInfo));
  }

  @Override
  public void trackNotificationClickWithUserInfo(final ReadableMap userInfo) {
    CampaignClassic.trackNotificationClick(
        RCTAEPCampaignClassicUtil.convertTrackInfoToMap(userInfo));
  }
}
