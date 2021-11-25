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

#import "RCTAEPEdgeConsent.h"
@import AEPEdgeConsent;
@import AEPCore;

@implementation RCTAEPEdgeConsent

static NSString* const EXTENSION_NAME = @"AEPEdgeConsent";

RCT_EXPORT_MODULE(AEPEdgeConsent);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdgeConsent extensionVersion]);
}

RCT_EXPORT_METHOD(update: (nonnull NSDictionary*)consents) {
    [AEPMobileEdgeConsent updateWithConsents:consents];
}

RCT_EXPORT_METHOD(getConsents:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdgeConsent getConsents:^(NSDictionary* consents, NSError* error) {
        if (error && error.code != AEPErrorNone) {
            if (error.code == AEPErrorCallbackTimeout) {
                reject(EXTENSION_NAME, [NSString stringWithFormat:@"getConsents - Request timed out"], error);
            } else {
                reject(EXTENSION_NAME, [NSString stringWithFormat:@"getConsents - Failed to retrieve consent"], error);
            }
            return;
        }
        
        resolve(consents);
    }];
}

@end
  
