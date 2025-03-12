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
#import "RCTAEPCoreDataBridge.h"

@implementation RCTAEPCore

RCT_EXPORT_MODULE(AEPCore);

static NSString* const EXTENSION_NAME = @"AEPCore";
static NSString* const FAILED_TO_CONVERT_EVENT_MESSAGE = @"Failed to convert dictionary to Event";

// Define dictionary keys as constants
static NSString* const APP_ID_KEY = @"appId";
static NSString* const LIFECYCLE_AUTOMATIC_TRACKING_ENABLED_KEY = @"lifecycleAutomaticTrackingEnabled";
static NSString* const LIFECYCLE_ADDITIONAL_CONTEXT_DATA_KEY = @"lifecycleAdditionalContextData";

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (void) initialize {
    [super initialize];
    [AEPMobileCore setWrapperType:AEPWrapperTypeReactNative];
}

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

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([AEPMobileCore extensionVersion]);
}

RCT_EXPORT_METHOD(configureWithAppId:(NSString* __nullable) appId) {
    [AEPMobileCore configureWithAppId:appId];
}

RCT_EXPORT_METHOD(updateConfiguration: (NSDictionary* __nullable) config) {
    [AEPMobileCore updateConfiguration:config];
}

RCT_EXPORT_METHOD(clearUpdatedConfiguration) {
     [AEPMobileCore clearUpdatedConfiguration];
}

RCT_EXPORT_METHOD(setLogLevel: (NSString *) logLevelString) {
    [AEPMobileCore setLogLevel:[RCTAEPCoreDataBridge logLevelFromString:logLevelString]];
}

RCT_EXPORT_METHOD(getLogLevel: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *logLevelString = [RCTAEPCoreDataBridge stringFromLogLevel:[AEPLog logFilter]];
    resolve(logLevelString);
}

RCT_EXPORT_METHOD(getPrivacyStatus: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileCore getPrivacyStatus:^(enum AEPPrivacyStatus status) {
        resolve([RCTAEPCoreDataBridge stringFromPrivacyStatus:status]);
    }];
}

RCT_EXPORT_METHOD(setPrivacyStatus: (NSString *) statusString) {
    [AEPMobileCore setPrivacyStatus:[RCTAEPCoreDataBridge privacyStatusFromString:statusString]];
}

RCT_EXPORT_METHOD(getSdkIdentities: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [AEPMobileCore getSdkIdentities:^(NSString * _Nullable content, NSError * _Nullable error) {
        if (error) {
            [self handleError:error rejecter:reject errorLocation:@"getSdkIdentities"];
        } else {
            resolve(content);
        }
    }];
}

RCT_EXPORT_METHOD(setAppGroup: (nullable NSString*) appGroup) {
    [AEPMobileCore setAppGroup:appGroup];
}

#pragma mark - Generic methods

RCT_EXPORT_METHOD(collectPii: (nonnull NSDictionary*) data) {
    [AEPMobileCore collectPii:[RCTAEPCoreDataBridge sanitizeDictionaryToContainClass:[NSString class] WithDictionary:data]];
}

RCT_EXPORT_METHOD(setAdvertisingIdentifier: (nullable NSString*) adId) {
    [AEPMobileCore setAdvertisingIdentifier:adId];
}

RCT_EXPORT_METHOD(setPushIdentifier: (nullable NSString*) deviceToken) {
    [AEPMobileCore setPushIdentifier:[self dataFromHexString:deviceToken]];
}

RCT_EXPORT_METHOD(trackAction: (nullable NSString*) action data: (nullable NSDictionary*) data) {
    [AEPMobileCore trackAction:action data:data];
}

RCT_EXPORT_METHOD(trackState: (nullable NSString*) state data: (nullable NSDictionary*) data) {
    [AEPMobileCore trackState:state data:data];
}

RCT_EXPORT_METHOD(dispatchEvent: (nonnull NSDictionary*) eventDict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
     AEPEvent *event = [RCTAEPCoreDataBridge eventFromDictionary:eventDict];
     if (!event) {
         reject(EXTENSION_NAME, FAILED_TO_CONVERT_EVENT_MESSAGE, nil);
         return;
     }
     [AEPMobileCore dispatch:event];
 }

RCT_EXPORT_METHOD(dispatchEventWithResponseCallback: (nonnull NSDictionary*) requestEventDict timeoutDuration:(nonnull NSNumber*) timeoutNumber resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    AEPEvent *requestEvent = [RCTAEPCoreDataBridge eventFromDictionary:requestEventDict];
    if (!requestEvent) {
        reject(EXTENSION_NAME, FAILED_TO_CONVERT_EVENT_MESSAGE, nil);
        return;
    }
    
    if (![timeoutNumber respondsToSelector:@selector(intValue)]) {
            reject(EXTENSION_NAME, @"Invalid timeout value", nil);
           return;
    }
    
    double timeout = [timeoutNumber intValue] / 1000.0;

    [AEPMobileCore dispatch:requestEvent timeout:timeout responseCallback:^(AEPEvent * _Nullable responseEvent) {
         if (responseEvent == nil) {
             reject(EXTENSION_NAME, @"general.callback.timeout", nil);
         } else {
             resolve([RCTAEPCoreDataBridge dictionaryFromEvent:responseEvent]);
         }
        
    }];
}

