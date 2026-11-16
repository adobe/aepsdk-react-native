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
package com.adobe.marketing.mobile.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/**
 * Legacy bridge module (old architecture / interop). Business logic lives in {@link RCTAEPIdentityUtil},
 * shared with {@link NativeAEPIdentityModule}.
 */
public class RCTAEPIdentityModule extends ReactContextBaseJavaModule {

    private final static String NAME = "NativeAEPIdentity";

    public RCTAEPIdentityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // Required for RN modules
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        RCTAEPIdentityUtil.extensionVersion(promise);
    }

    @ReactMethod
    public void syncIdentifiers(final ReadableMap identifiers) {
        RCTAEPIdentityUtil.syncIdentifiers(identifiers);
    }

    @ReactMethod
    public void syncIdentifiersWithAuthState(final ReadableMap identifiers, final String authenticationState) {
        RCTAEPIdentityUtil.syncIdentifiersWithAuthState(identifiers, authenticationState);
    }

    @ReactMethod
    public void syncIdentifier(final String identifierType, final String identifier, final String authenticationState) {
        RCTAEPIdentityUtil.syncIdentifier(identifierType, identifier, authenticationState);
    }

    @ReactMethod
    public void appendVisitorInfoForURL(final String baseURL, final Promise promise) {
        RCTAEPIdentityUtil.appendVisitorInfoForURL(baseURL, promise, NAME);
    }

    @ReactMethod
    public void getUrlVariables(final Promise promise) {
        RCTAEPIdentityUtil.getUrlVariables(promise, NAME);
    }

    @ReactMethod
    public void getIdentifiers(final Promise promise) {
        RCTAEPIdentityUtil.getIdentifiers(promise, NAME);
    }

    @ReactMethod
    public void getExperienceCloudId(final Promise promise) {
        RCTAEPIdentityUtil.getExperienceCloudId(promise, NAME);
    }
}
