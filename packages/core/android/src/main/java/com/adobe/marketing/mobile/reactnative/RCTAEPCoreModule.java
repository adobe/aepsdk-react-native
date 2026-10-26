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

import android.app.Application;

import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.WrapperType;
import com.adobe.marketing.mobile.services.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/**
 * Legacy bridge module (old architecture / interop). Business logic lives in {@link RCTAEPCoreUtil},
 * shared with {@link NativeAEPCoreModule}.
 */
public class RCTAEPCoreModule extends ReactContextBaseJavaModule {

    private final static String NAME = "NativeAEPCore";

    private final ReactApplicationContext reactContext;

    public RCTAEPCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        MobileCore.setWrapperType(WrapperType.REACT_NATIVE);
    }

    // Required for RN modules
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        RCTAEPCoreUtil.extensionVersion(promise);
    }

    @ReactMethod
    public void configureWithAppId(final String appId) {
        RCTAEPCoreUtil.configureWithAppId(appId);
    }

    @ReactMethod
    public void initialize(ReadableMap initOptionsMap, final Promise promise) {
        RCTAEPCoreUtil.initialize((Application) reactContext.getApplicationContext(), initOptionsMap, promise, NAME);
    }

    @ReactMethod
    public void clearUpdatedConfiguration() {
        RCTAEPCoreUtil.clearUpdatedConfiguration();
    }

    @ReactMethod
    public void updateConfiguration(final ReadableMap configMap) {
        RCTAEPCoreUtil.updateConfiguration(configMap);
    }

    @ReactMethod
    public void setLogLevel(final String mode) {
        RCTAEPCoreUtil.setLogLevel(mode);
    }

    @ReactMethod
    public void getLogLevel(final Promise promise) {
        RCTAEPCoreUtil.getLogLevel(promise);
    }

    @ReactMethod
    public void setPrivacyStatus(final String privacyStatus) {
        RCTAEPCoreUtil.setPrivacyStatus(privacyStatus);
    }

    @ReactMethod
    public void getPrivacyStatus(final Promise promise) {
        RCTAEPCoreUtil.getPrivacyStatus(promise, NAME);
    }

    @ReactMethod
    public void getSdkIdentities(final Promise promise) {
        RCTAEPCoreUtil.getSdkIdentities(promise, NAME);
    }

    @ReactMethod
    public void dispatchEvent(final ReadableMap eventMap, final Promise promise) {
        RCTAEPCoreUtil.dispatchEvent(eventMap, promise, NAME);
    }

    @ReactMethod
    public void dispatchEventWithResponseCallback(final ReadableMap eventMap, final int timeout, final Promise promise) {
        RCTAEPCoreUtil.dispatchEventWithResponseCallback(eventMap, timeout, promise, NAME);
    }

    @ReactMethod
    public void trackAction(final String action, final ReadableMap contextData) {
        RCTAEPCoreUtil.trackAction(action, contextData);
    }

    @ReactMethod
    public void trackState(final String state, final ReadableMap contextData) {
        RCTAEPCoreUtil.trackState(state, contextData);
    }

    @ReactMethod
    public void setAdvertisingIdentifier(final String advertisingIdentifier) {
        RCTAEPCoreUtil.setAdvertisingIdentifier(advertisingIdentifier);
    }

    @ReactMethod
    public void setPushIdentifier(final String pushIdentifier) {
        RCTAEPCoreUtil.setPushIdentifier(pushIdentifier);
    }

    @ReactMethod
    public void collectPii(final ReadableMap data) {
        RCTAEPCoreUtil.collectPii(data);
    }

    @ReactMethod
    public static void setSmallIconResourceID(final int resourceID) {
        RCTAEPCoreUtil.setSmallIconResourceID(resourceID);
    }

    @ReactMethod
    public static void setLargeIconResourceID(final int resourceID) {
        RCTAEPCoreUtil.setLargeIconResourceID(resourceID);
    }

    @ReactMethod
    public void setAppGroup(final String appGroup) {
        RCTAEPCoreUtil.setAppGroup(NAME);
    }

    @ReactMethod
    public void downloadRules() {
        Log.debug(NAME, "RCTAEPCoreModule", "downloadRules() cannot be invoked on Android");
    }

    @ReactMethod
    public void resetIdentities() {
        RCTAEPCoreUtil.resetIdentities();
    }
}
