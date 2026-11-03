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


// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_EDGE_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_EDGE_METHOD(method) - (void)method
#endif
#import "RCTAEPEdge.h"
@import AEPEdge;
@import AEPCore;
#import "RCTAEPExperienceEventDataBridge.h"

@implementation RCTAEPEdge

RCT_EXPORT_MODULE(NativeAEPEdge);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPEdgeSpecJSI>(params);
}
#endif

static NSString* const EXTENSION_NAME = @"AEPEdge";
static NSString* const FAILED_TO_CONVERT_EXPERIENCE_EVENT = @"Failed to convert dictionary to Experience Event, Experience Event could be null.";

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

AEP_EDGE_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdge extensionVersion]);
}


AEP_EDGE_METHOD(sendEvent: (NSDictionary *)experienceEventDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    
    AEPExperienceEvent *experienceEvent = [RCTAEPExperienceEventDataBridge experienceEventFromDictionary:experienceEventDict];

    if (!experienceEvent) {
        reject(EXTENSION_NAME, FAILED_TO_CONVERT_EXPERIENCE_EVENT, nil);
        return;
    }
    
    [AEPMobileEdge sendExperienceEvent:experienceEvent completion:^(NSArray<AEPEdgeEventHandle *> * _Nonnull handles) {
        resolve([RCTAEPExperienceEventDataBridge dictionaryFromEdgeEventHandler:handles]);
    }];
}

AEP_EDGE_METHOD(getLocationHint: (RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdge getLocationHint:^(NSString * _Nullable content, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getLocationHint"];
        } else {
            resolve(content);
        }
    }];
}

AEP_EDGE_METHOD(setLocationHint: (nullable NSString*) hint) {
    [AEPMobileEdge setLocationHint:hint];
}

- (void) handleError:(NSError *) error rejecter:(RCTPromiseRejectBlock) reject errorLocation:(NSString *) location {
    NSString *errorTimeOut = [NSString stringWithFormat:@"%@ call timed out", location];
    NSString *errorUnexpected = [NSString stringWithFormat:@"%@ call returned an unexpected error", location];

    if (!error || !reject) {
        return;
    }

    if (error && error.code != AEPErrorNone) {
        if (error.code == AEPErrorCallbackTimeout) {
        reject(EXTENSION_NAME, errorTimeOut, error);
        }
    } else {
        reject(EXTENSION_NAME, errorUnexpected, error);
    }

}


@end
