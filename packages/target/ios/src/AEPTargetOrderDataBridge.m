/*
 Copyright 2022 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or
 agreed to in writing, software distributed under the License is distributed on
 an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, either
 express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */

@import AEPTarget;
#import "AEPTargetOrderDataBridge.h"

@implementation AEPTargetOrder (RCTBridge)

NSString *const ORDER_ID_KEY = @"orderId";
NSString *const TOTAL_KEY = @"total";
NSString *const PURCHASED_PRODUCTS_IDS_KEY = @"purchasedProductIds";

+ (AEPTargetOrder *)targetOrderFromDict:(NSDictionary *)dict {
  if (!dict || [dict isEqual:[NSNull null]]) {
    return nil;
  }

  return
      [AEPTargetOrder targetOrderFromDict:dict[ORDER_ID_KEY]];
}

@end
