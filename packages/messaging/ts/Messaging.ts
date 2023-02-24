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

import { NativeModules, NativeEventEmitter, NativeModule } from 'react-native';
import Message from './models/Message';
import { MessagingDelegate } from "./models/MessagingDelegate";

export interface IMessaging {
  extensionVersion: () => Promise<string>;
  refreshInAppMessages: () => void;
  setMessagingDelegate: (delegate?: MessagingDelegate) => void;
  shouldShowMessage: (shouldShowMessage: boolean, shouldSaveMessage: boolean) => void;
  saveMessage: (message: Message) => void;
}

const RCTAEPMessaging: NativeModule & IMessaging = NativeModules.AEPMessaging;

declare var messagingDelegate: MessagingDelegate
declare var savedMessageId: string;

var messagingDelegate: MessagingDelegate;
var savedMessageId: string = null;

const Messaging = {
  /**
   * Returns the version of the AEPMessaging extension
   * @returns {string} Promise a promise that resolves with the extension version
   */
  extensionVersion(): Promise<string> {    
    return Promise.resolve(RCTAEPMessaging.extensionVersion());
  },

  /**
  * Initiates a network call to retrieve remote In-App Message definitions.
  */
  refreshInAppMessages() {
    RCTAEPMessaging.refreshInAppMessages();
  },

  /**
  * Function to set the UI Message delegate to listen the Message lifecycle events.
  */
  setMessagingDelegate(delegate: MessagingDelegate) {    
    messagingDelegate = delegate;
    RCTAEPMessaging.setMessagingDelegate();            
    const eventEmitter = new NativeEventEmitter(RCTAEPMessaging);    
    eventEmitter.addListener('onShow', (event) => {      
      if(messagingDelegate){
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);
        messagingDelegate.onShow(message);
      }  
    });

    eventEmitter.addListener('onDismiss', (event) => {      
      if(messagingDelegate){
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);
        messagingDelegate.onDismiss(message);
      }
    });

    eventEmitter.addListener('shouldShowMessage', (event) => {            
      if (messagingDelegate){        
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);        
        const shouldShowMessage: boolean = messagingDelegate.shouldShowMessage(message);        
        RCTAEPMessaging.shouldShowMessage(shouldShowMessage, savedMessageId ? true : false);
        savedMessageId = null;
      }
    });

    eventEmitter.addListener('urlLoaded', (event) => {      
      if(messagingDelegate){
        const url = event.url;
        const message = new Message(event.id, event.autoTrack === "true" ? true: false);        
        messagingDelegate.urlLoaded(url, message);
      }
    });    
  },

  /**
  * Cache the Message object in-memory to use later. 
  * If there is a requirement to call the Message functions like show, dismiss etc. The Message object should be saved first before calling it's functions.
  * If the Message is saved using this API then it is responsibility of App to free it after using.
  * To remove the Message from memory call clearMessage function of Message. Failure to call clearMessage will cause the Memory leak of Message object.
  */
  saveMessage(message: Message) {
    savedMessageId = message.id;
  },  
};

export default Messaging;
