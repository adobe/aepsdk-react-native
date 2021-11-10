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

#import "RCTAEPEdgeIdentityDataBridge.h"

@implementation RCTAEPEdgeIdentityDataBridge

static NSString* const ID_KEY = @"id";
static NSString* const IS_PRIMARY_KEY = @"primary";
static NSString* const AEP_AUTH_STATE_KEY = @"authenticatedState";

//
//
//+ (NSArray *)dictionaryFromEdgeEventHandler: (NSArray<AEPEdgeEventHandle *> *) experienceEventHandle {
//    NSMutableArray *experienceEventArr = [NSMutableArray array];
//    for (AEPEdgeEventHandle *expEventHandle in experienceEventHandle) {
//        NSMutableDictionary *experienceEventHandleDic = [NSMutableDictionary dictionary];
//        experienceEventHandleDic[TYPE_KEY] = expEventHandle.type;
//        experienceEventHandleDic[PAYLOAD_KEY] = expEventHandle.payload;
//        [experienceEventArr addObject:experienceEventHandleDic];
//    }
//
//    return experienceEventArr;
//}

+ (NSDictionary *)dictionaryFromIdentityMap: (nullable AEPIdentityMap *) idmap {
    NSMutableDictionary *mapDict = [NSMutableDictionary dictionary];
    NSMutableArray *mapArray = [NSMutableArray array];
        for (NSString *namespace in idmap.namespaces) {
            NSArray* items = [idmap getItemsWithNamespace:namespace];
            NSMutableDictionary *itemdict = [NSMutableDictionary dictionary];
            for (AEPIdentityItem *item in items){
              itemdict[IS_PRIMARY_KEY] = @(item.primary);
              itemdict[AEP_AUTH_STATE_KEY] = @(item.authenticatedState);
              itemdict[ID_KEY] = item.id ;
            
              [mapArray addObject:itemdict];
            }
            
            if (mapArray.count !=0) {
                [mapDict setObject:mapArray forKey:namespace];
            }
        }
        return mapDict;
    }
    
//RCT_EXPORT_METHOD(getIdentifiers:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject) {
//    [AEPMobileIdentity getIdentifiers:^(NSArray<id<AEPIdentifiable>> * _Nullable visitorIDs, NSError * _Nullable error) {
//        NSMutableArray *visitorIDArr = [NSMutableArray array];
//        for (id<AEPIdentifiable> visitorId in visitorIDs) {
//            NSMutableDictionary *visitorIdDict = [NSMutableDictionary dictionary];
//            visitorIdDict[VISITOR_ID_ID_ORIGIN_KEY] = visitorId.origin;
//            visitorIdDict[VISITOR_ID_ID_TYPE_KEY] = visitorId.type;
//            visitorIdDict[VISITOR_ID_ID_KEY] = visitorId.identifier;
//            visitorIdDict[VISITOR_ID_AUTH_STATE_KEY] = stringFromAuthState(visitorId.authenticationState);
//            [visitorIDArr addObject:visitorIdDict];
//        }
//
//        resolve(visitorIDArr);
//    }];
//}
    
  //  NSMutableDictionary *eventDict = [NSMutableDictionary dictionary];
    //eventDict[ID_KEY] = map.;
//    eventDict[EVENT_TYPE_KEY] = event.type;
//    eventDict[EVENT_SOURCE_KEY] = event.source;
//    eventDict[EVENT_DATA_KEY] = event.data;

//   return eventDict;
//}

@end

