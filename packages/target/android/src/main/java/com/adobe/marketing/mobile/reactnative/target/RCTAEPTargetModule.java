/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
package com.adobe.marketing.mobile.reactnative.target;

import com.adobe.marketing.mobile.target.TargetRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;

/**
 * Legacy bridge module (old architecture / interop). Business logic lives in {@link RCTAEPTargetUtil},
 * shared with {@link NativeAEPTargetModule}.
 */
public class RCTAEPTargetModule extends ReactContextBaseJavaModule {

  private static final String NAME = "NativeAEPTarget";

  private final HashMap<String, TargetRequest> registeredTargetRequests = new HashMap<>();

  public RCTAEPTargetModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPTargetUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void clearPrefetchCache() {
    RCTAEPTargetUtil.clearPrefetchCache();
  }

  @ReactMethod
  public void getSessionId(final Promise promise) {
    RCTAEPTargetUtil.getSessionId(promise);
  }

  @ReactMethod
  public void getThirdPartyId(final Promise promise) {
    RCTAEPTargetUtil.getThirdPartyId(promise);
  }

  @ReactMethod
  public void getTntId(final Promise promise) {
    RCTAEPTargetUtil.getTntId(promise);
  }

  @ReactMethod
  public void setSessionId(final String sessionId) {
    RCTAEPTargetUtil.setSessionId(sessionId);
  }

  @ReactMethod
  public void setTntId(final String tntId) {
    RCTAEPTargetUtil.setTntId(tntId);
  }

  @ReactMethod
  public void setThirdPartyId(final String thirdPartyId) {
    RCTAEPTargetUtil.setThirdPartyId(thirdPartyId);
  }

  @ReactMethod
  public void resetExperience() {
    RCTAEPTargetUtil.resetExperience();
  }

  @ReactMethod
  public void setPreviewRestartDeeplink(final String deepLinkString) {
    RCTAEPTargetUtil.setPreviewRestartDeeplink(deepLinkString, NAME);
  }

  @ReactMethod
  public void retrieveLocationContent(ReadableArray targetRequestList, ReadableMap parameters) {
    RCTAEPTargetUtil.retrieveLocationContent(targetRequestList, parameters, registeredTargetRequests);
  }

  @ReactMethod
  public void displayedLocations(ReadableArray mboxNames, ReadableMap parameters) {
    RCTAEPTargetUtil.displayedLocations(mboxNames, parameters);
  }

  @ReactMethod
  public void clickedLocation(String mboxName, ReadableMap parameters) {
    RCTAEPTargetUtil.clickedLocation(mboxName, parameters);
  }

  @ReactMethod
  public void prefetchContent(ReadableArray mboxPrefetchList, ReadableMap parameters, final Promise promise) {
    RCTAEPTargetUtil.prefetchContent(mboxPrefetchList, parameters, promise);
  }

  @ReactMethod
  public void prefetchContentWithTimeout(ReadableArray mboxPrefetchList, ReadableMap parameters, double timeout, final Promise promise) {
    RCTAEPTargetUtil.prefetchContentWithTimeout(mboxPrefetchList, parameters, timeout, promise, NAME);
  }

  @ReactMethod
  public void registerTargetRequests(ReadableMap requestMap, Callback successCallback) {
    RCTAEPTargetUtil.registerTargetRequests(requestMap, successCallback, registeredTargetRequests);
  }

}
