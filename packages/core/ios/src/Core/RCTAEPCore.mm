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

#import <React/RCTConvert.h>
#import "RCTAEPCore.h"
@import AEPCore;
@import AEPServices;
#import "RCTAEPCoreDataBridge.h"

static NSString* const EXTENSION_NAME = @"RCTAEPCore";
static NSString* const FAILED_TO_CONVERT_EVENT_MESSAGE = @"Failed to convert dictionary to Event";

static NSString* const APP_ID_KEY = @"appId";
static NSString* const LIFECYCLE_AUTOMATIC_TRACKING_ENABLED_KEY = @"lifecycleAutomaticTrackingEnabled";
static NSString* const LIFECYCLE_ADDITIONAL_CONTEXT_DATA_KEY = @"lifecycleAdditionalContextData";
static NSString* const APP_GROUP_IOS_KEY = @"appGroupIOS";

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_CORE_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_CORE_METHOD(method) - (void)method
#endif

@implementation RCTAEPCore

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (void) initialize {
    [super initialize];
    [AEPMobileCore setWrapperType:AEPWrapperTypeReactNative];
}

RCT_EXPORT_MODULE(NativeAEPCore);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPCoreSpecJSI>(params);
}
#endif

- (NSData *)dataFromHexString:(NSString *)string {
    NSMutableData *result = [[NSMutableData alloc] init];

    for (int i = 0; i + 2 <= string.length; i += 2) {
        NSRange range = NSMakeRange(i, 2);
        NSString* hexStr = [string substringWithRange:range];
        NSScanner* scanner = [NSScanner scannerWithString:hexStr];
        unsigned int intValue;
        [scanner scanHexInt:&intValue];
        unsigned char uc = (unsigned char) intValue;
        [result appendBytes:&uc length:1];
    }

    return [NSData dataWithData:result];
}

#pragma mark - NativeAEPCoreSpec protocol methods

AEP_CORE_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileCore extensionVersion]);
}

AEP_CORE_METHOD(configureWithAppId:(NSString *)appId) {
    [AEPMobileCore configureWithAppId:appId];
}

AEP_CORE_METHOD(updateConfiguration:(NSDictionary *)configMap) {
    [AEPMobileCore updateConfiguration:configMap];
}

AEP_CORE_METHOD(clearUpdatedConfiguration) {
     [AEPMobileCore clearUpdatedConfiguration];
}

AEP_CORE_METHOD(setLogLevel:(NSString *)mode) {
    [AEPMobileCore setLogLevel:[RCTAEPCoreDataBridge logLevelFromString:mode]];
}

AEP_CORE_METHOD(getLogLevel:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSString *logLevelString = [RCTAEPCoreDataBridge stringFromLogLevel:[AEPLog logFilter]];
    resolve(logLevelString);
}

AEP_CORE_METHOD(getPrivacyStatus:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileCore getPrivacyStatus:^(enum AEPPrivacyStatus status) {
        resolve([RCTAEPCoreDataBridge stringFromPrivacyStatus:status]);
    }];
}

AEP_CORE_METHOD(setPrivacyStatus:(NSString *)privacyStatus) {
    [AEPMobileCore setPrivacyStatus:[RCTAEPCoreDataBridge privacyStatusFromString:privacyStatus]];
}

AEP_CORE_METHOD(getSdkIdentities:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [AEPMobileCore getSdkIdentities:^(NSString * _Nullable content, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getSdkIdentities"];
        } else {
            resolve(content);
        }
    }];
}

AEP_CORE_METHOD(setAppGroup:(NSString *)appGroup) {
    [AEPMobileCore setAppGroup:appGroup];
}

#pragma mark - Generic methods

AEP_CORE_METHOD(collectPii:(NSDictionary *)data) {
    [AEPMobileCore collectPii:[RCTAEPCoreDataBridge sanitizeDictionaryToContainClass:[NSString class] WithDictionary:data]];
}

AEP_CORE_METHOD(setAdvertisingIdentifier:(NSString *)advertisingIdentifier) {
    [AEPMobileCore setAdvertisingIdentifier:advertisingIdentifier];
}

AEP_CORE_METHOD(setPushIdentifier:(NSString *)pushIdentifier) {
    [AEPMobileCore setPushIdentifier:[self dataFromHexString:pushIdentifier]];
}

AEP_CORE_METHOD(trackAction:(NSString *)action
                  contextData:(NSDictionary *)contextData) {
    [AEPMobileCore trackAction:action data:contextData];
}

AEP_CORE_METHOD(trackState:(NSString *)state
                  contextData:(NSDictionary *)contextData) {
    [AEPMobileCore trackState:state data:contextData];
}

