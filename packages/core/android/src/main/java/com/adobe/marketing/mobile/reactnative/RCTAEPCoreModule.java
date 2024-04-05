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
import com.adobe.marketing.mobile.services.Log;
import com.adobe.marketing.mobile.ExtensionError;
import com.adobe.marketing.mobile.ExtensionErrorCallback;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.MobilePrivacyStatus;
import com.adobe.marketing.mobile.WrapperType;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import android.app.Application;

import java.util.concurrent.atomic.AtomicBoolean;

public class RCTAEPCoreModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static String FAILED_TO_CONVERT_EVENT_MESSAGE = "Failed to convert map to Event";
    private static AtomicBoolean hasStarted = new AtomicBoolean(false);

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

    public static void setApplication(final Application application) {
      MobileCore.setApplication(application);
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
    public void log(final String mode, final String tag, final String message) {
        LoggingMode logMode = RCTAEPCoreDataBridge.loggingModeFromString(mode);
        switch (logMode) {
            case DEBUG:
                Log.debug(tag, tag, message);
                break;
            case VERBOSE:
                Log.trace(tag, tag, message);
                break;
            case WARNING:
                Log.warning(tag, tag, message);
            case ERROR:
                Log.error(tag, tag, message);
                break;
            default:
                Log.debug(tag, tag, message);
                break;
        }
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
    public void dispatchEventWithResponseCallback(final ReadableMap eventMap,
                                                  final Promise promise) {
        Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
        if (event == null) {
            promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
            return;
        }

        AdobeCallback<Event> eventAdobeCallback = new AdobeCallback<Event>() {
            @Override
            public void call(Event event) {
                promise.resolve(RCTAEPCoreDataBridge.readableMapFromEvent(event));
            }
        };

        ExtensionErrorCallback<ExtensionError> extensionErrorExtensionErrorCallback = new ExtensionErrorCallback<ExtensionError>() {
            @Override
            public void error(ExtensionError extensionError) {
                handleError(promise, extensionError);
            }
        };

        MobileCore.dispatchEventWithResponseCallback(event,123 ,extensionErrorExtensionErrorCallback);
    }

    @ReactMethod
    public void dispatchResponseEvent(final ReadableMap responseEvent, final ReadableMap requestEvent,
                                      final Promise promise) {
        MobileCore.dispatchResponseEvent(RCTAEPCoreDataBridge.eventFromReadableMap(responseEvent), RCTAEPCoreDataBridge.eventFromReadableMap(requestEvent), new ExtensionErrorCallback<ExtensionError>() {
            @Override
            public void error(ExtensionError extensionError) {
                if (extensionError != null) {
                    promise.resolve(true);
                } else {
                    handleError(promise, extensionError);
                }
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

    // Helper method/s
    private void handleError(Promise promise, ExtensionError error) {
        if (error == null || promise == null) {
            return;
        }

        promise.reject(String.valueOf(error.getErrorCode()), error.getErrorName(), new RuntimeException(error.getErrorName()));
    }

    private void handleError(final Promise promise, final AdobeError error, final String errorLocation) {
        if (error == null || promise == null) {
            return;
        }

        promise.reject(getName(), String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));
    }

}
