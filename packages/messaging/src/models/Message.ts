/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { NativeEventEmitter, NativeModules } from 'react-native';

const RCTAEPMessaging = NativeModules.AEPMessaging;

// Registery to store inAppMessage callbacks for each message in Message.handleJavascriptMessage
// Record - {messageId : {handlerName : callback}}
const jsMessageHandlers: Record<string, Record<string, (content: string) => void>> = {};
const handleJSMessageEventEmitter = new NativeEventEmitter(RCTAEPMessaging);

// invokes the callback registered in Message.handleJavascriptMessage with the content received from the inAppMessage webview
handleJSMessageEventEmitter.addListener('onJavascriptMessage', (event) => {
  const {messageId, handlerName, content} = event;
  if (jsMessageHandlers[messageId] && jsMessageHandlers[messageId][handlerName]) {
    jsMessageHandlers[messageId][handlerName](content);
  }
});

class Message {
  id: string;
  autoTrack: boolean;

  constructor({ id, autoTrack = false }: { id: string; autoTrack: boolean }) {
    this.id = id;
    this.autoTrack = autoTrack;
  }

  /**
   * Update the value of property "autoTrack"
   * This function works only for the Message objects that were saved by calling "Messaging.saveMessage"
   * @param {boolean} autoTrack: New value of property autoTrack.
   */
  setAutoTrack(autoTrack: boolean) {
    this.autoTrack = autoTrack;
    RCTAEPMessaging.setAutoTrack(this.id, autoTrack);
  }

  /**
   * Signals to the UIServices that the message should be shown.
   * If autoTrack is true, calling this method will result in an "inapp.display" Edge Event being dispatched.
   */
  show() {
    RCTAEPMessaging.show(this.id);
  }

  /**
   * Signals to the UIServices that the message should be dismissed.
   * If `autoTrack` is true, calling this method will result in an "inapp.dismiss" Edge Event being dispatched.
   * @param {boolean?} suppressAutoTrack: if set to true, the inapp.dismiss Edge Event will not be sent regardless
   * of the autoTrack setting.
   */
  dismiss(suppressAutoTrack?: boolean) {
    RCTAEPMessaging.dismiss(this.id, suppressAutoTrack ? true : false);
  }

  /**
   * Generates an Edge Event for the provided interaction and eventType.
   * @param {string?} interaction: a custom String value to be recorded in the interaction
   * @param {MessagingEdgeEventType} eventType: the MessagingEdgeEventType to be used for the ensuing Edge Event
   */
  track(interaction: string, eventType: number) {
    RCTAEPMessaging.track(this.id, interaction, eventType);
  }

  /**
   * Clears the cached reference to the Message object.
   * This function must be called if Message was saved by calling "MessagingDelegate.shouldSaveMessage" but no longer needed.
   * Failure to call this function leads to memory leaks.
   */
  clear() {
    RCTAEPMessaging.clear(this.id);
  }

  /**
   * Adds a handler for named JavaScript messages sent from the message's WebView.
   * The parameter passed to handler will contain the body of the message passed from the WebView's JavaScript.
   * @param {string} handlerName: The name of the message that should be handled by the handler
   * @param {function} handler: The method or closure to be called with the body of the message created in the Message's JavaScript
   */
  handleJavascriptMessage(handlerName: string, handler: (content: string) => void) {
    // Validate parameters
    if (!handlerName) {
      console.warn('[AEP Messaging] handleJavascriptMessage: handlerName is required');
      return;
    }

    if (typeof handler !== 'function') {
      console.warn('[AEP Messaging] handleJavascriptMessage: handler must be a function');
      return;
    }

    // cache the callback
    if (!jsMessageHandlers[this.id]) {
      jsMessageHandlers[this.id] = {};
    }
    jsMessageHandlers[this.id][handlerName] = handler;
    RCTAEPMessaging.handleJavascriptMessage(this.id, handlerName);
  }

  /**
   * Clears all the javascript message handlers for the message.
   * This function must be called if the callbacks registered in handleJavascriptMessage are no longer needed.
   * Failure to call this function may lead to memory leaks.
   */
  clearJavascriptMessageHandlers() {
    delete jsMessageHandlers[this.id];
  }
}

export default Message;
