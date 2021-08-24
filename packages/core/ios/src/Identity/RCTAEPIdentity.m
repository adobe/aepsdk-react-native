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

#import "RCTAEPIdentity.h"
@import AEPIdentity;
@import AEPCore;

// Visitor ID Auth State
static NSString* const AEP_VISITOR_AUTH_STATE_AUTHENTICATED = @"AEP_VISITOR_AUTH_STATE_AUTHENTICATED";
static NSString* const AEP_VISITOR_AUTH_STATE_LOGGED_OUT = @"AEP_VISITOR_AUTH_STATE_LOGGED_OUT";
static NSString* const AEP_VISITOR_AUTH_STATE_UNKNOWN = @"AEP_VISITOR_AUTH_STATE_UNKNOWN";

// Visitor ID
static NSString* const VISITOR_ID_ID_ORIGIN_KEY = @"idOrigin";
static NSString* const VISITOR_ID_ID_TYPE_KEY = @"idType";
static NSString* const VISITOR_ID_ID_KEY = @"identifier";
static NSString* const VISITOR_ID_AUTH_STATE_KEY = @"authenticationState";

@implementation RCTAEPIdentity

RCT_EXPORT_MODULE(AEPIdentity);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileIdentity extensionVersion]);
}

RCT_EXPORT_METHOD(appendVisitorInfoForURL:(nonnull NSString*)baseUrl resolver:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity appendToUrl:[NSURL URLWithString:baseUrl] completion:^(NSURL * _Nullable url, NSError * _Nullable error) {
        resolve(url.absoluteString);
    }];
}

RCT_EXPORT_METHOD(getUrlVariables:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getUrlVariables:^(NSString * _Nullable variables, NSError * _Nullable error) {
        resolve(variables);
    }];
}

RCT_EXPORT_METHOD(getIdentifiers:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getIdentifiers:^(NSArray<id<AEPIdentifiable>> * _Nullable visitorIDs, NSError * _Nullable error) {
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
    }];
}

RCT_EXPORT_METHOD(getExperienceCloudId:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileIdentity getExperienceCloudId:^(NSString * _Nullable experienceCloudId, NSError * _Nullable error) {
        resolve(experienceCloudId);
    }];
}

RCT_EXPORT_METHOD(syncIdentifier:(nonnull NSString*)identifierType
            identifier:(nonnull NSString*)identifier
                  authentication:(NSString *)authenticationState) {
    [AEPMobileIdentity syncIdentifierWithType:identifierType identifier:identifier authenticationState:authStateFromString(authenticationState)];
}

RCT_EXPORT_METHOD(syncIdentifiers:(nullable NSDictionary*)identifiers) {
    [AEPMobileIdentity syncIdentifiers:identifiers];
}

RCT_EXPORT_METHOD(syncIdentifiersWithAuthState:(nullable NSDictionary*)identifiers
                  authentication:(NSString *)authenticationState) {
    [AEPMobileIdentity syncIdentifiers:identifiers authenticationState:authStateFromString(authenticationState)];
}

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

@end
