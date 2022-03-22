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

import com.adobe.marketing.mobile.Edge;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.adobe.marketing.mobile.EdgeCallback;
import com.adobe.marketing.mobile.EdgeEventHandle;
import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.List;

public class RCTAEPEdgeModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private static final String FAILED_TO_CONVERT_EXPERIENCE_EVENT = "Failed to convert map to Experience Event, Experience Event could be null.";

  public RCTAEPEdgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AEPEdge";
  }

  @ReactMethod
  public void extensionVersion(final Promise promise) {
    promise.resolve(Edge.extensionVersion());
  }

  @ReactMethod
  public void sendEvent(final ReadableMap experienceEventMap,
                        final Promise promise) {
      ExperienceEvent experienceEvent = RCTAEPEdgeDataBridge.experienceEventFromReadableMap(experienceEventMap);
      if (experienceEvent == null) {
          promise.reject(getName(), FAILED_TO_CONVERT_EXPERIENCE_EVENT, new Error(FAILED_TO_CONVERT_EXPERIENCE_EVENT));
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

              for (EdgeEventHandle handle: handles) {
                  arr.pushMap(RCTAEPEdgeDataBridge.mapFromEdgeEventHandle(handle));
              }
              promise.resolve(arr);
          }
      });
  }
}
