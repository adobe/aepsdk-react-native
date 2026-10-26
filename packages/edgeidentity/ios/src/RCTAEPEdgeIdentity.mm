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

@import AEPEdgeIdentity;
@import AEPCore;

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_EDGEIDENTITY_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_EDGEIDENTITY_METHOD(method) - (void)method
#endif
#import "RCTAEPEdgeIdentity.h"
#import "RCTAEPEdgeIdentityDataBridge.h"


@implementation RCTAEPEdgeIdentity

static NSString* const EXTENSION_NAME = @"AEPEdgeIdentity";

RCT_EXPORT_MODULE(NativeAEPEdgeIdentity);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPEdgeIdentitySpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

AEP_EDGEIDENTITY_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileEdgeIdentity extensionVersion]);
}

AEP_EDGEIDENTITY_METHOD(getExperienceCloudId:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdgeIdentity getExperienceCloudId:^(NSString * _Nullable experienceCloudId, NSError * _Nullable error) {
        
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getExperienceCloudId"];
            } else {
              resolve(experienceCloudId);
            }
    }];
}

AEP_EDGEIDENTITY_METHOD(getIdentities:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    
    [AEPMobileEdgeIdentity getIdentities:^(AEPIdentityMap * _Nullable IdentityMap, NSError * _Nullable error) {
        
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getIdentities"];
        } else {
            resolve([RCTAEPEdgeIdentityDataBridge dictionaryFromIdentityMap:IdentityMap]);
        }
    }];
}

AEP_EDGEIDENTITY_METHOD(getUrlVariables:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileEdgeIdentity getUrlVariables:^(NSString * _Nullable urlVariables, NSError * _Nullable error) {
        
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getUrlVariables"];
            } else {
              resolve(urlVariables);
            }
    }];
}

AEP_EDGEIDENTITY_METHOD(updateIdentities:(NSDictionary *)map) {
    AEPIdentityMap *convertMap = [RCTAEPEdgeIdentityDataBridge dictionaryToIdentityMap:map];

    [AEPMobileEdgeIdentity updateIdentities:(AEPIdentityMap * _Nonnull) convertMap];
}

AEP_EDGEIDENTITY_METHOD(removeIdentity:(NSDictionary *)item
                  identityNamespace:(NSString *)identityNamespace) {
    
    AEPIdentityItem *convertItem = [RCTAEPEdgeIdentityDataBridge dictionaryToIdentityItem:item];
    
    if (!convertItem || !identityNamespace) {
    return;
    }

    [AEPMobileEdgeIdentity removeIdentityItem:(AEPIdentityItem * _Nonnull) convertItem withNamespace:(NSString * _Nonnull) identityNamespace];
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
