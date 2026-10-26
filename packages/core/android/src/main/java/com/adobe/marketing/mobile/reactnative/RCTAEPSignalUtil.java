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

import com.adobe.marketing.mobile.Signal;
import com.facebook.react.bridge.Promise;

/**
 * Logic shared by the legacy bridge module ({@link RCTAEPSignalModule}) and the
 * Turbo Native Module ({@link NativeAEPSignalModule}).
 */
final class RCTAEPSignalUtil {

    private RCTAEPSignalUtil() {}

    static void extensionVersion(final Promise promise) {
        promise.resolve(Signal.extensionVersion());
    }
}
