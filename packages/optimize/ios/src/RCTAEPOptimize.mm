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

static NSString *const TAG = @"RCTAEPOptimize";

@implementation RCTAEPOptimize {
  bool hasListeners;
  NSMutableDictionary<NSString *, AEPOptimizeProposition *> *propositionCache;
}

- (instancetype)init {
  self = [super init];
  hasListeners = false;
  propositionCache = [[NSMutableDictionary alloc] init];
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

// ──────────────────────────────────────────────────────────────────────────────
// USE_INTEROP_ROOT = 1 → RCTEventEmitter base class + RCT_EXPORT_MODULE bridge
//                        registration. getTurboModule: still returns
//                        NativeAEPOptimizeSpecJSI so the codegen RCTModuleProvider
//                        check passes and TurboModuleRegistry resolves correctly.
// USE_INTEROP_ROOT = 0 → NSObject <NativeAEPOptimizeSpec>; +moduleName only.
//                        Pure JSI/TurboModule path.
// getTurboModule: is shared — both paths return NativeAEPOptimizeSpecJSI.
// ──────────────────────────────────────────────────────────────────────────────

#if USE_INTEROP_ROOT
// ── Interop path ──────────────────────────────────────────────────────────────
// Bridge registration so the module is also reachable via the legacy bridge.
RCT_EXPORT_MODULE(NativeAEPOptimize);
#else
// ── Turbo Module path ─────────────────────────────────────────────────────────
+ (NSString *)moduleName { return @"NativeAEPOptimize"; }
#endif

// Shared for both paths: returns the codegen-generated JSI spec so
// TurboModuleRegistry.getEnforcing('NativeAEPOptimize') resolves and all
// protocol methods are dispatched correctly via NativeAEPOptimizeSpecJSI.
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}

#pragma mark - NativeAEPOptimizeSpec protocol methods

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
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
  NSArray<AEPDecisionScope *> *decisionScopesArray =
      [self createDecisionScopesArray:decisionScopeNames];
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
               NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *>
                   *propositionDictionary = [[NSMutableDictionary alloc] init];
               for (AEPDecisionScope *key in decisionScopePropositionDict) {
                 AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
                 [propositionDictionary
                     setValue:[self convertPropositionToDict:proposition]
                       forKey:key.name];
               }
               resolve(propositionDictionary);
             }
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
          if (onError != nil) { onError(@[errorDict]); }
      }
      if (decisionScopePropositionDict) {
          [self cachePropositions:decisionScopePropositionDict];
          NSDictionary *propositions = [self createCallbackResponse:decisionScopePropositionDict];
          if (onSuccess != nil) { onSuccess(@[propositions]); }
      }
  }];
}

- (void)onPropositionsUpdate {
  [AEPLog traceWithLabel:TAG message:@"onPropositionsUpdate is called."];
  [AEPMobileOptimize onPropositionsUpdate:^(
                         NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *>
                             *decisionScopePropositionDict) {
    [self cachePropositions:decisionScopePropositionDict];
    NSMutableDictionary<NSString *, NSDictionary<NSString *, id> *>
        *propositionDictionary = [[NSMutableDictionary alloc] init];
    for (AEPDecisionScope *key in decisionScopePropositionDict) {
      AEPOptimizeProposition *proposition = decisionScopePropositionDict[key];
      [propositionDictionary setValue:[self convertPropositionToDict:proposition]
                               forKey:key.name];
    }
    if (self->hasListeners) {
#if USE_INTEROP_ROOT
      [self sendEventWithName:@"onPropositionsUpdate" body:propositionDictionary];
#endif
    }
  }];
}

- (void)multipleOffersDisplayed:(NSArray *)offersArray {
  [AEPLog debugWithLabel:TAG message:@"multipleOffersDisplayed is called."];
  NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];
  if ([nativeOffers count] > 0) {
    [AEPMobileOptimize displayed:nativeOffers];
  }
}

