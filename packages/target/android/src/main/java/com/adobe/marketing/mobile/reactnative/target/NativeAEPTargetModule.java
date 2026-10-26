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

import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Target;
import com.adobe.marketing.mobile.target.TargetParameters;
import com.adobe.marketing.mobile.target.TargetPrefetch;
import com.adobe.marketing.mobile.target.TargetRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Turbo Native Module implementation. Extends the Codegen spec base; used when
 * USE_INTEROP_ROOT is false. Behavior mirrors RCTAEPTargetModule (the legacy bridge module).
 */
public final class NativeAEPTargetModule extends NativeAEPTargetSpec {

  private final String REQUEST_ID_KEY = "id";

  private final HashMap<String, TargetRequest> registeredTargetRequests = new HashMap<>();

  public NativeAEPTargetModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NativeAEPTarget";
  }

  @Override
  public void extensionVersion(final Promise promise) {
    promise.resolve(Target.extensionVersion());
  }

  @Override
  public void clearPrefetchCache() {
    Target.clearPrefetchCache();
  }

  @Override
  public void getSessionId(final Promise promise) {
    Target.getSessionId(new AdobeCallback<String>() {
      @Override
      public void call(String sessionId) {
        promise.resolve(sessionId);
      }
    });
  }

  @Override
  public void getThirdPartyId(final Promise promise) {
    Target.getThirdPartyId(new AdobeCallback<String>() {
      @Override
      public void call(String thirdPartyId) {
        promise.resolve(thirdPartyId);
      }
    });
  }

  @Override
  public void getTntId(final Promise promise) {
    Target.getTntId(new AdobeCallback<String>() {
      @Override
      public void call(String tntId) {
        promise.resolve(tntId);
      }
    });
  }

  @Override
  public void setSessionId(final String sessionId) {
    Target.setSessionId(sessionId);
  }

  @Override
  public void setTntId(final String tntId) {
    Target.setTntId(tntId);
  }

  @Override
  public void setThirdPartyId(final String thirdPartyId) {
    Target.setThirdPartyId(thirdPartyId);
  }

  @Override
  public void resetExperience() {
    Target.resetExperience();
  }

  @Override
  public void setPreviewRestartDeeplink(final String deepLinkString) {
    Uri deepLink = null;
    try {
      deepLink = Uri.parse(deepLinkString);
    } catch (Exception e) {
      e.printStackTrace();
    }

    if (deepLink != null) {
      Target.setPreviewRestartDeepLink(deepLink);
    } else {
      Log.d(getName(), "Deep link URI cannot be null");
    }
  }

  @Override
  public void retrieveLocationContent(ReadableArray targetRequestList, @Nullable ReadableMap parameters) {
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

  @Override
  public void displayedLocations(ReadableArray mboxNames, @Nullable ReadableMap parameters) {
    ArrayList<String> mboxNamesList = new ArrayList<>();
    for (int i = 0; i < mboxNames.size(); i++) {
      mboxNamesList.add(mboxNames.getString(i));
    }

    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.displayedLocations(mboxNamesList, parametersObj);
  }

  @Override
  public void clickedLocation(String mboxName, @Nullable ReadableMap parameters) {
    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.clickedLocation(mboxName, parametersObj);
  }

  @Override
  public void prefetchContent(ReadableArray mboxPrefetchList, @Nullable ReadableMap parameters, final Promise promise) {
    ArrayList<TargetPrefetch> prefetchList = new ArrayList<>();
    for (int i = 0; i < mboxPrefetchList.size(); i++) {
      TargetPrefetch prefetch = RCTAEPTargetDataBridge.mapToPrefetch(mboxPrefetchList.getMap(i));
      prefetchList.add(prefetch);
    }

    TargetParameters parametersObj = RCTAEPTargetDataBridge.mapToParameters(parameters);

    Target.prefetchContent(prefetchList, parametersObj, new AdobeCallback<String>() {
      @Override
      public void call(String s) {
        promise.resolve(s);
      }
    });
  }

  @Override
  public void registerTargetRequests(ReadableMap requestMap, Callback successCallback) {
    TargetRequest request = RCTAEPTargetDataBridge.mapToRequest(requestMap, successCallback);
    registeredTargetRequests.put(requestMap.getString(REQUEST_ID_KEY), request);
  }
}
