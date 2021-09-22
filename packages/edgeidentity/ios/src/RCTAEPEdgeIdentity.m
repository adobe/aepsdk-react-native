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

#import "RCTAEPEdgeIdentity.h"
@import AEPEdgeIdentity;

@implementation RCTAEPEdgeIdentity

static NSString* const EXTENSION_NAME = @"AEPEdgeIdentity";
static NSString* const FAILED_TO_CONVERT_EVENT_MESSAGE = @"Failed getting ECID";

RCT_EXPORT_MODULE(AEPEdgeIdentity);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdgeIdentity extensionVersion]);
}

RCT_EXPORT_METHOD(getExperienceCloudId:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdgeIdentity getExperienceCloudId:^(NSString * _Nullable experienceCloudId, NSError * _Nullable error) {
        if (error) {
            reject(EXTENSION_NAME, FAILED_TO_CONVERT_EVENT_MESSAGE, nil);
            return;
        } else {
            resolve(experienceCloudId);
        }
    }];
}
@end
  