- (void)multipleOffersGenerateDisplayInteractionXdm:(NSArray *)offersArray
                                            resolve:(RCTPromiseResolveBlock)resolve
                                             reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"multipleOffersGenerateDisplayInteractionXdm is called."];
  NSMutableArray<AEPOffer *> *nativeOffers = [self getNativeOffersFromOffersArray:offersArray];
  if ([nativeOffers count] > 0) {
    resolve([AEPMobileOptimize generateDisplayInteractionXdm:nativeOffers]);
  } else {
    reject(@"generateDisplayInteractionXdmForMultipleOffers", @"Error in generating Display interaction XDM for multiple offers.", nil);
  }
}

- (void)offerDisplayed:(NSString *)offerId
        propositionMap:(NSDictionary *)dictionary {
  [AEPLog debugWithLabel:TAG message:@"Offer Displayed"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) { [offer displayed]; break; }
  }
}

- (void)offerTapped:(NSString *)offerId
     propositionMap:(NSDictionary *)dictionary {
  [AEPLog debugWithLabel:TAG message:@"Offer Tapped"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) { [offer tapped]; break; }
  }
}

- (void)generateDisplayInteractionXdm:(NSString *)offerId
                       propositionMap:(NSDictionary *)dictionary
                              resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateDisplayInteractionXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerDisplayed = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) { offerDisplayed = offer; break; }
  }
  if (offerDisplayed != nil) {
    resolve([offerDisplayed generateDisplayInteractionXdm]);
  } else {
    reject(@"generateDisplayInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Display interaction XDM for offer with id: %@", offerId], nil);
  }
}

- (void)generateTapInteractionXdm:(NSString *)offerId
                   propositionMap:(NSDictionary *)dictionary
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"generateTapInteractionXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  NSArray<AEPOffer *> *offers = [proposition offers];
  AEPOffer *offerInteracted = nil;
  for (AEPOffer *offer in offers) {
    if ([[offer id] isEqualToString:offerId]) { offerInteracted = offer; break; }
  }
  if (offerInteracted != nil) {
    resolve([offerInteracted generateTapInteractionXdm]);
  } else {
    reject(@"generateTapInteractionXdm",
           [NSString stringWithFormat:@"Error in generating Tap interaction XDM for offer with id: %@", offerId], nil);
  }
}

- (void)generateReferenceXdm:(NSDictionary *)dictionary
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
  [AEPLog debugWithLabel:TAG message:@"Proposition generateReferenceXdm"];
  AEPOptimizeProposition *proposition = [AEPOptimizeProposition initFromData:dictionary];
  resolve([proposition generateReferenceXdm]);
}

- (void)addListener:(NSString *)eventName {
  hasListeners = true;
}

- (void)removeListeners:(double)count {
  hasListeners = false;
}

#if USE_INTEROP_ROOT
#pragma mark - RCTEventEmitter (interop only)

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onPropositionsUpdate" ];
}

- (void)startObserving {
  hasListeners = true;
}

- (void)stopObserving {
  hasListeners = false;
}
#endif

#pragma mark - Shared helper methods

