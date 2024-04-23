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

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AEPSampleApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  [AEPMobileCore setLogLevel:AEPLogLevelTrace];
  [AEPMobileCore configureWithAppId:@"YOUR-APP-ID"];
  const UIApplicationState appState = application.applicationState;
  [AEPMobileCore registerExtensions:@[
      AEPMobileLifecycle.class, AEPMobileIdentity.class,
      AEPMobileEdgeIdentity.class, AEPMobileEdge.class,
      AEPMobileEdgeConsent.class, AEPMobileEdgeBridge.class,
      AEPMobileMessaging.class, AEPMobileOptimize.class, AEPMobilePlaces.class,
      AEPMobileTarget.class, AEPMobileCampaignClassic.class,
      AEPMobileAssurance.class
    ]
                          completion:^{
                             if (appState != UIApplicationStateBackground) {
                               [AEPMobileCore lifecycleStart:nil];
                             }
                           }];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  [AEPMobileCore lifecyclePause];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  [AEPMobileCore lifecycleStart:nil];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
