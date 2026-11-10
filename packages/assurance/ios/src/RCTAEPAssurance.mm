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
#define AEP_ASSURANCE_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_ASSURANCE_METHOD(method) - (void)method
#endif
#import "RCTAEPAssurance.h"
@import AEPAssurance;

@implementation RCTAEPAssurance

RCT_EXPORT_MODULE(NativeAEPAssurance);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPAssuranceSpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

AEP_ASSURANCE_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileAssurance extensionVersion]);
}

AEP_ASSURANCE_METHOD(startSession: (NSString * _Nullable) url){
    if (url.length > 0) {
        NSURL* nsUrl = [[NSURL alloc] initWithString:url];
        if(nsUrl != nil){
            [AEPMobileAssurance startSessionWithUrl:nsUrl];
        }
    } else {
#if DEBUG
        // No url: start the Quick Connect flow (debug builds only).
        [AEPMobileAssurance startSession];
#endif
    }
}
@end
