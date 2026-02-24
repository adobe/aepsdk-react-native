/*
 Copyright 2022 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or
 agreed to in writing, software distributed under the License is distributed on
 an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, either
 express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */

#import "RCTNativeAEPOptimize.h"
@import AEPOptimize;
@import AEPServices;
@import Foundation;

static NSString *const TAG = @"RCTNativeAEPOptimize";

@interface RCTNativeAEPOptimize ()
@property (assign, nonatomic) BOOL hasListeners;
@property (strong, nonatomic) NSMutableDictionary<NSString *, AEPOptimizeProposition *> *propositionCache;
@end

@implementation RCTNativeAEPOptimize

- (id)init {
  if (self = [super init]) {
    _hasListeners = NO;
    _propositionCache = [[NSMutableDictionary alloc] init];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPLog traceWithLabel:TAG message:@"extensionVersion is called."];
  resolve([AEPMobileOptimize extensionVersion]);
}

- (void)clearCachedPropositions {
  [AEPLog traceWithLabel:TAG message:@"clearCachedPropositions is called."];
  [self clearPropositionsCache];
  [AEPMobileOptimize clearCachedPropositions];
}

- (void)getPropositions:(NSArray *)decisionScopeNames
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  [AEPLog traceWithLabel:TAG message:@"getPropositions is called."];
  NSArray<AEPDecisionScope *> *scopes = [self createDecisionScopesArray:decisionScopeNames];
  [AEPMobileOptimize getPropositions:scopes
                           completion:^(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *decisionScopePropositionDict, NSError *error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription, error);
      return;
    }
    [self cachePropositions:decisionScopePropositionDict];
    NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *> *propositionDictionary = [[NSMutableDictionary alloc] init];
    for (AEPDecisionScope *key in decisionScopePropositionDict) {
      AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
      if (proposition) {
        propositionDictionary[key.name] = [self convertPropositionToDict:proposition];
      }
    }
    resolve(propositionDictionary);
  }];
}

- (void)updatePropositions:(NSArray *)decisionScopeNames
                       xdm:(NSDictionary *)xdm
                      data:(NSDictionary *)data
                 onSuccess:(RCTResponseSenderBlock)onSuccess
                   onError:(RCTResponseSenderBlock)onError {
  [AEPLog traceWithLabel:TAG message:@"updatePropositions is called."];
  NSArray<AEPDecisionScope *> *scopes = [self createDecisionScopesArray:decisionScopeNames];
  [AEPMobileOptimize updatePropositions:scopes
                                 withXdm:xdm
                                andData:data
                             completion:^(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *decisionScopePropositionDict, NSError *error) {
    if (error) {
      NSDictionary *errorDict = [self convertNSErrorToOptimizeErrorDict:error];
      if (onError) {
        onError(@[ errorDict ]);
      }
      return;
    }
    if (decisionScopePropositionDict) {
      [self cachePropositions:decisionScopePropositionDict];
      NSDictionary *propositions = [self createCallbackResponse:decisionScopePropositionDict];
      if (onSuccess) {
        onSuccess(@[ propositions ]);
      }
    }
  }];
}

- (void)onPropositionsUpdate {
  [AEPLog traceWithLabel:TAG message:@"onPropositionsUpdate is called."];
  [AEPMobileOptimize onPropositionsUpdate:^(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *decisionScopePropositionDict) {
    [self cachePropositions:decisionScopePropositionDict];
    if (!_hasListeners) {
      return;
    }
    NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *> *propositionDictionary = [[NSMutableDictionary alloc] init];
    for (AEPDecisionScope *key in decisionScopePropositionDict) {
      AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
      if (proposition) {
        propositionDictionary[key.name] = [self convertPropositionToDict:proposition];
      }
    }
  }];
}

- (void)offerDisplayed:(NSString *)offerId propositionMap:(NSDictionary *)propositionMap {
  [AEPLog debugWithLabel:TAG message:@"Offer Displayed"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:propositionMap];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      [offer displayed];
      break;
    }
  }
}

- (void)offerTapped:(NSString *)offerId propositionMap:(NSDictionary *)propositionMap {
  [AEPLog debugWithLabel:TAG message:@"Offer Tapped"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:propositionMap];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      [offer tapped];
      break;
    }
  }
}

- (void)generateReferenceXdm:(NSDictionary *)propositionMap
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"Proposition generateReferenceXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:propositionMap];
  NSDictionary<NSString *, id> *referenceXdm = [proposition generateReferenceXdm];
  resolve(referenceXdm);
}

