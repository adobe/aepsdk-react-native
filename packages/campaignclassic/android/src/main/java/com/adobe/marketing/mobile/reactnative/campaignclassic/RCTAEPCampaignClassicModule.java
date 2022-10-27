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

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.CampaignClassic;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class RCTAEPCampaignClassicModule extends ReactContextBaseJavaModule {

  private static final String TAG = "RCTAEPCampaignClassicModule";
  private final ReactApplicationContext reactContext;

  public RCTAEPCampaignClassicModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPCampaignClassic";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(CampaignClassic.extensionVersion());
  }

  @ReactMethod
  public void registerDeviceWithToken(final String deviceToken,
                                      final String userKey,
                                      ReadableMap additionalParams) {
    final Map<String, Object> additionalParamsMap =
        additionalParams != null
            ? RCTAEPCampaignClassicUtil.convertReadableMapToMap(
                  additionalParams)
            : null;
    CampaignClassic.registerDevice(deviceToken, userKey, additionalParamsMap,
                                   null);
  }

  @ReactMethod
  public void trackNotificationReceiveWithUserInfo(ReadableMap trackInfo) {
    final Map<String, String> trackInfoMap =
        RCTAEPCampaignClassicUtil.convertTrackInfoToMap(trackInfo);
    CampaignClassic.trackNotificationReceive(trackInfoMap);
  }

  @ReactMethod
  public void trackNotificationClickWithUserInfo(ReadableMap trackInfo) {
    final Map<String, String> trackInfoMap =
        RCTAEPCampaignClassicUtil.convertTrackInfoToMap(trackInfo);
    CampaignClassic.trackNotificationReceive(trackInfoMap);
  }
}