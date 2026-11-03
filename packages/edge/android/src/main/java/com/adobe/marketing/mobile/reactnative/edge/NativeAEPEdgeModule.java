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
package com.adobe.marketing.mobile.reactnative.edge;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/** TurboModule; all logic lives in {@link RCTAEPEdgeUtil}. */
public final class NativeAEPEdgeModule extends NativeAEPEdgeSpec {
  private static final String NAME = "NativeAEPEdge";

  public NativeAEPEdgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPEdgeUtil.extensionVersion(promise);
  }

  @Override
  public void sendEvent(final ReadableMap experienceEventMap, final Promise promise) {
    RCTAEPEdgeUtil.sendEvent(experienceEventMap, promise, NAME);
  }

  @Override
  public void setLocationHint(@Nullable final String hint) {
    RCTAEPEdgeUtil.setLocationHint(hint);
  }

  @Override
  public void getLocationHint(final Promise promise) {
    RCTAEPEdgeUtil.getLocationHint(promise, NAME);
  }
}
