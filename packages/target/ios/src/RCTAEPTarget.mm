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

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_TARGET_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_TARGET_METHOD(method) - (void)method
#endif
#import "RCTAEPTarget.h"
#import "AEPTargetParametersDataBridge.h"
#import "AEPTargetPrefetchObjectDataBridge.h"
#import "AEPTargetRequestObjectDataBridge.h"

@implementation RCTAEPTarget

RCT_EXPORT_MODULE(NativeAEPTarget);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPTargetSpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

AEP_TARGET_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  resolve([AEPMobileTarget extensionVersion]);
}

AEP_TARGET_METHOD(clearPrefetchCache) { [AEPMobileTarget clearPrefetchCache]; }

AEP_TARGET_METHOD(getThirdPartyId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget getThirdPartyId:^(NSString *_Nullable thirdPartyId,
                                     NSError *_Nullable error) {
    resolve(thirdPartyId);
  }];
}

AEP_TARGET_METHOD(getSessionId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget
      getSessionId:^(NSString *_Nullable sessionId, NSError *_Nullable error) {
        resolve(sessionId);
      }];
}

AEP_TARGET_METHOD(getTntId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobileTarget
      getTntId:^(NSString *_Nullable tntId, NSError *_Nullable error) {
        resolve(tntId);
      }];
}

AEP_TARGET_METHOD(resetExperience) { [AEPMobileTarget resetExperience]; }

AEP_TARGET_METHOD(setPreviewRestartDeeplink:(NSString *)deepLink) {
  NSURL *url = [NSURL URLWithString:deepLink];
  if (url) {
    [AEPMobileTarget setPreviewRestartDeepLink:url];
  } else {
    NSLog(@"AdobeExperienceSDK: Error, deepLink is not a valid URL in "
          @"clickedLocation");
  }
}

AEP_TARGET_METHOD(setSessionId:(NSString *)sessionId) {
  [AEPMobileTarget setSessionId:sessionId];
}

AEP_TARGET_METHOD(setTntId:(NSString *)tntId) {
  [AEPMobileTarget setTntId:tntId];
}

AEP_TARGET_METHOD(setThirdPartyId:(NSString *)thirdPartyId) {
  [AEPMobileTarget setThirdPartyId:thirdPartyId];
}

AEP_TARGET_METHOD(retrieveLocationContent:(NSArray *)requests
                  parameters:(NSDictionary *)parameters) {

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

// Shared by prefetchContent and prefetchContentWithTimeout. A nil timeout uses the SDK default.
static void AEPTargetPrefetch(NSArray *prefetchObjectArray,
                              NSDictionary *parameters, NSNumber *timeout,
                              RCTPromiseResolveBlock resolve,
                              RCTPromiseRejectBlock reject) {
  NSMutableArray *prefetchObjArray = [NSMutableArray array];

  for (NSDictionary *prefetchDict in prefetchObjectArray) {
    AEPTargetPrefetchObject *obj =
        [AEPTargetPrefetchObject prefetchObjectFromDict:prefetchDict];
    [prefetchObjArray addObject:obj];
  }

  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];

  void (^completion)(NSError *_Nullable) = ^(NSError *_Nullable error) {
    if (error) {
      NSString *errorCode =
          [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(errorCode, [error localizedDescription], error);
    } else {
      resolve(@(YES));
    }
  };

  if (timeout) {
    [AEPMobileTarget prefetchContent:prefetchObjArray
                      withParameters:parametersObj
                             timeout:[timeout doubleValue]
                            callback:completion];
  } else {
    [AEPMobileTarget prefetchContent:prefetchObjArray
                      withParameters:parametersObj
                            callback:completion];
  }
}

AEP_TARGET_METHOD(prefetchContent:(NSArray *)prefetchObjectArray
                  parameters:(NSDictionary *)parameters
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  AEPTargetPrefetch(prefetchObjectArray, parameters, nil, resolve, reject);
}

AEP_TARGET_METHOD(prefetchContentWithTimeout:(NSArray *)prefetchObjectArray
                  parameters:(NSDictionary *)parameters
                  timeout:(double)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  AEPTargetPrefetch(prefetchObjectArray, parameters, @(timeout), resolve,
                    reject);
}

AEP_TARGET_METHOD(displayedLocations:(NSArray *)mboxNames
                  parameters:(NSDictionary *)parameters) {
  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];
  [AEPMobileTarget displayedLocations:mboxNames
                 withTargetParameters:parametersObj];
}

AEP_TARGET_METHOD(clickedLocation:(NSString *)name
                  parameters:(NSDictionary *)parameters) {
  AEPTargetParameters *parametersObj =
      [AEPTargetParameters targetParametersFromDict:parameters];
  [AEPMobileTarget clickedLocation:name withTargetParameters:parametersObj];
}

AEP_TARGET_METHOD(registerTargetRequests:(NSDictionary *)requestDict
                  callback:(RCTResponseSenderBlock)callback) {
  AEPTargetRequestObject *obj;

  if ([requestDict[@"detailedCallback"] boolValue]) {
    obj = [AEPTargetRequestObject
        targetRequestObjectFromDict:requestDict
            contentWithDataCallback:^(NSString *_Nullable content,
                                      NSDictionary<NSString *, id> *_Nullable data) {
              callback(@[
                [NSNull null], content ?: [NSNull null], data ?: [NSNull null]
              ]);
            }];
  } else {
    obj = [AEPTargetRequestObject
        targetRequestObjectFromDict:requestDict
                           callback:^(NSString *_Nullable content) {
                             callback(@[ [NSNull null], content ?: [NSNull null] ]);
                           }];
  }

  if (!_registeredTargetRequests) {
    _registeredTargetRequests = [NSMutableDictionary dictionary];
  }

  _registeredTargetRequests[requestDict[@"id"]] = obj;
}

@end
