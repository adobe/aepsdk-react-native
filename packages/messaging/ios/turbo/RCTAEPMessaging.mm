/*
  Copyright 2026 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
  or agreed to in writing, software distributed under the License is
  distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
  ANY KIND, either express or implied. See the License for the specific
  language governing permissions and limitations under the License.
*/

#import "RCTAEPMessaging.h"

#if __has_include(<RCTAEPMessaging/RCTAEPMessaging-Swift.h>)
#import <RCTAEPMessaging/RCTAEPMessaging-Swift.h>
#else
#import "RCTAEPMessaging-Swift.h"
#endif

// Thin Obj-C++ TurboModule over the Swift implementation (RCTAEPMessagingImpl). Promises are
// completed here; native -> JS events are mapped onto the codegen emitters from SpecBase.
@implementation RCTAEPMessaging {
  RCTAEPMessagingImpl *_impl;
}

RCT_EXPORT_MODULE(NativeAEPMessaging)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (instancetype)init {
  if (self = [super init]) {
    _impl = [[RCTAEPMessagingImpl alloc] init];
    __weak RCTAEPMessaging *weakSelf = self;
    _impl.eventEmitter = ^(NSString *name, NSDictionary<NSString *, id> *body) {
      [weakSelf dispatchEventNamed:name body:body];
    };
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAEPMessagingSpecJSI>(params);
}

#pragma mark - Events (native -> JS)

- (void)dispatchEventNamed:(NSString *)name body:(NSDictionary *)body {
  if (!_eventEmitterCallback) {
    return;
  }
  if ([name isEqualToString:@"onShow"]) {
    [self emitOnShow:body];
  } else if ([name isEqualToString:@"onDismiss"]) {
    [self emitOnDismiss:body];
  } else if ([name isEqualToString:@"shouldShowMessage"]) {
    [self emitShouldShowMessage:body];
  } else if ([name isEqualToString:@"urlLoaded"]) {
    [self emitUrlLoaded:body];
  } else if ([name isEqualToString:@"onContentLoaded"]) {
    [self emitOnContentLoaded:body];
  } else if ([name isEqualToString:@"onJavascriptMessage"]) {
    [self emitOnJavascriptMessage:body];
  } else if ([name isEqualToString:@"onJavascriptResult"]) {
    [self emitOnJavascriptResult:body];
  }
}

// Kept for NativeEventEmitter compatibility on the interop path.
- (void)addListener:(NSString *)eventName {
}

- (void)removeListeners:(double)count {
}

#pragma mark - NativeAEPMessagingSpec protocol methods

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  resolve([_impl extensionVersion]);
}

- (void)getCachedMessages:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
  resolve([_impl getCachedMessages]);
}

- (void)getLatestMessage:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  resolve([_impl getLatestMessage]);
}

- (void)getPropositionsForSurfaces:(NSArray *)surfaces
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject {
  [_impl getPropositionsForSurfaces:surfaces
                         completion:^(NSDictionary<NSString *, id> *_Nullable result,
                                      NSString *_Nullable errorCode) {
                           if (errorCode != nil) {
                             reject(errorCode, nil, nil);
                           } else {
                             resolve(result);
                           }
                         }];
}

- (void)refreshInAppMessages {
  [_impl refreshInAppMessages];
}

- (void)setMessagingDelegate {
  [_impl setMessagingDelegate];
}

// Synchronous: releases the native thread blocked in shouldShowMessage.
- (NSNumber *)setMessageSettings:(BOOL)shouldShowMessage
               shouldSaveMessage:(BOOL)shouldSaveMessage {
  [_impl setMessageSettingsWithShouldShowMessage:shouldShowMessage
                               shouldSaveMessage:shouldSaveMessage];
  return @YES;
}

- (void)updatePropositionsForSurfaces:(NSArray *)surfaces
                              resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject {
  [_impl updatePropositionsForSurfaces:surfaces
                            completion:^(BOOL success) {
                              if (success) {
                                resolve(nil);
                              } else {
                                reject(@"Unable to update propositions for surfaces", nil, nil);
                              }
                            }];
}

- (void)trackContentCardDisplay:(NSDictionary *)proposition
                    contentCard:(NSDictionary *)contentCard {
  [_impl trackContentCardDisplay:proposition contentCardMap:contentCard];
}

- (void)trackContentCardInteraction:(NSDictionary *)proposition
                        contentCard:(NSDictionary *)contentCard {
  [_impl trackContentCardInteraction:proposition contentCardMap:contentCard];
}

- (void)trackPropositionItem:(NSString *)uuid
                 interaction:(NSString *_Nullable)interaction
                   eventType:(double)eventType
                      tokens:(NSArray *_Nullable)tokens {
  [_impl trackPropositionItem:uuid
                  interaction:interaction
                    eventType:(NSInteger)eventType
                       tokens:tokens];
}

- (void)getInboxState:(NSString *)activityId
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  resolve([_impl getInboxState:activityId]);
}

- (void)setInboxState:(NSString *)activityId
            stateJson:(NSString *)stateJson
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  [_impl setInboxState:activityId stateJson:stateJson];
  resolve(nil);
}

- (void)setAutoTrack:(NSString *)messageId autoTrack:(BOOL)autoTrack {
  [_impl setAutoTrack:messageId autoTrack:autoTrack];
}

- (void)show:(NSString *)messageId {
  [_impl show:messageId];
}

- (void)dismiss:(NSString *)messageId suppressAutoTrack:(NSNumber *)suppressAutoTrack {
  [_impl dismiss:messageId suppressAutoTrack:suppressAutoTrack.boolValue];
}

- (void)track:(NSString *)messageId
  interaction:(NSString *)interaction
    eventType:(double)eventType {
  [_impl track:messageId interaction:interaction eventType:(NSInteger)eventType];
}

- (void)clear:(NSString *)messageId {
  [_impl clear:messageId];
}

- (void)handleJavascriptMessage:(NSString *)messageId handlerName:(NSString *)handlerName {
  [_impl handleJavascriptMessage:messageId handlerName:handlerName];
}

- (void)evaluateJavascript:(NSString *)messageId javascriptString:(NSString *)javascriptString {
  [_impl evaluateJavascript:messageId javascriptString:javascriptString];
}

@end
