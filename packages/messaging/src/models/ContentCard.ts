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

import { PersonalizationSchema } from './PersonalizationSchema';
import MessagingEdgeEventType from './MessagingEdgeEventType';
import { PropositionItem, PropositionItemData } from './PropositionItem';

type ContentCardTemplate = 'SmallImage';
type DismissButtonStyle = 'circle' | 'none' | 'simple';

export interface ContentCardData extends PropositionItemData {
  id: string;
  data: {
    contentType: 'application/json';
    expiryDate: number;
    publishedDate: number;
    content: {
      actionUrl: string;

      body: { content: string };
      title: { content: string };
      buttons: Array<{
        actionUrl: string;
        id: string;
        text: { content: string };
        interactId: string;
      }>;
      image: { alt: string; url: string };
      dismissBtn: { style: DismissButtonStyle };
    };
    meta: {
      [key: string]: any;
      adobe: { template: ContentCardTemplate };
      dismissState: boolean;
      readState: boolean;
      surface: string;
    };
  };
  schema: PersonalizationSchema.CONTENT_CARD;
}

export class ContentCard extends PropositionItem {
  declare data: ContentCardData['data']; // Override data type for better typing

  constructor(contentCardData: ContentCardData) {
    super(contentCardData);
    this.data = contentCardData.data;
  }

  /**
   * Convenience method to track when this ContentCard is displayed.
   * Equivalent to calling track(MessagingEdgeEventType.DISPLAY).
   */
  trackDisplay(): void {
    this.track(MessagingEdgeEventType.DISPLAY);
  }

  /**
   * Convenience method to track when this ContentCard is dismissed.
   * 
   * @param {string | null} interaction - Optional interaction identifier (e.g., "user_dismissed", "auto_dismissed")
   */
  trackDismiss(interaction: string | null = null): void {
    this.track(interaction, MessagingEdgeEventType.DISMISS, null);
  }

  /**
   * Convenience method to track user interactions with this ContentCard.
   * 
   * @param {string} interaction - The interaction identifier (e.g., "clicked", "button_pressed", "action_taken")
   */
  trackInteraction(interaction: string): void {
    this.track(interaction, MessagingEdgeEventType.INTERACT, null);
  }

  /**
   * Gets the title content of this ContentCard.
   * 
   * @returns {string} The title content
   */
  getTitle(): string {
    return this.data.content.title.content;
  }

  /**
   * Gets the body content of this ContentCard.
   * 
   * @returns {string} The body content
   */
  getBody(): string {
    return this.data.content.body.content;
  }

  /**
   * Gets the action URL of this ContentCard.
   * 
   * @returns {string} The action URL
   */
  getActionUrl(): string {
    return this.data.content.actionUrl;
  }

  /**
   * Gets the image URL of this ContentCard.
   * 
   * @returns {string} The image URL
   */
  getImageUrl(): string {
    return this.data.content.image.url;
  }

  /**
   * Gets the image alt text of this ContentCard.
   * 
   * @returns {string} The image alt text
   */
  getImageAlt(): string {
    return this.data.content.image.alt;
  }

  /**
   * Gets the buttons array of this ContentCard.
   * 
   * @returns {Array} The buttons array
   */
  getButtons(): Array<{
    actionUrl: string;
    id: string;
    text: { content: string };
    interactId: string;
  }> {
    return this.data.content.buttons;
  }

  /**
   * Checks if this ContentCard has been dismissed.
   * 
   * @returns {boolean} True if dismissed, false otherwise
   */
  isDismissed(): boolean {
    return this.data.meta.dismissState;
  }

  /**
   * Checks if this ContentCard has been read.
   * 
   * @returns {boolean} True if read, false otherwise
   */
  isRead(): boolean {
    return this.data.meta.readState;
  }

  /**
   * Gets the surface name for this ContentCard.
   * 
   * @returns {string} The surface name
   */
  getSurface(): string {
    return this.data.meta.surface;
  }

  /**
   * Gets the template type for this ContentCard.
   * 
   * @returns {ContentCardTemplate} The template type
   */
  getTemplate(): ContentCardTemplate {
    return this.data.meta.adobe.template;
  }

  /**
   * Gets the expiry date of this ContentCard as epoch seconds.
   * 
   * @returns {number} The expiry date
   */
  getExpiryDate(): number {
    return this.data.expiryDate;
  }

  /**
   * Gets the published date of this ContentCard as epoch seconds.
   * 
   * @returns {number} The published date
   */
  getPublishedDate(): number {
    return this.data.publishedDate;
  }

  /**
   * Checks if this ContentCard has expired.
   * 
   * @returns {boolean} True if expired, false otherwise
   */
  isExpired(): boolean {
    const now = Math.floor(Date.now() / 1000);
    return this.data.expiryDate > 0 && now > this.data.expiryDate;
  }
}
