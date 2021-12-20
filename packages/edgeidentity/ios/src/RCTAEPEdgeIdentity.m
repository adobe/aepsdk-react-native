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

@import AEPEdgeIdentity;
@import AEPCore;
#import "RCTAEPEdgeIdentity.h"
#import "RCTAEPEdgeIdentityDataBridge.h"


@implementation RCTAEPEdgeIdentity

static NSString* const EXTENSION_NAME = @"AEPEdgeIdentity";

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
            [self handleError:error rejecter:reject errorLocation:@"getExperienceCloudId"];
            } else {
              resolve(experienceCloudId);
            }
    }];
}

RCT_EXPORT_METHOD(getIdentities:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    [AEPMobileEdgeIdentity getIdentities:^(AEPIdentityMap * _Nullable IdentityMap, NSError * _Nullable error) {
        
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getIdentities"];
        } else {
            resolve([RCTAEPEdgeIdentityDataBridge dictionaryFromIdentityMap:IdentityMap]);
        }
    }];
}

RCT_EXPORT_METHOD(updateIdentities:(nonnull NSDictionary*) map) {
    AEPIdentityMap *convertMap = [RCTAEPEdgeIdentityDataBridge dictionaryToIdentityMap:map];

    [AEPMobileEdgeIdentity updateIdentities:(AEPIdentityMap * _Nonnull) convertMap];
}

RCT_EXPORT_METHOD(removeIdentity:(nonnull NSDictionary*)item
                  namespace:(NSString *)namespace) {
    
    AEPIdentityItem *convertItem = [RCTAEPEdgeIdentityDataBridge dictionaryToIdentityItem:item];
    
    if (!convertItem || !namespace) {
    return;
    }

    [AEPMobileEdgeIdentity removeIdentityItem:(AEPIdentityItem * _Nonnull) convertItem withNamespace:(NSString * _Nonnull) namespace];
}

#pragma mark - Helper methods

- (void) handleError:(NSError *) error rejecter:(RCTPromiseRejectBlock) reject errorLocation:(NSString *) location {
    NSString *errorTimeOut = [NSString stringWithFormat:@"%@ call timed out", location];
    NSString *errorUnexpected = [NSString stringWithFormat:@"%@ call returned an unexpected error", location];
    
    if (!error || !reject) {
        return;
    }

    if (error && error.code != AEPErrorNone) {
        if (error.code == AEPErrorCallbackTimeout) {
            reject(EXTENSION_NAME, errorTimeOut, error);
        }else {
            reject(EXTENSION_NAME, errorUnexpected, error);
        }
    } 

}

@end
