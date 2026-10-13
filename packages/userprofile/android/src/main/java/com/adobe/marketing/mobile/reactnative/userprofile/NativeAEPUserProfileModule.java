/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPUserProfileSpec); delegates shared logic to RCTAEPUserProfileUtil.
 */

package com.adobe.marketing.mobile.reactnative.userprofile;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.UserProfile;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base;
 * used when USE_INTEROP_ROOT is false.
 */
public class NativeAEPUserProfileModule extends NativeAEPUserProfileSpec {

    public static final String NAME = "NativeAEPUserProfile";

    public NativeAEPUserProfileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void extensionVersion(Promise promise) {
        promise.resolve(UserProfile.extensionVersion());
    }

    @Override
    public void updateUserAttributes(ReadableMap attributeMap) {
        UserProfile.updateUserAttributes(RCTAEPUserProfileMapUtil.toMap(attributeMap));
    }

    @Override
    public void getUserAttributes(ReadableArray attributeNames, final Promise promise) {
        UserProfile.getUserAttributes(RCTAEPUserProfileArrayUtil.toStringList(attributeNames), new AdobeCallback<Map<String, Object>>() {
            @Override
            public void call(Map<String, Object> stringObjectMap) {
                promise.resolve(RCTAEPUserProfileMapUtil.toWritableMap(stringObjectMap));
            }
        });
    }

    @Override
    public void removeUserAttributes(ReadableArray attributeNames) {
        UserProfile.removeUserAttributes(RCTAEPUserProfileArrayUtil.toStringList(attributeNames));
    }

    // addListener/removeListeners kept for NativeEventEmitter compatibility (interop path).
    @Override
    public void addListener(String eventName) {
    }

    @Override
    public void removeListeners(double count) {
    }
}
