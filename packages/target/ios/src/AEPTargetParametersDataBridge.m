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

#import "AEPTargetParametersDataBridge.h"
#import "AEPTargetOrderDataBridge.h"
#import "AEPTargetProductDataBridge.h"

@implementation AEPTargetParameters (RCTBridge)

NSString *const TARGET_PARAMETERS_KEY = @"parameters";
NSString *const PROFILE_PARAMETERS_KEY = @"profileParameters";
NSString *const ORDER_KEY = @"order";
NSString *const PRODUCT_KEY = @"product";

+ (AEPTargetParameters *)targetParametersFromDict:(NSDictionary *)dict {
  if (!dict || [dict isEqual:[NSNull null]]) {
    return nil;
  }

  AEPTargetProduct *product =
      [AEPTargetProduct targetProductFromDict:dict[PRODUCT_KEY]];
  AEPTargetOrder *order = [AEPTargetOrder targetOrderFromDict:dict[ORDER_KEY]];

  NSDictionary *parametersDict =
      [dict[TARGET_PARAMETERS_KEY] isEqual:[NSNull null]]
          ? nil
          : dict[TARGET_PARAMETERS_KEY];
  NSDictionary *profileParametersDict =
      [dict[PROFILE_PARAMETERS_KEY] isEqual:[NSNull null]]
          ? nil
          : dict[PROFILE_PARAMETERS_KEY];

  return
      [AEPTargetParameters targetParametersFromDict:parametersDict];
}

@end
