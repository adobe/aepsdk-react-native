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

#import "RCTAEPOptimize.h"
#import <React/RCTEventEmitter.h>
@import AEPOptimize;
@import AEPServices;
@import Foundation;

@implementation RCTAEPOptimize


static NSString* const TAG = @"RCTAEPOptimize";
RCTEventEmitter* eventEmitter;

- (instancetype)init
{
  self = [super init];
  if (self) {
    eventEmitter = [[RCTEventEmitter alloc] init];
  }
  return self;
}

RCT_EXPORT_MODULE(AEPOptimize);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject) {
    resolve([AEPMobileOptimize extensionVersion]);
}

RCT_EXPORT_METHOD(clearCachedPropositions) {
    [AEPMobileOptimize clearCachedPropositions];
}

RCT_EXPORT_METHOD(updatePropositions: (NSArray<NSString*>*) decisionsScopes xdm: (NSDictionary<NSString*, id>*) xdm data: (NSDictionary<NSString*, id>*) data) {
  
  NSArray<AEPDecisionScope*>* decisionScopesArray = [self createDecisionScopesArray:decisionsScopes];
  [AEPMobileOptimize updatePropositions:decisionScopesArray withXdm:xdm andData: data];
}

RCT_EXPORT_METHOD(getPropositions: (NSArray<NSString*>*) decisionScopes resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject) {
  
  NSArray<AEPDecisionScope*>* decisionScopesArray = [self createDecisionScopesArray:decisionScopes];
  [AEPMobileOptimize getPropositions:decisionScopesArray completion: ^(NSDictionary<AEPDecisionScope*, AEPProposition*>* decisionScopePropositionDict, NSError* error){
    
    if(error){
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.description, nil);
    } else {
      NSDictionary<NSString*, NSDictionary<NSString*, id>*>* propositionDictionary = [[NSMutableDictionary alloc] init];
      
      for(AEPDecisionScope* key in decisionScopePropositionDict) {
        AEPProposition* proposition = decisionScopePropositionDict[key];
        [propositionDictionary setValue:[self convertPropositionToDict:proposition] forKey:key.name];
      }
      resolve(propositionDictionary);
    }
  }];
}

RCT_EXPORT_METHOD(onPropositionsUpdate) {
  [AEPMobileOptimize onPropositionsUpdate: ^(NSDictionary<AEPDecisionScope*, AEPProposition*>* decisionScopePropositionDict) {
    NSDictionary<NSString*, NSDictionary<NSString*, id>*>* propositionDictionary = [[NSMutableDictionary alloc] init];
    
    for(AEPDecisionScope* key in decisionScopePropositionDict) {
      AEPProposition* proposition = decisionScopePropositionDict[key];
      [propositionDictionary setValue:[self convertPropositionToDict:proposition] forKey:key.name];
    }
        
    [eventEmitter sendEventWithName:@"onPropositionsUpdate" body:propositionDictionary];
  }];
}

RCT_EXPORT_METHOD(offerTapped: (NSString*) offerId propositionDictionary: (NSDictionary<NSString*, id>*) dictionary) {
  [AEPLog debugWithLabel:TAG message:@"Offer Tapped"];
  AEPProposition* proposition = [AEPProposition initFromData: dictionary];
  NSArray<AEPOffer*>* offers = [proposition offers];
  for(AEPOffer* offer in offers) {
    if([[offer id] isEqualToString:offerId]){
      [offer tapped];
      break;
    }
  }
}

RCT_EXPORT_METHOD(offerDisplayed: (NSString*) offerId propositionDictionary: (NSDictionary<NSString*, id>*) dictionary) {
  [AEPLog debugWithLabel:TAG message:@"Offer Displayed"];
  AEPProposition* proposition = [AEPProposition initFromData: dictionary];
  NSArray<AEPOffer*>* offers = [proposition offers];
  for(AEPOffer* offer in offers) {
    if([[offer id] isEqualToString:offerId]){
      [offer displayed];
      break;
    }
  }
}

RCT_EXPORT_METHOD(generateReferenceXdm:(NSDictionary<NSString*, id>*) dictionary resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject){
  [AEPLog debugWithLabel:TAG message:@"Proposition generateReferenceXdm"];
  AEPProposition* proposition = [AEPProposition initFromData: dictionary];
  NSDictionary<NSString*, id>* referenceXDM = [proposition generateReferenceXdm];
  resolve(referenceXDM);
}

