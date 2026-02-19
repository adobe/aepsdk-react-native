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

#import "RCTAEPOptimize.h"
@import AEPOptimize;
@import AEPServices;
@import Foundation;

#if RCT_NEW_ARCH_ENABLED
#import <memory>
#import <ReactCodegen/NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
#import <ReactCommon/RCTTurboModule.h>
#endif

static NSString *const TAG = @"RCTAEPOptimize";

@implementation RCTAEPOptimize {
  NSMutableDictionary<NSString *, AEPOptimizeProposition *> *propositionCache;
}

- (instancetype)init {
  self = [super init];
  propositionCache = [[NSMutableDictionary alloc] init];
  return self;
}

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  [AEPLog traceWithLabel:TAG message:@"extensionVersion is called."];
  resolve([AEPMobileOptimize extensionVersion]);
}

- (void)clearCachedPropositions {
  [AEPLog traceWithLabel:TAG message:@"clearCachedPropositions is called."];
  [self clearPropositionsCache];
  [AEPMobileOptimize clearCachedPropositions];
}

// Helper method to handle proposition dictionary creation
- (NSDictionary<NSString *, NSDictionary<NSString *, id> *> *)createPropositionDictionary:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
    NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *> *propositionDictionary = [[NSMutableDictionary alloc] initWithCapacity:decisionScopePropositionDict.count];
    
    for (AEPDecisionScope *key in decisionScopePropositionDict) {
        AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
        if (proposition) {
            [propositionDictionary setValue:[self convertPropositionToDict:proposition] forKey:key.name];
        }
    }
    return propositionDictionary;
}

// Unified method that handles both callback and non-callback cases (used by Turbo spec)
- (void)updatePropositions:(NSArray<NSString *> *)decisionScopesArray
                  withXdm:(NSDictionary *)xdm
                  andData:(NSDictionary *)data
                  successCallback:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)errorCallback {
    [AEPLog traceWithLabel:TAG message:@"updatePropositions is called."];
    NSArray<AEPDecisionScope *> *scopes = [self createDecisionScopesArray:decisionScopesArray];
    [AEPMobileOptimize updatePropositions:scopes
                                   withXdm:xdm
                                   andData:data
                                completion:^(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *decisionScopePropositionDict, NSError *error) {
        if (error) {
            NSDictionary *errorDict = [self convertNSErrorToOptimizeErrorDict:error];
            if (errorCallback != nil) {
                errorCallback(@[errorDict]);
            }
        } 
        if (decisionScopePropositionDict) {
            [self cachePropositions:decisionScopePropositionDict];
            NSDictionary *propositions = [self createCallbackResponse:decisionScopePropositionDict];
            if (successCallback != nil) {
                successCallback(@[propositions]);
            }
        }
    }];
}


- (void)getPropositions:(NSArray<NSString *> *)decisionScopes
              resolver:(RCTPromiseResolveBlock)resolve
               rejector:(RCTPromiseRejectBlock)reject {

  [AEPLog traceWithLabel:TAG message:@"getPropositions is called."];
  NSArray<AEPDecisionScope *> *decisionScopesArray =
      [self createDecisionScopesArray:decisionScopes];
  [AEPMobileOptimize
      getPropositions:decisionScopesArray
           completion:^(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *>
                            *decisionScopePropositionDict,
                        NSError *error) {
             if (error) {
               reject([NSString stringWithFormat:@"%ld", (long)error.code],
                      error.description, nil);
             } else {
              [self cachePropositions:decisionScopePropositionDict];

               NSDictionary<NSString *, NSDictionary<NSString *, id> *>
                   *propositionDictionary = [[NSMutableDictionary alloc] init];

               for (AEPDecisionScope *key in decisionScopePropositionDict) {
                   AEPOptimizeProposition *proposition =
                     decisionScopePropositionDict[key];
                 [propositionDictionary
                     setValue:[self convertPropositionToDict:proposition]
                       forKey:key.name];
               }
               resolve(propositionDictionary);
             }
           }];
}

- (void)onPropositionsUpdate {
  [AEPLog traceWithLabel:TAG message:@"onPropositionsUpdate is called."];
  [AEPMobileOptimize onPropositionsUpdate:^(
                         NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *>
                             *decisionScopePropositionDict) {
    [self cachePropositions:decisionScopePropositionDict];
    // Turbo-only: event emission would require RCTEventEmitter; left as cache-only for now.
  }];
}

- (void)offerTapped:(NSString *)offerId propositionDictionary:(NSDictionary<NSString *, id> *)dictionary {
  [AEPLog debugWithLabel:TAG message:@"Offer Tapped"];
    AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      [offer tapped];
      break;
    }
  }
}

