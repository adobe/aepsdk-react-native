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

#import "RCTAEPCampaignClassic.h"
#import <React/RCTEventEmitter.h>
@import AEPCampaignClassic;
@import AEPServices;
@import Foundation;

static NSString *const TAG = @"RCTAEPCampaignClassic";

@implementation RCTAEPCampaignClassic {
  bool hasListeners;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"Accelerometer" ];
}

- (instancetype)init {
  self = [super init];
  hasListeners = false;
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSData *)dataFromHexString:(NSString *)string {
  NSMutableData *result = [[NSMutableData alloc] init];

  for (int i = 0; i + 2 <= string.length; i += 2) {
    NSRange range = NSMakeRange(i, 2);
    NSString *hexStr = [string substringWithRange:range];
    NSScanner *scanner = [NSScanner scannerWithString:hexStr];
    unsigned int intValue;
    [scanner scanHexInt:&intValue];
    unsigned char uc = (unsigned char)intValue;
    [result appendBytes:&uc length:1];
  }

  return [NSData dataWithData:result];
}

RCT_EXPORT_MODULE(AEPCampaignClassic);

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPLog traceWithLabel:TAG message:@"extensionVersion is called."];
  resolve([AEPMobileCampaignClassic extensionVersion]);
}

RCT_EXPORT_METHOD(registerDeviceWithToken
                  : (nonnull NSString *)deviceToken
                  : (nullable NSString *)userKey
                  : (nullable NSDictionary *)additionalParams) {
  [AEPMobileCampaignClassic
      registerDeviceWithToken:[self dataFromHexString:deviceToken]
                      userKey:userKey
         additionalParameters:additionalParams];
}

RCT_EXPORT_METHOD(trackNotificationClickWithUserInfo
                  : (nonnull NSDictionary *)userInfo) {
  [AEPMobileCampaignClassic trackNotificationClickWithUserInfo:userInfo];
}

RCT_EXPORT_METHOD(trackNotificationReceiveWithUserInfo
                  : (nonnull NSDictionary *)userInfo) {
  [AEPMobileCampaignClassic trackNotificationReceiveWithUserInfo:userInfo];
}

@end
