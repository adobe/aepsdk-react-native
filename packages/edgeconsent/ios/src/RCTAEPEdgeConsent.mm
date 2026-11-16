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
#define AEP_EDGECONSENT_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_EDGECONSENT_METHOD(method) - (void)method
#endif
#import "RCTAEPEdgeConsent.h"
@import AEPEdgeConsent;
@import AEPCore;

@implementation RCTAEPEdgeConsent

static NSString* const EXTENSION_NAME = @"AEPEdgeConsent";

RCT_EXPORT_MODULE(NativeAEPEdgeConsent);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPEdgeConsentSpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

AEP_EDGECONSENT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdgeConsent extensionVersion]);
}

AEP_EDGECONSENT_METHOD(update: (NSDictionary *)consents) {
    [AEPMobileEdgeConsent updateWithConsents:consents];
}

AEP_EDGECONSENT_METHOD(getConsents:(RCTPromiseResolveBlock) resolve
                  reject:(RCTPromiseRejectBlock)reject) {
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
  
