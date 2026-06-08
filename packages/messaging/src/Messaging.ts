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
  Platform,
} from "react-native";
import Message from "./models/Message";
import { MessagingDelegate } from "./models/MessagingDelegate";
import { MessagingProposition } from "./models/MessagingProposition";
import { ContentCard } from "./models/ContentCard";
import { PersonalizationSchema } from "./models/PersonalizationSchema";
import { ContentTemplate } from "./ui/types/Templates";
import {
  InboxSettings,
  SettingsPlacement,
} from "./ui/providers/InboxProvider";

export interface NativeMessagingModule {
  extensionVersion: () => Promise<string>;
  getCachedMessages: () => Message[];
  getLatestMessage: () => Message;
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
  trackPropositionItem: (
    itemId: string,
    interaction: string | null,
    eventType: number,
    tokens: string[] | null
  ) => void;
}

const RCTAEPMessaging: NativeModule & NativeMessagingModule =
  NativeModules.AEPMessaging;

declare var messagingDelegate: MessagingDelegate;
var messagingDelegate: MessagingDelegate;

function optString(map: Record<string, any> | undefined, key: string): string | undefined {
  if (!map || typeof map !== 'object') return undefined;
  const val = map[key] ?? map[key.toLowerCase()];
  return typeof val === 'string' ? val : undefined;
}

