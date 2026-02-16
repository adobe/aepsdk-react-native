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
package com.adobe.marketing.mobile.reactnative.optimize;

import android.util.Log;
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.optimize.AdobeCallbackWithOptimizeError;
import com.adobe.marketing.mobile.optimize.AEPOptimizeError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.optimize.DecisionScope;
import com.adobe.marketing.mobile.optimize.Offer;
import com.adobe.marketing.mobile.optimize.OfferType;
import com.adobe.marketing.mobile.optimize.Optimize;
import com.adobe.marketing.mobile.optimize.OptimizeProposition;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Callback;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import androidx.annotation.Nullable;

public class RCTAEPOptimizeModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RCTAEPOptimizeModule";
    private final ReactApplicationContext reactContext;
    // Cache of <Proposition ID, Proposition>
    private final Map<String, OptimizeProposition> propositionCache = new ConcurrentHashMap<>();

    public RCTAEPOptimizeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AEPOptimize";
    }

    @ReactMethod
    public void offerDisplayed(final String offerId, final ReadableMap propositionMap) {
        RCTAEPOptimizeUtil.offerDisplayed(offerId, propositionMap);
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        promise.resolve(Optimize.extensionVersion());
    }

    @ReactMethod
    public void clearCachedPropositions() {
        propositionCache.clear();
        Optimize.clearCachedPropositions();
    }

    @ReactMethod
    public void updatePropositions(final ReadableArray decisionScopesArray, ReadableMap xdm, ReadableMap data, @Nullable final Callback successCallback, @Nullable final Callback errorCallback) {
        Log.d(TAG, "updatePropositions called");
        final List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);

        Map<String, Object> mapXdm = xdm != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(xdm) : Collections.<String, Object>emptyMap();
        Map<String, Object> mapData = data != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(data) : Collections.<String, Object>emptyMap();
        
        Optimize.updatePropositions(decisionScopeList, mapXdm, mapData, new AdobeCallbackWithOptimizeError<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void fail(final AEPOptimizeError adobeError) {
                Log.e(TAG, "updatePropositions callback failed: " );
                if (errorCallback != null) {
                    final WritableMap response = RCTAEPOptimizeUtil.convertAEPOptimizeErrorToWritableMap(adobeError);
                    Log.d(TAG, "Invoking JS errorCallback with error: ");
                    errorCallback.invoke(response);
                }
            }

            @Override
            public void call(final Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                Log.d(TAG, "updatePropositions callback success.");
                if (successCallback != null) {
                    Log.d(TAG, "Invoking JS successCallback with success");
                    successCallback.invoke(RCTAEPOptimizeUtil.createCallbackResponse(decisionScopePropositionMap));
                }
            }
        });
    }

    @ReactMethod
    public void getPropositions(final ReadableArray decisionScopesArray, final Promise promise) {
        final List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);

        Optimize.getPropositions(decisionScopeList, new AdobeCallbackWithError<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void fail(final AdobeError adobeError) {
                promise.reject(String.valueOf(adobeError.getErrorCode()), adobeError.getErrorName());
            }

            @Override
            public void call(final Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                promise.resolve(RCTAEPOptimizeUtil.createCallbackResponse(decisionScopePropositionMap));
            }
        });
    }

    @ReactMethod
    public void multipleOffersDisplayed(final ReadableArray offersArray) {
        RCTAEPOptimizeUtil.multipleOffersDisplayed(offersArray, propositionCache);
    }

    @ReactMethod
    public void multipleOffersGenerateDisplayInteractionXdm(final ReadableArray offersArray, final Promise promise) {
        RCTAEPOptimizeUtil.multipleOffersGenerateDisplayInteractionXdm(offersArray, propositionCache, promise);
    }

    @ReactMethod
    public void onPropositionsUpdate() {
        Optimize.onPropositionsUpdate(new AdobeCallback<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void call(final Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                RCTAEPOptimizeUtil.emitOnPropositionsUpdate(reactContext, decisionScopePropositionMap, false);
            }
        });
    }

    @ReactMethod
    public void offerTapped(final String offerId, final ReadableMap propositionMap) {
        RCTAEPOptimizeUtil.offerTapped(offerId, propositionMap);
    }

    @ReactMethod
    public void generateDisplayInteractionXdm(final String offerId, final ReadableMap propositionMap, final Promise promise) {
        RCTAEPOptimizeUtil.generateDisplayInteractionXdm(offerId, propositionMap, promise);
    }

    @ReactMethod
    public void generateTapInteractionXdm(final String offerId, final ReadableMap propositionMap, final Promise promise) {
        RCTAEPOptimizeUtil.generateTapInteractionXdm(offerId, propositionMap, promise);
    }

    @ReactMethod
    public void generateReferenceXdm(final ReadableMap propositionMap, final Promise promise) {
        RCTAEPOptimizeUtil.generateReferenceXdm(propositionMap, promise);
    }

    // Required for React Native built in EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {}

    // Required for React Native built in EventEmitter Calls.
    @ReactMethod
    public void removeListeners(Integer count) {}

    private static Offer createOffer(Map<String, Object> offerEventData) {
        String id = (String) offerEventData.get("id");
        String type = (String) offerEventData.get("type");
        String content = (String) offerEventData.get("content");
        final Offer.Builder offerBuilder = new Offer.Builder(id, OfferType.from(type), content);
        offerBuilder.setEtag((String) offerEventData.get("etag"));
        offerBuilder.setSchema((String) offerEventData.get("schema"));
        offerBuilder.setLanguage((List<String>) offerEventData.get("language"));
        offerBuilder.setCharacteristics((Map<String, String>) offerEventData.get("characteristics"));
        Offer offer = offerBuilder.build();
        return offer;
    }

}