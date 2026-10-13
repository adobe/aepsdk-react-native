/*
    Copyright 2023 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
 */
package com.adobe.marketing.mobile.reactnative.messaging;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import java.util.HashMap;
import java.util.Map;

/**
 * Registers the Messaging native module per the React Native Turbo Module doc.
 * Both paths register under the JS-visible name "NativeAEPMessaging" so the codegen JS spec
 * (`TurboModuleRegistry.getEnforcing('NativeAEPMessaging')`) resolves on either path.
 *
 * USE_INTEROP_ROOT true  -> RCTAEPMessagingModule (classic bridge); isTurboModule = false.
 * USE_INTEROP_ROOT false -> NativeAEPMessagingModule (Turbo);        isTurboModule = true.
 */
public class RCTAEPMessagingPackage extends BaseReactPackage implements ReactPackage {

  private static final String MODULE_NAME = "NativeAEPMessaging";

  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (!MODULE_NAME.equals(name)) {
      return null;
    }
    if (BuildConfig.USE_INTEROP_ROOT || !BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return new RCTAEPMessagingModule(reactContext);
    }
    return createTurboModule(reactContext);
  }

  /** Reflection avoids a compile-time dependency on NativeAEPMessagingModule when old arch omits codegen sources. */
  private static NativeModule createTurboModule(ReactApplicationContext reactContext) {
    try {
      Class<?> cls = Class.forName(
          "com.adobe.marketing.mobile.reactnative.messaging.NativeAEPMessagingModule");
      return (NativeModule) cls.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
    } catch (ReflectiveOperationException e) {
      throw new RuntimeException(
          "NativeAEPMessagingModule not available — enable New Architecture or set USE_INTEROP_ROOT=true",
          e);
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        Map<String, ReactModuleInfo> map = new HashMap<>();
        boolean isTurboModule =
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && !BuildConfig.USE_INTEROP_ROOT;
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
