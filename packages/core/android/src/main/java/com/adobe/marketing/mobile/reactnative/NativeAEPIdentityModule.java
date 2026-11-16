/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPIdentitySpec); business logic lives in RCTAEPIdentityUtil,
 * shared with the legacy RCTAEPIdentityModule.
 */
package com.adobe.marketing.mobile.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base;
 * used when USE_INTEROP_ROOT is false.
 */
public class NativeAEPIdentityModule extends NativeAEPIdentitySpec {

    public static final String NAME = "NativeAEPIdentity";

    public NativeAEPIdentityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void extensionVersion(Promise promise) {
        RCTAEPIdentityUtil.extensionVersion(promise);
    }

    @Override
    public void syncIdentifiers(ReadableMap identifiers) {
        RCTAEPIdentityUtil.syncIdentifiers(identifiers);
    }

    @Override
    public void syncIdentifiersWithAuthState(ReadableMap identifiers, String authenticationState) {
        RCTAEPIdentityUtil.syncIdentifiersWithAuthState(identifiers, authenticationState);
    }

    @Override
    public void syncIdentifier(String identifierType, String identifier, String authenticationState) {
        RCTAEPIdentityUtil.syncIdentifier(identifierType, identifier, authenticationState);
    }

    @Override
    public void appendVisitorInfoForURL(String baseURL, Promise promise) {
        RCTAEPIdentityUtil.appendVisitorInfoForURL(baseURL, promise, NAME);
    }

    @Override
    public void getUrlVariables(Promise promise) {
        RCTAEPIdentityUtil.getUrlVariables(promise, NAME);
    }

    @Override
    public void getIdentifiers(Promise promise) {
        RCTAEPIdentityUtil.getIdentifiers(promise, NAME);
    }

    @Override
    public void getExperienceCloudId(Promise promise) {
        RCTAEPIdentityUtil.getExperienceCloudId(promise, NAME);
    }
}