RCT_EXPORT_METHOD(generateTapInteractionXdm: (NSString*) offerId propositionDictionary: (NSDictionary<NSString*, id>*) dictionary resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject) {
  [AEPLog debugWithLabel:TAG message:@"generateTapInteractionXdm"];
  AEPProposition* proposition = [AEPProposition initFromData: dictionary];
  NSArray<AEPOffer*>* offers = [proposition offers];
  AEPOffer* offerInteracted = nil;
  for(AEPOffer* offer in offers) {
    if([[offer id] isEqualToString:offerId]){
      offerInteracted = offer;
      break;
    }
  }
  
  if(offerInteracted != nil){
    NSDictionary<NSString*, id>* tapInteractionXdm = [offerInteracted generateTapInteractionXdm];
    resolve(tapInteractionXdm);
  } else {
    reject(@"generateTapInteractionXdm", [NSString stringWithFormat:@"Error in generating Tap interaction XDM for offer with id: %@", offerId], nil);
  }
}

RCT_EXPORT_METHOD(generateDisplayInteractionXdm: (NSString*) offerId propositionDictionary: (NSDictionary<NSString*, id>*) dictionary resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject){
  [AEPLog debugWithLabel:TAG message:@"generateDisplayInteractionXdm"];
  AEPProposition* proposition = [AEPProposition initFromData: dictionary];
  NSArray<AEPOffer*>* offers = [proposition offers];
  AEPOffer* offerDisplayed = nil;
  for(AEPOffer* offer in offers) {
    if([[offer id] isEqualToString:offerId]){
      offerDisplayed = offer;
      break;
    }
  }
  
  if(offerDisplayed != nil){
    NSDictionary<NSString*, id>* displayInteractionXdm = [offerDisplayed generateDisplayInteractionXdm];
    resolve(displayInteractionXdm);
  } else {
    reject(@"generateDisplayInteractionXdm", [NSString stringWithFormat:@"Error in generating Display interaction XDM for offer with id: %@", offerId], nil);
  }
  
}

#pragma mark - Helper methods

- (NSArray<AEPDecisionScope*>*) createDecisionScopesArray: (NSArray<NSString*>*) decisionScopes {
  NSMutableArray<AEPDecisionScope *>* decisionScopesArray = [[NSMutableArray alloc] init];
  for (NSString* decisionScopeName in decisionScopes) {
      [decisionScopesArray addObject:[[AEPDecisionScope alloc] initWithName:decisionScopeName]];
  }
  return decisionScopesArray;
}

- (NSDictionary<NSString*, NSDictionary<NSString*, id>*>*) convertPropositionToDict: (AEPProposition*) proposition {
  NSDictionary<NSString*, id>* propositionDict = [[NSMutableDictionary alloc] init];
  if(!proposition){
    return propositionDict;
  }
  
  [propositionDict setValue:proposition.id forKey:@"id"];
  [propositionDict setValue:proposition.scope forKey:@"scope"];
  [propositionDict setValue:[proposition scopeDetails] forKey:@"scopeDetails"];
  
  
  NSMutableArray<NSDictionary<NSString*, id>*>* offersArray = [[NSMutableArray alloc] init];
  for(AEPOffer* offer in proposition.offers){
    [offersArray addObject:[self convertOfferToDict:offer]];
  }
  [propositionDict setValue:offersArray forKey:@"items"];
  return propositionDict;
}

- (NSDictionary<NSString*, id>*) convertOfferToDict: (AEPOffer*) offer {
  NSMutableDictionary<NSString*, id>* offerDict = [[NSMutableDictionary alloc] init];
  if(!offer){
    return offerDict;
  }
  
  [offerDict setValue:offer.id forKey:@"id"];
  if([offer etag] != nil){
    [offerDict setValue:[offer etag] forKey:@"etag"];
  }
  [offerDict setValue:[offer schema] forKey:@"schema"];
  
  NSDictionary<NSString*, id>* data = [[NSMutableDictionary alloc] init];
  [data setValue:[offer id] forKey:@"id"];
  [data setValue:[self convertOfferTypeToString:[offer type]] forKey:@"format"];
  [data setValue:[offer content] forKey:@"content"];
  if([offer language] != nil){
    [data setValue:[offer language] forKey:@"language"];
  }
  if([offer characteristics] != nil){
    [data setValue:[offer characteristics] forKey:@"characteristics"];
  }
  
  [offerDict setValue:data forKey:@"data"];
  return offerDict;
}

- (NSString*) convertOfferTypeToString: (AEPOfferType) offerType {
  switch (offerType) {
    case AEPOfferTypeHtml:
      return @"text/html";
    case AEPOfferTypeJson:
      return @"application/json";
    case AEPOfferTypeText:
      return @"text/plain";
    case AEPOfferTypeImage:
      return @"image/*";
    default:
      return @"";
  }
}

- (void) handleError:(NSError *) error rejecter:(RCTPromiseRejectBlock) reject {
    if (!error || !reject) {
        return;
    }

    NSDictionary *userInfo = [error userInfo];
    NSString *errorString = [[userInfo objectForKey:NSUnderlyingErrorKey] localizedDescription];

    reject([NSString stringWithFormat: @"%lu", (long)error.code],
           errorString,
           error);
}

@end
