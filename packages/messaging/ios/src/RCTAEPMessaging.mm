/*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
  or agreed to in writing, software distributed under the License is
  distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
  ANY KIND, either express or implied. See the License for the specific
  language governing permissions and limitations under the License.
*/

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (RCTAEPMessaging, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(extensionVersion
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getCachedMessages
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLatestMessage
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPropositionsForSurfaces
                  : (NSArray<NSString *> *)surfaces withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(refreshInAppMessages);

RCT_EXTERN_METHOD(setMessagingDelegate);

RCT_EXTERN_METHOD(setMessageSettings
                  : (BOOL) shouldShowMessage withShouldSaveMessage
                  : (BOOL)shouldSaveMessage);

RCT_EXTERN_METHOD(updatePropositionsForSurfaces
                  : (NSArray<NSString *> *)surfaces withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(trackContentCardDisplay
                  : (NSDictionary *)propositionMap contentCardMap
                  : (NSDictionary *)contentCardMap);

RCT_EXTERN_METHOD(trackContentCardInteraction
                  : (NSDictionary *)propositionMap contentCardMap
                  : (NSDictionary *)contentCardMap);

RCT_EXTERN_METHOD(trackPropositionItem
                  : (NSString *)uuid interaction
                  : (NSString * _Nullable)interaction eventType
                  : (NSInteger)eventType tokens
                  : (NSArray<NSString *> * _Nullable)tokens withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(handleJavascriptMessage
                  : (NSString *)messageId handlerName
                  : (NSString *)handlerName)

@end