- (void)offerDisplayed:(NSString *)offerId propositionDictionary:(NSDictionary<NSString *, id> *)dictionary {
  [AEPLog debugWithLabel:TAG message:@"Offer Displayed"];
    AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      [offer displayed];
      break;
    }
  }
}

- (void)generateReferenceXdm:(NSDictionary<NSString *, id> *)dictionary
                    resolver:(RCTPromiseResolveBlock)resolve
                     rejector:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"Proposition generateReferenceXdm"];
    AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSDictionary<NSString *, id> *referenceXDM =
      [proposition generateReferenceXdm];
  resolve(referenceXDM);
}

- (void)generateTapInteractionXdm:(NSString *)offerId
               propositionDictionary:(NSDictionary<NSString *, id> *)dictionary
                            resolver:(RCTPromiseResolveBlock)resolve
                             rejector:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateTapInteractionXdm"];
    AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerInteracted = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      offerInteracted = offer;
      break;
    }
  }

  if (offerInteracted != nil) {
    NSDictionary<NSString *, id> *tapInteractionXdm =
        [offerInteracted generateTapInteractionXdm];
    resolve(tapInteractionXdm);
  } else {
    reject(@"generateTapInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Tap interaction "
                                      @"XDM for offer with id: %@",
                                      offerId],
           nil);
  }
}

- (void)generateDisplayInteractionXdm:(NSString *)offerId
                  propositionDictionary:(NSDictionary<NSString *, id> *)dictionary
                               resolver:(RCTPromiseResolveBlock)resolve
                                rejector:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateDisplayInteractionXdm"];
    AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerDisplayed = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) {
      offerDisplayed = offer;
      break;
    }
  }

  if (offerDisplayed != nil) {
    NSDictionary<NSString *, id> *displayInteractionXdm =
        [offerDisplayed generateDisplayInteractionXdm];
    resolve(displayInteractionXdm);
  } else {
    reject(@"generateDisplayInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Display "
                                      @"interaction XDM for offer with id: %@",
                                      offerId],
           nil);
  }
}

- (void)multipleOffersDisplayed:(NSArray<NSDictionary<NSString *, id> *> *)offersArray {
                    
    [AEPLog debugWithLabel:TAG message:@"multipleOffersDisplayed is called."];

    NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];

    if ([nativeOffers count] > 0) {
      [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"multipleOffersDisplayed: calling display for: %lu offers", (unsigned long)[nativeOffers count]]];
      [AEPMobileOptimize displayed:nativeOffers];
    }
}

- (void)multipleOffersGenerateDisplayInteractionXdm:(NSArray<NSDictionary<NSString *, id> *> *)offersArray
                                            resolver:(RCTPromiseResolveBlock)resolve
                                             rejector:(RCTPromiseRejectBlock)reject {
    
    [AEPLog debugWithLabel:TAG message:@"multipleOffersGenerateDisplayInteractionXdm is called."];
    
    NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];
    
    if ([nativeOffers count] > 0) {
      [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"multipleOffersGenerateDisplayInteractionXdm: calling display for: %lu offers", (unsigned long)[nativeOffers count]]];
      NSDictionary<NSString *, id> *displayInteractionXdm = [AEPMobileOptimize generateDisplayInteractionXdm:nativeOffers];

      resolve(displayInteractionXdm);
    } else {
      reject(@"generateDisplayInteractionXdmForMultipleOffers", @"Error in generating Display interaction XDM for multiple offers.", nil);
    }
}

#pragma mark - Helper methods

- (NSMutableArray<AEPOffer *> *)getNativeOffersFromOffersArray:(NSArray<NSDictionary<NSString *, id> *> *)offersArray {
  NSMutableArray<AEPOffer *> *nativeOffers = [[NSMutableArray alloc] init];

  if (!offersArray || [offersArray count] == 0) {
    [AEPLog debugWithLabel:TAG message:@"getNativeOffersFromOffersArray: offersArray is null or empty"];
    return nativeOffers;
  }

  for (NSDictionary<NSString *, id> *offerDict in offersArray) {
    if (!offerDict) {
      [AEPLog debugWithLabel:TAG message:@"getNativeOffersFromOffersArray: offer is null"];
      continue;
    }
    
    NSString *uniquePropositionId = [offerDict objectForKey:@"uniquePropositionId"];
    NSString *offerId = [offerDict objectForKey:@"id"];
        
    if (!uniquePropositionId || !offerId) {
      [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"getNativeOffersFromOffersArray: uniquePropositionId or offerId is null for offer: %@", offerDict]];
      continue;
    }
    
    AEPOptimizeProposition *proposition = [propositionCache objectForKey:uniquePropositionId];
    if (!proposition) {
      [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"getNativeOffersFromOffersArray: proposition not found in cache for uniquePropositionId: %@", uniquePropositionId]];
      continue;
    }

    NSArray<AEPOffer *> *offers = [proposition offers];
    for (AEPOffer *propositionOffer in offers) {
      if ([[propositionOffer id] isEqualToString:offerId]) {
        [nativeOffers addObject:propositionOffer];
        break;
      }
    }
  }

  return nativeOffers;
}