- (void)generateTapInteractionXdm:(NSString *)offerId
                  propositionMap:(NSDictionary *)propositionMap
                         resolve:(RCTPromiseResolveBlock)resolve
                          reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateTapInteractionXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:propositionMap];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerInteracted = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      offerInteracted = offer;
      break;
    }
  }
  if (offerInteracted) {
    NSDictionary<NSString *, id> *tapInteractionXdm = [offerInteracted generateTapInteractionXdm];
    resolve(tapInteractionXdm);
  } else {
    reject(@"generateTapInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Tap interaction XDM for offer with id: %@", offerId],
           nil);
  }
}

- (void)generateDisplayInteractionXdm:(NSString *)offerId
                      propositionMap:(NSDictionary *)propositionMap
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateDisplayInteractionXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:propositionMap];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerDisplayed = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      offerDisplayed = offer;
      break;
    }
  }
  if (offerDisplayed) {
    NSDictionary<NSString *, id> *displayInteractionXdm = [offerDisplayed generateDisplayInteractionXdm];
    resolve(displayInteractionXdm);
  } else {
    reject(@"generateDisplayInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Display interaction XDM for offer with id: %@", offerId],
           nil);
  }
}

- (void)multipleOffersDisplayed:(NSArray *)offersArray {
  [AEPLog debugWithLabel:TAG message:@"multipleOffersDisplayed is called."];
  NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];
  if (nativeOffers.count > 0) {
    [AEPMobileOptimize displayed:nativeOffers];
  }
}

- (void)multipleOffersGenerateDisplayInteractionXdm:(NSArray *)offersArray
                                           resolve:(RCTPromiseResolveBlock)resolve
                                            reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"multipleOffersGenerateDisplayInteractionXdm is called."];
  NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];
  if (nativeOffers.count > 0) {
    NSDictionary<NSString *, id> *displayInteractionXdm = [AEPMobileOptimize generateDisplayInteractionXdm:nativeOffers];
    resolve(displayInteractionXdm);
  } else {
    reject(@"generateDisplayInteractionXdmForMultipleOffers", @"Error in generating Display interaction XDM for multiple offers.", nil);
  }
}

- (void)addListener:(NSString *)eventName {
  _hasListeners = YES;
}

- (void)removeListeners:(double)count {
  _hasListeners = NO;
}

- (NSArray<AEPDecisionScope *> *)createDecisionScopesArray:(NSArray<NSString *> *)decisionScopes {
  NSMutableArray<AEPDecisionScope *> *decisionScopesArray = [[NSMutableArray alloc] init];
  for (NSString *name in decisionScopes) {
    [decisionScopesArray addObject:[[AEPDecisionScope alloc] initWithName:name]];
  }
  return decisionScopesArray;
}

- (NSDictionary<NSString *, NSDictionary<NSString *, id> *> *)createPropositionDictionary:
    (NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
  NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *> *propositionDictionary =
      [[NSMutableDictionary alloc] initWithCapacity:decisionScopePropositionDict.count];
  for (AEPDecisionScope *key in decisionScopePropositionDict) {
    AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
    if (proposition) {
      propositionDictionary[key.name] = [self convertPropositionToDict:proposition];
    }
  }
  return propositionDictionary;
}

- (NSDictionary *)createCallbackResponse:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
  if (decisionScopePropositionDict.count > 0) {
    return [self createPropositionDictionary:decisionScopePropositionDict];
  }
  return @{};
}

- (NSDictionary<NSString *, id> *)convertPropositionToDict:(AEPOptimizeProposition *)proposition {
  NSMutableDictionary<NSString *, id> *propositionDict = [[NSMutableDictionary alloc] init];
  if (!proposition) {
    return propositionDict;
  }
  propositionDict[@"id"] = proposition.id;
  propositionDict[@"scope"] = proposition.scope;
  propositionDict[@"scopeDetails"] = [proposition scopeDetails];
  NSMutableArray<NSDictionary<NSString *, id> *> *offersArray = [[NSMutableArray alloc] init];
  for (AEPOffer *offer in proposition.offers) {
    [offersArray addObject:[self convertOfferToDict:offer]];
  }
  propositionDict[@"items"] = offersArray;
  if ([proposition activity]) {
    propositionDict[@"activity"] = [proposition activity];
  }
  if ([proposition placement]) {
    propositionDict[@"placement"] = [proposition placement];
  }
  return propositionDict;
}

