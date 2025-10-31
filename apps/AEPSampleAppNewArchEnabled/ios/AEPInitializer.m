
//
//  AEPInitializer.m
//  AEPSampleAppNewArchEnabled
//

@import AEPCore;
@import AEPServices;
@import AEPLifecycle;
@import AEPSignal;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;

#import "AEPInitializer.h"

@implementation AEPInitializer

+ (void)initializeSDKWithApplication:(UIApplication *)application appId:(NSString *)appId
{
  [AEPMobileCore setLogLevel:AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:appId];

#if DEBUG
  [AEPMobileCore updateConfiguration:@{ @"messaging.useSandbox": @YES }];
#endif

  const UIApplicationState appState = application.applicationState;
  [AEPMobileCore registerExtensions:@[
    AEPMobileLifecycle.class,
    AEPMobileSignal.class,
    AEPMobileEdge.class,
    AEPMobileEdgeIdentity.class,
    AEPMobileEdgeConsent.class,
  ] completion:^{
    if (appState != UIApplicationStateBackground) {
      [AEPMobileCore lifecycleStart:nil];
    }
  }];
}

+ (void)setPushToken:(NSData *)deviceToken
{
  // Log the APNs device token being passed to AEPMobileCore
  NSLog(@"[AEPInitializer][Push] setPushToken called; NSData length: %lu", (unsigned long)deviceToken.length);
  const unsigned char *dataBuffer = (const unsigned char *)deviceToken.bytes;
  NSMutableString *tokenString = [NSMutableString stringWithCapacity:(deviceToken.length * 2)];
  for (NSUInteger i = 0; i < deviceToken.length; ++i) {
    [tokenString appendFormat:@"%02x", dataBuffer[i]];
  }
  NSLog(@"[AEPInitializer][Push] APNs device token (hex) passed to AEPMobileCore: %@", tokenString);

  [AEPMobileCore setPushIdentifier:deviceToken];
}

@end


