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

#import "RCTAEPIdentity.h"
@import AEPIdentity;
@import AEPCore;
@import AEPServices;

// Visitor ID Auth State
static NSString* const AEP_VISITOR_AUTH_STATE_AUTHENTICATED = @"VISITOR_AUTH_STATE_AUTHENTICATED";
static NSString* const AEP_VISITOR_AUTH_STATE_LOGGED_OUT = @"VISITOR_AUTH_STATE_LOGGED_OUT";
static NSString* const AEP_VISITOR_AUTH_STATE_UNKNOWN = @"VISITOR_AUTH_STATE_UNKNOWN";

// Visitor ID
static NSString* const VISITOR_ID_ID_ORIGIN_KEY = @"idOrigin";
static NSString* const VISITOR_ID_ID_TYPE_KEY = @"idType";
static NSString* const VISITOR_ID_ID_KEY = @"identifier";
static NSString* const VISITOR_ID_AUTH_STATE_KEY = @"authenticationState";

static NSString* const EXTENSION_NAME = @"RCTAEPIdentity";

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_IDENTITY_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_IDENTITY_METHOD(method) - (void)method
#endif

static AEPMobileVisitorAuthState authStateFromString(NSString* authStateString) {
    if ([authStateString isEqualToString:AEP_VISITOR_AUTH_STATE_AUTHENTICATED]) {
           return AEPMobileVisitorAuthStateAuthenticated;
       } else if ([authStateString isEqualToString:AEP_VISITOR_AUTH_STATE_LOGGED_OUT]) {
           return AEPMobileVisitorAuthStateLoggedOut;
       }

       return AEPMobileVisitorAuthStateUnknown;
}

static NSString* stringFromAuthState(AEPMobileVisitorAuthState authState) {
    switch (authState) {
        case AEPMobileVisitorAuthStateAuthenticated:
            return AEP_VISITOR_AUTH_STATE_AUTHENTICATED;
        case AEPMobileVisitorAuthStateLoggedOut:
            return AEP_VISITOR_AUTH_STATE_LOGGED_OUT;
        default:
            return AEP_VISITOR_AUTH_STATE_UNKNOWN;
    }
}

@implementation RCTAEPIdentity

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(NativeAEPIdentity);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPIdentitySpecJSI>(params);
}
#endif

#pragma mark - NativeAEPIdentitySpec protocol methods

AEP_IDENTITY_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileIdentity extensionVersion]);
}

AEP_IDENTITY_METHOD(appendVisitorInfoForURL:(NSString *)baseURL
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity appendToUrl:[NSURL URLWithString:baseURL] completion:^(NSURL * _Nullable url, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"appendVisitorInfoForURL"];
        } else {
            resolve(url.absoluteString);
        }
    }];
}

AEP_IDENTITY_METHOD(getUrlVariables:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getUrlVariables:^(NSString * _Nullable variables, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getUrlVariables"];
        } else {
            resolve(variables);
        }
    }];
}

AEP_IDENTITY_METHOD(getIdentifiers:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getIdentifiers:^(NSArray<id<AEPIdentifiable>> * _Nullable visitorIDs, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getIdentifiers"];
        } else {
            NSMutableArray *visitorIDArr = [NSMutableArray array];
            for (id<AEPIdentifiable> visitorId in visitorIDs) {
                NSMutableDictionary *visitorIdDict = [NSMutableDictionary dictionary];
                visitorIdDict[VISITOR_ID_ID_ORIGIN_KEY] = visitorId.origin;
                visitorIdDict[VISITOR_ID_ID_TYPE_KEY] = visitorId.type;
                visitorIdDict[VISITOR_ID_ID_KEY] = visitorId.identifier;
                visitorIdDict[VISITOR_ID_AUTH_STATE_KEY] = stringFromAuthState(visitorId.authenticationState);
                [visitorIDArr addObject:visitorIdDict];
            }

            resolve(visitorIDArr);
        }
    }];
}

AEP_IDENTITY_METHOD(getExperienceCloudId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getExperienceCloudId:^(NSString * _Nullable experienceCloudId, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getExperienceCloudId"];
        } else {
            resolve(experienceCloudId);
        }
    }];
}

AEP_IDENTITY_METHOD(syncIdentifier:(NSString *)identifierType
            identifier:(NSString *)identifier
            authenticationState:(NSString *)authenticationState) {
    [AEPMobileIdentity syncIdentifierWithType:identifierType identifier:identifier authenticationState:authStateFromString(authenticationState)];
}

AEP_IDENTITY_METHOD(syncIdentifiers:(NSDictionary *)identifiers) {
    [AEPMobileIdentity syncIdentifiers:identifiers];
}

AEP_IDENTITY_METHOD(syncIdentifiersWithAuthState:(nullable NSDictionary *)identifiers
                  authenticationState:(NSString *)authenticationState) {
    [AEPMobileIdentity syncIdentifiers:identifiers authenticationState:authStateFromString(authenticationState)];
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
