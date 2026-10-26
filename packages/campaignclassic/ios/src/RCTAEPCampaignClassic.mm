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
@import AEPCampaignClassic;
@import AEPServices;
@import Foundation;

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_CAMPAIGNCLASSIC_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_CAMPAIGNCLASSIC_METHOD(method) - (void)method
#endif

static NSString *const TAG = @"RCTAEPCampaignClassic";

@implementation RCTAEPCampaignClassic

RCT_EXPORT_MODULE(NativeAEPCampaignClassic);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPCampaignClassicSpecJSI>(params);
}
#endif

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
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

AEP_CAMPAIGNCLASSIC_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject) {
  [AEPLog traceWithLabel:TAG message:@"extensionVersion is called."];
  resolve([AEPMobileCampaignClassic extensionVersion]);
}

AEP_CAMPAIGNCLASSIC_METHOD(registerDeviceWithToken:(NSString *)deviceToken
                           userKey:(NSString * _Nullable)userKey
                           additionalParameters:(NSDictionary * _Nullable)additionalParams) {
  [AEPMobileCampaignClassic
      registerDeviceWithToken:[self dataFromHexString:deviceToken]
                      userKey:userKey
         additionalParameters:additionalParams];
}

AEP_CAMPAIGNCLASSIC_METHOD(trackNotificationClickWithUserInfo:(NSDictionary *)userInfo) {
  [AEPMobileCampaignClassic trackNotificationClickWithUserInfo:userInfo];
}

AEP_CAMPAIGNCLASSIC_METHOD(trackNotificationReceiveWithUserInfo:(NSDictionary *)userInfo) {
  [AEPMobileCampaignClassic trackNotificationReceiveWithUserInfo:userInfo];
}

@end
