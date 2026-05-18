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
package com.adobe.marketing.mobile.reactnative.optimize;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

/**
 * Registers the Optimize native module per React Native Turbo Module doc.
 * Build-time switch: only one root is registered, but both paths register under
 * the same JS-visible name "NativeAEPOptimize" so the codegen JS spec
 * (`TurboModuleRegistry.getEnforcing('NativeAEPOptimize')`) resolves on either path.
 * Matches iOS, where both paths expose moduleName "NativeAEPOptimize".
 *
 * USE_INTEROP_ROOT true  -> RCTAEPOptimizeModule (classic bridge); isTurboModule = false.
 * USE_INTEROP_ROOT false -> NativeAEPOptimizeModule (Turbo);       isTurboModule = true.
 */
public class RCTAEPOptimizePackage extends BaseReactPackage {

    private static final String MODULE_NAME = "NativeAEPOptimize";

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (!MODULE_NAME.equals(name)) {
            return null;
        }
        return BuildConfig.USE_INTEROP_ROOT
                ? new RCTAEPOptimizeModule(reactContext)
                : new NativeAEPOptimizeModule(reactContext);
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                Map<String, ReactModuleInfo> map = new HashMap<>();
                boolean isTurboModule = !BuildConfig.USE_INTEROP_ROOT;
                map.put(MODULE_NAME, new ReactModuleInfo(
                        MODULE_NAME,
                        MODULE_NAME,
                        false,
                        false,
                        false,
                        isTurboModule
                ));
                return map;
            }
        };
    }
}
