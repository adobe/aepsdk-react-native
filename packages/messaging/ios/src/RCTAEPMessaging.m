/*
 Copyright 2022 Adobe. All rights reserved.
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

static NSString* const TAG = @"RCTAEPMessaging";

@implementation RCTAEPMessaging {
    NSMutableDictionary<NSString*, AEPMessage*> * cachedMessages;
    dispatch_semaphore_t semaphore;
    bool shouldShowMessage;
    bool hasListeners;
    bool shouldSaveMessage;
}

- (instancetype) init {
    self = [super init];
    cachedMessages = [NSMutableDictionary dictionary];
    semaphore = dispatch_semaphore_create(0);
    hasListeners = false;
    shouldShowMessage = true;
    shouldSaveMessage = false;
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
    [AEPLog traceWithLabel:TAG message:@"refreshInAppMessages is called."];
    [AEPMobileMessaging refreshInAppMessages];
}

RCT_EXPORT_METHOD(setMessagingDelegate) {
    [AEPLog traceWithLabel:TAG message:@"Messaging Delegate is set."];
    [AEPMobileCore setMessagingDelegate: self];
}

RCT_EXPORT_METHOD(show: (NSString *) messageId) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"show is called with message id: %@", messageId]];
    AEPMessage * message = [cachedMessages objectForKey:messageId];
    if(message){
        [message show];
    }
}

RCT_EXPORT_METHOD(dismiss: (NSString *) messageId suppressAutoTrack: (BOOL) suppressAutoTrack) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"dismiss is called with message id: %@ and suppressAutoTrack: %i", messageId, suppressAutoTrack]];
    AEPMessage * message = [cachedMessages objectForKey:messageId];
    if(message){
        [message dismissSuppressingAutoTrack:suppressAutoTrack];
    }
}

RCT_EXPORT_METHOD(track: (NSString *) messageId withInteraction: (NSString *) interaction eventType: (int) eventTypeValue) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"track is called with message id: %@, withInteraction: %@ and eventType: %i", messageId, interaction, eventTypeValue]];
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

RCT_EXPORT_METHOD(handleJavascriptMessage: (NSString *) messageId
                  messageName: (NSString *) name resolver: (RCTPromiseResolveBlock) resolve rejector:(RCTPromiseRejectBlock) reject) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"handleJavascriptMessage is called with message id: %@ and messageName: %@", messageId, name]];
    AEPMessage * message = [cachedMessages objectForKey: messageId];
    [message handleJavascriptMessage:name withHandler:^(id result) {
        if(result) {
            resolve(result);
        } else {
            reject(@"error", @"error in handleJavaScriptMessage", nil);
        }
    }];
}

RCT_EXPORT_METHOD(clear: (NSString *) messageId) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"clearMessage is called with message id: %@", messageId]];
    [cachedMessages removeObjectForKey:messageId];
}

RCT_EXPORT_METHOD(setAutoTrack: (NSString *) messageId autoTrack: (BOOL) autoTrack) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"setAutoTrack called for messageId: %@ and autoTrack value: %i", messageId, autoTrack]];
    AEPMessage * messageObj = [cachedMessages objectForKey:messageId];
    if(messageObj) {
        messageObj.autoTrack = autoTrack;
    }
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(shouldShowMessage: (BOOL) shouldShowMessage shouldSaveMessage: (BOOL) saveMessage) {
    [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"shouldShowMessage is called with values (shouldShowMessage: %i) and (shouldSaveMessage: %i)", shouldShowMessage, shouldSaveMessage]];
    self->shouldShowMessage = shouldShowMessage;
    self->shouldSaveMessage = saveMessage;
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
        [self emitEventWithName:@"shouldShowMessage" body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false"}];
    //Semaphore stops the thread until the value to be returned from this function is received from the JS side on thread dedicated to run JS code. The function called from JS that unlock the Semaphore is "shouldShowMessage".
        [AEPLog traceWithLabel:TAG message:@"Semaphore lock initiated."];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
        [AEPLog traceWithLabel:TAG message:@"Semaphore lock removed."];
        if(self->shouldSaveMessage) {
            [AEPLog traceWithLabel:TAG message:[[NSString alloc] initWithFormat:@"Message is saved with id: %@", messageObj.id]];
            [cachedMessages setObject:messageObj forKey:messageObj.id];
        }
    }
    return self->shouldShowMessage;
}

- (void) urlLoaded:(NSURL *)url byMessage:(id<AEPShowable>)message {
    AEPFullscreenMessage * fullscreenMessage = (AEPFullscreenMessage *) message;
    AEPMessage * messageObj = (AEPMessage *) fullscreenMessage.settings.parent;
    if(messageObj){
        [self emitEventWithName:@"urlLoaded" body:@{@"id":messageObj.id, @"autoTrack":messageObj.autoTrack ? @"true" : @"false", @"url":url.absoluteString}];
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
        [AEPLog traceWithLabel:TAG message:[NSString stringWithFormat:@"Event emitted with name: %@", name]];
        [self sendEventWithName:name body:dictionary];
    }
}

@end
