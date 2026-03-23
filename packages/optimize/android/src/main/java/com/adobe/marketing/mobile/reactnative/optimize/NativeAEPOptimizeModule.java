/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Turbo Native Module implementation per https://reactnative.dev/docs/turbo-native-modules-introduction
 * Extends the spec base (NativeAEPOptimizeSpec); does not extend or reference RCTAEPOptimizeModule.
 */

package com.adobe.marketing.mobile.reactnative.optimize;

import android.util.Log;

import androidx.annotation.Nullable;

import com.adobe.marketing.mobile.reactnative.optimize.BuildConfig;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.optimize.AdobeCallbackWithOptimizeError;
import com.adobe.marketing.mobile.optimize.AEPOptimizeError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.optimize.DecisionScope;
import com.adobe.marketing.mobile.optimize.Optimize;
import com.adobe.marketing.mobile.optimize.OptimizeProposition;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Turbo Native Module implementation. Extends the spec base per RN doc;
 * invoked when USE_INTEROP_ROOT is false.
 */
public class NativeAEPOptimizeModule extends NativeAEPOptimizeSpec {

    public static final String NAME = "NativeAEPOptimize";

    private static final String TAG = "NativeAEPOptimizeModule";

    private final Map<String, OptimizeProposition> propositionCache = new ConcurrentHashMap<>();

    public NativeAEPOptimizeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void invalidate() {
        propositionCache.clear();
    }

    // ---------- Spec: extensionVersion ----------

    @Override
    public void extensionVersion(Promise promise) {
        String version = Optimize.extensionVersion();
        Log.d(TAG, "extensionVersion called: module=" + NAME + ", USE_INTEROP_ROOT=" + BuildConfig.USE_INTEROP_ROOT + ", version=" + version);
        promise.resolve(version);
    }

    // ---------- Spec: clearCachedPropositions ----------

    @Override
    public void clearCachedPropositions() {
        propositionCache.clear();
        Optimize.clearCachedPropositions();
    }

    // ---------- Spec: getPropositions ----------

    @Override
    public void getPropositions(ReadableArray decisionScopesArray, Promise promise) {
        List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);
        Optimize.getPropositions(decisionScopeList, new AdobeCallbackWithError<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void fail(AdobeError adobeError) {
                promise.reject(String.valueOf(adobeError.getErrorCode()), adobeError.getErrorName());
            }

            @Override
            public void call(Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                promise.resolve(RCTAEPOptimizeUtil.createCallbackResponse(decisionScopePropositionMap));
            }
        });
    }

    // ---------- Spec: updatePropositions ----------

    @Override
    public void updatePropositions(
            ReadableArray decisionScopesArray,
            @Nullable ReadableMap xdm,
            @Nullable ReadableMap data,
            @Nullable Callback successCallback,
            @Nullable Callback errorCallback) {
        Log.d(TAG, "updatePropositions called");
        List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);
        Map<String, Object> mapXdm = xdm != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(xdm) : Collections.<String, Object>emptyMap();
        Map<String, Object> mapData = data != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(data) : Collections.<String, Object>emptyMap();

        Optimize.updatePropositions(decisionScopeList, mapXdm, mapData, new AdobeCallbackWithOptimizeError<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void fail(AEPOptimizeError adobeError) {
                Log.e(TAG, "updatePropositions callback failed");
                if (errorCallback != null) {
                    WritableMap response = RCTAEPOptimizeUtil.convertAEPOptimizeErrorToWritableMap(adobeError);
                    errorCallback.invoke(response);
                }
            }

            @Override
            public void call(Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                Log.d(TAG, "updatePropositions callback success.");
                if (successCallback != null) {
                    successCallback.invoke(RCTAEPOptimizeUtil.createCallbackResponse(decisionScopePropositionMap));
                }
            }
        });
    }

    // ---------- Spec: onPropositionsUpdate ----------

    @Override
    public void onPropositionsUpdate() {
        Optimize.onPropositionsUpdate(new AdobeCallback<Map<DecisionScope, OptimizeProposition>>() {
            @Override
            public void call(Map<DecisionScope, OptimizeProposition> decisionScopePropositionMap) {
                RCTAEPOptimizeUtil.cachePropositionOffers(decisionScopePropositionMap, propositionCache);
                RCTAEPOptimizeUtil.emitOnPropositionsUpdate(getReactApplicationContext(), decisionScopePropositionMap, true);
            }
        });
    }

    // ---------- Spec: multipleOffersDisplayed ----------

    @Override
    public void multipleOffersDisplayed(ReadableArray offersArray) {
        RCTAEPOptimizeUtil.multipleOffersDisplayed(offersArray, propositionCache);
    }

    // ---------- Spec: multipleOffersGenerateDisplayInteractionXdm ----------

    @Override
    public void multipleOffersGenerateDisplayInteractionXdm(ReadableArray offersArray, Promise promise) {
        RCTAEPOptimizeUtil.multipleOffersGenerateDisplayInteractionXdm(offersArray, propositionCache, promise);
    }

    // ---------- Spec: offerDisplayed ----------

    @Override
    public void offerDisplayed(String offerId, ReadableMap propositionMap) {
        RCTAEPOptimizeUtil.offerDisplayed(offerId, propositionMap);
    }

    // ---------- Spec: offerTapped ----------

    @Override
    public void offerTapped(String offerId, ReadableMap propositionMap) {
        RCTAEPOptimizeUtil.offerTapped(offerId, propositionMap);
    }

    // ---------- Spec: generateDisplayInteractionXdm ----------

    @Override
    public void generateDisplayInteractionXdm(String offerId, ReadableMap propositionMap, Promise promise) {
        RCTAEPOptimizeUtil.generateDisplayInteractionXdm(offerId, propositionMap, promise);
    }

    // ---------- Spec: generateTapInteractionXdm ----------

    @Override
    public void generateTapInteractionXdm(String offerId, ReadableMap propositionMap, Promise promise) {
        RCTAEPOptimizeUtil.generateTapInteractionXdm(offerId, propositionMap, promise);
    }

    // ---------- Spec: generateReferenceXdm ----------

    @Override
    public void generateReferenceXdm(ReadableMap propositionMap, Promise promise) {
        RCTAEPOptimizeUtil.generateReferenceXdm(propositionMap, promise);
    }

    // ---------- Spec: addListener / removeListeners (EventEmitter) ----------

    @Override
    public void addListener(String eventName) {
        // Required for React Native EventEmitter
    }

    @Override
    public void removeListeners(double count) {
        // Required for React Native EventEmitter (codegen uses double for number)
    }

}
