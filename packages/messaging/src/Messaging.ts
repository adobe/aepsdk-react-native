/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import {
  NativeModules,
  NativeEventEmitter,
  NativeModule,
  Platform
} from 'react-native';
import Message from './models/Message';
import { MessagingDelegate } from './models/MessagingDelegate';
import { MessagingProposition } from './models/MessagingProposition';
import { ContentCard } from './models/ContentCard';
import { PersonalizationSchema } from './models/PersonalizationSchema';
import { ContentTemplate, TemplateType } from './ui/types/Templates';
export interface NativeMessagingModule {
  extensionVersion: () => Promise<string>;
  getCachedMessages: () => Message[];
  getLatestMessage: () => Message;
  getContentCardUI: (surface: string) => Promise<ContentTemplate[]>;
  getPropositionsForSurfaces: (
    surfaces: string[]
  ) => Record<string, MessagingProposition[]>;
  refreshInAppMessages: () => void;
  setMessagingDelegate: (delegate?: MessagingDelegate) => void;
  setMessageSettings: (
    shouldShowMessage: boolean,
    shouldSaveMessage: boolean
  ) => void;
  updatePropositionsForSurfaces: (surfaces: string[]) => void;
  trackContentCardDisplay: (
    proposition: MessagingProposition,
    contentCard: ContentCard
  ) => void;
  trackContentCardInteraction: (
    proposition: MessagingProposition,
    contentCard: ContentCard
  ) => void;
  handleJavascriptMessage: (messageId: string, handlerName: string) => void;
}

const RCTAEPMessaging: NativeModule & NativeMessagingModule =
  NativeModules.AEPMessaging;

declare var messagingDelegate: MessagingDelegate;
var messagingDelegate: MessagingDelegate;

// Registery to store callbacks for each message in handleJavascriptMessage
// Record - {messageId : {handlerName : callback}}
const jsMessageHandlers: Record<
  string,
  Record<string, (content: string) => void>
> = {};
const handleJSMessageEventEmitter = new NativeEventEmitter(RCTAEPMessaging);

handleJSMessageEventEmitter.addListener('onJavascriptMessage', (event) => {
  const { messageId, handlerName, content } = event;
  if (
    jsMessageHandlers[messageId] &&
    jsMessageHandlers[messageId][handlerName]
  ) {
    jsMessageHandlers[messageId][handlerName](content);
  }
});

