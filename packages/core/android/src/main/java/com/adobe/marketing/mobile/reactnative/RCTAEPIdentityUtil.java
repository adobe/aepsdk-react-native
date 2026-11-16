/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
package com.adobe.marketing.mobile.reactnative;

import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.Identity;
import com.adobe.marketing.mobile.VisitorID;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.List;

/**
 * Logic shared by the legacy bridge module ({@link RCTAEPIdentityModule}) and the
 * Turbo Native Module ({@link NativeAEPIdentityModule}), so both behave identically.
 */
final class RCTAEPIdentityUtil {

    private RCTAEPIdentityUtil() {}

    static void extensionVersion(final Promise promise) {
        promise.resolve(Identity.extensionVersion());
    }

    static void syncIdentifiers(final ReadableMap identifiers) {
        Identity.syncIdentifiers(RCTAEPMapUtil.toStringMap(identifiers));
    }

    static void syncIdentifiersWithAuthState(final ReadableMap identifiers, final String authenticationState) {
        VisitorID.AuthenticationState authState = RCTAEPIdentityDataBridge.authenticationStateFromString(authenticationState);
        Identity.syncIdentifiers(RCTAEPMapUtil.toStringMap(identifiers), authState);
    }

    static void syncIdentifier(final String identifierType, final String identifier, final String authenticationState) {
        VisitorID.AuthenticationState authState = RCTAEPIdentityDataBridge.authenticationStateFromString(authenticationState);
        Identity.syncIdentifier(identifierType, identifier, authState);
    }

    static void appendVisitorInfoForURL(final String baseURL, final Promise promise, final String moduleName) {
        Identity.appendVisitorInfoForURL(baseURL, stringCallback(promise, "appendVisitorInfoForURL", moduleName));
    }

    static void getUrlVariables(final Promise promise, final String moduleName) {
        Identity.getUrlVariables(stringCallback(promise, "getUrlVariables", moduleName));
    }

    static void getExperienceCloudId(final Promise promise, final String moduleName) {
        Identity.getExperienceCloudId(stringCallback(promise, "getExperienceCloudId", moduleName));
    }

    static void getIdentifiers(final Promise promise, final String moduleName) {
        Identity.getIdentifiers(new AdobeCallbackWithError<List<VisitorID>>() {
            @Override
            public void fail(AdobeError adobeError) {
                RCTAEPCoreUtil.handleError(promise, adobeError, "getIdentifiers", moduleName);
            }

            @Override
            public void call(List<VisitorID> visitorIDS) {
                WritableArray arr = new WritableNativeArray();
                if (visitorIDS != null) {
                    for (VisitorID vid : visitorIDS) {
                        arr.pushMap(RCTAEPIdentityDataBridge.mapFromVisitorIdentifier(vid));
                    }
                }
                promise.resolve(arr);
            }
        });
    }

    private static AdobeCallbackWithError<String> stringCallback(final Promise promise,
                                                                 final String errorLocation,
                                                                 final String moduleName) {
        return new AdobeCallbackWithError<String>() {
            @Override
            public void fail(AdobeError adobeError) {
                RCTAEPCoreUtil.handleError(promise, adobeError, errorLocation, moduleName);
            }

            @Override
            public void call(String value) {
                promise.resolve(value);
            }
        };
    }
}
