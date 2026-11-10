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
package com.adobe.marketing.mobile.reactnative.assurance;

import com.adobe.marketing.mobile.Assurance;
import com.facebook.react.bridge.Promise;

/** Shared logic used by both the legacy and the TurboModule implementations. */
final class RCTAEPAssuranceUtil {

    private RCTAEPAssuranceUtil() {}

    static void extensionVersion(final Promise promise) {
        promise.resolve(Assurance.extensionVersion());
    }

    static void startSession(final String url) {
        if (url != null && !url.isEmpty()) {
            Assurance.startSession(url);
        } else {
            // No url: start the Quick Connect flow (debuggable builds only).
            Assurance.startSession();
        }
    }
}
