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

@implementation RCTAEPUserProfile

RCT_EXPORT_MODULE(AEPUserProfile);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileUserProfile extensionVersion]);
}

RCT_EXPORT_METHOD(removeUserAttributes: (nonnull NSArray*) attributeNames) {
    [AEPMobileUserProfile removeUserAttributesWithAttributeNames:attributeNames];
}

RCT_EXPORT_METHOD(getUserAttributes: (nonnull NSArray*) attributeNames resolver:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileUserProfile getUserAttributesWithAttributeNames:attributeNames completion:^(NSDictionary<NSString *,id> * attributes, enum AEPError error) {
        resolve(attributes);
    }];
}

RCT_EXPORT_METHOD(updateUserAttributes: (nonnull NSDictionary*) attributeMap) {
    [AEPMobileUserProfile updateUserAttributesWithAttributeDict:attributeMap];
}

@end
  
