/*
 Copyright 2021 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */
package com.adobe.marketing.mobile.reactnative.userprofile;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.EdgeIdentity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

public class RCTAEPEdgeIdentityModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RCTAEPEdgeIdentityModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPEdgeIdentity";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(EdgeEdgeIdentity.extensionVersion());
  }

  // @ReactMethod
  // public void updateUserAttributes(ReadableMap attributeMap) {
  //   UserProfile.updateUserAttributes(RCTAEPUserProfileMapUtil.toMap(attributeMap));
  // }

  // @ReactMethod
  // public void getUserAttributes(final ReadableArray attributeNames, final Promise promise) {
  //   UserProfile.getUserAttributes(RCTAEPUserProfileArrayUtil.toStringList(attributeNames), new AdobeCallback<Map<String, Object>>() {
  //     @Override
  //     public void call(Map<String, Object> stringObjectMap) {
  //       promise.resolve(stringObjectMap);
  //     }
  //   });
  // }

  // @ReactMethod
  // public void removeUserAttributes(final ReadableArray attributeNames) {
  //   UserProfile.removeUserAttributes(RCTAEPUserProfileArrayUtil.toStringList(attributeNames));
  }

}
