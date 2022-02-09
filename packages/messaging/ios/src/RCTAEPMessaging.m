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
    NSMutableDictionary<NSString*, AEPMessage*> * cachedMessages;
    dispatch_semaphore_t semaphore;
    bool shouldShowMessage;
    bool hasListeners;
}

- (instancetype) init {
    self = [super init];
    cachedMessages = [NSMutableDictionary dictionary];
    semaphore = dispatch_semaphore_create(0);
    hasListeners = false;
    shouldShowMessage = true;
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
    AEPMessage * message = [cachedMessages objectForKey:messageId];
    [message show];
}

RCT_EXPORT_METHOD(dismiss: (NSString *) messageId) {
    AEPMessage * message = [cachedMessages objectForKey:messageId];
    [message dismiss];
}

RCT_EXPORT_METHOD(track: (NSString *) messageId withInteraction: (NSString *) interaction eventType: (int) eventTypeValue) {
    AEPMessage * message = [cachedMessages objectForKey:messageId];
    AEPMessagingEdgeEventType messagingEdgeEventType = -1;
    
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
    
    if(messagingEdgeEventType != -1){
        [message trackInteraction:interaction withEdgeEventType:messagingEdgeEventType];
    }
}

RCT_EXPORT_METHOD(handleJavascriptMessage: (NSString *) messageId messageName: (NSString *) name resolver: (RCTPromiseResolveBlock) resolve rejector:(RCTPromiseRejectBlock) reject) {
    
    AEPMessage * message = [cachedMessages objectForKey: messageId];
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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(shouldShowMessage: (BOOL) shouldShowMessage) {
    self->shouldShowMessage = shouldShowMessage;
    NSLog(@">>>> IN JS thread %i", self->shouldShowMessage);
    dispatch_semaphore_signal(semaphore);
    return nil;
}

//MARK: - AEPMessagingDelegate functions.
- (void) onDismissWithMessage:(id<AEPShowable> _Nonnull) message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    AEPMessage * messageObj = (AEPMessage *) fullscreenMessage.settings.parent;
        if(messageObj) {
            [self emitEventWithName:@"onDismiss"  body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false"}];
        }
}

- (void) onShowWithMessage:(id<AEPShowable> _Nonnull)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    AEPMessage * messageObj = (AEPMessage *) fullscreenMessage.settings.parent;
    if(messageObj) {
        [self emitEventWithName:@"onShow" body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false"}];
    }
}

- (BOOL) shouldShowMessageWithMessage:(id<AEPShowable> _Nonnull)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    AEPMessage * messageObj = (AEPMessage *) fullscreenMessage.settings.parent;
    if(messageObj) {
        NSLog(@">>>> shouldShowMessageWithMessage Message id: %@", messageObj.id);
        [cachedMessages setObject:messageObj forKey:messageObj.id];
        [self emitEventWithName:@"shouldShowMessage" body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false"}];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    }
    NSLog(@">>>> From shouldShowMessageWithMessage returning %i ", self->shouldShowMessage);
    return self->shouldShowMessage;
}

- (void) urlLoaded:(NSURL *)url byMessage:(id<AEPShowable>)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    AEPMessage * messageObj = (AEPMessage *) fullscreenMessage.settings.parent;
    if(messageObj){
        [self emitEventWithName:@"urlLoaded" body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false"}];
    }
 }

- (NSArray<NSString *> *) supportedEvents {
    return @[@"onShow", @"onDismiss", @"shouldShowMessage",@"urlLoaded"];
}

- (void) startObserving {
    hasListeners = true;
}

- (void) stopObserving {
    hasListeners = false;
}

- (void) emitEventWithName: (NSString *) name body: (NSDictionary<NSString*, NSString*> *) dictionary {
    if(hasListeners){
        [self sendEventWithName:name body:dictionary];
    }
}

@end
    
    