- (NSDictionary<NSString *, id> *)convertOfferToDict:(AEPOffer *)offer {
  NSMutableDictionary<NSString *, id> *offerDict = [[NSMutableDictionary alloc] init];
  if (!offer) {
    return offerDict;
  }
  offerDict[@"id"] = offer.id;
  if ([offer etag]) {
    offerDict[@"etag"] = [offer etag];
  }
  if ([offer meta]) {
    offerDict[@"meta"] = [offer meta];
  }
  offerDict[@"schema"] = [offer schema];
  offerDict[@"score"] = @([offer score]);
  NSMutableDictionary<NSString *, id> *data = [[NSMutableDictionary alloc] init];
  data[@"id"] = [offer id];
  data[@"format"] = [self convertOfferTypeToString:[offer type]];
  data[@"content"] = [offer content];
  if ([offer language]) {
    data[@"language"] = [offer language];
  }
  if ([offer characteristics]) {
    data[@"characteristics"] = [offer characteristics];
  }
  offerDict[@"data"] = data;
  return offerDict;
}

- (NSString *)convertOfferTypeToString:(AEPOfferType)offerType {
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

- (NSDictionary *)convertNSErrorToOptimizeErrorDict:(NSError *)error {
  if (!error) {
    return @{};
  }
  NSMutableDictionary *errorDict = [NSMutableDictionary dictionary];
  NSDictionary *userInfo = error.userInfo;
  errorDict[@"type"] = userInfo[@"type"] ?: @"";
    errorDict[@"status"] = userInfo[@"status"] ?: @(error.code) ; @(error.code);
  errorDict[@"title"] = userInfo[@"title"] ?: @"";
  errorDict[@"detail"] = userInfo[@"detail"] ?: @"";
    errorDict[@"report"] = userInfo[@"report"] ?: @{} ; @{};
  id aepErrorValue = userInfo[@"aepError"];
  if (aepErrorValue && aepErrorValue != [NSNull null]) {
    errorDict[@"aepError"] = aepErrorValue;
  } else {
    errorDict[@"aepError"] = @"general.unexpected";
  }
  return errorDict;
}

- (NSMutableArray<AEPOffer *> *)getNativeOffersFromOffersArray:(NSArray<NSDictionary<NSString *, id> *> *)offersArray {
  NSMutableArray<AEPOffer *> *nativeOffers = [[NSMutableArray alloc] init];
  if (!offersArray || offersArray.count == 0) {
    return nativeOffers;
  }
  for (NSDictionary<NSString *, id> *offerDict in offersArray) {
    if (!offerDict) {
      continue;
    }
    NSString *uniquePropositionId = offerDict[@"uniquePropositionId"];
    NSString *offerId = offerDict[@"id"];
    if (!uniquePropositionId || !offerId) {
      continue;
    }
    AEPOptimizeProposition *proposition = _propositionCache[uniquePropositionId];
    if (!proposition) {
      continue;
    }
    for (AEPOffer *propositionOffer in [proposition offers]) {
      if ([[propositionOffer id] isEqualToString:offerId]) {
        [nativeOffers addObject:propositionOffer];
        break;
      }
    }
  }
  return nativeOffers;
}

- (void)cachePropositions:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
  for (AEPDecisionScope *key in decisionScopePropositionDict) {
    AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
    if (!proposition) {
      continue;
    }
    NSDictionary *propositionDict = [self convertPropositionToDict:proposition];
    NSString *activityId = nil;
    NSDictionary *activity = propositionDict[@"activity"];
    if (propositionDict[@"activity"] && activity && activity[@"id"]) {
      activityId = activity[@"id"];
    } else {
      NSDictionary *scopeDetails = propositionDict[@"scopeDetails"];
      if (scopeDetails && scopeDetails[@"activity"]) {
        NSDictionary *scopeDetailsActivity = scopeDetails[@"activity"];
        if (scopeDetailsActivity && scopeDetailsActivity[@"id"]) {
          activityId = scopeDetailsActivity[@"id"];
        }
      }
    }
    if (activityId) {
      _propositionCache[activityId] = proposition;
    }
  }
}

- (void)clearPropositionsCache {
  [_propositionCache removeAllObjects];
}

+ (NSString *)moduleName {
  return @"NativeAEPOptimize";
}

@end
