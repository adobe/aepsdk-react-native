/*
    Copyright 2025 Adobe. All rights reserved.
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
  uuid: string;
  schema: PersonalizationSchema;
  activityID: string;
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
  uuid: string;
  activityID: string;
  schema: PersonalizationSchema;
  data: { [key: string]: any };

  constructor(propositionItemData: PropositionItemData) {
    this.id = propositionItemData.id;
    this.schema = propositionItemData.schema;
    this.data = propositionItemData.data;
    this.uuid = propositionItemData.uuid;
    this.activityID = propositionItemData.activityID;
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
    // Handle overloaded method signatures
    if (typeof interactionOrEventType === 'number' && eventType === undefined) {
      // First overload: track(eventType)
      this.trackWithDetails(null, interactionOrEventType, null);
    } else if (typeof interactionOrEventType === 'string' || interactionOrEventType === null) {
      // Second overload: track(interaction, eventType, tokens)
      this.trackWithDetails(interactionOrEventType, eventType!, tokens || null);
    }
  }

  /**
   * Internal method that performs the actual tracking
   */
  private trackWithDetails(interaction: string | null, eventType: MessagingEdgeEventType, tokens: string[] | null): void {
    console.log("activityID here", this.activityID);
    const nativeIdentifier = this.activityID ?? null;
    console.log("nativeIdentifier here", nativeIdentifier);
    RCTAEPMessaging.trackPropositionItem(nativeIdentifier, interaction, eventType, tokens);
  }

} 