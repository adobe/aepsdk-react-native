#import "AdobeBridge.h"
#import <UIKit/UIKit.h>

@import AEPCore;
@import AEPLifecycle;
@import AEPSignal;
@import AEPIdentity;
@import AEPAssurance;
@import AEPCampaignClassic;
@import AEPEdge;
@import AEPEdgeBridge;
@import AEPEdgeConsent;
@import AEPEdgeIdentity;
@import AEPMessaging;
@import AEPOptimize;
@import AEPPlaces;
@import AEPTarget;
@import AEPUserProfile;
@import AEPServices;

@implementation AdobeBridge

+ (void)configure:(UIApplicationState)appState {
    [AEPMobileCore setLogLevel:AEPLogLevelDebug];

    NSArray *extensionsToRegister = @[
        AEPMobileIdentity.class, AEPMobileLifecycle.class,
        AEPMobileSignal.class, AEPMobileAssurance.class,
        AEPMobileCampaignClassic.class, AEPMobileEdge.class,
        AEPMobileEdgeBridge.class, AEPMobileEdgeConsent.class,
        AEPMobileEdgeIdentity.class, AEPMobileMessaging.class,
        AEPMobileOptimize.class, AEPMobilePlaces.class,
        AEPMobileTarget.class, AEPMobileUserProfile.class
    ];

    [AEPMobileCore registerExtensions:extensionsToRegister completion:^{
        [AEPMobileCore configureWithAppId:@"YOUR-APP-ID"];

        if (appState != UIApplicationStateBackground) {
            [AEPMobileCore lifecycleStart:nil]; // Added for foreground handling
        }
    }];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    [AEPMobileCore lifecyclePause]; // Added method for background handling
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    [AEPMobileCore lifecycleStart:nil]; // Added method for foreground handling
}

@end