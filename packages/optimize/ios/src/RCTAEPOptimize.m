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

RCT_EXPORT_METHOD(updatePropositions: (NSArray*) decisionsScopes xdm: (NSDictionary*) xdm data: (NSDictionary*) data) {
  
  NSArray<AEPDecisionScope*>* decisionScopesArray = [self createDecisionScopesArray:decisionsScopes];
  [AEPMobileOptimize updatePropositions:decisionScopesArray withXdm:xdm andData: data];
}

RCT_EXPORT_METHOD(getPropositions: (NSArray*) decisionScopes resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject) {
  
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

RCT_EXPORT_METHOD(offerTapped:(NSDictionary<NSString*, id>*) offerEventData) {
  [AEPLog debugWithLabel:TAG message:@"Offer tapped"];
//TODO: Define this function.
  
}

RCT_EXPORT_METHOD(generateDisplayInteractionXdm: (NSDictionary<NSString*, id>*) offersEventData resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject){
  [AEPLog debugWithLabel:TAG message:@"Offer generateDisplayInteractionXdm"];
//TODO: Define this function.
  
}

RCT_EXPORT_METHOD(generateReferenceXdm: (NSDictionary<NSString*, id>*) propositionEventData resolver: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject){
  [AEPLog debugWithLabel:TAG message:@"Proposition generateReferenceXdm"];
//TODO: Define this function.
}

#pragma mark - Helper methods

- (NSArray<AEPDecisionScope*>*) createDecisionScopesArray: (NSArray<NSString*>*) decisionScope {
  NSMutableArray<AEPDecisionScope *>* decisionScopesArray = [[NSMutableArray alloc] init];
  for (NSString* scope in decisionScope) {
    [decisionScopesArray addObject:[[AEPDecisionScope alloc] initWithName:scope]];
  }
  return decisionScopesArray;
}

- (NSDictionary<NSString*, NSDictionary<NSString*, id>*>*) convertPropositionToDict: (AEPProposition*) proposition {
  NSDictionary<NSString*, NSDictionary*>* propositionDict = [[NSMutableDictionary alloc] init];
  if(!proposition){
    return propositionDict;
  }
  
  [propositionDict setValue:proposition.id forKey:@"id"];
  
  NSMutableArray<NSDictionary<NSString*, id>*>* offersArray = [[NSMutableArray alloc] init];
  for(AEPOffer* offer in proposition.offers){
    [offersArray addObject:[self convertOfferToDict:offer]];
  }
  
  [propositionDict setValue:offersArray forKey:@"offers"];
  [propositionDict setValue:proposition.scope forKey:@"scope"];
  
  return propositionDict;
}



- (NSDictionary<NSString*, id>*) convertOfferToDict: (AEPOffer*) offer {
  NSMutableDictionary<NSString*, id>* offerDict = [[NSMutableDictionary alloc] init];
  if(!offer){
    return offerDict;
  }
  
  [offerDict setValue:offer.id forKey:@"id"];
  [offerDict setValue:offer.etag forKey:@"etag"];
  [offerDict setValue:offer.schema forKey:@"schema"];
  [offerDict setValue:[self convertOfferTypeToString:offer.type] forKey:@"type"];
  [offerDict setValue:offer.language forKey:@"language"];
  [offerDict setValue:offer.content forKey:@"content"];
  [offerDict setValue:offer.characteristics forKey:@"characteristics"];

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
