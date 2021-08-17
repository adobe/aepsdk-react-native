/*
 Copyright 2021 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */
package com.adobe.marketing.mobile.reactnative.edge;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.edge;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

public class RCTAEPEdgeModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private static String FAILED_TO_CONVERT_EXPERIENCE_EVENT = "Failed to convert map to Experience Event";

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
  public void sendExperienceEvent(final ReadableMap experienceEventMap,
                                                final Promise promise) {
      Event event = RCTAEPCoreDataBridge.eventFromReadableMap(eventMap);
      if (event == null) {
          promise.reject(getName(), FAILED_TO_CONVERT_EVENT_MESSAGE, new Error(FAILED_TO_CONVERT_EVENT_MESSAGE));
          return;
      }

      EdgeCallback<Event> eventAdobeCallback = new AdobeCallback<Event>() {
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

      Edge.sendEvent(experienceEvent, new EdgeCallback callback){

      }   
  }

}
