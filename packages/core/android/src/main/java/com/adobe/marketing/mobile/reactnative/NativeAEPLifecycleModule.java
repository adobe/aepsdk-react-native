/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 */
package com.adobe.marketing.mobile.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base;
 * used when USE_INTEROP_ROOT is false.
 */
public class NativeAEPLifecycleModule extends NativeAEPLifecycleSpec {

    public static final String NAME = "NativeAEPLifecycle";

    public NativeAEPLifecycleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void extensionVersion(Promise promise) {
        RCTAEPLifecycleUtil.extensionVersion(promise);
    }

}
