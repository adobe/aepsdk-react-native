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
      undefined, // empty Map becomes undefined
      undefined // empty Map becomes undefined
    );
  });

  it('AEPOptimize updateProposition is called with callback', async () => {
    let spy = jest.spyOn(NativeModules.AEPOptimize, "updatePropositions");
    let decisionScopes = [new DecisionScope("abcdef")];
    let xdm = new Map();
    let data = new Map();
    const callback = (_response: { error?: any; propositions?: { [key: string]: Proposition } | undefined }) => {};
    await Optimize.updatePropositions(decisionScopes, xdm, data, callback);
    expect(spy).toHaveBeenCalledWith(
      decisionScopes.map((decisionScope) => decisionScope.getName()),
      undefined, // empty Map becomes undefined
      undefined, // empty Map becomes undefined
      expect.any(Function)
    );
  });

  it('AEPOptimize updateProposition callback handles successful response', async () => {
    const mockResponse = {
      propositions: {
        'scope1': propositionJson
      }
    };
    
    // Mock the native method to call the callback with mock data
    const mockMethod = jest.fn().mockImplementation((...args: any[]) => {
      const callback = args[3];
      if (typeof callback === 'function') {
        callback(mockResponse);
      }
    });
    NativeModules.AEPOptimize.updatePropositions = mockMethod;
    
    let decisionScopes = [new DecisionScope("abcdef")];
    let callbackResponse: any = null;
    const callback = (response: { error?: any; propositions?: { [key: string]: Proposition } | undefined }) => {
      callbackResponse = response;
    };
    
    await Optimize.updatePropositions(decisionScopes, undefined, undefined, callback);
    
    expect(callbackResponse).not.toBeNull();
    expect(callbackResponse.propositions).toBeDefined();
    expect(callbackResponse.propositions['scope1']).toBeInstanceOf(Proposition);
    expect(callbackResponse.error).toBeUndefined();
  });

  it('AEPOptimize updateProposition callback handles error response', async () => {
    const mockErrorResponse = {
      error: {
        message: 'Test error',
        code: 500
      }
    };
    
    // Mock the native method to call the callback with error data
    const mockMethod = jest.fn().mockImplementation((...args: any[]) => {
      const callback = args[3];
      if (typeof callback === 'function') {
        callback(mockErrorResponse);
      }
    });
    NativeModules.AEPOptimize.updatePropositions = mockMethod;
    
    let decisionScopes = [new DecisionScope("abcdef")];
    let callbackResponse: any = null;
    const callback = (response: { error?: any; propositions?: { [key: string]: Proposition } | undefined }) => {
      callbackResponse = response;
    };
    
    await Optimize.updatePropositions(decisionScopes, undefined, undefined, callback);
    
    expect(callbackResponse).not.toBeNull();
    expect(callbackResponse.error).toBeDefined();
    expect(callbackResponse.error.message).toBe('Test error');
    expect(callbackResponse.error.code).toBe(500);
    expect(callbackResponse.propositions).toBeUndefined();
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
});
