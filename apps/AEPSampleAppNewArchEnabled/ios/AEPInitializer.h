//
//  AEPInitializer.h
//  AEPSampleAppNewArchEnabled
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface AEPInitializer : NSObject

+ (void)initializeSDKWithApplication:(UIApplication *)application appId:(NSString *)appId;
+ (void)setPushToken:(NSData *)deviceToken;

@end

NS_ASSUME_NONNULL_END



