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

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/** Legacy-bridge module; all logic lives in {@link RCTAEPEdgeUtil}. */
public class RCTAEPEdgeModule extends ReactContextBaseJavaModule {
  private static final String NAME = "NativeAEPEdge";

  public RCTAEPEdgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPEdgeUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void sendEvent(final ReadableMap experienceEventMap, final Promise promise) {
    RCTAEPEdgeUtil.sendEvent(experienceEventMap, promise, NAME);
  }

  @ReactMethod
  public void setLocationHint(final String hint) {
    RCTAEPEdgeUtil.setLocationHint(hint);
  }

  @ReactMethod
  public void getLocationHint(final Promise promise) {
    RCTAEPEdgeUtil.getLocationHint(promise, NAME);
  }
}
