/*
Copyright 2022 Adobe. All rights reserved.
RCTCoreTurbo – Turbo Native Module (iOS). Logs Mobile Core extension version and returns it.
*/
#import "RCTCoreTurbo.h"
@import AEPCore;

@implementation RCTCoreTurbo

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeCoreTurboSpecJSI>(params);
}

- (void)getExtensionVersion:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject
{
  NSString *version = [AEPMobileCore extensionVersion];
  NSLog(@"[CoreTurbo] Mobile Core extension version: %@", version);
  resolve(version ?: @"");
}

+ (NSString *)moduleName {
  return @"NativeCoreTurbo";
}

@end