RCT_EXPORT_METHOD(setSmallIconResourceID: (NSInteger) resourceID) {
    [AEPLog debugWithLabel:EXTENSION_NAME message:@"setSm`allIconResourceID is not suppported on iOS"];
}

RCT_EXPORT_METHOD(setLargeIconResourceID: (NSInteger) resourceID) {
    [AEPLog debugWithLabel:EXTENSION_NAME message:@"setSmallIconResourceID is not suppported on iOS"];
}


RCT_EXPORT_METHOD(resetIdentities) {
     [AEPMobileCore resetIdentities];
}


/**
 * Initializes the AEP Mobile SDK with the provided initialization options.
 * @param {NSDictionary} initOptionsDict - The options to use for initialization.
 *   - `appId` (NSString, required): A unique identifier assigned to the app instance by Adobe Experience Platform.
 *   - `lifecycleAutomaticTrackingEnabled` (NSNumber, optional): Determines whether automatic lifecycle 
 *      tracking should be enabled. Defaults to `true` if not provided.
 *   - `lifecycleAdditionalContextData` (NSDictionary, optional): Key-value pairs of additional context data 
 *      to be included with lifecycle events.
 * @param {RCTPromiseResolveBlock} resolve - The promise resolve block.
 * @param {RCTPromiseRejectBlock} reject - The promise reject block.
 */
RCT_EXPORT_METHOD(initialize:(NSDictionary *)initOptionsDict 
                  resolver:(RCTPromiseResolveBlock)resolve 
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!initOptionsDict || ![initOptionsDict isKindOfClass:[NSDictionary class]]) {
        reject(EXTENSION_NAME, @"InitOptions must be a valid dictionary.", nil);
        return;
    }

    @try {
        // Extract and validate appId
        NSString *appId = initOptionsDict[APP_ID_KEY];
        AEPInitOptions *options;
        
        if (!appId || ![appId isKindOfClass:[NSString class]]) {
            [AEPLog debugWithLabel:EXTENSION_NAME message:@"No appId provided, initializing with default options."];
            options = [[AEPInitOptions alloc] init];
        } else {
            options = [[AEPInitOptions alloc] initWithAppId:appId];
            [AEPLog debugWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Initializing with appId: %@", appId]];
        }

        // Extract lifecycleAutomaticTrackingEnabled safely
        NSNumber *lifecycleTrackingEnabled = initOptionsDict[LIFECYCLE_AUTOMATIC_TRACKING_ENABLED_KEY];
        if (!lifecycleTrackingEnabled || ![lifecycleTrackingEnabled isKindOfClass:[NSNumber class]]) {
            [AEPLog debugWithLabel:EXTENSION_NAME message:@"Lifecycle tracking not specified, using default value."];
        } else {
            options.lifecycleAutomaticTrackingEnabled = [lifecycleTrackingEnabled boolValue];
            [AEPLog debugWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Setting lifecycle tracking to: %@", lifecycleTrackingEnabled.boolValue ? @"enabled" : @"disabled"]];
        }

        // Extract lifecycleAdditionalContextData safely
        NSDictionary *lifecycleAdditionalContextData = initOptionsDict[LIFECYCLE_ADDITIONAL_CONTEXT_DATA_KEY];
        if ([lifecycleAdditionalContextData isKindOfClass:[NSDictionary class]]) {
            [AEPLog traceWithLabel:@"RCTAEPCore" message:[NSString stringWithFormat:@"Lifecycle Additional Context Data: %@", lifecycleAdditionalContextData]];
            [options setLifecycleAdditionalContextData:lifecycleAdditionalContextData];
        }

        // Initialize AEP SDK
        [AEPMobileCore initializeWithOptions:options completion:^{
            [AEPLog traceWithLabel:@"RCTAEPCore" message:@"AEP Mobile SDK initialized successfully."];
            resolve(nil);
        }];

    } @catch (NSException *exception) {
        [AEPLog errorWithLabel:EXTENSION_NAME message:[NSString stringWithFormat:@"Error initializing AEP SDK: %@", exception.reason]];
        reject(EXTENSION_NAME, @"Exception occurred while initializing AEP SDK.", nil);
    }
}

#pragma mark - Helper methods

- (void) handleError:(NSError *) error rejecter:(RCTPromiseRejectBlock) reject {
    if (!error || !reject) {
        return;
    }

    NSDictionary *userInfo = [error userInfo];
    NSString *errorString = [[userInfo objectForKey:NSUnderlyingErrorKey] localizedDescription];

    reject([NSString stringWithFormat: @"%lu", (long)error.code],
           errorString,
           error);
}

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
