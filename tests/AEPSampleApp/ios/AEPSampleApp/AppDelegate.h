#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@import AEPCore;
@import AEPServices;
@import AEPSignal;
@import AEPLifecycle;
@import AEPIdentity;
@import AEPUserProfile;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