function optInt(map: Record<string, any> | undefined, key: string, fallback: number): number {
  if (!map || typeof map !== 'object') return fallback;
  const val = map[key] ?? map[key.toLowerCase()];
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

function optBoolean(map: Record<string, any> | undefined, key: string, fallback: boolean): boolean {
  if (!map || typeof map !== 'object') return fallback;
  const val = map[key] ?? map[key.toLowerCase()];
  if (typeof val === 'boolean') return val;
  if (val === 'true' || val === 1) return true;
  if (val === 'false' || val === 0) return false;
  return fallback;
}

function optTypedMap(map: Record<string, any> | undefined, key: string): Record<string, any> {
  if (!map || typeof map !== 'object') return {};
  const val = map[key] ?? map[key.toLowerCase()];
  return val && typeof val === 'object' && !Array.isArray(val) ? val : {};
}

function createAepText(map: Record<string, any> | undefined, key: string): { content: string } | undefined {
  const nested = optTypedMap(map, key);
  const content = optString(nested, 'content') ?? optString(nested, 'txt');
  return content !== undefined ? { content } : undefined;
}

function createAepColor(clrMap: Record<string, any>): { light: string; dark: string } | undefined {
  if (!clrMap || typeof clrMap !== 'object') return undefined;
  const light = optString(clrMap, 'light') ?? optString(clrMap, 'default') ?? '#FFFFFF';
  const dark = optString(clrMap, 'dark') ?? light;
  return { light, dark };
}

function createAepImage(map: Record<string, any> | undefined): { url: string; darkUrl?: string } | undefined {
  if (!map || typeof map !== 'object') return undefined;
  const url = optString(map, 'url') ?? optString(map, 'src');
  if (!url) return undefined;
  const darkUrl = optString(map, 'darkUrl') ?? optString(map, 'dark');
  return { url, darkUrl };
}

function createAlignment(placement: string | undefined): SettingsPlacement {
  const p = (placement ?? '').toLowerCase();
  if (['topleft', 'topright', 'bottomleft', 'bottomright'].includes(p)) {
    return p as SettingsPlacement;
  }
  return 'topleft';
}

function createInboxSettingsFromContent(
  contentMap: Record<string, any>,
  activityId?: string
): InboxSettings {
  const heading = createAepText(contentMap, 'heading') ?? createAepText(contentMap, 'Heading');
  const layoutMap = optTypedMap(contentMap, 'layout');
  const orientation = (optString(layoutMap, 'orientation') ?? 'vertical') as 'horizontal' | 'vertical';
  const capacity = optInt(contentMap, 'capacity', 15);

  if (!heading || !heading.content) {
    throw new Error(
      'Messaging.getInbox: inbox content is missing a valid heading (heading.content).'
    );
  }

  const emptyStateSettings = optTypedMap(contentMap, 'emptyStateSettings') ||
    optTypedMap(contentMap, 'empty_state_settings') || {};
  const emptyMessage = createAepText(emptyStateSettings, 'message') ?? createAepText(emptyStateSettings, 'Message');
  const emptyImage = createAepImage(optTypedMap(emptyStateSettings, 'image'));

  const unreadIndicator = optTypedMap(contentMap, 'unread_indicator') ||
    optTypedMap(contentMap, 'unreadIndicator') || {};
  const unreadBg = optTypedMap(unreadIndicator, 'unread_bg') || optTypedMap(unreadIndicator, 'unreadBg') || {};
  const unreadBgClr = optTypedMap(unreadBg, 'clr') || {};
  const unreadBgColor = createAepColor(unreadBgClr);

  const unreadIcon = optTypedMap(unreadIndicator, 'unread_icon') || optTypedMap(unreadIndicator, 'unreadIcon') || {};
  const placement = createAlignment(optString(unreadIndicator, 'placement') ?? optString(unreadIcon, 'placement'));
  const unreadIconImage = createAepImage(optTypedMap(unreadIcon, 'image'));

  const isUnreadEnabled = optBoolean(contentMap, 'isUnreadEnabled', true) ||
    optBoolean(contentMap, 'is_unread_enabled', true);

  const content: InboxSettings['content'] = {
    heading,
    layout: { orientation },
    capacity,
    emptyStateSettings: {
      message: emptyMessage ?? { content: 'No Content Available' },
      ...(emptyImage && { image: emptyImage }),
    },
    isUnreadEnabled,
  };

  if (isUnreadEnabled && (unreadBgColor || unreadIconImage)) {
    content.unread_indicator = {
      unread_bg: {
        clr: unreadBgColor ?? { light: '#FFF3E0', dark: '#2D1B0E' },
      },
      unread_icon: {
        placement,
        image: unreadIconImage ?? {
          url: 'https://icons.veryicon.com/png/o/leisure/crisp-app-icon-library-v3/notification-5.png',
          darkUrl: '',
        },
      },
    };
  }

  return {
    ...(activityId && { activityId }),
    content,
    showPagination: optBoolean(contentMap, 'showPagination', false) ||
      optBoolean(contentMap, 'show_pagination', false),
  };
}

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

    const propositionsList = await RCTAEPMessaging.getPropositionsForSurfaces(surfaces);
    let messagingPropositionsForSurfaces: Record<string, MessagingProposition[]> = {};
    
    for (const [surface, propositions] of Object.entries(propositionsList)) {
      messagingPropositionsForSurfaces[surface] = propositions.map(
        (proposition) => new MessagingProposition(proposition)
      );
    }

    return messagingPropositionsForSurfaces;
  }
  
  /**
   * @deprecated Use PropositionItem.track(...) instead.
   */  
  static trackContentCardDisplay(
    proposition: MessagingProposition,
    contentCard: ContentCard
  ): void {
    RCTAEPMessaging.trackContentCardDisplay(proposition, contentCard);
  }

   /**
   * @deprecated Use PropositionItem.track(...) instead.
   */
  static trackContentCardInteraction(
    proposition: MessagingProposition,
    contentCard: ContentCard
  ): void {
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
  static trackPropositionItem(
    itemId: string,
    interaction: string | null,
    eventType: number,
    tokens: string[] | null
  ): void {
    RCTAEPMessaging.trackPropositionItem(
      itemId,
      interaction,
      eventType,
      tokens
    );
  }

  /**
   * Function to set the UI Message delegate to listen the Message lifecycle events.
   * @returns A function to unsubscribe from all event listeners
   */
  static setMessagingDelegate(delegate: MessagingDelegate): () => void {
    messagingDelegate = delegate;

    const eventEmitter = new NativeEventEmitter(RCTAEPMessaging);

    eventEmitter.addListener("onShow", (message: Message) =>
      messagingDelegate?.onShow?.(new Message(message))
    );

    eventEmitter.addListener("onDismiss", (message: Message) => {
      const messageInstance = new Message(message);
      messageInstance._clearJavascriptMessageHandlers();
      messageInstance._clearJavascriptResultHandlers();
      messagingDelegate?.onDismiss?.(messageInstance);
    });

    eventEmitter.addListener("shouldShowMessage", (message: Message) => {
      const messageInstance = new Message(message);
      const shouldShowMessage =
        messagingDelegate?.shouldShowMessage?.(messageInstance) ?? true;
      const shouldSaveMessage =
        messagingDelegate?.shouldSaveMessage?.(messageInstance) ?? false;
      RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
    });

    if (Platform.OS === "ios") {
      eventEmitter.addListener(
        "urlLoaded",
        (event: { url: string; message: Message }) =>
          messagingDelegate?.urlLoaded?.(event.url, new Message(event.message))
      );
    }

    if (Platform.OS === "android") {
      eventEmitter.addListener(
        "onContentLoaded",
        (event: { message: Message }) =>
          messagingDelegate?.onContentLoaded?.(new Message(event.message))
      );
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
  static async updatePropositionsForSurfaces(
    surfaces: string[]
  ): Promise<void> {
    return await RCTAEPMessaging.updatePropositionsForSurfaces(surfaces);
  }

  /**
   * @experimental
   * Retrieves the content card UI data for a given surface.
   * @param surface The surface to get the content card UI data for
   * @returns The content card UI data for the given surface
   */
  static async getContentCardUI(surface: string): Promise<ContentTemplate[]> {
    const messages = await Messaging.getPropositionsForSurfaces([surface]);
    const propositions = messages[surface];
    if (!propositions?.length) {
      return [];
    }
    const contentCards = propositions
      .flatMap((proposition) =>
        proposition.items.filter(
          (item) => item.schema === PersonalizationSchema.CONTENT_CARD
        )
      );

    if (!contentCards?.length) {
      return [];
    }

    return contentCards.map((card: any) => {
    // Test: To mark first 2 cards as read, swap the two map lines above to add index, then replace isRead with:
    // return contentCards.map((card: any, index: number) => {
      const type = card.data?.meta?.adobe?.template ?? "SmallImage";
      const isRead = card.data?.read ?? false;
      // const isRead = card.data?.read ?? (index < 2);
      return new ContentTemplate(card, type, isRead);
    });
  }


  /**
   * @experimental
   * Loads inbox UI settings from the inbox proposition for the given surface.
   * @throws {Error} When no propositions, no inbox proposition, or invalid inbox content is returned.
   */
  static async getInbox(surface: string): Promise<InboxSettings> {
    const propositionsMap = await Messaging.getPropositionsForSurfaces([surface]);
    const propositions = propositionsMap[surface];

    if (!propositions?.length) {
      throw new Error(
        `Messaging.getInbox: no propositions returned for surface "${surface}".`
      );
    }

    const inboxPropositions = propositions.filter(
      (p) =>
        p.items?.length > 0 &&
        (p.items[0].schema === PersonalizationSchema.INBOX ||
          String(p.items[0].schema).includes('inbox'))
    );

    if (inboxPropositions.length === 0) {
      throw new Error(
        `Messaging.getInbox: no inbox proposition found for surface "${surface}".`
      );
    }

    const sortedByRank = [...inboxPropositions].sort(
      (a, b) => ((b as any).rank ?? 0) - ((a as any).rank ?? 0)
    );
    const inboxProposition = sortedByRank[0];
    const firstItem = inboxProposition.items[0];
    const rawItem = firstItem as any;

    const contentMap =
      rawItem?.inboxSchemaData?.content ??
      rawItem?.data?.inboxSchemaData?.content ??
      rawItem?.data?.content;

    if (!contentMap || typeof contentMap !== 'object') {
      throw new Error(
        `Messaging.getInbox: inbox proposition has no valid content configuration for surface "${surface}".`
      );
    }

    const activityId = inboxProposition.scopeDetails?.activity?.id;
    return createInboxSettingsFromContent(contentMap, activityId);
  }
}

export default Messaging;
