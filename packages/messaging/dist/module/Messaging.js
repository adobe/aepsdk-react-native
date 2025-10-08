"use strict";

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

import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import Message from "./models/Message.js";
import { MessagingProposition } from "./models/MessagingProposition.js";
import { PersonalizationSchema } from "./models/PersonalizationSchema.js";
import { ContentTemplate } from "./ui/types/Templates.js";
const RCTAEPMessaging = NativeModules.AEPMessaging;
var messagingDelegate;
class Messaging {
  /**
   * Returns the version of the AEPMessaging extension
   * @returns {string} Promise a promise that resolves with the extension version
   */
  static extensionVersion() {
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
  static async getCachedMessages() {
    const messages = await RCTAEPMessaging.getCachedMessages();
    return messages.map(msg => new Message(msg));
  }

  /**
   * Retrieves the last message that has been shown in the UI
   * @returns The latest message to have been displayed
   */
  static async getLatestMessage() {
    const message = await RCTAEPMessaging.getLatestMessage();
    return message ? new Message(message) : undefined;
  }

  /**
   * Retrieves the previously fetched (and cached) feeds content from the SDK for the provided surfaces.
   * If the feeds content for one or more surfaces isn't previously cached in the SDK, it will not be retrieved from Adobe Journey Optimizer via the Experience Edge network.
   * @param surfaces A list of surfaces to fetch
   * @returns A record of surface names with their corresponding propositions
   */
  static async getPropositionsForSurfaces(surfaces) {
    const propositionsList = await RCTAEPMessaging.getPropositionsForSurfaces(surfaces);
    let messagingPropositionsForSurfaces = {};
    for (const [surface, propositions] of Object.entries(propositionsList)) {
      messagingPropositionsForSurfaces[surface] = propositions.map(proposition => new MessagingProposition(proposition));
    }
    return messagingPropositionsForSurfaces;
  }

  /**
   * @deprecated Use PropositionItem.track(...) instead.
   */
  static trackContentCardDisplay(proposition, contentCard) {
    RCTAEPMessaging.trackContentCardDisplay(proposition, contentCard);
  }

  /**
   * @deprecated Use PropositionItem.track(...) instead.
   */
  static trackContentCardInteraction(proposition, contentCard) {
    RCTAEPMessaging.trackContentCardInteraction(proposition, contentCard);
  }

  /**
   * Tracks interactions with a PropositionItem using the provided interaction and event type.
   * This method is used internally by the PropositionItem.track() method.
   *
   * @param {string} itemId - The unique identifier of the PropositionItem
   * @param {string | null} interaction - A custom string value to be recorded in the interaction
   * @param {number} eventType - The MessagingEdgeEventType numeric value
   * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
   */
  static trackPropositionItem(itemId, interaction, eventType, tokens) {
    RCTAEPMessaging.trackPropositionItem(itemId, interaction, eventType, tokens);
  }

  /**
   * Function to set the UI Message delegate to listen the Message lifecycle events.
   * @returns A function to unsubscribe from all event listeners
   */
  static setMessagingDelegate(delegate) {
    messagingDelegate = delegate;
    const eventEmitter = new NativeEventEmitter(RCTAEPMessaging);
    eventEmitter.addListener("onShow", message => messagingDelegate?.onShow?.(new Message(message)));
    eventEmitter.addListener("onDismiss", message => {
      const messageInstance = new Message(message);
      messageInstance._clearJavascriptMessageHandlers();
      messagingDelegate?.onDismiss?.(messageInstance);
    });
    eventEmitter.addListener("shouldShowMessage", message => {
      const messageInstance = new Message(message);
      const shouldShowMessage = messagingDelegate?.shouldShowMessage?.(messageInstance) ?? true;
      const shouldSaveMessage = messagingDelegate?.shouldSaveMessage?.(messageInstance) ?? false;
      RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
    });
    if (Platform.OS === "ios") {
      eventEmitter.addListener("urlLoaded", event => messagingDelegate?.urlLoaded?.(event.url, new Message(event.message)));
    }
    if (Platform.OS === "android") {
      eventEmitter.addListener("onContentLoaded", event => messagingDelegate?.onContentLoaded?.(new Message(event.message)));
    }
    RCTAEPMessaging.setMessagingDelegate();
    return () => {
      eventEmitter.removeAllListeners("onDismiss");
      eventEmitter.removeAllListeners("onShow");
      eventEmitter.removeAllListeners("shouldShowMessage");
      if (Platform.OS === "ios") {
        eventEmitter.removeAllListeners("urlLoaded");
      }
      if (Platform.OS === "android") {
        eventEmitter.removeAllListeners("onContentLoaded");
      }
    };
  }

  /**
   * Sets global settings for messages being shown and cached
   * Note: This method is also used by MessagingDelegate.shouldShowMessage,
   * which allows finer-grained control over setting these settings
   * @param shouldShowMessage Whether or not a message should be displayed
   * @param shouldSaveMessage Whether or not a message should be cached
   */
  static setMessageSettings(shouldShowMessage, shouldSaveMessage) {
    RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
  }

  /**
   * Dispatches an event to fetch propositions for the provided surfaces from remote.
   * @param surfaces A list of surface names to update
   */
  static async updatePropositionsForSurfaces(surfaces) {
    return await RCTAEPMessaging.updatePropositionsForSurfaces(surfaces);
  }

  /**
   * @experimental
   * Retrieves the content card UI data for a given surface.
   * @param surface The surface to get the content card UI data for
   * @returns The content card UI data for the given surface
   */
  static async getContentCardUI(surface) {
    const messages = await Messaging.getPropositionsForSurfaces([surface]);
    const propositions = messages[surface];
    if (!propositions?.length) {
      return [];
    }
    const contentCards = propositions.flatMap(proposition => proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD));
    if (!contentCards?.length) {
      return [];
    }
    return contentCards.map(card => {
      const type = card.data?.meta?.adobe?.template ?? "SmallImage";
      return new ContentTemplate(card, type);
    });
  }
  static async getContentCardContainer(surface) {
    console.log("getContentCardContainer", surface);
    return {
      templateType: "inbox",
      content: {
        heading: {
          content: "Heading"
        },
        layout: {
          orientation: "horizontal"
        },
        capacity: 10,
        emptyStateSettings: {
          message: {
            content: "Empty State"
          }
        },
        unread_indicator: {
          unread_bg: {
            clr: {
              light: "#FFF3E0",
              // Light orange background for unread cards
              dark: "#2D1B0E" // Dark orange background for unread cards
            }
          },
          unread_icon: {
            placement: "topright",
            image: {
              url: "https://icons.veryicon.com/png/o/leisure/crisp-app-icon-library-v3/notification-5.png",
              // Image in light mode
              darkUrl: "" // Empty URL = shows dot in dark mode
            }
          }
        },
        isUnreadEnabled: true // Enable unread features!
      },
      showPagination: false
    };
  }
}
export default Messaging;
//# sourceMappingURL=Messaging.js.map