/*
    Copyright 2024 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import { PersonalizationSchema } from './PersonalizationSchema';
import MessagingEdgeEventType from './MessagingEdgeEventType';

const RCTAEPMessaging = NativeModules.AEPMessaging;

/**
 * Base PropositionItem interface that all proposition items implement
 */
export interface PropositionItemData {
  id: string;
  schema: PersonalizationSchema;
  data: {
    [key: string]: any;
  };
}

/**
 * A PropositionItem represents a personalization JSON object returned by Konductor.
 * This is the base class that provides tracking functionality for all proposition items
 * including ContentCards, InApp messages, and code-based experiences.
 * 
 * This mirrors the native Android PropositionItem class functionality.
 */
export class PropositionItem {
  id: string;
  schema: PersonalizationSchema;
  data: { [key: string]: any };

  constructor(propositionItemData: PropositionItemData) {
    this.id = propositionItemData.id;
    this.schema = propositionItemData.schema;
    this.data = propositionItemData.data;
  }

  /**
   * Gets the PropositionItem identifier.
   * 
   * @returns {string} The PropositionItem identifier
   */
  getItemId(): string {
    return this.id;
  }

  /**
   * Gets the PropositionItem content schema.
   * 
   * @returns {PersonalizationSchema} The PropositionItem content schema
   */
  getSchema(): PersonalizationSchema {
    return this.schema;
  }

  /**
   * Gets the PropositionItem data.
   * 
   * @returns {object} The PropositionItem data
   */
  getItemData(): { [key: string]: any } {
    return this.data;
  }

  /**
   * Tracks interaction with this proposition item.
   * This is the core tracking method that all proposition items use.
   * 
   * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
   * 
   * @example
   * propositionItem.track(MessagingEdgeEventType.DISPLAY);
   */
  track(eventType: MessagingEdgeEventType): void;
  
  /**
   * Tracks interaction with this proposition item.
   * 
   * @param {string | null} interaction - String describing the interaction
   * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
   * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
   * 
   * @example
   * // Track display
   * propositionItem.track(null, MessagingEdgeEventType.DISPLAY, null);
   * 
   * // Track interaction
   * propositionItem.track("button_clicked", MessagingEdgeEventType.INTERACT, null);
   * 
   * // Track with tokens
   * propositionItem.track("click", MessagingEdgeEventType.INTERACT, ["token1", "token2"]);
   */
  track(interaction: string | null, eventType: MessagingEdgeEventType, tokens: string[] | null): void;

  // Implementation
  track(
    interactionOrEventType: string | null | MessagingEdgeEventType,
    eventType?: MessagingEdgeEventType,
    tokens?: string[] | null
  ): void {
    console.log('i am in track method ');
    // Handle overloaded method signatures
    if (typeof interactionOrEventType === 'number' && eventType === undefined) {
      // First overload: track(eventType)
      console.log('track(eventType) here ia m doing awesome ');
      this.trackWithDetails(null, interactionOrEventType, null);
    } else if (typeof interactionOrEventType === 'string' || interactionOrEventType === null) {
      // Second overload: track(interaction, eventType, tokens)
      console.log("i am in the second overload");
      this.trackWithDetails(interactionOrEventType, eventType!, tokens || null);
    }
  }

  /**
   * Internal method that performs the actual tracking
   */
  private trackWithDetails(interaction: string | null, eventType: MessagingEdgeEventType, tokens: string[] | null): void {
    RCTAEPMessaging.trackPropositionItem(this.id, interaction, eventType, tokens);
  }

  /**
   * Creates a Map<String, Object> containing XDM data for interaction with this proposition item.
   * 
   * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
   * @returns {Promise<object>} Promise containing XDM data for the proposition interaction
   */
  async generateInteractionXdm(eventType: MessagingEdgeEventType): Promise<object>;
  
  /**
   * Creates a Map<String, Object> containing XDM data for interaction with this proposition item.
   * 
   * @param {string | null} interaction - Custom string describing the interaction
   * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
   * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
   * @returns {Promise<object>} Promise containing XDM data for the proposition interaction
   */
  async generateInteractionXdm(
    interaction: string | null, 
    eventType: MessagingEdgeEventType, 
    tokens: string[] | null
  ): Promise<object>;

  // Implementation
  async generateInteractionXdm(
    interactionOrEventType: string | null | MessagingEdgeEventType,
    eventType?: MessagingEdgeEventType,
    tokens?: string[] | null
  ): Promise<object> {
    // Handle overloaded method signatures
    if (typeof interactionOrEventType === 'number' && eventType === undefined) {
      // First overload: generateInteractionXdm(eventType)
      return await RCTAEPMessaging.generatePropositionInteractionXdm(this.id, null, interactionOrEventType, null);
    } else if (typeof interactionOrEventType === 'string' || interactionOrEventType === null) {
      // Second overload: generateInteractionXdm(interaction, eventType, tokens)
      return await RCTAEPMessaging.generatePropositionInteractionXdm(this.id, interactionOrEventType, eventType!, tokens || null);
    }
    throw new Error('Invalid arguments for generateInteractionXdm');
  }

  /**
   * Returns this PropositionItem's content as a JSON content Map.
   * Only works if the schema is JSON_CONTENT.
   * 
   * @returns {object | null} Object containing the PropositionItem's content, or null if not JSON content
   */
  getJsonContentMap(): object | null {
    if (this.schema !== PersonalizationSchema.JSON_CONTENT) {
      return null;
    }
    return this.data.content || null;
  }

  /**
   * Returns this PropositionItem's content as a JSON content array.
   * Only works if the schema is JSON_CONTENT.
   * 
   * @returns {any[] | null} Array containing the PropositionItem's content, or null if not JSON content array
   */
  getJsonContentArrayList(): any[] | null {
    if (this.schema !== PersonalizationSchema.JSON_CONTENT) {
      return null;
    }
    const content = this.data.content;
    return Array.isArray(content) ? content : null;
  }

  /**
   * Returns this PropositionItem's content as HTML content string.
   * Only works if the schema is HTML_CONTENT.
   * 
   * @returns {string | null} String containing the PropositionItem's content, or null if not HTML content
   */
  getHtmlContent(): string | null {
    if (this.schema !== PersonalizationSchema.HTML_CONTENT) {
      return null;
    }
    return this.data.content || null;
  }

  /**
   * Checks if this PropositionItem is of ContentCard schema type.
   * 
   * @returns {boolean} True if this is a content card proposition item
   */
  isContentCard(): boolean {
    return this.schema === PersonalizationSchema.CONTENT_CARD;
  }

  /**
   * Checks if this PropositionItem is of InApp schema type.
   * 
   * @returns {boolean} True if this is an in-app message proposition item
   */
  isInAppMessage(): boolean {
    return this.schema === PersonalizationSchema.IN_APP;
  }

  /**
   * Checks if this PropositionItem is of JSON content schema type.
   * 
   * @returns {boolean} True if this is a JSON content proposition item
   */
  isJsonContent(): boolean {
    return this.schema === PersonalizationSchema.JSON_CONTENT;
  }

  /**
   * Checks if this PropositionItem is of HTML content schema type.
   * 
   * @returns {boolean} True if this is an HTML content proposition item
   */
  isHtmlContent(): boolean {
    return this.schema === PersonalizationSchema.HTML_CONTENT;
  }
} 