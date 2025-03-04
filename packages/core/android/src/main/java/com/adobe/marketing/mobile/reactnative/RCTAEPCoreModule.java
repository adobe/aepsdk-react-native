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
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import android.app.Application;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.HashMap;
import java.util.Map;

public class RCTAEPCoreModule extends ReactContextBaseJavaModule {

    private final static String TAG = "RCTAEPCoreModule";

    private final ReactApplicationContext reactContext;
    private static String FAILED_TO_CONVERT_EVENT_MESSAGE = "Failed to convert map to Event";
    private static String INVALID_TIMEOUT_VALUE_MESSAGE = "Invalid timeout value. Timeout must be a positive integer.";
    private static AtomicBoolean hasStarted = new AtomicBoolean(false);
    private final static String APP_ID_KEY = "appId";
    private final static String LIFECYCLE_ADDITIONAL_CONTEXT_DATA = "lifecycleAdditionalContextData";
    private final static String LIFECYCLE_AUTOMATIC_TACKING_ENABLED = "lifecycleAutomaticTrackingEnabled";
    private final static String ERROR_MESSAGE = "Error parsing lifecycleAdditionalContextData";

    public RCTAEPCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        MobileCore.setWrapperType(WrapperType.REACT_NATIVE);
    }

    // Required for RN modules
    @Override
    public String getName() {
        return "AEPCore";
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        promise.resolve(MobileCore.extensionVersion());
    }

    @ReactMethod
    public void configureWithAppId(final String appId) {
        MobileCore.configureWithAppID(appId);
    }

    @ReactMethod
    public void initialize(ReadableMap initOptionsMap, final Promise promise) {
        InitOptions initOptions = initOptionsFromMap(initOptionsMap);

        if (initOptions == null) {
            promise.reject(getName(), "InitOptions is null or invalid.");
            return;
        }

        MobileCore.initialize((Application) reactContext.getApplicationContext(), initOptions, new AdobeCallback<Object>() {
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
    
            Boolean lifecycleAutomaticTrackingEnabled = initOptionsMap.hasKey(LIFECYCLE_AUTOMATIC_TACKING_ENABLED)
                    ? initOptionsMap.getBoolean(LIFECYCLE_AUTOMATIC_TACKING_ENABLED)
                    : null;
            if (lifecycleAutomaticTrackingEnabled != null) {
                options.setLifecycleAutomaticTrackingEnabled(lifecycleAutomaticTrackingEnabled);
            }
            // Use the helper method to extract lifecycleAdditionalContextData
            Map<String, String> lifecycleAdditionalContextData = getLifecycleAdditionalContextData(initOptionsMap);
            if (lifecycleAdditionalContextData != null) {
                options.setLifecycleAdditionalContextData(lifecycleAdditionalContextData);
            }
            return options;
        } catch (Exception e) {
            Log.error(getName(), TAG, "Error parsing initOptionsMap:");

            return null; // Return null or consider throwing a custom exception based on your use case
        }
    }
    

    /**
     * Extracts lifecycleAdditionalContextData from the initOptionsMap.
     * If the key exists but does not contain a valid ReadableMap,
     * the method catches the exception and returns an empty map.
     */
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

    @ReactMethod
    public void clearUpdatedConfiguration() {
        MobileCore.clearUpdatedConfiguration();
    }

    @ReactMethod
    public void updateConfiguration(final ReadableMap configMap) {
        MobileCore.updateConfiguration(RCTAEPMapUtil.toMap(configMap));
    }

    @ReactMethod
    public void setLogLevel(final String mode) {
        LoggingMode logMode = RCTAEPCoreDataBridge.loggingModeFromString(mode);
        MobileCore.setLogLevel(logMode);
    }

    @ReactMethod
    public void getLogLevel(final Promise promise) {
        promise.resolve(RCTAEPCoreDataBridge.stringFromLoggingMode(MobileCore.getLogLevel()));
    }

    @ReactMethod
    public void setPrivacyStatus(final String privacyStatus) {
        MobileCore.setPrivacyStatus(RCTAEPCoreDataBridge.privacyStatusFromString(privacyStatus));
    }

    @ReactMethod
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

    @ReactMethod
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

    @ReactMethod
    public void dispatchEvent(final ReadableMap eventMap, final Promise promise) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEvent(event);
    }

    @ReactMethod
    public void dispatchEventWithResponseCallback(final ReadableMap eventMap, final int timeout, final Promise promise) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEventWithResponseCallback(event, timeout, new AdobeCallbackWithError<Event>() {
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

    @ReactMethod
    public void trackAction(final String action, final ReadableMap contextData) {
        MobileCore.trackAction(action, RCTAEPMapUtil.toStringMap(contextData));
    }

    @ReactMethod
    public void trackState(final String state, final ReadableMap contextData) {
        MobileCore.trackState(state, RCTAEPMapUtil.toStringMap(contextData));
    }

    @ReactMethod
    public void setAdvertisingIdentifier(final String advertisingIdentifier) {
        MobileCore.setAdvertisingIdentifier(advertisingIdentifier);
    }

    @ReactMethod
    public void setPushIdentifier(final String pushIdentifier) {
        MobileCore.setPushIdentifier(pushIdentifier);
    }

    @ReactMethod
    public void collectPii(final ReadableMap data) {
        MobileCore.collectPii(RCTAEPMapUtil.toStringMap(data));
    }

    @ReactMethod
    public static void setSmallIconResourceID(final int resourceID) {
        MobileCore.setSmallIconResourceID(resourceID);
    }

    @ReactMethod
    public static void setLargeIconResourceID(final int resourceID) {
        MobileCore.setLargeIconResourceID(resourceID);
    }

    @ReactMethod
    public void setAppGroup(final String appGroup) {
        Log.debug(getName(), "RCTAEPCoreModule", "setAppGroup() cannot be invoked on Android");
    }

    @ReactMethod
    public void downloadRules() {
        Log.debug(getName(), "RCTAEPCoreModule", "downloadRules() cannot be invoked on Android");
    }

    @ReactMethod
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
