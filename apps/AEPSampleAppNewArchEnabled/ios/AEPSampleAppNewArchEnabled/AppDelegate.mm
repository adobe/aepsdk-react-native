#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <UserNotifications/UserNotifications.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self; // Show notifications in foreground via willPresentNotification
  UNAuthorizationOptions options = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [center requestAuthorizationWithOptions:options completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      NSLog(@"[Push] Authorization granted: %d", granted);

      dispatch_async(dispatch_get_main_queue(), ^{
        [application registerForRemoteNotifications];
      });
    } else {
      NSLog(@"[Push] Authorization not granted: %@", error);
    }
  }];

  // AEP SDK initialization is handled from JS via RCTAEPCore; no native init here

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog(@"[Push] didRegisterForRemoteNotificationsWithDeviceToken invoked");
  NSLog(@"[Push] deviceToken (NSData) length: %lu", (unsigned long)deviceToken.length);

  // Access raw bytes
  const unsigned char *dataBuffer = (const unsigned char *)deviceToken.bytes;
  NSLog(@"[Push] Obtained raw bytes pointer for device token");

  // Prepare mutable string with expected capacity (2 chars per byte)
  NSMutableString *tokenString  = [NSMutableString stringWithCapacity:(deviceToken.length * 2)];
  NSLog(@"[Push] Initialized tokenString with capacity: %lu", (unsigned long)(deviceToken.length * 2));

  // Build lowercase hex string while logging each step
  for (NSUInteger i = 0; i < deviceToken.length; ++i) {
    unsigned char byte = dataBuffer[i];
    [tokenString appendFormat:@"%02x", byte];
    NSLog(@"[Push] Assembling token: index=%lu, byte=0x%02x, partial=%@", (unsigned long)i, byte, tokenString);
  }

  NSLog(@"[Push] Final APNs device token (hex): %@", tokenString);

  // First, attempt to call our helper if it's linked
  Class aepInitializer = NSClassFromString(@"AEPInitializer");
  if (aepInitializer && [aepInitializer respondsToSelector:@selector(setPushToken:)]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
    [aepInitializer performSelector:@selector(setPushToken:) withObject:deviceToken];
#pragma clang diagnostic pop
  } else {
    // Fallback: call AEPMobileCore directly without importing headers
    Class mobileCore = NSClassFromString(@"AEPMobileCore");
    if (mobileCore && [mobileCore respondsToSelector:@selector(setPushIdentifier:)]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
      [mobileCore performSelector:@selector(setPushIdentifier:) withObject:deviceToken];
#pragma clang diagnostic pop
    } else {
      NSLog(@"[Push] AEPMobileCore not available; token not synced.");
    }
  }

  return [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  return [super application:application didFailToRegisterForRemoteNotificationsWithError:error];
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  // Log incoming remote notification payload
  NSLog(@"[Push] didReceiveRemoteNotification userInfo: %@", userInfo);
  return [super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Show notifications while app is in foreground
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  NSDictionary *userInfo = notification.request.content.userInfo;
  NSLog(@"[Push] willPresentNotification userInfo: %@", userInfo);
  completionHandler(UNNotificationPresentationOptionBanner | UNNotificationPresentationOptionList | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge);
}

// Handle taps on notifications
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  NSLog(@"[Push] didReceiveNotificationResponse actionIdentifier=%@ userInfo=%@", response.actionIdentifier, userInfo);
  completionHandler();
}

@end
