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

#import "AEPTargetRequestObjectDataBridge.h"
#import "AEPTargetParametersDataBridge.h"

@implementation AEPTargetRequestObject (RCTBridge)

NSString *const REQUEST_NAME_KEY = @"name";
NSString *const REQUEST_PARAMETERS_KEY = @"targetParameters";
NSString *const DEFAULT_CONTENT_KEY = @"defaultContent";

+ (AEPTargetRequestObject *)
    targetRequestObjectFromDict:(NSDictionary *)dict
                       callback:(nullable void (^)(
                                    NSString *__nullable content))callback {
  if (!dict || [dict isEqual:[NSNull null]]) {
    return nil;
  }

  AEPTargetParameters *parameters = [AEPTargetParameters
      targetParametersFromDict:dict[REQUEST_PARAMETERS_KEY]];
  return [AEPTargetRequestObject
      targetRequestObjectFromDict:dict[REQUEST_NAME_KEY] callback:callback];
}

@end
