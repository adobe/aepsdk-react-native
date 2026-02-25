/**
 * RCTAEPOptimize Turbo Native Module implementation (iOS).
 * - Conforms to Codegen-generated NativeAEPOptimizeSpec protocol
 * - Implements getTurboModule: (returns NativeAEPOptimizeSpecJSI)
 * - Implements + (NSString *)moduleName
 */
#import "RCTAEPOptimize.h"
@import AEPServices;
@import AEPOptimize;

@implementation RCTAEPOptimize

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPOptimizeSpecJSI>(params);
}

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
  resolve([AEPOptimize extensionVersion]);
}

+ (NSString *)moduleName {
  return @"NativeAEPOptimize";
}

@end