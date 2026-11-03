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
package com.adobe.marketing.mobile.reactnative.edgeconsent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/** Legacy-bridge module; all logic lives in {@link RCTAEPEdgeConsentUtil}. */
public class RCTAEPEdgeConsentModule extends ReactContextBaseJavaModule {
  private static final String NAME = "NativeAEPEdgeConsent";

  public RCTAEPEdgeConsentModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    RCTAEPEdgeConsentUtil.extensionVersion(promise);
  }

  @ReactMethod
  public void update(final ReadableMap consents) {
    RCTAEPEdgeConsentUtil.update(consents);
  }

  @ReactMethod
  public void getConsents(final Promise promise) {
    RCTAEPEdgeConsentUtil.getConsents(promise, NAME);
  }
}
