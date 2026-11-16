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

#import "RCTAEPUserProfile.h"
@import AEPUserProfile;
@import AEPCore;
@import AEPServices;

static NSString *const TAG = @"RCTAEPUserProfile";

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_USERPROFILE_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_USERPROFILE_METHOD(method) - (void)method
#endif

@implementation RCTAEPUserProfile

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

// Single moduleName registration for all paths (interop + turbo, old + new arch).
// RCT_EXPORT_MODULE expands to +moduleName — do NOT also define +moduleName manually
// (duplicate declaration when USE_INTEROP_ROOT=0; see aep-turbo-migrate gotcha #29).
RCT_EXPORT_MODULE(NativeAEPUserProfile);

// Old-arch interop (RN 0.76): turbo is off — skip getTurboModule: so the module
// registers as a classic bridge NativeModule with RCT_EXPORT_METHOD exports.
// New-arch interop + turbo path: getTurboModule: required for TurboModuleRegistry.
#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPUserProfileSpecJSI>(params);
}
#endif

#pragma mark - NativeAEPUserProfileSpec protocol methods

AEP_USERPROFILE_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [AEPLog traceWithLabel:TAG message:@"extensionVersion is called."];
  resolve([AEPMobileUserProfile extensionVersion]);
}

AEP_USERPROFILE_METHOD(removeUserAttributes:(NSArray *)attributeNames)
{
  [AEPLog traceWithLabel:TAG message:@"removeUserAttributes is called."];
  [AEPMobileUserProfile removeUserAttributesWithAttributeNames:attributeNames];
}

AEP_USERPROFILE_METHOD(getUserAttributes:(NSArray *)attributeNames
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [AEPLog traceWithLabel:TAG message:@"getUserAttributes is called."];
  [AEPMobileUserProfile getUserAttributesWithAttributeNames:attributeNames completion:^(NSDictionary<NSString *,id> * attributes, enum AEPError error) {
    resolve(attributes);
  }];
}

AEP_USERPROFILE_METHOD(updateUserAttributes:(NSDictionary *)attributeMap)
{
  [AEPLog traceWithLabel:TAG message:@"updateUserAttributes is called."];
  [AEPMobileUserProfile updateUserAttributesWithAttributeDict:attributeMap];
}

@end