#pragma mark - Cache Management

- (void)cachePropositions:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
    for (AEPDecisionScope *key in decisionScopePropositionDict) {
        AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
        if (!proposition) {
            [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"cachePropositions: proposition is null for decisionScope: %@", key]];
            continue;
        }
        
        NSString *activityId = nil;

        NSDictionary *propositionDict = [self convertPropositionToDict:proposition];
        NSDictionary *activity = [propositionDict valueForKey:@"activity"];
        if ([propositionDict objectForKey:@"activity"]) {
          if (activity && [activity objectForKey:@"id"]) {
              activityId = [activity objectForKey:@"id"];
          }
        } else {
          NSDictionary *scopeDetails = [propositionDict valueForKey:@"scopeDetails"];
          if (scopeDetails && [scopeDetails objectForKey:@"activity"]) {
            NSDictionary *scopeDetailsActivity = [scopeDetails objectForKey:@"activity"];
            if (scopeDetailsActivity && [scopeDetailsActivity objectForKey:@"id"]) {
              activityId = [scopeDetailsActivity objectForKey:@"id"];
            }
          }
        }

        if (activityId) {
          [propositionCache setObject:proposition forKey:activityId];
        }
    }
}

- (void)clearPropositionsCache {
    [propositionCache removeAllObjects];
}

#pragma mark - Helper methods

- (NSArray<AEPDecisionScope *> *)createDecisionScopesArray:
    (NSArray<NSString *> *)decisionScopes {
  NSMutableArray<AEPDecisionScope *> *decisionScopesArray =
      [[NSMutableArray alloc] init];
  for (NSString *decisionScopeName in decisionScopes) {
    [decisionScopesArray
        addObject:[[AEPDecisionScope alloc] initWithName:decisionScopeName]];
  }
  return decisionScopesArray;
}

- (NSDictionary<NSString *, NSDictionary<NSString *, id> *> *)
    convertPropositionToDict:(AEPOptimizeProposition *)proposition {
  NSDictionary<NSString *, id> *propositionDict =
      [[NSMutableDictionary alloc] init];
  if (!proposition) {
    return propositionDict;
  }

  [propositionDict setValue:proposition.id forKey:@"id"];
  [propositionDict setValue:proposition.scope forKey:@"scope"];
  [propositionDict setValue:[proposition scopeDetails] forKey:@"scopeDetails"];

  NSMutableArray<NSDictionary<NSString *, id> *> *offersArray =
      [[NSMutableArray alloc] init];
  for (AEPOffer *offer in proposition.offers) {
    [offersArray addObject:[self convertOfferToDict:offer]];
  }
  [propositionDict setValue:offersArray forKey:@"items"];

  if ([proposition activity]) {
    [propositionDict setValue:[proposition activity] forKey:@"activity"];
  }
  if ([proposition placement]) {
    [propositionDict setValue:[proposition placement] forKey:@"placement"];
  }
  return propositionDict;
}

