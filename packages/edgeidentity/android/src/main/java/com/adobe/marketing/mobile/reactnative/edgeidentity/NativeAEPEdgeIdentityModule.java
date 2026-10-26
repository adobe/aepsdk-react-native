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
package com.adobe.marketing.mobile.reactnative.edgeidentity;


import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.edge.identity.Identity;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.facebook.react.bridge.WritableMap;

public final class NativeAEPEdgeIdentityModule extends NativeAEPEdgeIdentitySpec {

    private final ReactApplicationContext reactContext;

    public NativeAEPEdgeIdentityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "NativeAEPEdgeIdentity";
    }

    @Override
    public void extensionVersion(final Promise promise) {
        promise.resolve(Identity.extensionVersion());
    }

    @Override
    public void getExperienceCloudId(final Promise promise) {
        Identity.getExperienceCloudId(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError error) {
                handleError(promise, error, "getExperienceCloudId");
            }

            @Override
            public void call(String s) {
                promise.resolve(s);
            }
        });
    }

    @Override
    public void getIdentities(final Promise promise) {
        Identity.getIdentities(new AdobeCallbackWithError<IdentityMap>() {

            @Override
            public void fail(AdobeError error) {
                handleError(promise, error, "getIdentities");
            }

            @Override
            public void call(IdentityMap map) {
                WritableMap identitymap = RCTAEPEdgeIdentityDataBridge.mapFromIdentityMap(map);
                promise.resolve(identitymap);
            }
        });
    }

    @Override
    public void getUrlVariables(final Promise promise) {
        Identity.getUrlVariables(new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError error) {
                handleError(promise, error, "getUrlVariables");
            }

            @Override
            public void call(String s) {
                promise.resolve(s);
            }
        });
    }

    @Override
    public void updateIdentities(final ReadableMap identitymap) {
        IdentityMap mapobj  = RCTAEPEdgeIdentityDataBridge.mapToIdentityMap(identitymap);
        Identity.updateIdentities(mapobj);
    }

    @Override
    public void removeIdentity(final ReadableMap item, String namespace) {
        IdentityItem itemobj  = RCTAEPEdgeIdentityDataBridge.mapToIdentityItem(item);
        Identity.removeIdentity(itemobj, namespace);
    }

   // Helper method
   private void handleError(final Promise promise, final AdobeError error, final String errorLocation) {
    if (error == null || promise == null) {
      return;
    }
    
    promise.reject(getName(), String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));  
  }
}
