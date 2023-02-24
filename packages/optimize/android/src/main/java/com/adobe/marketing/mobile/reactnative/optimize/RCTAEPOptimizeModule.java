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

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.AdobeCallbackWithError;
import com.adobe.marketing.mobile.AdobeError;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.optimize.DecisionScope;
import com.adobe.marketing.mobile.optimize.Offer;
import com.adobe.marketing.mobile.optimize.OfferType;
import com.adobe.marketing.mobile.optimize.Optimize;
import com.adobe.marketing.mobile.optimize.Proposition;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class RCTAEPOptimizeModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RCTAEPOptimizeModule";
    private final ReactApplicationContext reactContext;

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
        final Map<String, Object> eventData = RCTAEPOptimizeUtil.convertReadableMapToMap(propositionMap);
        final Proposition proposition = Proposition.fromEventData(eventData);
        MobileCore.log(LoggingMode.VERBOSE, TAG, "OFFER Displayed");
        for (Offer offer : proposition.getOffers()) {
            if (offer.getId().equalsIgnoreCase(offerId)) {
                offer.displayed();
                break;
            }
        }
    }

    @ReactMethod
    public void extensionVersion(final Promise promise) {
        promise.resolve(Optimize.extensionVersion());
    }

    @ReactMethod
    public void clearCachedPropositions() {
        Optimize.clearCachedPropositions();
    }

    @ReactMethod
    public void updatePropositions(final ReadableArray decisionScopesArray, ReadableMap xdm, ReadableMap data) {
        final List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);

        Map<String, Object> mapXdm = xdm != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(xdm) : Collections.<String, Object>emptyMap();
        Map<String, Object> mapData = data != null ? RCTAEPOptimizeUtil.convertReadableMapToMap(data) : Collections.<String, Object>emptyMap();
        Optimize.updatePropositions(decisionScopeList, mapXdm, mapData);
    }

    @ReactMethod
    public void getPropositions(final ReadableArray decisionScopesArray, final Promise promise) {
        final List<DecisionScope> decisionScopeList = RCTAEPOptimizeUtil.createDecisionScopes(decisionScopesArray);

        Optimize.getPropositions(decisionScopeList, new AdobeCallbackWithError<Map<DecisionScope, Proposition>>() {
            @Override
            public void fail(final AdobeError adobeError) {
                promise.reject(String.valueOf(adobeError.getErrorCode()), adobeError.getErrorName());
            }

            @Override
            public void call(final Map<DecisionScope, Proposition> decisionScopePropositionMap) {
                final WritableMap writableMap = new WritableNativeMap();
                for (final Map.Entry<DecisionScope, Proposition> entry : decisionScopePropositionMap.entrySet()) {
                    writableMap.putMap(entry.getKey().getName(), RCTAEPOptimizeUtil.convertPropositionToWritableMap(entry.getValue()));
                }
                promise.resolve(writableMap);
            }
        });
    }

    @ReactMethod
    public void onPropositionsUpdate() {
        Optimize.onPropositionsUpdate(new AdobeCallback<Map<DecisionScope, Proposition>>() {
            @Override
            public void call(final Map<DecisionScope, Proposition> decisionScopePropositionMap) {
                sendUpdatedPropositionsEvent(decisionScopePropositionMap);
            }
        });
    }

    @ReactMethod
    public void offerTapped(final String offerId, final ReadableMap propositionMap) {
        final Map<String, Object> eventData = RCTAEPOptimizeUtil.convertReadableMapToMap(propositionMap);
        final Proposition proposition = Proposition.fromEventData(eventData);
        MobileCore.log(LoggingMode.VERBOSE, TAG, "OFFER TAPPED");
        for (Offer offer : proposition.getOffers()) {
            if (offer.getId().equalsIgnoreCase(offerId)) {
                offer.tapped();
                break;
            }
        }
    }

    @ReactMethod
    public void generateDisplayInteractionXdm(final String offerId, final ReadableMap propositionMap, final Promise promise) {
        final Map<String, Object> eventData = RCTAEPOptimizeUtil.convertReadableMapToMap(propositionMap);
        final Proposition proposition = Proposition.fromEventData(eventData);
        MobileCore.log(LoggingMode.VERBOSE, TAG, "generateDisplayInteractionXdm");
        Offer offerDisplayed = null;
        for (Offer offer : proposition.getOffers()) {
            if (offer.getId().equalsIgnoreCase(offerId)) {
                offerDisplayed = offer;
                break;
            }
        }

        if (offerDisplayed != null) {
            final Map<String, Object> interactionXdm = offerDisplayed.generateDisplayInteractionXdm();
            final WritableMap writableMap = RCTAEPOptimizeUtil.convertMapToWritableMap(interactionXdm);
            promise.resolve(writableMap);
        } else {
            promise.reject("generateDisplayInteractionXdm", "Error in generating Display interaction XDM for offer with id: " + offerId);
        }
    }

    @ReactMethod
    public void generateTapInteractionXdm(final String offerId, final ReadableMap propositionMap, final Promise promise) {
        final Map<String, Object> eventData = RCTAEPOptimizeUtil.convertReadableMapToMap(propositionMap);
        final Proposition proposition = Proposition.fromEventData(eventData);
        MobileCore.log(LoggingMode.VERBOSE, TAG, "generateTapInteractionXdm");
        Offer offerTapped = null;
        for (Offer offer : proposition.getOffers()) {
            if (offer.getId().equalsIgnoreCase(offerId)) {
                offerTapped = offer;
                break;
            }
        }

        if (offerTapped != null) {
            final Map<String, Object> interactionXdm = offerTapped.generateTapInteractionXdm();
            final WritableMap writableMap = RCTAEPOptimizeUtil.convertMapToWritableMap(interactionXdm);
            promise.resolve(writableMap);
        } else {
            promise.reject("generateTapInteractionXdm", "Error in generating Tap interaction XDM for offer with id: " + offerId);
        }
    }

    @ReactMethod
    public void generateReferenceXdm(final ReadableMap propositionMap, final Promise promise) {
        final Map<String, Object> propositionEventData = RCTAEPOptimizeUtil.convertReadableMapToMap(propositionMap);
        final Proposition proposition = Proposition.fromEventData(propositionEventData);
        if (proposition != null) {
            Map<String, Object> referenceXdm = proposition.generateReferenceXdm();
            final WritableMap writableMap = RCTAEPOptimizeUtil.convertMapToWritableMap(referenceXdm);
            promise.resolve(writableMap);
        } else {
            promise.reject("generateReferenceXdm", "Error in generating Reference XDM.");
        }
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

    private void sendUpdatedPropositionsEvent(final Map<DecisionScope, Proposition> decisionScopePropositionMap) {
        final WritableMap writableMap = new WritableNativeMap();
        for (final Map.Entry<DecisionScope, Proposition> entry : decisionScopePropositionMap.entrySet()) {
            writableMap.putMap(entry.getKey().getName(), RCTAEPOptimizeUtil.convertPropositionToWritableMap(entry.getValue()));
        }
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onPropositionsUpdate", writableMap);
    }
}