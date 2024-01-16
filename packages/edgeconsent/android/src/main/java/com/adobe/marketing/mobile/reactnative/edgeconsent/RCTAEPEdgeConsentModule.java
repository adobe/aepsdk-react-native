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

import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.edge.consent.Consent;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

public class RCTAEPEdgeConsentModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public RCTAEPEdgeConsentModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPEdgeConsent";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(Consent.extensionVersion());
  }

  @ReactMethod
  public void update(final ReadableMap consents) {
    Consent.update(RCTAEPEdgeConsentUtils.toMap(consents));
  }

  @ReactMethod
  public void getConsents(final Promise promise) {
    Consent.getConsents(new AdobeCallbackWithError<Map<String, Object>>() {
      @Override
      public void call(final Map<String, Object> consents) {
        // null is unexpected, handle as empty to resolve the promise
        WritableMap consentsAsWritableMap = RCTAEPEdgeConsentUtils.toWritableMap(consents);
        promise.resolve(consentsAsWritableMap != null ? consentsAsWritableMap : Arguments.createMap());
      }

      @Override
      public void fail(final AdobeError adobeError) {
        final String errorName = adobeError != null ? adobeError.getErrorName() : AdobeError.UNEXPECTED_ERROR.getErrorName();
        promise.reject(getName(), String.format("getConsents - Failed to retrieve consents (%s)", errorName), new Error(errorName));
      }
    });
  }
}
