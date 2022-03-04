/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@format
@flow
*/

import { NativeModules } from 'react-native';
import {AEPOptimize, Proposition, DecisionScope, Offer} from "../";
const offerJson = require('./Offer_json');
const propositionJson = require('./Proposition_json');

describe('AEPOptimize', () => {
  it('AEPOptimize extensionVersion is called', async () => {    
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'extensionVersion');
    await AEPOptimize.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });  

  it('AEPOptimize onPropositionUpdate is called with correct parameters', async () => {    
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'onPropositionsUpdate');
    let adobeCallback = {
      call(_: Map<string, Proposition>): void {        
      }
    };
    
    await AEPOptimize.onPropositionUpdate(adobeCallback);
    expect(spy).toHaveBeenCalled();
  });

  it('AEPOptimize clearCachedProposition is called', async () => {    
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'clearCachedPropositions');        
    await AEPOptimize.clearCachedPropositions();
    expect(spy).toHaveBeenCalledWith();
  });

  it('AEPOptimize getPropositions is called',async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'getPropositions');        
    let decisionScopes = [new DecisionScope("abcdef", null, null, null)];
    await AEPOptimize.getPropositions(decisionScopes);
    expect(spy).toHaveBeenCalledWith(decisionScopes.map(decisionScope => decisionScope.getName()));    
  });

  it('AEPOptimize updateProposition is called',async () => {
    const spy = jest.spyOn(NativeModules.AEPOptimize, 'updatePropositions');        
    let decisionScopes = [new DecisionScope("abcdef", null, null, null)];
    let xdm = new Map();
    let data = new Map();
    await AEPOptimize.updatePropositions(decisionScopes, xdm, data);
    expect(spy).toHaveBeenCalledWith(decisionScopes.map(decisionScope => decisionScope.getName()), xdm, data);    
  });

  it('Test Offer object state', async () => {    

 const offer = new Offer(offerJson);    
  //Asserts
  expect(offer.id).toBe("xcore:personalized-offer:2222222222222222");
  expect(offer.etag).toBe("7");
  expect(offer.schema).toBe("https://ns.adobe.com/experience/offer-management/content-component-text");
  expect(offer.content).toBe("This is a plain text content!");
  expect(offer.format).toBe("text/plain");
  console.log(offer.characteristics);
  console.log(JSON.stringify(offer.characteristics));
  expect(offer.language).toBe(offerJson.data.language);
  expect(offer.characteristics).toBe(offerJson.data.characteristics);    
});

it('Test Offer.displayed',async () => {  
  const offer = new Offer(offerJson);    
  const spy = jest.spyOn(NativeModules.AEPOptimize, 'offerDisplayed');        
  const proposition = new Proposition(propositionJson);
  const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");        
  const cleanedProposition = Object.fromEntries(entries);
  await offer.displayed(proposition);
  expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);
});

it('Test Offer.tapped',async () => {  
  const offer = new Offer(offerJson);    
  const spy = jest.spyOn(NativeModules.AEPOptimize, 'offerTapped');        
  const proposition = new Proposition(propositionJson);
  const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");        
  const cleanedProposition = Object.fromEntries(entries);
  await offer.tapped(proposition);
  expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);  
});

it('Test Offer.generateDisplayInteractionXdm',async () => {  
  const offer = new Offer(offerJson);    
  const spy = jest.spyOn(NativeModules.AEPOptimize, 'generateDisplayInteractionXdm');        
  const proposition = new Proposition(propositionJson);
  const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");        
  const cleanedProposition = Object.fromEntries(entries);
  await offer.generateDisplayInteractionXdm(proposition);
  expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);  
});

it('Test Offer.generateTapInteractionXdm',async () => {  
  const offer = new Offer(offerJson);    
  const spy = jest.spyOn(NativeModules.AEPOptimize, 'generateTapInteractionXdm');        
  const proposition = new Proposition(propositionJson);
  const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");        
  const cleanedProposition = Object.fromEntries(entries);
  await offer.generateTapInteractionXdm(proposition);
  expect(spy).toHaveBeenCalledWith(offerJson.id, cleanedProposition);  
});

it('Test Proposition Object state',async () => {  
  const proposition = new Proposition(propositionJson);    
  //Asserts
  expect(proposition.id).toBe("de03ac85-802a-4331-a905-a57053164d35");
  expect(proposition.items.length).toBe(1);
  expect(proposition.scope).toBe("eydhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEifQ==");  
});

it('Test Proposition Object state',async () => {  
  const proposition = new Proposition(propositionJson);    
  //Asserts
  expect(proposition.id).toBe("de03ac85-802a-4331-a905-a57053164d35");
  expect(proposition.items.length).toBe(1);
  expect(proposition.scope).toBe("eydhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEifQ==");  
});

it('Test Proposition generateReferenceXdm', async () => {    
 const spy = jest.spyOn(NativeModules.AEPOptimize, "generateReferenceXdm");
 let proposition = new Proposition(propositionJson);
 await proposition.generateReferenceXdm();
 const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");
 const cleanProposition = Object.fromEntries(entries);    
 expect(spy).toHaveBeenCalledWith(cleanProposition);
});

it('Test DecisionScope getName', async () => {      
 const decisionScope = new DecisionScope(null, "xcore:offer-activity:1111111111111111", "xcore:offer-placement:1111111111111111", 10);
  //Asserts
  expect(decisionScope.getName()).toBe("eyJhY3Rpdml0eUlkIjoieGNvcmU6b2ZmZXItYWN0aXZpdHk6MTExMTExMTExMTExMTExMSIsInBsYWNlbWVudElkIjoieGNvcmU6b2ZmZXItcGxhY2VtZW50OjExMTExMTExMTExMTExMTEiLCJpdGVtQ291bnQiOjEwfQ==");
});
});


  

