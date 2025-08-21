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

import { ContentCard } from './models/ContentCard';
import { MessagingProposition } from './models/MessagingProposition';

export interface ContentCardMapping {
    contentCard: ContentCard;
    proposition: MessagingProposition;
}

/**
 * Singleton manager for content card mapping functionality.
 * Provides a centralized way to manage mappings between content card IDs and their corresponding objects.
 */
export class ContentCardMappingManager {
    private static instance: ContentCardMappingManager;
    private contentCardMap: Map<string, ContentCardMapping> = new Map();

    private constructor() { }

    /**
     * Gets the singleton instance of ContentCardMappingManager.
     * @returns ContentCardMappingManager The singleton instance
     */
    public static getInstance(): ContentCardMappingManager {
        if (!ContentCardMappingManager.instance) {
            ContentCardMappingManager.instance = new ContentCardMappingManager();
        }
        return ContentCardMappingManager.instance;
    }

    /**
     * Gets the content card and proposition objects for a given content card ID.
     * @param contentCardId The ID of the content card
     * @returns ContentCardMapping | undefined The content card and proposition objects, or undefined if not found
     */
    getContentCardMapping(contentCardId: string): ContentCardMapping | undefined {
        return this.contentCardMap.get(contentCardId);
    }

    /**
     * Adds a mapping for a content card ID with its corresponding content card and proposition objects.
     * @param contentCardId The ID of the content card
     * @param contentCard The content card object
     * @param proposition The proposition object
     */
    addMapping(contentCardId: string, contentCard: ContentCard, proposition: MessagingProposition): void {
        this.contentCardMap.set(contentCardId, {
            contentCard: contentCard,
            proposition: proposition
        });
    }

    /**
     * Removes a mapping for a specific content card ID.
     * @param contentCardId The ID of the content card to remove
     * @returns boolean True if the mapping was removed, false if it didn't exist
     */
    removeMapping(contentCardId: string): boolean {
        return this.contentCardMap.delete(contentCardId);
    }

    /**
     * Clears all mappings.
     */
    clearMappings(): void {
        this.contentCardMap.clear();
    }

    /**
     * Checks if a mapping exists for a given content card ID.
     * @param contentCardId The ID of the content card
     * @returns boolean True if the mapping exists, false otherwise
     */
    hasMapping(contentCardId: string): boolean {
        return this.contentCardMap.has(contentCardId);
    }

    /**
     * Gets the total number of mappings.
     * @returns number The number of mappings
     */
    getMappingCount(): number {
        return this.contentCardMap.size;
    }

    /**
     * Gets all content card IDs that have mappings.
     * @returns string[] Array of content card IDs
     */
    getAllContentCardIds(): string[] {
        return Array.from(this.contentCardMap.keys());
    }
} 