AEP_CORE_METHOD(dispatchEvent:(NSDictionary *)event
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
     AEPEvent *aepEvent = [RCTAEPCoreDataBridge eventFromDictionary:event];
     if (!aepEvent) {
         reject(EXTENSION_NAME, FAILED_TO_CONVERT_EVENT_MESSAGE, nil);
         return;
     }
     [AEPMobileCore dispatch:aepEvent];
}

AEP_CORE_METHOD(dispatchEventWithResponseCallback:(NSDictionary *)event
                  timeoutMS:(double)timeoutMS
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {

    AEPEvent *requestEvent = [RCTAEPCoreDataBridge eventFromDictionary:event];
    if (!requestEvent) {
        reject(EXTENSION_NAME, FAILED_TO_CONVERT_EVENT_MESSAGE, nil);
        return;
    }

    double timeout = timeoutMS / 1000.0;

    [AEPMobileCore dispatch:requestEvent timeout:timeout responseCallback:^(AEPEvent * _Nullable responseEvent) {
         if (responseEvent == nil) {
             reject(EXTENSION_NAME, @"general.callback.timeout", nil);
         } else {
             resolve([RCTAEPCoreDataBridge dictionaryFromEvent:responseEvent]);
         }
    }];
}

AEP_CORE_METHOD(setSmallIconResourceID:(double)resourceID) {
    [AEPLog traceWithLabel:EXTENSION_NAME message:@"setSmallIconResourceID is not supported on iOS"];
}

AEP_CORE_METHOD(setLargeIconResourceID:(double)resourceID) {
    [AEPLog traceWithLabel:EXTENSION_NAME message:@"setLargeIconResourceID is not supported on iOS"];
}

AEP_CORE_METHOD(resetIdentities) {
     [AEPMobileCore resetIdentities];
}

/**
 * Initializes the AEP Mobile SDK with the provided initialization options.
 */
AEP_CORE_METHOD(initialize:(NSDictionary *)initOptions
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {

    if (!initOptions || ![initOptions isKindOfClass:[NSDictionary class]]) {
        reject(EXTENSION_NAME, @"InitOptions must be a valid dictionary.", nil);
        return;
    }

    @try {
        NSString *appId = initOptions[APP_ID_KEY];
        AEPInitOptions *options;

        if (!appId || ![appId isKindOfClass:[NSString class]]) {
            [AEPLog traceWithLabel:EXTENSION_NAME message:@"No appId provided, initializing with default options."];
            options = [[AEPInitOptions alloc] init];
        } else {
            options = [[AEPInitOptions alloc] initWithAppId:appId];
            [AEPLog traceWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Initializing with appId: %@", appId]];
        }

        NSNumber *lifecycleTrackingEnabled = initOptions[LIFECYCLE_AUTOMATIC_TRACKING_ENABLED_KEY];
        if (!lifecycleTrackingEnabled || ![lifecycleTrackingEnabled isKindOfClass:[NSNumber class]]) {
            [AEPLog traceWithLabel:EXTENSION_NAME message:@"Lifecycle tracking not specified, using default value."];
        } else {
            options.lifecycleAutomaticTrackingEnabled = [lifecycleTrackingEnabled boolValue];
            [AEPLog traceWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Setting lifecycle tracking to: %@", lifecycleTrackingEnabled.boolValue ? @"enabled" : @"disabled"]];
        }

        NSDictionary *lifecycleAdditionalContextData = initOptions[LIFECYCLE_ADDITIONAL_CONTEXT_DATA_KEY];
        if ([lifecycleAdditionalContextData isKindOfClass:[NSDictionary class]]) {
            [AEPLog traceWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Lifecycle Additional Context Data: %@", lifecycleAdditionalContextData]];
            [options setLifecycleAdditionalContextData:lifecycleAdditionalContextData];
        }

        NSString *appGroupIOS = initOptions[APP_GROUP_IOS_KEY];
        if ([appGroupIOS isKindOfClass:[NSString class]]) {
            [AEPLog traceWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Setting app group: %@", appGroupIOS]];
            options.appGroup = appGroupIOS;
        }

        [AEPMobileCore initializeWithOptions:options completion:^{
            [AEPLog traceWithLabel:EXTENSION_NAME message:@"AEP Mobile SDK initialized successfully."];
            resolve(nil);
        }];

    } @catch (NSException *exception) {
        [AEPLog errorWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Error initializing AEP SDK: %@", exception.reason]];
        reject(EXTENSION_NAME, @"Exception occurred while initializing AEP SDK.", nil);
    }
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
        }
    } else {
        reject(EXTENSION_NAME, errorUnexpected, error);
    }
}

@end
