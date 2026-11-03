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
import com.facebook.react.bridge.ReadableMap;

/** TurboModule; all logic lives in {@link RCTAEPEdgeConsentUtil}. */
public final class NativeAEPEdgeConsentModule extends NativeAEPEdgeConsentSpec {
  private static final String NAME = "NativeAEPEdgeConsent";

  public NativeAEPEdgeConsentModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPEdgeConsentUtil.extensionVersion(promise);
  }

  @Override
  public void update(final ReadableMap consents) {
    RCTAEPEdgeConsentUtil.update(consents);
  }

  @Override
  public void getConsents(final Promise promise) {
    RCTAEPEdgeConsentUtil.getConsents(promise, NAME);
  }
}
