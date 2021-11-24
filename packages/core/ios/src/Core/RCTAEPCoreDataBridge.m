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

#import "RCTAEPCoreDataBridge.h"

@implementation RCTAEPCoreDataBridge

// Logging mode
static NSString* const ERROR = @"ERROR";
static NSString* const WARNING = @"WARNING";
static NSString* const DEBUG = @"DEBUG";
static NSString* const VERBOSE = @"VERBOSE";

// Privacy Status
static NSString* const OPT_IN = @"OPT_IN";
static NSString* const OPT_OUT = @"OPT_OUT";
static NSString* const UNKNOWN = @"UNKNOWN";


static NSString* const EVENT_NAME_KEY = @"eventName";
static NSString* const EVENT_TYPE_KEY = @"eventType";
static NSString* const EVENT_SOURCE_KEY = @"eventSource";
static NSString* const EVENT_DATA_KEY = @"eventData";

+ (AEPEvent *)eventFromDictionary: (nonnull NSDictionary *) dict {
    NSString *name = [dict objectForKey:EVENT_NAME_KEY];
    NSString *type = [dict objectForKey:EVENT_TYPE_KEY];
    NSString *source = [dict objectForKey:EVENT_SOURCE_KEY];

    if (name && type && source && ([[dict objectForKey:EVENT_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:EVENT_DATA_KEY])) {
        return [[AEPEvent alloc] initWithName:name type:type source:source data:[dict objectForKey:EVENT_DATA_KEY]];
    }

    return nil;
}

+ (NSDictionary *)dictionaryFromEvent: (nonnull AEPEvent *) event {
    NSMutableDictionary *eventDict = [NSMutableDictionary dictionary];
    eventDict[EVENT_NAME_KEY] = event.name;
    eventDict[EVENT_TYPE_KEY] = event.type;
    eventDict[EVENT_SOURCE_KEY] = event.source;
    eventDict[EVENT_DATA_KEY] = event.data;

    return eventDict;
}

+ (AEPPrivacyStatus)privacyStatusFromString: (NSString *) statusString {
    if ([statusString isEqualToString:OPT_IN]) {
        return AEPPrivacyStatusOptedIn;
    } else if ([statusString isEqualToString:OPT_OUT]) {
        return AEPPrivacyStatusOptedOut;
    }

    return AEPPrivacyStatusUnknown;
}

+ (AEPLogLevel) logLevelFromString: (NSString *) logLevelString {
    if ([logLevelString isEqualToString:ERROR]) {
        return AEPLogLevelError;
    } else if ([logLevelString isEqualToString:WARNING]) {
        return AEPLogLevelWarning;
    } else if ([logLevelString isEqualToString:DEBUG]) {
        return AEPLogLevelDebug;
    } else if ([logLevelString isEqualToString:VERBOSE]) {
        return AEPLogLevelTrace;
    }

    return AEPLogLevelDebug;
}

+ (NSString *)stringFromPrivacyStatus: (AEPPrivacyStatus) status {
    switch (status) {
        case AEPPrivacyStatusOptedIn:
            return OPT_IN;
            break;
        case AEPPrivacyStatusOptedOut:
            return OPT_OUT;
            break;
        case AEPPrivacyStatusUnknown:
            return UNKNOWN;
            break;
    }
}

+ (NSString *)stringFromLogLevel: (AEPLogLevel) logLevel {
    switch (logLevel) {
        case AEPLogLevelError:
            return ERROR;
        case AEPLogLevelWarning:
            return WARNING;
        case AEPLogLevelDebug:
            return DEBUG;
        case AEPLogLevelTrace:
            return VERBOSE;
    }
}

+ (NSDictionary *)sanitizeDictionaryToContainClass: (Class) type WithDictionary:(NSDictionary *)dict {
    NSMutableDictionary *sanitizedDict = [NSMutableDictionary dictionary];

    for (id key in dict) {
        id obj = [dict objectForKey:key];
        if ([key isKindOfClass:type] && [obj isKindOfClass:type]) {
            sanitizedDict[key] = obj;
        }
    }

    return sanitizedDict;
}

@end
