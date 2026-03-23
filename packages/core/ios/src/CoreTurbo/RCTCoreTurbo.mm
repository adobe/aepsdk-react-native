/*
Copyright 2022 Adobe. All rights reserved.
RCTCoreTurbo – Turbo Native Module (iOS). Logs Core and Optimize extension versions (AEP SDK from cloud).
*/
#import "RCTCoreTurbo.h"
@import AEPCore;
@import AEPOptimize;

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

- (void)getOptimizeVersion:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
  NSString *version = [AEPMobileOptimize extensionVersion];
  NSLog(@"[CoreTurbo] AEP Optimize extension version: %@", version);
  resolve(version ?: @"");
}

+ (NSString *)moduleName {
  return @"NativeCoreTurbo";
}

@end
