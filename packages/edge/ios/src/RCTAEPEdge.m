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

#import "RCTAEPEdge.h"
@import AEPEdge;
@import AEPCore;
#import "RCTAEPExperienceEventDataBridge.h"

@implementation RCTAEPEdge

RCT_EXPORT_MODULE(AEPEdge);

static NSString* const EXTENSION_NAME = @"AEPEdge";
static NSString* const FAILED_TO_CONVERT_EXPERIENCE_EVENT = @"Failed to convert dictionary to Experience Event, Experience Event could be null.";

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdge extensionVersion]);
}


RCT_EXPORT_METHOD(sendEvent: (nonnull NSDictionary*) experienceEventDict resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    AEPExperienceEvent *experienceEvent = [RCTAEPExperienceEventDataBridge experienceEventFromDictionary:experienceEventDict];

    if (!experienceEvent) {
        reject(EXTENSION_NAME, FAILED_TO_CONVERT_EXPERIENCE_EVENT, nil);
        return;
    }
    
    [AEPMobileEdge sendExperienceEvent:experienceEvent completion:^(NSArray<AEPEdgeEventHandle *> * _Nonnull handles) {
        resolve([RCTAEPExperienceEventDataBridge dictionaryFromEdgeEventHandler:handles]);
    }];
}

RCT_EXPORT_METHOD(getLocationHint: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdge getLocationHint:^(NSString * _Nullable content, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getLocationHint"];
        } else {
            resolve(content);
        }
    }];
}

RCT_EXPORT_METHOD(setLocationHint: (nullable NSString*) hint) {
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
