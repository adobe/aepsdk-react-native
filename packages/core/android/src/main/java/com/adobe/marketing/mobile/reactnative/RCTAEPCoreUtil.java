/*
Copyright 2026 Adobe. All rights reserved.
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

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Event;
import com.adobe.marketing.mobile.InitOptions;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.MobilePrivacyStatus;
import com.adobe.marketing.mobile.services.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.HashMap;
import java.util.Map;

/**
 * Logic shared by the legacy bridge module ({@link RCTAEPCoreModule}) and the
 * Turbo Native Module ({@link NativeAEPCoreModule}), so both behave identically.
 */
final class RCTAEPCoreUtil {

    private static final String TAG = "RCTAEPCoreUtil";
    private static final String FAILED_TO_CONVERT_EVENT_MESSAGE = "Failed to convert map to Event";
    private static final String APP_ID_KEY = "appId";
    private static final String LIFECYCLE_ADDITIONAL_CONTEXT_DATA = "lifecycleAdditionalContextData";
    private static final String LIFECYCLE_AUTOMATIC_TACKING_ENABLED = "lifecycleAutomaticTrackingEnabled";
    private static final String ERROR_MESSAGE = "Error parsing lifecycleAdditionalContextData";

    private RCTAEPCoreUtil() {}

    static void extensionVersion(final Promise promise) {
        promise.resolve(MobileCore.extensionVersion());
    }

    static void initialize(final Application application, final ReadableMap initOptionsMap,
                           final Promise promise, final String moduleName) {
        InitOptions initOptions = initOptionsFromMap(initOptionsMap, moduleName);

        if (initOptions == null) {
            promise.reject(moduleName, "InitOptions is null or invalid.");
            return;
        }

        MobileCore.initialize(application, initOptions, new AdobeCallback<Object>() {
            @Override
            public void call(Object o) {
                promise.resolve(null);
            }
        });
    }

    private static InitOptions initOptionsFromMap(final ReadableMap initOptionsMap, final String moduleName) {
        if (initOptionsMap == null) {
            return null;
        }

        try {
            String appId = initOptionsMap.hasKey(APP_ID_KEY) ? initOptionsMap.getString(APP_ID_KEY) : null;
            InitOptions options = appId != null ? InitOptions.configureWithAppID(appId) : new InitOptions();

            if (initOptionsMap.hasKey(LIFECYCLE_AUTOMATIC_TACKING_ENABLED)) {
                options.setLifecycleAutomaticTrackingEnabled(initOptionsMap.getBoolean(LIFECYCLE_AUTOMATIC_TACKING_ENABLED));
            }

            Map<String, String> lifecycleAdditionalContextData = getLifecycleAdditionalContextData(initOptionsMap, moduleName);
            if (lifecycleAdditionalContextData != null) {
                options.setLifecycleAdditionalContextData(lifecycleAdditionalContextData);
            }
            return options;
        } catch (Exception e) {
            Log.error(moduleName, TAG, "Error parsing initOptionsMap:");
            return null;
        }
    }

    /**
     * Extracts lifecycleAdditionalContextData from the initOptionsMap.
     * If the key exists but does not contain a valid ReadableMap,
     * the method catches the exception and returns an empty map.
     */
    private static Map<String, String> getLifecycleAdditionalContextData(final ReadableMap initOptionsMap,
                                                                         final String moduleName) {
        if (!initOptionsMap.hasKey(LIFECYCLE_ADDITIONAL_CONTEXT_DATA)) {
            return null;
        }

        Map<String, String> lifecycleAdditionalContextData = new HashMap<>();
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
            Log.error(moduleName, TAG, ERROR_MESSAGE);
        }
        return lifecycleAdditionalContextData;
    }

    static void configureWithAppId(final String appId) {
        MobileCore.configureWithAppID(appId);
    }

    static void clearUpdatedConfiguration() {
        MobileCore.clearUpdatedConfiguration();
    }

    static void updateConfiguration(final ReadableMap configMap) {
        MobileCore.updateConfiguration(RCTAEPMapUtil.toMap(configMap));
    }

    static void setLogLevel(final String mode) {
        LoggingMode logMode = RCTAEPCoreDataBridge.loggingModeFromString(mode);
        MobileCore.setLogLevel(logMode);
    }

    static void getLogLevel(final Promise promise) {
        promise.resolve(RCTAEPCoreDataBridge.stringFromLoggingMode(MobileCore.getLogLevel()));
    }

    static void setPrivacyStatus(final String privacyStatus) {
        MobileCore.setPrivacyStatus(RCTAEPCoreDataBridge.privacyStatusFromString(privacyStatus));
    }

    static void getPrivacyStatus(final Promise promise, final String moduleName) {
        MobileCore.getPrivacyStatus(new AdobeCallbackWithError<MobilePrivacyStatus>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getPrivacyStatus", moduleName);
            }

            @Override
            public void call(MobilePrivacyStatus mobilePrivacyStatus) {
                promise.resolve(RCTAEPCoreDataBridge.stringFromPrivacyStatus(mobilePrivacyStatus));
            }
        });
    }

    static void getSdkIdentities(final Promise promise, final String moduleName) {
        MobileCore.getSdkIdentities(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "getSdkIdentities", moduleName);
            }

            @Override
            public void call(String value) {
                promise.resolve(value);
            }
        });
    }

    static void dispatchEvent(final ReadableMap eventMap, final Promise promise, final String moduleName) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(moduleName, FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEvent(event);
    }

    static void dispatchEventWithResponseCallback(final ReadableMap eventMap, final int timeout,
                                                  final Promise promise, final String moduleName) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(moduleName, FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        MobileCore.dispatchEventWithResponseCallback(event, timeout, new AdobeCallbackWithError<Event>() {
            @Override
            public void fail(AdobeError adobeError) {
                handleError(promise, adobeError, "dispatchEventWithResponseCallback", moduleName);
            }

            @Override
            public void call(Event responseEvent) {
                promise.resolve(RCTAEPCoreDataBridge.readableMapFromEvent(responseEvent));
            }
        });
    }

    static void trackAction(final String action, final ReadableMap contextData) {
        MobileCore.trackAction(action, RCTAEPMapUtil.toStringMap(contextData));
    }

    static void trackState(final String state, final ReadableMap contextData) {
        MobileCore.trackState(state, RCTAEPMapUtil.toStringMap(contextData));
    }

    static void setAdvertisingIdentifier(final String advertisingIdentifier) {
        MobileCore.setAdvertisingIdentifier(advertisingIdentifier);
    }

    static void setPushIdentifier(final String pushIdentifier) {
        MobileCore.setPushIdentifier(pushIdentifier);
    }

    static void collectPii(final ReadableMap data) {
        MobileCore.collectPii(RCTAEPMapUtil.toStringMap(data));
    }

    static void setSmallIconResourceID(final int resourceID) {
        MobileCore.setSmallIconResourceID(resourceID);
    }

    static void setLargeIconResourceID(final int resourceID) {
        MobileCore.setLargeIconResourceID(resourceID);
    }

    static void setAppGroup(final String moduleName) {
        Log.debug(moduleName, TAG, "setAppGroup() cannot be invoked on Android");
    }

    static void resetIdentities() {
        MobileCore.resetIdentities();
    }

    static void handleError(final Promise promise, final AdobeError error,
                            final String errorLocation, final String moduleName) {
        if (error == null || promise == null) {
            return;
        }

        promise.reject(moduleName,
                String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()),
                new Error(error.getErrorName()));
    }
}
