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

#import "RCTAEPExperienceEventDataBridge.h"

@implementation RCTAEPExperienceEventDataBridge

static NSString* const XDM_DATA_KEY = @"xdmData";
static NSString* const DATA_KEY = @"data";
static NSString* const DATASET_IDENTIFIER_KEY = @"datasetIdentifier";

static NSString* const TYPE_KEY = @"type";
static NSString* const PAYLOAD_KEY = @"payload";

+ (AEPExperienceEvent *)experienceEventFromDictionary: (nonnull NSDictionary *) dict {
    
    if (!dict || [dict isEqual:[NSNull null]]) {
            return nil;
        }

    NSDictionary  *xdmdata = [[dict objectForKey:XDM_DATA_KEY] isEqual:[NSNull null]] ? nil : [dict objectForKey:XDM_DATA_KEY];
    NSDictionary  *data = [[dict objectForKey:DATA_KEY] isEqual:[NSNull null]] ? nil : [dict objectForKey:DATA_KEY];
    NSString * datasetIdentifier = [[dict objectForKey:DATASET_IDENTIFIER_KEY] isEqual:[NSNull null]] ? nil : [dict objectForKey:DATASET_IDENTIFIER_KEY];
    
    if (!xdmdata) {
        return nil;
    } else if (([[dict objectForKey:XDM_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:XDM_DATA_KEY]) && ([[dict objectForKey:DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:DATA_KEY]) && datasetIdentifier) {
        return [[AEPExperienceEvent alloc] initWithXdm:xdmdata data:data datasetIdentifier:datasetIdentifier];
        
    } else if (([[dict objectForKey:XDM_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:XDM_DATA_KEY]) && ([[dict objectForKey:DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:DATA_KEY])) {
        return [[AEPExperienceEvent alloc] initWithXdm:xdmdata data:data datasetIdentifier:nil];
        
    } else if (([[dict objectForKey:XDM_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:XDM_DATA_KEY]) && datasetIdentifier) {
        return [[AEPExperienceEvent alloc] initWithXdm:xdmdata data:nil datasetIdentifier:datasetIdentifier];
        
     } else if (([[dict objectForKey:XDM_DATA_KEY] isKindOfClass:[NSDictionary class]] || ![dict objectForKey:XDM_DATA_KEY]) && datasetIdentifier) {
        return [[AEPExperienceEvent alloc] initWithXdm:xdmdata data:nil datasetIdentifier:datasetIdentifier];
     }
    
    return nil;
}

+ (NSArray *)dictionaryFromEdgeEventHandler: (NSArray<AEPEdgeEventHandle *> *) experienceEventHandle {
    NSMutableArray *experienceEventArr = [NSMutableArray array];
    for (AEPEdgeEventHandle *expEventHandle in experienceEventHandle) {
        NSMutableDictionary *experienceEventHandleDic = [NSMutableDictionary dictionary];
        experienceEventHandleDic[TYPE_KEY] = expEventHandle.type;
        experienceEventHandleDic[PAYLOAD_KEY] = expEventHandle.payload;
        [experienceEventArr addObject:experienceEventHandleDic];
    }
   
    return experienceEventHandle;
}

@end

