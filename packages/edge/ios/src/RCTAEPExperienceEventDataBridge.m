/*
 Copyright 2019 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */

#import "RCTAEPExperienceEventDataBridge.h"

@implementation RCTAEPExperienceEventDataBridge

static NSString* const XDM_DATA_KEY = @"xdmData";
static NSString* const DATA_KEY = @"data";
static NSString* const DATASET_IDENTIFIER_KEY = @"datasetIdentifier";

static NSString* const TYPE_KEY = @"type";
static NSString* const PAYLOAD_KEY = @"payload";

+ (AEPExperienceEvent *)experienceEventFromDictionary: (nonnull NSDictionary *) dict {

    if (([[dict objectForKey:XDM_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:XDM_DATA_KEY]) && ([[dict objectForKey:DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:DATA_KEY]) && ([[dict objectForKey:DATASET_IDENTIFIER_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:DATASET_IDENTIFIER_KEY])) {
        return [[AEPExperienceEvent alloc]initWithXdm:[dict objectForKey:XDM_DATA_KEY] data:[dict objectForKey:DATA_KEY] datasetIdentifier:[dict objectForKey:DATASET_IDENTIFIER_KEY]];
    }

    return nil;
}

+ (NSDictionary *)dictionaryFromExperienceEvent: (nonnull AEPExperienceEvent *) experienceEvent {
    NSMutableDictionary *experienceEventDict = [NSMutableDictionary dictionary];
    experienceEventDict[XDM_DATA_KEY] = experienceEvent.xdm;
    experienceEventDict[DATA_KEY] = experienceEvent.data;
    experienceEventDict[DATASET_IDENTIFIER_KEY] = experienceEvent.datasetIdentifier;

    return experienceEventDict;
}

@end
