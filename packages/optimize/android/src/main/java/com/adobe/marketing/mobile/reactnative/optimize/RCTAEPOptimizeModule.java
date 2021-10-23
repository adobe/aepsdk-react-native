/*
 Copyright 2021 Adobe. All rights reserved.
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RCTAEPOptimizeModule extends ReactContextBaseJavaModule {

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
    public void extensionVersion(final Promise promise) {
        promise.resolve(Optimize.extensionVersion());
    }

    @ReactMethod
    public void clearCachedPropositions() {
        Optimize.clearCachedPropositions();
    }

    @ReactMethod
    public void updatePropositions(final ReadableArray decisionScopesArray, ReadableMap xdm, ReadableMap data) {
        final List<DecisionScope> decisionScopeList = new ArrayList<>();

        for (int i = 0; i < decisionScopesArray.size(); i++) {
            decisionScopeList.add(new DecisionScope(decisionScopesArray.getString(i)));
        }

        Map<String, Object> mapXdm = RCTAEPOptimizeUtil.convertReadableMapToMap(xdm);
        Map<String, Object> mapData = RCTAEPOptimizeUtil.convertReadableMapToMap(data);
        Optimize.updatePropositions(decisionScopeList, mapXdm, mapData);
    }

    @ReactMethod
    public void getPropositions(final ReadableArray decisionScopesArray, final Promise promise) {
        final List<DecisionScope> decisionScopeList = new ArrayList<>();

        for (int i = 0; i < decisionScopesArray.size(); i++) {
            decisionScopeList.add(new DecisionScope(decisionScopesArray.getString(i)));
        }

        Optimize.getPropositions(decisionScopeList, new AdobeCallbackWithError<Map<DecisionScope, Proposition>>() {
            @Override
            public void fail(AdobeError adobeError) {
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
    public void offerDisplayed(final ReadableMap readableMap) {
        final Map<String, Object> offerEventData = RCTAEPOptimizeUtil.convertReadableMapToMap(readableMap);
        Offer offer = createOffer(offerEventData);
        offer.displayed();
    }

    @ReactMethod
    public void offerTapped(final ReadableMap readableMap) {
        final Map<String, Object> offerEventData = RCTAEPOptimizeUtil.convertReadableMapToMap(readableMap);
        Offer offer = createOffer(offerEventData);
        offer.tapped();
    }

    @ReactMethod
    public void generateDisplayInteractionXdm(final ReadableMap readableMap, final Promise promise){
        final Map<String, Object> offerEventData = RCTAEPOptimizeUtil.convertReadableMapToMap(readableMap);
        Offer offer = createOffer(offerEventData);
        final Map<String, Object> interactionXdm = offer.generateDisplayInteractionXdm();
        final WritableMap writableMap = RCTAEPOptimizeUtil.convertMapToWritableMap(interactionXdm);
        promise.resolve(writableMap);
    }

    @ReactMethod
    public void generateReferenceXdm(final ReadableMap readableMap, final Promise promise) {
        final Map<String, Object> propositionEventData = RCTAEPOptimizeUtil.convertReadableMapToMap(readableMap);
        String id = (String) propositionEventData.get("id");
        String scope = (String) propositionEventData.get("scope");
        Map<String, Object> scopeDetails = (Map<String, Object>) propositionEventData.get("scopeDetails");
        List<Map<String, Object>> offersMap = (List<Map<String, Object>>) propositionEventData.get("offers");
        List<Offer> offers = new ArrayList<>();
        for (Map<String, Object> eventData : offersMap) {
            offers.add(createOffer(eventData));
        }
//        Proposition proposition = new Proposition(id, offers, scope, scopeDetails);
//        Map<String, Object> referenceXdm = proposition.generateReferenceXdm();

    }

    private static Offer createOffer(Map<String, Object> offerEventData) {
        String id = (String) offerEventData.get("id");
        String type = (String) offerEventData.get("type");
        String content = (String) offerEventData.get("content");
        final Offer.Builder offerBuilder = new Offer.Builder(id, OfferType.valueOf(type), content);
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