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

export interface HTMLPropositionData extends PropositionItemData {
  id: string;
  data: {
    content: string;
  };
  schema: PersonalizationSchema.HTML_CONTENT;
}

export class HTMLProposition extends PropositionItem {
  declare data: HTMLPropositionData['data']; // Override data type for better typing

  constructor(htmlPropositionData: HTMLPropositionData) {
    super(htmlPropositionData);
    this.data = htmlPropositionData.data;
  }

  /**
   * Convenience method to track when this HTMLProposition is displayed.
   * Equivalent to calling track(MessagingEdgeEventType.DISPLAY).
   */
  trackDisplay(): void {
    this.track(MessagingEdgeEventType.DISPLAY);
  }

  /**
   * Convenience method to track when this HTMLProposition is dismissed.
   * 
   * @param {string | null} interaction - Optional interaction identifier (e.g., "user_dismissed", "auto_dismissed")
   */
  trackDismiss(interaction: string | null = null): void {
    this.track(interaction, MessagingEdgeEventType.DISMISS, null);
  }

  /**
   * Convenience method to track user interactions with this HTMLProposition.
   * 
   * @param {string} interaction - The interaction identifier (e.g., "clicked", "link_pressed", "action_taken")
   */
  trackInteraction(interaction: string): void {
    this.track(interaction, MessagingEdgeEventType.INTERACT, null);
  }

  /**
   * Gets the HTML content string of this proposition.
   * 
   * @returns {string} The HTML content
   */
  getContent(): string {
    return this.data.content;
  }

  /**
   * Gets the HTML content as a formatted string for display purposes.
   * This is an alias for getContent() for consistency with other proposition types.
   * 
   * @returns {string} The HTML content
   */
  getHtmlContent(): string {
    return this.data.content;
  }

  /**
   * Checks if the HTML content contains specific elements or patterns.
   * 
   * @param {string} pattern - The pattern to search for (can be a tag, class, id, etc.)
   * @returns {boolean} True if the pattern is found in the HTML content
   */
  containsPattern(pattern: string): boolean {
    return this.data.content.includes(pattern);
  }

  /**
   * Checks if the HTML content contains interactive elements (buttons, links, forms).
   * 
   * @returns {boolean} True if interactive elements are found
   */
  hasInteractiveElements(): boolean {
    const interactivePatterns = ['<button', '<a ', '<input', '<select', '<textarea', 'onclick=', 'href='];
    return interactivePatterns.some(pattern => this.data.content.includes(pattern));
  }

  /**
   * Gets the estimated word count of the HTML content (excluding HTML tags).
   * 
   * @returns {number} Estimated word count
   */
  getWordCount(): number {
    // Remove HTML tags and count words
    const textContent = this.data.content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  /**
   * Checks if the HTML content is likely to be a full-page experience.
   * This is determined by the presence of certain HTML structure elements.
   * 
   * @returns {boolean} True if this appears to be a full-page HTML experience
   */
  isFullPageExperience(): boolean {
    const fullPageIndicators = ['<!DOCTYPE', '<html', '<head', '<body', '<meta'];
    return fullPageIndicators.some(indicator => this.data.content.includes(indicator));
  }

  /**
   * Extracts all link URLs from the HTML content.
   * 
   * @returns {string[]} Array of URLs found in href attributes
   */
  extractLinks(): string[] {
    const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
    const links: string[] = [];
    let match;
    
    while ((match = linkRegex.exec(this.data.content)) !== null) {
      links.push(match[1]);
    }
    
    return links;
  }

  /**
   * Extracts all image URLs from the HTML content.
   * 
   * @returns {string[]} Array of image URLs found in src attributes
   */
  extractImages(): string[] {
    const imageRegex = /src\s*=\s*["']([^"']+)["']/gi;
    const images: string[] = [];
    let match;
    
    while ((match = imageRegex.exec(this.data.content)) !== null) {
      images.push(match[1]);
    }
    
    return images;
  }
}
