#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"aepsampleapp";
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
