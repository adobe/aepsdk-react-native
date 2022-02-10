/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

'use strict';

import { NativeModules, NativeEventEmitter } from 'react-native';
const RCTAEPMessaging = NativeModules.AEPMessaging;
import { Message } from './models/Message';
import type { MessagingDelegate } from "./models/MessagingDelegate";

var messagingDelegate: MessagingDelegate
var eventListenerShow;
var eventListenerDismiss;
var eventListenerShouldShow;
var eventListenerUrlLoaded;
var savedMessageId: ?string = null;

module.exports = {
  /**
   * Returns the version of the AEPMessaging extension
   * @param  {string} Promise a promise that resolves with the extension verison
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPMessaging.extensionVersion());
  },

  refreshInAppMessages() {
    RCTAEPMessaging.refreshInAppMessages();
  },

  setMessagingDelegate(delegate: MessagingDelegate) {    
    messagingDelegate = delegate;
    RCTAEPMessaging.setMessagingDelegate();        
    // @"onShow", @"onDismiss", @"shouldShowMessage",@"urlLoaded"
    const eventEmitter = new NativeEventEmitter(RCTAEPMessaging);
    eventListenerShow = eventEmitter.addListener('onShow', (event) => {
      console.log(">>>>> onShow");      
      if(messagingDelegate){
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);
        messagingDelegate.onShow(message);
      }  
    });

    eventListenerDismiss = eventEmitter.addListener('onDismiss', (event) => {
      console.log(">>>>> onDismiss");      
      if(messagingDelegate){
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);
        messagingDelegate.onDismiss(message);
      }
    });

    eventListenerShouldShow = eventEmitter.addListener('shouldShowMessage', (event) => {      
      console.log(">>>> shouldShowMessage1");
      if(messagingDelegate){
        console.log(`>>>> shouldShowMessage2. Message details: event: ${JSON.stringify(event)} id: ${event.id} autotrack: ${event.autoTrack}`);        
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);
        console.log(">>>> shouldShowMessage3");
        var shouldShowMessage: boolean = messagingDelegate.shouldShowMessage(message);
        console.log(">>>> shouldShowMessage4");
        RCTAEPMessaging.shouldShowMessage(shouldShowMessage, savedMessageId ? true : false);
        savedMessageId = null;
      }
    });

    eventListenerUrlLoaded = eventEmitter.addListener('urlLoaded', (event) => {
      console.log(">>>>> urlLoaded");      
      if(messagingDelegate){
        const url = event.url;
        messagingDelegate.urlLoaded(url);
      }
    });    
  },

  show(id: string) {
    console.log(`>>>> show message id: ${id}`);
    RCTAEPMessaging.show(id);
  },

  dismiss(id: string, suppressAutoTrack: boolean) {
    RCTAEPMessaging.dismiss(id, suppressAutoTrack);
  }, 

  track(id: string, interaction: ?string, eventType: number) {
    RCTAEPMessaging.track(id, interaction, eventType);
  },

  handleJavascriptMessage(id: string, name: string): Promise<?any> {
    return Promise.resolve(RCTAEPMessaging.handleJavascriptMessage(id, name));
  },  

  saveMessage(message: Message) {
    savedMessageId = message.id;
  },

  clearMessage(id: string) {
    RCTAEPMessaging.clearMessage(id);
  }
};