- (NSMutableArray<AEPOffer *> *)getNativeOffersFromOffersArray:(NSArray *)offersArray {
  NSMutableArray<AEPOffer *> *nativeOffers = [[NSMutableArray alloc] init];
  if (!offersArray || [offersArray count] == 0) {
    [AEPLog debugWithLabel:TAG message:@"getNativeOffersFromOffersArray: offersArray is null or empty"];
    return nativeOffers;
  }
  for (NSDictionary<NSString *, id> *offerDict in offersArray) {
    if (!offerDict) { continue; }
    NSString *uniquePropositionId = [offerDict objectForKey:@"uniquePropositionId"];
    NSString *offerId = [offerDict objectForKey:@"id"];
    if (!uniquePropositionId || !offerId) {
      [AEPLog debugWithLabel:TAG message:[NSString stringWithFormat:@"getNativeOffersFromOffersArray: uniquePropositionId or offerId is null for offer: %@", offerDict]];
      continue;
    }
    AEPOptimizeProposition *proposition = [propositionCache objectForKey:uniquePropositionId];
    if (!proposition) { continue; }
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
        if (!proposition) { continue; }
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

- (NSArray<AEPDecisionScope *> *)createDecisionScopesArray:
    (NSArray<NSString *> *)decisionScopes {
  NSMutableArray<AEPDecisionScope *> *decisionScopesArray = [[NSMutableArray alloc] init];
  for (NSString *decisionScopeName in decisionScopes) {
    [decisionScopesArray addObject:[[AEPDecisionScope alloc] initWithName:decisionScopeName]];
  }
  return decisionScopesArray;
}

- (NSDictionary<NSString *, NSDictionary<NSString *, id> *> *)
    convertPropositionToDict:(AEPOptimizeProposition *)proposition {
  NSDictionary<NSString *, id> *propositionDict = [[NSMutableDictionary alloc] init];
  if (!proposition) { return propositionDict; }
  [propositionDict setValue:proposition.id forKey:@"id"];
  [propositionDict setValue:proposition.scope forKey:@"scope"];
  [propositionDict setValue:[proposition scopeDetails] forKey:@"scopeDetails"];
  NSMutableArray<NSDictionary<NSString *, id> *> *offersArray = [[NSMutableArray alloc] init];
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
  NSMutableDictionary<NSString *, id> *offerDict = [[NSMutableDictionary alloc] init];
  if (!offer) { return offerDict; }
  [offerDict setValue:offer.id forKey:@"id"];
  if ([offer etag] != nil) { [offerDict setValue:[offer etag] forKey:@"etag"]; }
  if ([offer meta] != nil) { [offerDict setValue:[offer meta] forKey:@"meta"]; }
  [offerDict setValue:[offer schema] forKey:@"schema"];
  [offerDict setValue:@([offer score]) forKey:@"score"];
  NSDictionary<NSString *, id> *data = [[NSMutableDictionary alloc] init];
  [data setValue:[offer id] forKey:@"id"];
  [data setValue:[self convertOfferTypeToString:[offer type]] forKey:@"format"];
  [data setValue:[offer content] forKey:@"content"];
  if ([offer language] != nil) { [data setValue:[offer language] forKey:@"language"]; }
  if ([offer characteristics] != nil) { [data setValue:[offer characteristics] forKey:@"characteristics"]; }
  [offerDict setValue:data forKey:@"data"];
  return offerDict;
}

- (NSString *)convertOfferTypeToString:(AEPOfferType)offerType {
  switch (offerType) {
  case AEPOfferTypeHtml:  return @"text/html";
  case AEPOfferTypeJson:  return @"application/json";
  case AEPOfferTypeText:  return @"text/plain";
  case AEPOfferTypeImage: return @"image/*";
  default:                return @"";
  }
}

- (NSDictionary *)convertNSErrorToOptimizeErrorDict:(NSError *)error {
    if (!error) return @{};
    NSMutableDictionary *errorDict = [NSMutableDictionary dictionary];
    NSDictionary *userInfo = error.userInfo;
    errorDict[@"type"] = userInfo[@"type"] ?: @"";
    errorDict[@"status"] = userInfo[@"status"] ?: @(error.code);
    errorDict[@"title"] = userInfo[@"title"] ?: @"";
    errorDict[@"detail"] = userInfo[@"detail"] ?: @"";
    errorDict[@"report"] = userInfo[@"report"] ?: @{};
    id aepErrorValue = userInfo[@"aepError"];
    if (aepErrorValue && aepErrorValue != [NSNull null]) {
        errorDict[@"aepError"] = aepErrorValue;
    } else {
        errorDict[@"aepError"] = @"general.unexpected";
    }
    return errorDict;
}

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

- (NSDictionary *)createCallbackResponse:(NSDictionary<AEPDecisionScope *, AEPOptimizeProposition *> *)decisionScopePropositionDict {
    if (decisionScopePropositionDict && [decisionScopePropositionDict count] > 0) {
        return [self createPropositionDictionary:decisionScopePropositionDict];
    }
    return @{};
}

- (void)handleError:(NSError *)error rejecter:(RCTPromiseRejectBlock)reject {
  if (!error || !reject) { return; }
  NSDictionary *userInfo = [error userInfo];
  NSString *errorString = [[userInfo objectForKey:NSUnderlyingErrorKey] localizedDescription];
  reject([NSString stringWithFormat:@"%lu", (long)error.code], errorString, error);
}

@end
