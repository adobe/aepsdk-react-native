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
package com.adobe.marketing.mobile.reactnative.edgeidentity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/** TurboModule; all logic lives in {@link RCTAEPEdgeIdentityUtil}. */
public final class NativeAEPEdgeIdentityModule extends NativeAEPEdgeIdentitySpec {
  private static final String NAME = "NativeAEPEdgeIdentity";

  public NativeAEPEdgeIdentityModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void extensionVersion(final Promise promise) {
    RCTAEPEdgeIdentityUtil.extensionVersion(promise);
  }

  @Override
  public void getExperienceCloudId(final Promise promise) {
    RCTAEPEdgeIdentityUtil.getExperienceCloudId(promise, NAME);
  }

  @Override
  public void getIdentities(final Promise promise) {
    RCTAEPEdgeIdentityUtil.getIdentities(promise, NAME);
  }

  @Override
  public void getUrlVariables(final Promise promise) {
    RCTAEPEdgeIdentityUtil.getUrlVariables(promise, NAME);
  }

  @Override
  public void updateIdentities(final ReadableMap identitymap) {
    RCTAEPEdgeIdentityUtil.updateIdentities(identitymap);
  }

  @Override
  public void removeIdentity(final ReadableMap item, String namespace) {
    RCTAEPEdgeIdentityUtil.removeIdentity(item, namespace);
  }
}
