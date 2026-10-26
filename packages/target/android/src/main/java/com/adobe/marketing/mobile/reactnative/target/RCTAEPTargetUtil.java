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
package com.adobe.marketing.mobile.reactnative.target;

import android.net.Uri;
import android.util.Log;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Target;
import com.adobe.marketing.mobile.target.TargetParameters;
import com.adobe.marketing.mobile.target.TargetPrefetch;
import com.adobe.marketing.mobile.target.TargetRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.Map;

/**
 * Logic shared by the legacy bridge module ({@link RCTAEPTargetModule}) and the
 * Turbo Native Module ({@link NativeAEPTargetModule}), so both behave identically.
 */
final class RCTAEPTargetUtil {

  private static final String REQUEST_ID_KEY = "id";

  private RCTAEPTargetUtil() {}

  static void extensionVersion(final Promise promise) {
    promise.resolve(Target.extensionVersion());
  }

  static void clearPrefetchCache() {
    Target.clearPrefetchCache();
  }

  static void getSessionId(final Promise promise) {
    Target.getSessionId(resolveWith(promise));
  }

  static void getThirdPartyId(final Promise promise) {
    Target.getThirdPartyId(resolveWith(promise));
  }

  static void getTntId(final Promise promise) {
    Target.getTntId(resolveWith(promise));
  }

  static void setSessionId(final String sessionId) {
    Target.setSessionId(sessionId);
  }

  static void setTntId(final String tntId) {
    Target.setTntId(tntId);
  }

  static void setThirdPartyId(final String thirdPartyId) {
    Target.setThirdPartyId(thirdPartyId);
  }

  static void resetExperience() {
    Target.resetExperience();
  }

  static void setPreviewRestartDeeplink(final String deepLinkString, final String moduleName) {
    Uri deepLink = null;
    try {
      deepLink = Uri.parse(deepLinkString);
    } catch (Exception e) {
      e.printStackTrace();
    }

    if (deepLink != null) {
      Target.setPreviewRestartDeepLink(deepLink);
    } else {
      Log.d(moduleName, "Deep link URI cannot be null");
    }
  }

  static void retrieveLocationContent(final ReadableArray targetRequestList, final ReadableMap parameters,
                                      final Map<String, TargetRequest> registeredTargetRequests) {
    ArrayList<TargetRequest> requestList = new ArrayList<>();
    for (int i = 0; i < targetRequestList.size(); i++) {
      String identifier = targetRequestList.getMap(i).getString(REQUEST_ID_KEY);

      if (registeredTargetRequests.containsKey(identifier)) {
        requestList.add(registeredTargetRequests.get(identifier));
      }
    }

    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.retrieveLocationContent(requestList, parametersObj);
  }

  static void displayedLocations(final ReadableArray mboxNames, final ReadableMap parameters) {
    ArrayList<String> mboxNamesList = new ArrayList<>();
    for (int i = 0; i < mboxNames.size(); i++) {
      mboxNamesList.add(mboxNames.getString(i));
    }

    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.displayedLocations(mboxNamesList, parametersObj);
  }

  static void clickedLocation(final String mboxName, final ReadableMap parameters) {
    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.clickedLocation(mboxName, parametersObj);
  }

  static void prefetchContent(final ReadableArray mboxPrefetchList, final ReadableMap parameters,
                              final Promise promise) {
    ArrayList<TargetPrefetch> prefetchList = new ArrayList<>();
    for (int i = 0; i < mboxPrefetchList.size(); i++) {
      TargetPrefetch prefetch = RCTAEPTargetDataBridge.mapToPrefetch(mboxPrefetchList.getMap(i));
      prefetchList.add(prefetch);
    }

    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.prefetchContent(prefetchList, parametersObj, resolveWith(promise));
  }

  static void registerTargetRequests(final ReadableMap requestMap, final Callback successCallback,
                                     final Map<String, TargetRequest> registeredTargetRequests) {
    TargetRequest request = RCTAEPTargetDataBridge.mapToRequest(requestMap, successCallback);
    registeredTargetRequests.put(requestMap.getString(REQUEST_ID_KEY), request);
  }

  private static AdobeCallback<String> resolveWith(final Promise promise) {
    return new AdobeCallback<String>() {
      @Override
      public void call(String value) {
        promise.resolve(value);
      }
    };
  }
}
