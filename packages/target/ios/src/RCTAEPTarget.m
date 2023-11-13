/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance with the License. You
may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
REPRESENTATIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

@import AEPCore;
@import AEPTarget;
#import "RCTAEPTarget.h"
#import "AEPTargetParametersDataBridge.h"
#import "AEPTargetPrefetchObjectDataBridge.h"
#import "AEPTargetRequestObjectDataBridge.h"

@implementation RCTAEPTarget

RCT_EXPORT_MODULE(AEPTarget);

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  resolve([AEPMobileTarget extensionVersion]);
}

RCT_EXPORT_METHOD(clearPrefetchCache) { [AEPMobileTarget clearPrefetchCache]; }

RCT_EXPORT_METHOD(getThirdPartyId
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget getThirdPartyId:^(NSString *_Nullable thirdPartyId,
                                     NSError *_Nullable error) {
    resolve(thirdPartyId);
  }];
}

RCT_EXPORT_METHOD(getSessionId
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget
      getSessionId:^(NSString *_Nullable sessionId, NSError *_Nullable error) {
        resolve(sessionId);
      }];
}

RCT_EXPORT_METHOD(getTntId
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget
      getTntId:^(NSString *_Nullable tntId, NSError *_Nullable error) {
        resolve(tntId);
      }];
}

RCT_EXPORT_METHOD(resetExperience) { [AEPMobileTarget resetExperience]; }

RCT_EXPORT_METHOD(setPreviewRestartDeeplink : (nonnull NSString *)deepLink) {
  NSURL *url = [NSURL URLWithString:deepLink];
  if (url) {
    [AEPMobileTarget setPreviewRestartDeepLink:url];
  } else {
    NSLog(@"AdobeExperienceSDK: Error, deepLink is not a valid URL in "
          @"clickedLocation");
  }
}

RCT_EXPORT_METHOD(setSessionId : (nonnull NSString *)sessionId) {
  [AEPMobileTarget setSessionId:sessionId];
}

RCT_EXPORT_METHOD(setTntId : (nonnull NSString *)tntId) {
  [AEPMobileTarget setTntId:tntId];
}

RCT_EXPORT_METHOD(setThirdPartyId : (nonnull NSString *)thirdPartyId) {
  [AEPMobileTarget setThirdPartyId:thirdPartyId];
}

RCT_EXPORT_METHOD(retrieveLocationContent
                  : (nonnull NSArray *)requests withParameters
                  : (nullable NSDictionary *)parameters) {

  NSMutableArray *requestsArr = [NSMutableArray array];
  for (NSDictionary *requestDict in requests) {
    NSString *identifier = requestDict[@"id"];

    if (_registeredTargetRequests[identifier]) {
      [requestsArr addObject:_registeredTargetRequests[identifier]];
    }
  }

  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];

  [AEPMobileTarget retrieveLocationContent:requestsArr
                            withParameters:parametersObj];
}

RCT_EXPORT_METHOD(prefetchContent
                  : (nonnull NSArray *)prefetchObjectArray withParameters
                  : (nullable NSDictionary *)parameters resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  NSMutableArray *prefetchObjArray = [NSMutableArray array];

  for (NSDictionary *prefetchDict in prefetchObjectArray) {
    AEPTargetPrefetchObject *obj =
        [AEPTargetPrefetchObject prefetchObjectFromDict:prefetchDict];
    [prefetchObjArray addObject:obj];
  }

  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];

  [AEPMobileTarget
      prefetchContent:prefetchObjArray
       withParameters:parametersObj
             callback:^(NSError *_Nullable error) {
               if (error) {
                 NSString *errorCode =
                     [NSString stringWithFormat:@"%ld", (long)error.code];
                 reject(errorCode, [error localizedDescription], error);
               } else {
                 resolve(@(YES));
               }
             }];
}

RCT_EXPORT_METHOD(displayedLocations
                  : (nonnull NSArray *)mboxNames withTargetParameters
                  : (nullable NSDictionary *)parameters) {
  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];
  [AEPMobileTarget displayedLocations:mboxNames
                 withTargetParameters:parametersObj];
}

RCT_EXPORT_METHOD(clickedLocation
                  : (nonnull NSString *)name targetParameters
                  : (nullable NSDictionary *)parameters) {
  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];
  [AEPMobileTarget clickedLocation:name withTargetParameters:parametersObj];
}

RCT_EXPORT_METHOD(registerTargetRequests
                  : (nonnull NSDictionary *)requestDict callback
                  : (RCTResponseSenderBlock)callback) {
  AEPTargetRequestObject *obj = [AEPTargetRequestObject
      targetRequestObjectFromDict:requestDict
                         callback:^(NSString *_Nullable content) {
                           callback(@[ [NSNull null], content ]);
                         }];

  if (!_registeredTargetRequests) {
    _registeredTargetRequests = [NSMutableDictionary dictionary];
  }

  _registeredTargetRequests[requestDict[@"id"]] = obj;
}

RCT_EXPORT_METHOD(registerTargetRequestsWithData
                  : (nonnull NSDictionary *)requestDict callback
                  : (RCTResponseSenderBlock)callback) {
    
 TargetRequestCallbackWithData contentWithDataCallback = ^void(NSString * _Nullable content, NSDictionary<NSString *,id> * _Nullable data) {
     NSDictionary *test = [[NSDictionary alloc] initWithDictionary: data];
     callback(@[ [NSNull null], content, test]);
 };
    
  AEPTargetRequestObject *obj = [AEPTargetRequestObject
             targetRequestObjectWithDataFromDict:requestDict
                                 contentWithDataCallback: contentWithDataCallback];

  if (!_registeredTargetRequests) {
    _registeredTargetRequests = [NSMutableDictionary dictionary];
  }

  _registeredTargetRequests[requestDict[@"id"]] = obj;
}

@end