- (NSDictionary<NSString *, id> *)convertOfferToDict:(AEPOffer *)offer {
  NSMutableDictionary<NSString *, id> *offerDict =
      [[NSMutableDictionary alloc] init];
  if (!offer) {
    return offerDict;
  }

  [offerDict setValue:offer.id forKey:@"id"];
  if ([offer etag] != nil) {
    [offerDict setValue:[offer etag] forKey:@"etag"];
  }
  if ([offer meta] != nil) {
    [offerDict setValue:[offer meta] forKey:@"meta"];
  }
  [offerDict setValue:[offer schema] forKey:@"schema"];
  [offerDict setValue:@([offer score]) forKey:@"score"];

  NSDictionary<NSString *, id> *data = [[NSMutableDictionary alloc] init];
  [data setValue:[offer id] forKey:@"id"];
  [data setValue:[self convertOfferTypeToString:[offer type]] forKey:@"format"];
  [data setValue:[offer content] forKey:@"content"];
  if ([offer language] != nil) {
    [data setValue:[offer language] forKey:@"language"];
  }
  if ([offer characteristics] != nil) {
    [data setValue:[offer characteristics] forKey:@"characteristics"];
  }

  [offerDict setValue:data forKey:@"data"];
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

// Helper to convert NSError to a structured error dictionary for JS
- (NSDictionary *)convertNSErrorToOptimizeErrorDict:(NSError *)error {
    if (!error) return @{};
    NSMutableDictionary *errorDict = [NSMutableDictionary dictionary];

    // Log for debugging
    NSLog(@"[AEPOptimize] NSError.domain: %@", error.domain);
    NSLog(@"[AEPOptimize] NSError.code: %ld", (long)error.code);
    NSLog(@"[AEPOptimize] NSError.userInfo: %@", error.userInfo);
    NSLog(@"[AEPOptimize] NSError.localizedDescription: %@", error.localizedDescription);

    // Extract AEPOptimizeError properties from userInfo (matches Android structure)
    NSDictionary *userInfo = error.userInfo;

    errorDict[@"type"] = userInfo[@"type"] ?: @"";
    errorDict[@"status"] = userInfo[@"status"] ?: @(error.code);
    errorDict[@"title"] = userInfo[@"title"] ?: @"";
    errorDict[@"detail"] = userInfo[@"detail"] ?: @"";
    errorDict[@"report"] = userInfo[@"report"] ?: @{};
    
    // Handle aepError - check for both nil and NSNull
    id aepErrorValue = userInfo[@"aepError"];
    if (aepErrorValue && aepErrorValue != [NSNull null]) {
        errorDict[@"aepError"] = aepErrorValue;
    } else {
        errorDict[@"aepError"] = @"general.unexpected";
    }

    return errorDict;
}

// Helper method to create standardized response for callbacks
- (NSDictionary *)createCallbackResponse:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
    
    if (decisionScopePropositionDict && [decisionScopePropositionDict count] > 0) {
        // Return the propositions map directly
        return [self createPropositionDictionary:decisionScopePropositionDict];
    }
    
    return @{};
}

- (void)handleError:(NSError *)error rejecter:(RCTPromiseRejectBlock)reject {
  if (!error || !reject) {
    return;
  }

  NSDictionary *userInfo = [error userInfo];
  NSString *errorString =
      [[userInfo objectForKey:NSUnderlyingErrorKey] localizedDescription];

  reject([NSString stringWithFormat:@"%lu", (long)error.code], errorString,
         error);
}

#pragma mark - RCTEventEmitter functions

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onPropositionsUpdate" ];
}

- (void)startObserving {
  // Turbo-only: no RCTEventEmitter; no-op.
}

- (void)stopObserving {
  // Turbo-only: no-op.
}

#if RCT_NEW_ARCH_ENABLED
#pragma mark - NativeAEPOptimizeSpec (Turbo Module protocol)

+ (NSString *)moduleName {
  return @"NativeAEPOptimize";
}

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [self extensionVersion:resolve rejecter:reject];
}

- (void)getPropositions:(NSArray *)decisionScopeNames
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  [self getPropositions:decisionScopeNames resolver:resolve rejector:reject];
}

- (void)updatePropositions:(NSArray *)decisionScopeNames
                       xdm:(NSDictionary *)xdm
                      data:(NSDictionary *)data
                 onSuccess:(RCTResponseSenderBlock)onSuccess
                   onError:(RCTResponseSenderBlock)onError {
  [self updatePropositions:decisionScopeNames withXdm:xdm andData:data successCallback:onSuccess errorCallback:onError];
}

- (void)offerDisplayed:(NSString *)offerId propositionMap:(NSDictionary *)propositionMap {
  [self offerDisplayed:offerId propositionDictionary:propositionMap];
}

- (void)offerTapped:(NSString *)offerId propositionMap:(NSDictionary *)propositionMap {
  [self offerTapped:offerId propositionDictionary:propositionMap];
}

- (void)generateDisplayInteractionXdm:(NSString *)offerId
                       propositionMap:(NSDictionary *)propositionMap
                              resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject {
  [self generateDisplayInteractionXdm:offerId propositionDictionary:propositionMap resolver:resolve rejector:reject];
}

- (void)generateTapInteractionXdm:(NSString *)offerId
                   propositionMap:(NSDictionary *)propositionMap
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
  [self generateTapInteractionXdm:offerId propositionDictionary:propositionMap resolver:resolve rejector:reject];
}

- (void)generateReferenceXdm:(NSDictionary *)propositionMap
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject {
  [self generateReferenceXdm:propositionMap resolver:resolve rejector:reject];
}

- (void)multipleOffersGenerateDisplayInteractionXdm:(NSArray *)offersArray
                                           resolve:(RCTPromiseResolveBlock)resolve
                                            reject:(RCTPromiseRejectBlock)reject {
  [self multipleOffersGenerateDisplayInteractionXdm:offersArray resolver:resolve rejector:reject];
}

- (void)addListener:(NSString *)eventName {
  // Turbo-only: no RCTEventEmitter superclass; listener stored if needed for future event support.
}

- (void)removeListeners:(double)count {
  // Turbo-only: no-op without RCTEventEmitter.
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}
#endif

@end
