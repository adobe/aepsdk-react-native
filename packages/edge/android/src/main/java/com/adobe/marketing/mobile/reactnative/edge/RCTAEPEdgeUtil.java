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
package com.adobe.marketing.mobile.reactnative.edge;

import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.EdgeCallback;
import com.adobe.marketing.mobile.EdgeEventHandle;
import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.List;

/**
 * Single implementation behind both {@code RCTAEPEdgeModule} (legacy bridge) and
 * {@code NativeAEPEdgeModule} (TurboModule). Both modules only adapt signatures and delegate here.
 */
final class RCTAEPEdgeUtil {
  private static final String FAILED_TO_CONVERT_EXPERIENCE_EVENT =
      "Failed to convert map to Experience Event, Experience Event could be null.";

  private RCTAEPEdgeUtil() {}

  static void extensionVersion(final Promise promise) {
    promise.resolve(Edge.extensionVersion());
  }

  static void sendEvent(final ReadableMap experienceEventMap, final Promise promise, final String moduleName) {
    ExperienceEvent experienceEvent = RCTAEPEdgeDataBridge.experienceEventFromReadableMap(experienceEventMap);
    if (experienceEvent == null) {
      promise.reject(moduleName, FAILED_TO_CONVERT_EXPERIENCE_EVENT, new Error(FAILED_TO_CONVERT_EXPERIENCE_EVENT));
      return;
    }

    Edge.sendEvent(experienceEvent, new EdgeCallback() {
      @Override
      public void onComplete(final List<EdgeEventHandle> handles) {
        WritableArray arr = new WritableNativeArray();
        if (handles == null) {
          promise.resolve(arr);
          return;
        }

        for (EdgeEventHandle handle : handles) {
          arr.pushMap(RCTAEPEdgeDataBridge.mapFromEdgeEventHandle(handle));
        }
        promise.resolve(arr);
      }
    });
  }

  static void setLocationHint(final String hint) {
    Edge.setLocationHint(hint);
  }

  static void getLocationHint(final Promise promise, final String moduleName) {
    Edge.getLocationHint(new AdobeCallbackWithError<String>() {
      @Override
      public void fail(AdobeError adobeError) {
        handleError(promise, adobeError, "getLocationHint", moduleName);
      }

      @Override
      public void call(String value) {
        promise.resolve(value);
      }
    });
  }

  private static void handleError(final Promise promise, final AdobeError error, final String errorLocation, final String moduleName) {
    if (error == null || promise == null) {
      return;
    }

    promise.reject(moduleName, String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));
  }
}
