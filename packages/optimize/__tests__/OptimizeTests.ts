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

import { NativeModules } from 'react-native';
import { Optimize, Proposition, DecisionScope, Offer } from '../src';
import offerJson from './offer.json';
import propositionJson from './proposition.json';

describe('Optimize', () => {
  it('AEPOptimize extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'extensionVersion');
    await Optimize.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('AEPOptimize onPropositionUpdate is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'onPropositionsUpdate');
    let adobeCallback = {
      call(_: Map<string, Proposition>): void {}
    };

    await Optimize.onPropositionUpdate(adobeCallback);
    expect(spy).toHaveBeenCalled();
  });

  it('AEPOptimize clearCachedProposition is called', async () => {
    const spy = jest.spyOn(
      NativeModules.AEPOptimize,
      'clearCachedPropositions'
    );
    await Optimize.clearCachedPropositions();
    expect(spy).toHaveBeenCalledWith();
  });

  it('AEPOptimize getPropositions is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'getPropositions');
    let decisionScopes = [new DecisionScope('abcdef')];
    await Optimize.getPropositions(decisionScopes);
    expect(spy).toHaveBeenCalledWith(
      decisionScopes.map((decisionScope) => decisionScope.getName())
    );
  });

  it('AEPOptimize updateProposition is called', async () => {
    let spy = jest.spyOn(NativeModules.AEPOptimize, "updatePropositions");
    let decisionScopes = [new DecisionScope("abcdef")];
    let xdm = new Map();
    let data = new Map();
    await Optimize.updatePropositions(decisionScopes, xdm, data);
    expect(spy).toHaveBeenCalledWith(
      decisionScopes.map((decisionScope) => decisionScope.getName()),
      xdm,
      data,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('AEPOptimize updateProposition is called with callback', async () => {
    let spy = jest.spyOn(NativeModules.AEPOptimize, "updatePropositions");
    let decisionScopes = [new DecisionScope("abcdef")];
    let xdm = new Map();
    let data = new Map();
    const callback = (_propositions: Map<string, Proposition>) => {};
    await Optimize.updatePropositions(decisionScopes, xdm, data, callback as any, undefined);
    expect(spy).toHaveBeenCalledWith(
      decisionScopes.map((decisionScope) => decisionScope.getName()),
      xdm,
      data,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('AEPOptimize updateProposition callback handles successful response', async () => {
    const mockResponse = new Map<string, Proposition>();
    mockResponse.set('scope1', new Proposition(propositionJson as any));
    // Mock the native method to call the callback with mock data
    const mockMethod = jest.fn().mockImplementation((...args: any[]) => {
      const callback = args[3];
      if (typeof callback === 'function') {
        callback(mockResponse);
      }
    });
    NativeModules.AEPOptimize.updatePropositions = mockMethod;
    let decisionScopes = [new DecisionScope("abcdef")];
    let callbackResponse: Map<string, Proposition> | null = null;
    const callback = (propositions: Map<string, Proposition>) => {
      callbackResponse = propositions;
    };
    await Optimize.updatePropositions(decisionScopes, undefined, undefined, callback as any, undefined);
    expect(callbackResponse).not.toBeNull();
    expect(callbackResponse!.get('scope1')).toBeInstanceOf(Proposition);
  });

  it('AEPOptimize updateProposition callback handles error response', async () => {
    // For error, the callback may not be called, or may be called with an empty map or undefined. We'll simulate an empty map.
    const mockErrorResponse = new Error('Test error');
    // Mock the native method to call the callback with error data
    const mockMethod = jest.fn().mockImplementation((...args: any[]) => {
      const onError = args[4];
      if (typeof onError === 'function') {
        onError(mockErrorResponse);
      }
    });
    NativeModules.AEPOptimize.updatePropositions = mockMethod;
    let decisionScopes = [new DecisionScope("abcdef")];
    let callbackResponse: any = null;
    const onError = (error: any) => {
      callbackResponse = error;
    };
    await Optimize.updatePropositions(decisionScopes, undefined, undefined, undefined, onError as any);
    expect(callbackResponse).not.toBeNull();
    expect(callbackResponse!.message).toBe('Test error');
  });

  it('AEPOptimize updateProposition calls both success and error callbacks', async () => {
    const mockSuccessResponse = new Map<string, Proposition>();
    mockSuccessResponse.set('scope1', new Proposition(propositionJson as any));
    const mockError = { message: 'Test error', code: 500 };

    // Mock the native method to call both callbacks
    const mockMethod = jest.fn().mockImplementation((...args: any[]) => {
      const onSuccess = args[3];
      const onError = args[4];
      if (typeof onSuccess === 'function') {
        onSuccess(mockSuccessResponse);
      }
      if (typeof onError === 'function') {
        onError(mockError);
      }
    });
    NativeModules.AEPOptimize.updatePropositions = mockMethod;

    let successCalled = false;
    let errorCalled = false;
    let successResponse: Map<string, Proposition> | null = null;
    let errorResponse: any = null;

    const onSuccess = (propositions: Map<string, Proposition>) => {
      successCalled = true;
      successResponse = propositions;
    };
    const onError = (error: any) => {
      errorCalled = true;
      errorResponse = error;
    };

    let decisionScopes = [new DecisionScope("abcdef")];
    await Optimize.updatePropositions(decisionScopes, undefined, undefined, onSuccess as any, onError as any);

    expect(successCalled).toBe(true);
    expect(errorCalled).toBe(true);
    expect(successResponse).not.toBeNull();
    expect(successResponse!.get('scope1')).toBeInstanceOf(Proposition);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.message).toBe('Test error');
    expect(errorResponse.code).toBe(500);
  });

  it('Test Offer object state', async () => {
    const offer = new Offer(offerJson);
    //Asserts
    expect(offer.id).toBe('xcore:personalized-offer:2222222222222222');
    expect(offer.etag).toBe('7');
    expect(offer.schema).toBe(
      'https://ns.adobe.com/experience/offer-management/content-component-text'
    );
    expect(offer.content).toBe('This is a plain text content!');
    expect(offer.format).toBe('text/plain');
    expect(offer.language).toBe(offerJson.data.language);
    expect(offer.characteristics).toBe(offerJson.data.characteristics);
  });

  it('Test Offer.displayed', async () => {
    const offer = new Offer(offerJson);
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'offerDisplayed');
    const proposition = new Proposition(propositionJson as any);
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    await offer.displayed(proposition);
    expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);
  });

  it('Test Offer.tapped', async () => {
    const offer = new Offer(offerJson);
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'offerTapped');
    const proposition = new Proposition(propositionJson as any);
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    await offer.tapped(proposition);
    expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);
  });

  it('Test Offer.generateDisplayInteractionXdm', async () => {
    const offer = new Offer(offerJson);
    const spy = jest.spyOn(
      NativeModules.AEPOptimize,
      'generateDisplayInteractionXdm'
    );
    const proposition = new Proposition(propositionJson as any);
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    await offer.generateDisplayInteractionXdm(proposition);
    expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);
  });

  it('Test Offer.generateTapInteractionXdm', async () => {
    const offer = new Offer(offerJson);
    const spy = jest.spyOn(
      NativeModules.AEPOptimize,
      'generateTapInteractionXdm'
    );
    const proposition = new Proposition(propositionJson as any);
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    await offer.generateTapInteractionXdm(proposition);
    expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);
  });

  it('Test Proposition Object state', async () => {
    const proposition = new Proposition(propositionJson as any);
    //Asserts
    expect(proposition.id).toBe('de03ac85-802a-4331-a905-a57053164d35');
    expect(proposition.items.length).toBe(1);
    expect(proposition.scope).toBe(
      'eydhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEifQ=='
    );
  });

  it('Test Proposition Object state', async () => {
    const proposition = new Proposition(propositionJson as any);
    //Asserts
    expect(proposition.id).toBe('de03ac85-802a-4331-a905-a57053164d35');
    expect(proposition.items.length).toBe(1);
    expect(proposition.scope).toBe(
      'eydhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEifQ=='
    );
  });

  it('Test Proposition generateReferenceXdm', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'generateReferenceXdm');
    let proposition = new Proposition(propositionJson as any);
    await proposition.generateReferenceXdm();
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanProposition = Object.fromEntries(entries);
    expect(spy).toHaveBeenCalledWith(cleanProposition);
  });

  it('Test DecisionScope getName', async () => {
    const decisionScope = new DecisionScope(
      undefined,
      'xcore:offer-activity:1111111111111111',
      'xcore:offer-placement:1111111111111111',
      10
    );
    //Asserts
    expect(decisionScope.getName()).toBe(
      'eyJhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEiLCJpdGVtQ291bnQiOjEwfQ=='
    );
  });

  it('Test Optimize.displayed', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'multipleOffersDisplayed');
    const proposition = new Proposition(propositionJson as any);
    const offer = proposition.items[0];
    const offerPairs = [{
      proposition,
      offerId: offer.id
    }];

    // Clean the proposition as your implementation does
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    const cleanedPairs = [{
      proposition: cleanedProposition,
      offerId: offer.id
    }];

    await Optimize.displayed(offerPairs);
    expect(spy).toHaveBeenCalledWith(cleanedPairs);
  });

  it('Test Optimize.generateDisplayInteractionXdm', async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'generateDisplayInteractionXdmForMultipleOffers');
    const proposition = new Proposition(propositionJson as any);
    const offer = proposition.items[0];
    const offerPairs = [{
      proposition,
      offerId: offer.id
    }];
  
    // Clean the proposition as your implementation does
    const entries = Object.entries(proposition).filter(
      ([_, value]) => typeof value !== 'function'
    );
    const cleanedProposition = Object.fromEntries(entries);
    const cleanedPairs = [{
      proposition: cleanedProposition,
      offerId: offer.id
    }];
  
    await Optimize.generateDisplayInteractionXdm(offerPairs);
    expect(spy).toHaveBeenCalledWith(cleanedPairs);
  });
});
