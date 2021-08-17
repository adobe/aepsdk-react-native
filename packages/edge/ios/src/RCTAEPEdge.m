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

#import "RCTAEPEdge.h"
@import AEPEdge;
@import AEPCore;
#import "RCTAEPExperienceEventDataBridge.h"

@implementation RCTAEPEdge

RCT_EXPORT_MODULE(AEPEdge);

static NSString* const EXTENSION_NAME = @"AEPEdge";
static NSString* const FAILED_TO_CONVERT_EXPERIENCE_EVENT = @"Failed to convert dictionary to Experience Event";

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

    [AEPMobileEdge sendEvent:experienceEvent completion:^(NSArray<AEPEdgeEventHandle *> * _Nonnull handles){
        resolve(handles);
            }];
}

@end
