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

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

/**
 * Registers the Core/Identity/Lifecycle/Signal native modules per React Native Turbo Module doc.
 * Build-time switch: only one root is registered per module, but both paths register under
 * the same JS-visible names so the codegen JS specs
 * (`TurboModuleRegistry.getEnforcing('NativeAEP<Module>')`) resolve on either path.
 *
 * USE_INTEROP_ROOT true  -> RCTAEP<Module>Module (classic bridge); isTurboModule = false.
 * USE_INTEROP_ROOT false -> NativeAEP<Module>Module (Turbo);       isTurboModule = true.
 */
public class RCTAEPCorePackage extends BaseReactPackage implements ReactPackage {

    private static final String CORE_MODULE_NAME = "NativeAEPCore";
    private static final String IDENTITY_MODULE_NAME = "NativeAEPIdentity";
    private static final String LIFECYCLE_MODULE_NAME = "NativeAEPLifecycle";
    private static final String SIGNAL_MODULE_NAME = "NativeAEPSignal";

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        boolean useLegacy = BuildConfig.USE_INTEROP_ROOT || !BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

        switch (name) {
            case CORE_MODULE_NAME:
                return useLegacy
                        ? new RCTAEPCoreModule(reactContext)
                        : createTurboModule("NativeAEPCoreModule", reactContext);
            case IDENTITY_MODULE_NAME:
                return useLegacy
                        ? new RCTAEPIdentityModule(reactContext)
                        : createTurboModule("NativeAEPIdentityModule", reactContext);
            case LIFECYCLE_MODULE_NAME:
                return useLegacy
                        ? new RCTAEPLifecycleModule(reactContext)
                        : createTurboModule("NativeAEPLifecycleModule", reactContext);
            case SIGNAL_MODULE_NAME:
                return useLegacy
                        ? new RCTAEPSignalModule(reactContext)
                        : createTurboModule("NativeAEPSignalModule", reactContext);
            default:
                return null;
        }
    }

    /** Reflection avoids compile-time dep on Native*Module when old arch omits codegen sources. */
    private static NativeModule createTurboModule(String simpleClassName, ReactApplicationContext reactContext) {
        try {
            Class<?> cls = Class.forName(
                    "com.adobe.marketing.mobile.reactnative." + simpleClassName);
            return (NativeModule) cls.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(
                    simpleClassName + " not available — enable New Architecture or set USE_INTEROP_ROOT=true",
                    e);
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                boolean isTurboModule =
                        BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && !BuildConfig.USE_INTEROP_ROOT;
                Map<String, ReactModuleInfo> map = new HashMap<>();
                for (String moduleName : new String[]{
                        CORE_MODULE_NAME, IDENTITY_MODULE_NAME, LIFECYCLE_MODULE_NAME, SIGNAL_MODULE_NAME}) {
                    map.put(moduleName, new ReactModuleInfo(
                            moduleName,
                            moduleName,
                            false,
                            false,
                            false,
                            isTurboModule
                    ));
                }
                return map;
            }
        };
    }
}
