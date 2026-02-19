/*
 * Copyright 2022 Adobe. All rights reserved.
 * RCTAEPOptimize Turbo Native Module (iOS).
 * Structure follows the reference: AepTurboCore (turboPackageCore/turboCore)
 * https://reactnative.dev/docs/turbo-native-modules-introduction?platforms=ios
 * Forward-declare spec to avoid importing ReactCodegen in the header (non-modular include errors).
 */
#import <Foundation/Foundation.h>

@protocol NativeAEPOptimizeSpec;

NS_ASSUME_NONNULL_BEGIN

@interface RCTAEPOptimize : NSObject <NativeAEPOptimizeSpec>

@end

NS_ASSUME_NONNULL_END
