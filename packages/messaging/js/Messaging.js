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

const RCTAEPMessaging = require('react-native').NativeModules.AEPMessaging;
const MessagingEdgeEventType = require("./models/MessagingEdgeEventType");
import { Message } from './models/Message';
import type { MessagingDelegate } from "./models/MessagingDelegate";

var messagingDelegate: MessagingDelegate

const onShow = (data) => {
  const message = new Message(data[0].id, data[0].autoTrack);
  if(messagingDelegate){
    messagingDelegate.onShow(message);
  }  
}

const onDismiss = (data) => {
  const message = new Message(data[0].id, data[0].autoTrack);
  if(messagingDelegate){
    messagingDelegate.onDismiss(message);
  }
}

const shouldShowMessage = (data) => {
  const message = new Message(data[0].id, data[0].autoTrack);
  if(messagingDelegate){
    var shouldShowMessage: boolean = messagingDelegate.shouldShowMessage(message);
    RCTAEPMessaging.shouldShowMessage(shouldShowMessage);
  }
}

const urlLoaded = (data) => {
  const url = data[0].url;
  if(messagingDelegate){
    messagingDelegate.urlLoaded(url);
  }
}

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
    RCTAEPMessaging.setOnDismissCallback(onDismiss);
    RCTAEPMessaging.setOnShowCallback(onShow);
    RCTAEPMessaging.setShouldShowMessageCallback(shouldShowMessage);
    RCTAEPMessaging.setUrlLoadedCallback(urlLoaded);
  },

  show(id: string) {
    RCTAEPMessaging.show(id);
  },

  dismiss(id: string, suppressAutoTrack: boolean) {
    RCTAEPMessaging.dismiss(suppressAutoTrack);
  }, 

  track(id: string, interaction: ?string, eventType: number) {
    RCTAEPMessaging.track(interaction, eventType);
  },

  handleJavascriptMessage(id: string, name: string): Promise<?any> {
    return Promise.resolve(RCTAEPMessaging.handleJavascriptMessage(name));
  },  

  clearMessage(id: string) {
    RCTAEPMessaging.clearMessage(id);
  }
};
