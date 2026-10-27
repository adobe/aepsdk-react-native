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
package com.adobe.marketing.mobile.reactnative.target;

import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.target.TargetRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Business logic lives in {@link RCTAEPTargetUtil},
 * shared with the legacy {@link RCTAEPTargetModule}.
 */
public final class NativeAEPTargetModule extends NativeAEPTargetSpec {

  public static final String NAME = "NativeAEPTarget";

  private final HashMap<String, TargetRequest> registeredTargetRequests = new HashMap<>();

  public NativeAEPTargetModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPTargetUtil.extensionVersion(promise);
  }

  @Override
  public void clearPrefetchCache() {
    RCTAEPTargetUtil.clearPrefetchCache();
  }

  @Override
  public void getSessionId(final Promise promise) {
    RCTAEPTargetUtil.getSessionId(promise);
  }

  @Override
  public void getThirdPartyId(final Promise promise) {
    RCTAEPTargetUtil.getThirdPartyId(promise);
  }

  @Override
  public void getTntId(final Promise promise) {
    RCTAEPTargetUtil.getTntId(promise);
  }

  @Override
  public void setSessionId(final String sessionId) {
    RCTAEPTargetUtil.setSessionId(sessionId);
  }

  @Override
  public void setTntId(final String tntId) {
    RCTAEPTargetUtil.setTntId(tntId);
  }

  @Override
  public void setThirdPartyId(final String thirdPartyId) {
    RCTAEPTargetUtil.setThirdPartyId(thirdPartyId);
  }

  @Override
  public void resetExperience() {
    RCTAEPTargetUtil.resetExperience();
  }

  @Override
  public void setPreviewRestartDeeplink(final String deepLinkString) {
    RCTAEPTargetUtil.setPreviewRestartDeeplink(deepLinkString, NAME);
  }

  @Override
  public void retrieveLocationContent(ReadableArray targetRequestList, @Nullable ReadableMap parameters) {
    RCTAEPTargetUtil.retrieveLocationContent(targetRequestList, parameters, registeredTargetRequests);
  }

  @Override
  public void displayedLocations(ReadableArray mboxNames, @Nullable ReadableMap parameters) {
    RCTAEPTargetUtil.displayedLocations(mboxNames, parameters);
  }

  @Override
  public void clickedLocation(String mboxName, @Nullable ReadableMap parameters) {
    RCTAEPTargetUtil.clickedLocation(mboxName, parameters);
  }

  @Override
  public void prefetchContent(ReadableArray mboxPrefetchList, @Nullable ReadableMap parameters, final Promise promise) {
    RCTAEPTargetUtil.prefetchContent(mboxPrefetchList, parameters, promise);
  }

  @Override
  public void prefetchContentWithTimeout(ReadableArray mboxPrefetchList, @Nullable ReadableMap parameters, double timeout, final Promise promise) {
    RCTAEPTargetUtil.prefetchContentWithTimeout(mboxPrefetchList, parameters, timeout, promise, NAME);
  }

  @Override
  public void registerTargetRequests(ReadableMap requestMap, Callback successCallback) {
    RCTAEPTargetUtil.registerTargetRequests(requestMap, successCallback, registeredTargetRequests);
  }
}
