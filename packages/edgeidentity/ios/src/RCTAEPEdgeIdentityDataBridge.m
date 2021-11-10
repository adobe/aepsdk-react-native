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

+ (AEPIdentityMap *)dictionaryToIdentityMap: (nonnull NSDictionary *) dict {
     
    return nil;
    
  }

+ (AEPIdentityItem *)dictionaryToIdentityItem: (nonnull NSDictionary *) dict {

//    AEPAuthenticatedState *authenticatedState = [[dict objectForKey:AEP_AUTH_STATE_KEY] isKindOfClass:[AEPAuthenticatedState class]] ? [dict objectForKey:AEP_AUTH_STATE_KEY] : nil;
//
//
//    NSString *id = [[dict objectForKey:ID_KEY] isKindOfClass:[NSString class]] ? [dict objectForKey:ID_KEY] : nil;
//
//
//    Boolean *primary = [[dict objectForKey:IS_PRIMARY_KEY] isKindOfClass:[bool class]] ? [dict objectForKey:IS_PRIMARY_KEY] : nil;
//
//    return [AEPIdentityItem :dict[PRODUCT_ID_KEY]
//                                             categoryId:[dict[CATEGORY_ID_KEY] isEqual:[NSNull null]] ? nil : dict[CATEGORY_ID_KEY]];
//       }
    return nil;
  }

@end

