/*
 Copyright 2021 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */

#import "RCTAEPMessaging.h"
@import AEPMessaging;
@import AEPCore;
@import AEPServices;

@implementation RCTAEPMessaging {
    NSMutableDictionary<NSString*, Message*> * cachedMessages;
    BOOL shouldShowMessage;
    RCTResponseSenderBlock dismissCallback;
    RCTResponseSenderBlock showCallback;
    RCTResponseSenderBlock shouldShowCallback;
    RCTResponseSenderBlock urlLoadedCallback;
    
    dispatch_semaphore_t semaphore;
}

- (instancetype)init {
    self = [super init];
    cachedMessages = [NSMutableDictionary dictionary];
    semaphore = dispatch_semaphore_create(0);
    return self;
}

RCT_EXPORT_MODULE(AEPMessaging);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject) {
    resolve([AEPMobileMessaging extensionVersion]);
}

RCT_EXPORT_METHOD(refreshInAppMessages) {
    [AEPMobileMessaging refreshInAppMessages];
}

RCT_EXPORT_METHOD(setMessagingDelegate) {
    [AEPMobileCore setMessagingDelegate: self];
}

RCT_EXPORT_METHOD(show: (NSString *) messageId) {
    Message * message = [cachedMessages objectForKey:messageId];
    [message show];
}

RCT_EXPORT_METHOD(dismiss: (NSString *) messageId  withSuppressAutoTrack: (Boolean) suppressAutoTrack) {
    Message * message = [cachedMessages objectForKey:messageId];
    [message dismissWithSuppressAutoTrack: suppressAutoTrack];
}

RCT_EXPORT_METHOD(track: (NSString *) messageId withInteraction: (NSString *) interaction eventType: (int) eventTypeValue) {
    Message * message = [cachedMessages objectForKey:messageId];
    AEPMessagingEdgeEventType * messagingEdgeEventType;
    
    if(eventTypeValue == 0){
        messagingEdgeEventType = AEPMessagingEdgeEventTypeInappDismiss;
    } else if (eventTypeValue == 1) {
        messagingEdgeEventType = AEPMessagingEdgeEventTypeInappInteract;
    } else if (eventTypeValue == 2) {
        messagingEdgeEventType = AEPMessagingEdgeEventTypeInappTrigger;
    } else if (eventTypeValue == 3) {
        messagingEdgeEventType = AEPMessagingEdgeEventTypeInappDisplay;
    } else if (eventTypeValue == 4) {
        messagingEdgeEventType = AEPMessagingEdgeEventTypePushApplicationOpened;
    } else if (eventTypeValue == 5) {
        messagingEdgeEventType = AEPMessagingEdgeEventTypePushCustomAction;
    }
    
    [message track:interaction withEdgeEventType: *messagingEdgeEventType];
}

RCT_EXPORT_METHOD(handleJavascriptMessage: (NSString *) messageId messageName: (NSString *) name resolver: (RCTPromiseResolveBlock) resolve rejector:(RCTPromiseRejectBlock) reject) {
    
    Message * message = [cachedMessages objectForKey: messageId];
    [message handleJavascriptMessage:name withHandler:^(id result) {
        if(result) {
            resolve(result);
        } else {
            reject(@"error", @"error in handleJavaScriptMessage", nil);
        }
    }];
}

RCT_EXPORT_METHOD(clearMessage: (NSString *) messageId) {
    [cachedMessages removeObjectForKey:messageId];
}

RCT_EXPORT_METHOD(shouldShowMessage: (BOOL) shouldShowMessage) {
    self->shouldShowMessage = shouldShowMessage;
    dispatch_semaphore_signal(semaphore);
}

RCT_EXPORT_METHOD(setOnDismissCallback: (RCTResponseSenderBlock) dismissCallback){
    self->dismissCallback = dismissCallback;
}

RCT_EXPORT_METHOD(setOnShowCallback: (RCTResponseSenderBlock) showCallback){
    self->showCallback = showCallback;
}

RCT_EXPORT_METHOD(setShouldShowMessageCallback: (RCTResponseSenderBlock) shouldShowCallback){
    self->shouldShowCallback = shouldShowCallback;
}

RCT_EXPORT_METHOD(setUrlLoadedCallback: (RCTResponseSenderBlock) urlLoadedCallback){
    self->urlLoadedCallback = urlLoadedCallback;
}

//MARK: - AEPMessagingDelegate functions.
- (void) onDismissWithMessage:(id<AEPShowable> _Nonnull) message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    Message * messageObj = (Message *) fullscreenMessage.settings.parent;
    self->dismissCallback(@[@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @true : @false}]);
}

- (void) onShowWithMessage:(id<AEPShowable> _Nonnull)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    Message * messageObj = (Message *) fullscreenMessage.settings.parent;
    self->showCallback(@[@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @true: @false}]);
}

- (BOOL) shouldShowMessageWithMessage:(id<AEPShowable> _Nonnull)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    Message * messageObj = (Message *) fullscreenMessage.settings.parent;
    self->shouldShowCallback(@[@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @true : @false}]);
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    return shouldShowMessage;
}

- (void) urlLoaded:(NSURL *)url byMessage:(id<AEPShowable>)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    Message * messageObj = (Message *) fullscreenMessage.settings.parent;
    self->urlLoadedCallback(
                            @[@{@"url":url, @"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @true : @false}]
    );
 }

@end
