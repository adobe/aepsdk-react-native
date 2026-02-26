/*
Copyright 2022 Adobe. All rights reserved.
CoreTurbo – Turbo Module that logs and returns Mobile Core extension version.
*/
package com.adobe.marketing.mobile.reactnative;

import android.util.Log;
import com.adobe.marketing.mobile.MobileCore;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RCTCoreTurboModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CoreTurbo";

    public RCTCoreTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NativeCoreTurbo";
    }

    @ReactMethod
    public void getExtensionVersion(Promise promise) {
        try {
            String version = MobileCore.extensionVersion();
            Log.d(TAG, "Mobile Core extension version: " + version);
            promise.resolve(version != null ? version : "");
        } catch (Exception e) {
            Log.e(TAG, "getExtensionVersion error", e);
            promise.reject("E_CORETURBO", e.getMessage());
        }
    }
}