class Messaging {
  /**
   * Returns the version of the AEPMessaging extension
   * @returns {string} Promise a promise that resolves with the extension version
   */
  static extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPMessaging.extensionVersion());
  }

  /**
   * Initiates a network call to retrieve remote In-App Message definitions.
   */
  static refreshInAppMessages() {
    RCTAEPMessaging.refreshInAppMessages();
  }

  /**
   * Retrieves the list of messages which have been cached using the `shouldSaveMessage`
   * method of the messaging delegate.
   * Note: Messages should be cached before trying to use any of the methods on the message class
   * @returns An array of messages that have been cached
   */
  static async getCachedMessages(): Promise<Message[]> {
    const messages = await RCTAEPMessaging.getCachedMessages();
    return messages.map((msg) => new Message(msg));
  }

  /**
   * Retrieves the last message that has been shown in the UI
   * @returns The latest message to have been displayed
   */
  static async getLatestMessage(): Promise<Message | null | undefined> {
    const message = await RCTAEPMessaging.getLatestMessage();
    return message ? new Message(message) : undefined;
  }

  /**
   * Retrieves the previously fetched (and cached) feeds content from the SDK for the provided surfaces.
   * If the feeds content for one or more surfaces isn't previously cached in the SDK, it will not be retrieved from Adobe Journey Optimizer via the Experience Edge network.
   * @param surfaces A list of surfaces to fetch
   * @returns A record of surface names with their corresponding propositions
   */
  static async getPropositionsForSurfaces(
    surfaces: string[]
  ): Promise<Record<string, MessagingProposition[]>> {
    return await RCTAEPMessaging.getPropositionsForSurfaces(surfaces);
  }

  static trackContentCardDisplay(
    proposition: MessagingProposition,
    contentCard: ContentCard
  ): void {
    RCTAEPMessaging.trackContentCardDisplay(proposition, contentCard);
  }

  static trackContentCardInteraction(
    proposition: MessagingProposition,
    contentCard: ContentCard
  ): void {
    RCTAEPMessaging.trackContentCardInteraction(proposition, contentCard);
  }

  /**
   * Function to set the UI Message delegate to listen the Message lifecycle events.
   * @returns A function to unsubscribe from all event listeners
   */
  static setMessagingDelegate(delegate: MessagingDelegate): () => void {
    messagingDelegate = delegate;

    const eventEmitter = new NativeEventEmitter(RCTAEPMessaging);

    eventEmitter.addListener('onShow', (message) =>
      messagingDelegate?.onShow?.(message)
    );

    eventEmitter.addListener('onDismiss', (message) => {
      messagingDelegate?.onDismiss?.(message);
    });

    eventEmitter.addListener('shouldShowMessage', (message) => {
      const shouldShowMessage =
        messagingDelegate?.shouldShowMessage?.(message) ?? true;
      const shouldSaveMessage =
        messagingDelegate?.shouldSaveMessage?.(message) ?? false;
      RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
    });

    if (Platform.OS === 'ios') {
      eventEmitter.addListener('urlLoaded', (event) =>
        messagingDelegate?.urlLoaded?.(event.url, event.message)
      );
    }

    if (Platform.OS === 'android') {
      eventEmitter.addListener('onContentLoaded', (event) =>
        messagingDelegate?.onContentLoaded?.(event.message)
      );
    }

    RCTAEPMessaging.setMessagingDelegate();

    return () => {
      eventEmitter.removeAllListeners('onDismiss');
      eventEmitter.removeAllListeners('onShow');
      eventEmitter.removeAllListeners('shouldShowMessage');
      eventEmitter.removeAllListeners('urlLoaded');
      eventEmitter.removeAllListeners('onContentLoaded');
    };
  }

  /**
   * Sets global settings for messages being shown and cached
   * Note: This method is also used by MessagingDelegate.shouldShowMessage,
   * which allows finer-grained control over setting these settings
   * @param shouldShowMessage Whether or not a message should be displayed
   * @param shouldSaveMessage Whether or not a message should be cached
   */
  static setMessageSettings(
    shouldShowMessage: boolean,
    shouldSaveMessage: boolean
  ) {
    RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
  }

  /**
   * Dispatches an event to fetch propositions for the provided surfaces from remote.
   * @param surfaces A list of surface names to update
   */
  static updatePropositionsForSurfaces(surfaces: string[]) {
    RCTAEPMessaging.updatePropositionsForSurfaces(surfaces);
  }

  /**
   * Registers a javascript interface for the provided handler name
   * to the WebView associated with the InAppMessage presentation
   * to handle Javascript messages.
   * When the registered handlers are executed via the HTML
   * the result will be passed back to the associated callback.
   * @param messageId The id of the message to handle
   * @param handlerName The name of the handler to handle
   * @param callback The callback to handle the message
   */
  static handleJavascriptMessage(
    messageId: string,
    handlerName: string,
    callback: (content: string) => void
  ) {
    if (!jsMessageHandlers[messageId]) {
      jsMessageHandlers[messageId] = {};
    }
    jsMessageHandlers[messageId][handlerName] = callback;
    RCTAEPMessaging.handleJavascriptMessage(messageId, handlerName);
  }

  static async getContentCardUI(surface: string): Promise<ContentTemplate[]> {
    const messages = await Messaging.getPropositionsForSurfaces([surface]);
    const propositions = messages[surface];
    if (!propositions?.length) {
      return [];
    }
    const contentCards = propositions.flatMap((proposition) =>
      proposition.items.filter(
        (item) => item.schema === PersonalizationSchema.CONTENT_CARD
      )
    );

    if (!contentCards?.length) {
      return [];
    }

    return contentCards.map((card: ContentCard) => {
      const type = card.data?.meta?.adobe?.template ?? TemplateType.SMALL_IMAGE;
      return {
        ...card,
        type
      };
    }) as ContentTemplate[];
  }
}

export default Messaging;
