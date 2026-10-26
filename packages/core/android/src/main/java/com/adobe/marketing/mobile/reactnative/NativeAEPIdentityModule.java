/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPIdentitySpec); mirrors the shared logic in RCTAEPIdentityModule (interop path).
 */
package com.adobe.marketing.mobile.reactnative;

import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Identity;
import com.adobe.marketing.mobile.VisitorID;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.List;

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
        promise.resolve(Identity.extensionVersion());
    }

    @Override
    public void syncIdentifiers(ReadableMap identifiers) {
        Identity.syncIdentifiers(RCTAEPMapUtil.toStringMap(identifiers));
    }

    @Override
    public void syncIdentifiersWithAuthState(ReadableMap identifiers, String authenticationState) {
        VisitorID.AuthenticationState authState = RCTAEPIdentityDataBridge.authenticationStateFromString(authenticationState);
        Identity.syncIdentifiers(RCTAEPMapUtil.toStringMap(identifiers), authState);
    }

    @Override
    public void syncIdentifier(String identifierType, String identifier, String authenticationState) {
        VisitorID.AuthenticationState authState = RCTAEPIdentityDataBridge.authenticationStateFromString(authenticationState);
        Identity.syncIdentifier(identifierType, identifier, authState);
    }

    @Override
    public void appendVisitorInfoForURL(String baseURL, final Promise promise) {
        Identity.appendVisitorInfoForURL(baseURL, new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "appendVisitorInfoForURL");
            }

            @Override
            public void call(String s) {
                promise.resolve(s);
            }
        });
    }

    @Override
    public void getUrlVariables(final Promise promise) {
        Identity.getUrlVariables(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getUrlVariables");
            }

            @Override
            public void call(String s) {
                promise.resolve(s);
            }
        });
    }

    @Override
    public void getIdentifiers(final Promise promise) {
        Identity.getIdentifiers(new AdobeCallbackWithError<List<VisitorID>>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getIdentifiers");
            }

            @Override
            public void call(List<VisitorID> visitorIDS) {
                WritableArray arr = new WritableNativeArray();
                if (visitorIDS == null) {
                    promise.resolve(arr);
                    return;
                }

                for (VisitorID vid : visitorIDS) {
                    arr.pushMap(RCTAEPIdentityDataBridge.mapFromVisitorIdentifier(vid));
                }
                promise.resolve(arr);
            }
        });
    }

    @Override
    public void getExperienceCloudId(final Promise promise) {
        Identity.getExperienceCloudId(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getExperienceCloudId");
            }

            @Override
            public void call(String s) {
                promise.resolve(s);
            }
        });
    }

    private void handleError(final Promise promise, final AdobeError error, final String errorLocation) {
        if (error == null || promise == null) {
            return;
        }

        promise.reject(getName(), String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));
    }
}
