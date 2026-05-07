/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTBridgeModule.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@interface RCTNSLogger : NSObject <RCTBridgeModule> @end
@implementation RCTNSLogger
RCT_EXPORT_MODULE(NSLogger)
RCT_EXPORT_METHOD(log:(NSString *)message) { NSLog(@"[JS] %@", message); }
+ (BOOL)requiresMainQueueSetup { return NO; }
@end

@interface RCTBuildInfo : NSObject <RCTBridgeModule> @end
@implementation RCTBuildInfo
RCT_EXPORT_MODULE(BuildInfo)
- (NSDictionary *)constantsToExport {
#if DEBUG
  return @{ @"isDebug": @YES };
#else
  return @{ @"isDebug": @NO };
#endif
}
+ (BOOL)requiresMainQueueSetup { return NO; }
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AEPSampleApp";
  self.dependencyProvider = [RCTAppDependencyProvider new];
  self.initialProps = @{};

#if DEBUG
  NSLog(@"[BUILD] ✅ DEBUG BUILD");
#else
  NSLog(@"[BUILD] 🚀 RELEASE BUILD");
#endif

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  NSURL *embeddedBundle = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  if (embeddedBundle) {
    return embeddedBundle;
  }
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
