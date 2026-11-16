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

import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.edge.identity.Identity;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Single implementation behind both {@code RCTAEPEdgeIdentityModule} (legacy bridge) and
 * {@code NativeAEPEdgeIdentityModule} (TurboModule). Both modules only adapt signatures and delegate here.
 */
final class RCTAEPEdgeIdentityUtil {
  private RCTAEPEdgeIdentityUtil() {}

  static void extensionVersion(final Promise promise) {
    promise.resolve(Identity.extensionVersion());
  }

  static void getExperienceCloudId(final Promise promise, final String moduleName) {
    Identity.getExperienceCloudId(new AdobeCallbackWithError<String>() {
      @Override
      public void fail(AdobeError error) {
        handleError(promise, error, "getExperienceCloudId", moduleName);
      }

      @Override
      public void call(String s) {
        promise.resolve(s);
      }
    });
  }

  static void getIdentities(final Promise promise, final String moduleName) {
    Identity.getIdentities(new AdobeCallbackWithError<IdentityMap>() {
      @Override
      public void fail(AdobeError error) {
        handleError(promise, error, "getIdentities", moduleName);
      }

      @Override
      public void call(IdentityMap map) {
        WritableMap identitymap = RCTAEPEdgeIdentityDataBridge.mapFromIdentityMap(map);
        promise.resolve(identitymap);
      }
    });
  }

  static void getUrlVariables(final Promise promise, final String moduleName) {
    Identity.getUrlVariables(new AdobeCallbackWithError<String>() {
      @Override
      public void fail(AdobeError error) {
        handleError(promise, error, "getUrlVariables", moduleName);
      }

      @Override
      public void call(String s) {
        promise.resolve(s);
      }
    });
  }

  static void updateIdentities(final ReadableMap identitymap) {
    IdentityMap mapobj = RCTAEPEdgeIdentityDataBridge.mapToIdentityMap(identitymap);
    Identity.updateIdentities(mapobj);
  }

  static void removeIdentity(final ReadableMap item, final String namespace) {
    IdentityItem itemobj = RCTAEPEdgeIdentityDataBridge.mapToIdentityItem(item);
    Identity.removeIdentity(itemobj, namespace);
  }

  private static void handleError(final Promise promise, final AdobeError error, final String errorLocation, final String moduleName) {
    if (error == null || promise == null) {
      return;
    }

    promise.reject(moduleName, String.format("%s returned an unexpected error: %s", errorLocation, error.getErrorName()), new Error(error.getErrorName()));
  }
}
