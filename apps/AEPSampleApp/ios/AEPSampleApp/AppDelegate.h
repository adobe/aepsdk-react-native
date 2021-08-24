#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@import AEPCore;
@import AEPServices;
@import AEPSignal;
@import AEPLifecycle;
@import AEPIdentity;
@import AEPUserProfile;
@import AEPEdge;
@import AEPEdgeIdentity;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
