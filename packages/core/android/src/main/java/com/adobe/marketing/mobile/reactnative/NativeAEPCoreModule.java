/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPCoreSpec); mirrors the shared logic in RCTAEPCoreModule (interop path).
 */
package com.adobe.marketing.mobile.reactnative;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Event;
import com.adobe.marketing.mobile.InitOptions;
import com.adobe.marketing.mobile.services.Log;

import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.MobilePrivacyStatus;
import com.adobe.marketing.mobile.WrapperType;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import android.app.Application;

import java.util.HashMap;
import java.util.Map;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base;
 * used when USE_INTEROP_ROOT is false.
 */
public class NativeAEPCoreModule extends NativeAEPCoreSpec {

    public static final String NAME = "NativeAEPCore";
    private final static String TAG = "NativeAEPCoreModule";

    private static String FAILED_TO_CONVERT_EVENT_MESSAGE = "Failed to convert map to Event";
    private final static String APP_ID_KEY = "appId";
    private final static String LIFECYCLE_ADDITIONAL_CONTEXT_DATA = "lifecycleAdditionalContextData";
    private final static String LIFECYCLE_AUTOMATIC_TACKING_ENABLED = "lifecycleAutomaticTrackingEnabled";
    private final static String ERROR_MESSAGE = "Error parsing lifecycleAdditionalContextData";

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
        promise.resolve(MobileCore.extensionVersion());
    }

    @Override
    public void configureWithAppId(String appId) {
        MobileCore.configureWithAppID(appId);
    }

    @Override
    public void initialize(ReadableMap initOptionsMap, Promise promise) {
        InitOptions initOptions = initOptionsFromMap(initOptionsMap);

        if (initOptions == null) {
            promise.reject(getName(), "InitOptions is null or invalid.");
            return;
        }

        MobileCore.initialize((Application) getReactApplicationContext().getApplicationContext(), initOptions, new AdobeCallback<Object>() {
            @Override
            public void call(Object o) {
                promise.resolve(null);
            }
        });
    }

    private InitOptions initOptionsFromMap(final ReadableMap initOptionsMap) {
        if (initOptionsMap == null) {
            return null;
        }

        try {
            String appId = initOptionsMap.hasKey(APP_ID_KEY) ? initOptionsMap.getString(APP_ID_KEY) : null;
            InitOptions options;

            if (appId != null) {
                options = InitOptions.configureWithAppID(appId);
            } else {
                options = new InitOptions();
            }

            if (initOptionsMap.hasKey(LIFECYCLE_AUTOMATIC_TACKING_ENABLED)) {
                options.setLifecycleAutomaticTrackingEnabled(initOptionsMap.getBoolean(LIFECYCLE_AUTOMATIC_TACKING_ENABLED));
            }

            Map<String, String> lifecycleAdditionalContextData = getLifecycleAdditionalContextData(initOptionsMap);
            if (lifecycleAdditionalContextData != null) {
                options.setLifecycleAdditionalContextData(lifecycleAdditionalContextData);
            }
            return options;
        } catch (Exception e) {
            Log.error(getName(), TAG, "Error parsing initOptionsMap:");
            return null;
        }
    }

    private Map<String, String> getLifecycleAdditionalContextData(ReadableMap initOptionsMap) {
        Map<String, String> lifecycleAdditionalContextData = new HashMap<>();

        if (initOptionsMap.hasKey(LIFECYCLE_ADDITIONAL_CONTEXT_DATA)) {
            try {
                ReadableMap contextDataMap = initOptionsMap.getMap(LIFECYCLE_ADDITIONAL_CONTEXT_DATA);
                if (contextDataMap != null) {
                    ReadableMapKeySetIterator iterator = contextDataMap.keySetIterator();
                    while (iterator.hasNextKey()) {
                        String key = iterator.nextKey();
                        lifecycleAdditionalContextData.put(key, contextDataMap.getString(key));
                    }
                }
            } catch (Exception e) {
                Log.error(getName(), TAG, ERROR_MESSAGE);
            }
            return lifecycleAdditionalContextData;
        }
        return null;
    }

    @Override
    public void clearUpdatedConfiguration() {
        MobileCore.clearUpdatedConfiguration();
    }

    @Override
    public void updateConfiguration(ReadableMap configMap) {
        MobileCore.updateConfiguration(RCTAEPMapUtil.toMap(configMap));
    }

    @Override
    public void setLogLevel(String mode) {
        LoggingMode logMode = RCTAEPCoreDataBridge.loggingModeFromString(mode);
        MobileCore.setLogLevel(logMode);
    }

    @Override
    public void getLogLevel(Promise promise) {
        promise.resolve(RCTAEPCoreDataBridge.stringFromLoggingMode(MobileCore.getLogLevel()));
    }

    @Override
    public void setPrivacyStatus(String privacyStatus) {
        MobileCore.setPrivacyStatus(RCTAEPCoreDataBridge.privacyStatusFromString(privacyStatus));
    }

    @Override
    public void getPrivacyStatus(final Promise promise) {
        MobileCore.getPrivacyStatus(new AdobeCallbackWithError<MobilePrivacyStatus>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getPrivacyStatus");
            }

            @Override
            public void call(MobilePrivacyStatus mobilePrivacyStatus) {
                promise.resolve(RCTAEPCoreDataBridge.stringFromPrivacyStatus(mobilePrivacyStatus));
            }
        });
    }

    @Override
    public void getSdkIdentities(final Promise promise) {
        MobileCore.getSdkIdentities(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getSdkIdentities");
            }

            @Override
            public void call(String value) {
                promise.resolve(value);
            }
        });
    }

    @Override
    public void dispatchEvent(ReadableMap eventMap, Promise promise) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEvent(event);
    }

    @Override
    public void dispatchEventWithResponseCallback(ReadableMap eventMap, double timeoutMS, final Promise promise) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEventWithResponseCallback(event, (int) timeoutMS, new AdobeCallbackWithError<Event>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "dispatchEventWithResponseCallback");
            }

            @Override
            public void call(Event event) {
                promise.resolve(RCTAEPCoreDataBridge.readableMapFromEvent(event));
            }
        });
    }

    @Override
    public void trackAction(String action, ReadableMap contextData) {
        MobileCore.trackAction(action, RCTAEPMapUtil.toStringMap(contextData));
    }

    @Override
    public void trackState(String state, ReadableMap contextData) {
        MobileCore.trackState(state, RCTAEPMapUtil.toStringMap(contextData));
    }

    @Override
    public void setAdvertisingIdentifier(String advertisingIdentifier) {
        MobileCore.setAdvertisingIdentifier(advertisingIdentifier);
    }

    @Override
    public void setPushIdentifier(String pushIdentifier) {
        MobileCore.setPushIdentifier(pushIdentifier);
    }

    @Override
    public void collectPii(ReadableMap data) {
        MobileCore.collectPii(RCTAEPMapUtil.toStringMap(data));
    }

    @Override
    public void setSmallIconResourceID(double resourceID) {
        MobileCore.setSmallIconResourceID((int) resourceID);
    }

    @Override
    public void setLargeIconResourceID(double resourceID) {
        MobileCore.setLargeIconResourceID((int) resourceID);
    }

    @Override
    public void setAppGroup(String appGroup) {
        Log.debug(getName(), TAG, "setAppGroup() cannot be invoked on Android");
    }

    @Override
    public void resetIdentities() {
        MobileCore.resetIdentities();
    }

    private void handleError(final Promise promise, final AdobeError error, final String errorLocation) {
        if (error == null || promise == null) {
            return;
        }

        promise.reject(getName(), String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));
    }
}
