/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPCoreSpec); business logic lives in RCTAEPCoreUtil,
 * shared with the legacy RCTAEPCoreModule.
 */
package com.adobe.marketing.mobile.reactnative;

import android.app.Application;

import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.WrapperType;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base;
 * used when USE_INTEROP_ROOT is false.
 */
public class NativeAEPCoreModule extends NativeAEPCoreSpec {

    public static final String NAME = "NativeAEPCore";

    public NativeAEPCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        MobileCore.setWrapperType(WrapperType.REACT_NATIVE);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void extensionVersion(Promise promise) {
        RCTAEPCoreUtil.extensionVersion(promise);
    }

    @Override
    public void configureWithAppId(String appId) {
        RCTAEPCoreUtil.configureWithAppId(appId);
    }

    @Override
    public void initialize(ReadableMap initOptionsMap, Promise promise) {
        RCTAEPCoreUtil.initialize((Application) getReactApplicationContext().getApplicationContext(), initOptionsMap, promise, NAME);
    }

    @Override
    public void clearUpdatedConfiguration() {
        RCTAEPCoreUtil.clearUpdatedConfiguration();
    }

    @Override
    public void updateConfiguration(ReadableMap configMap) {
        RCTAEPCoreUtil.updateConfiguration(configMap);
    }

    @Override
    public void setLogLevel(String mode) {
        RCTAEPCoreUtil.setLogLevel(mode);
    }

    @Override
    public void getLogLevel(Promise promise) {
        RCTAEPCoreUtil.getLogLevel(promise);
    }

    @Override
    public void setPrivacyStatus(String privacyStatus) {
        RCTAEPCoreUtil.setPrivacyStatus(privacyStatus);
    }

    @Override
    public void getPrivacyStatus(Promise promise) {
        RCTAEPCoreUtil.getPrivacyStatus(promise, NAME);
    }

    @Override
    public void getSdkIdentities(Promise promise) {
        RCTAEPCoreUtil.getSdkIdentities(promise, NAME);
    }

    @Override
    public void dispatchEvent(ReadableMap eventMap, Promise promise) {
        RCTAEPCoreUtil.dispatchEvent(eventMap, promise, NAME);
    }

    @Override
    public void dispatchEventWithResponseCallback(ReadableMap eventMap, double timeoutMS, Promise promise) {
        RCTAEPCoreUtil.dispatchEventWithResponseCallback(eventMap, (int) timeoutMS, promise, NAME);
    }

    @Override
    public void trackAction(String action, ReadableMap contextData) {
        RCTAEPCoreUtil.trackAction(action, contextData);
    }

    @Override
    public void trackState(String state, ReadableMap contextData) {
        RCTAEPCoreUtil.trackState(state, contextData);
    }

    @Override
    public void setAdvertisingIdentifier(String advertisingIdentifier) {
        RCTAEPCoreUtil.setAdvertisingIdentifier(advertisingIdentifier);
    }

    @Override
    public void setPushIdentifier(String pushIdentifier) {
        RCTAEPCoreUtil.setPushIdentifier(pushIdentifier);
    }

    @Override
    public void collectPii(ReadableMap data) {
        RCTAEPCoreUtil.collectPii(data);
    }

    @Override
    public void setSmallIconResourceID(double resourceID) {
        RCTAEPCoreUtil.setSmallIconResourceID((int) resourceID);
    }

    @Override
    public void setLargeIconResourceID(double resourceID) {
        RCTAEPCoreUtil.setLargeIconResourceID((int) resourceID);
    }

    @Override
    public void setAppGroup(String appGroup) {
        RCTAEPCoreUtil.setAppGroup(NAME);
    }

    @Override
    public void resetIdentities() {
        RCTAEPCoreUtil.resetIdentities();
    }
}
