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

#import "RCTAEPEdgeIdentityDataBridge.h"

@implementation RCTAEPEdgeIdentityDataBridge

static NSString* const ID_KEY = @"id";
static NSString* const IS_PRIMARY_KEY = @"primary";
static NSString* const AUTH_STATE_KEY = @"authenticatedState";
static NSString* const IDENTITY_MAP_KEY = @"identityMap";
static NSString* const AUTHENTICATED = @"authenticated";
static NSString* const LOGGED_OUT = @"loggedOut";
static NSString* const AMBIGUOUS = @"ambiguous";

+ (NSDictionary *)dictionaryFromIdentityMap: (nullable AEPIdentityMap *) idmap {
    NSMutableDictionary *mapDict = [NSMutableDictionary dictionary];
    
    if (!idmap){
        return mapDict;
    }
    
        for (NSString *namespace in idmap.namespaces) {
            NSArray* items = [idmap getItemsWithNamespace:namespace];
           
            NSMutableArray *mapArray = [NSMutableArray array];
            
            for (AEPIdentityItem *item in items){
              NSMutableDictionary *itemdict = [NSMutableDictionary dictionary];
              itemdict[IS_PRIMARY_KEY] = @(item.primary);
              itemdict[AUTH_STATE_KEY] = [RCTAEPEdgeIdentityDataBridge stringFromAuthState:(item.authenticatedState)];
              itemdict[ID_KEY] = item.id ;
                
              [mapArray addObject:itemdict];
            }
            if (mapArray.count !=0) {
                [mapDict setObject:mapArray forKey:namespace];
            }
        }
      
        return mapDict;
    }

+ (nonnull AEPIdentityMap  *)dictionaryToIdentityMap: (nonnull NSDictionary *) dict {
    AEPIdentityMap *identityMap = [[AEPIdentityMap alloc] init];
    NSDictionary *itemsMap = [[dict objectForKey:IDENTITY_MAP_KEY] isKindOfClass:[NSDictionary class]] ? [dict objectForKey:IDENTITY_MAP_KEY] : nil;
    
    if (!itemsMap){
        return identityMap;
    }
    
    NSArray <NSString*>* namespaces = [itemsMap allKeys];
   
    for (NSString *namespace in namespaces){
        NSArray* items = [itemsMap objectForKey:namespace];
        for (NSDictionary *itemMap in items){
            AEPIdentityItem *item = [RCTAEPEdgeIdentityDataBridge dictionaryToIdentityItem:itemMap];
            
            if (item){
                [identityMap addItem:item withNamespace:namespace];
            }
        }
    }
    
    return identityMap;
  }

+ (AEPIdentityItem *)dictionaryToIdentityItem: (nullable NSDictionary *) dict {
    
    if (!dict) {
        return nil;
    }
    
    NSString *identifier = [[dict objectForKey:ID_KEY] isKindOfClass:[NSString class]] ? [dict objectForKey:ID_KEY] : nil;
    
    NSString *authenticatedString = [[dict objectForKey:AUTH_STATE_KEY] isKindOfClass:[NSString class]] ? [dict objectForKey:AUTH_STATE_KEY] : nil;
        
    AEPAuthenticatedState authenticatedState = [RCTAEPEdgeIdentityDataBridge authStateFromString:(authenticatedString)];
   
    BOOL primary = [[dict objectForKey:IS_PRIMARY_KEY] boolValue];

    return [[AEPIdentityItem alloc] initWithId:identifier authenticatedState:authenticatedState primary:primary];
  }

+ (AEPAuthenticatedState) authStateFromString: (nullable NSString *) authStateString {
     if (!authStateString){
        return AEPAuthenticatedStateAmbiguous;
     }
    
     if ([authStateString isEqualToString:AUTHENTICATED]) {
           return AEPAuthenticatedStateAuthenticated;
       } else if ([authStateString isEqualToString:LOGGED_OUT]) {
           return AEPAuthenticatedStateLoggedOut;
       }

    return AEPAuthenticatedStateAmbiguous;
}

+ (NSString *) stringFromAuthState: (AEPAuthenticatedState) authState {
    if (!authState){
       return AMBIGUOUS;
    }
    
    switch (authState) {
        case AEPAuthenticatedStateAuthenticated:
            return AUTHENTICATED;
        case AEPAuthenticatedStateLoggedOut:
            return LOGGED_OUT;
        default:
            return AMBIGUOUS;
    }
}

@end
