/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { ContentProvider, TemplateType } from '../src/ContentProvider';
import { ContentCardMappingManager } from '../src/ContentCardMappingManager';
import { ContentCard } from '../src/models/ContentCard';
import { MessagingProposition } from '../src/models/MessagingProposition';
import { PersonalizationSchema } from '../src/models/PersonalizationSchema';
import Messaging from '../src/Messaging';

// Mock the Messaging module
jest.mock('../src/Messaging');

describe('ContentProvider', () => {
    let contentProvider: ContentProvider;
    let mappingManager: ContentCardMappingManager;
    const mockSurface = 'testSurface';

    beforeEach(() => {
        contentProvider = new ContentProvider(mockSurface);
        mappingManager = ContentCardMappingManager.getInstance();
        mappingManager.clearMappings();
        jest.clearAllMocks();
    });

    describe('getContentCardMap', () => {
        it('should return empty map initially', () => {
            const mappingCount = mappingManager.getMappingCount();
            expect(mappingCount).toBe(0);
        });

        it('should populate map after getContent is called', async () => {
            // Mock the getPropositionsForSurfaces response
            const mockContentCard: ContentCard = {
                id: 'test-content-card-id',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body' },
                        title: { content: 'Test title' },
                        buttons: [],
                        image: { alt: 'Test image', url: 'https://example.com/image.jpg' },
                        dismissBtn: { style: 'circle' }
                    },
                    meta: {
                        adobe: { template: 'SmallImage' },
                        dismissState: false,
                        readState: false,
                        surface: mockSurface
                    }
                },
                schema: PersonalizationSchema.CONTENT_CARD
            };

            const mockProposition: MessagingProposition = {
                id: 'test-proposition-id',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id' },
                    correlationID: 'test-correlation-id',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard]
            };

            const mockPropositions = {
                [mockSurface]: [mockProposition]
            };

            (Messaging.getPropositionsForSurfaces as jest.Mock).mockResolvedValue(mockPropositions);

            // Call getContent to populate the map
            await contentProvider.getContent();

            // Verify the map is populated
            const mappingCount = mappingManager.getMappingCount();
            expect(mappingCount).toBe(1);
            expect(mappingManager.hasMapping('test-content-card-id')).toBe(true);

            const mapping = mappingManager.getContentCardMapping('test-content-card-id');
            expect(mapping).toBeDefined();
            expect(mapping?.contentCard).toEqual(mockContentCard);
            expect(mapping?.proposition).toEqual(mockProposition);
        });
    });

    describe('getContentCardMapping', () => {
        it('should return undefined for non-existent content card ID', () => {
            const mapping = mappingManager.getContentCardMapping('non-existent-id');
            expect(mapping).toBeUndefined();
        });

        it('should return correct mapping for existing content card ID', async () => {
            // Mock the getPropositionsForSurfaces response
            const mockContentCard: ContentCard = {
                id: 'test-content-card-id',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body' },
                        title: { content: 'Test title' },
                        buttons: [],
                        image: { alt: 'Test image', url: 'https://example.com/image.jpg' },
                        dismissBtn: { style: 'circle' }
                    },
                    meta: {
                        adobe: { template: 'SmallImage' },
                        dismissState: false,
                        readState: false,
                        surface: mockSurface
                    }
                },
                schema: PersonalizationSchema.CONTENT_CARD
            };

            const mockProposition: MessagingProposition = {
                id: 'test-proposition-id',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id' },
                    correlationID: 'test-correlation-id',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard]
            };

            const mockPropositions = {
                [mockSurface]: [mockProposition]
            };

            (Messaging.getPropositionsForSurfaces as jest.Mock).mockResolvedValue(mockPropositions);

            // Call getContent to populate the map
            await contentProvider.getContent();

            // Get the mapping for the content card ID
            const mapping = mappingManager.getContentCardMapping('test-content-card-id');
            expect(mapping).toBeDefined();
            expect(mapping?.contentCard).toEqual(mockContentCard);
            expect(mapping?.proposition).toEqual(mockProposition);
        });
    });

    describe('getContent', () => {
        it('should return content templates and populate the map', async () => {
            // Mock the getPropositionsForSurfaces response
            const mockContentCard: ContentCard = {
                id: 'test-content-card-id',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body' },
                        title: { content: 'Test title' },
                        buttons: [],
                        image: { alt: 'Test image', url: 'https://example.com/image.jpg' },
                        dismissBtn: { style: 'circle' }
                    },
                    meta: {
                        adobe: { template: 'SmallImage' },
                        dismissState: false,
                        readState: false,
                        surface: mockSurface
                    }
                },
                schema: PersonalizationSchema.CONTENT_CARD
            };

            const mockProposition: MessagingProposition = {
                id: 'test-proposition-id',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id' },
                    correlationID: 'test-correlation-id',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard]
            };

            const mockPropositions = {
                [mockSurface]: [mockProposition]
            };

            (Messaging.getPropositionsForSurfaces as jest.Mock).mockResolvedValue(mockPropositions);

            // Call getContent
            const contentTemplates = await contentProvider.getContent();

            // Verify content templates are returned
            expect(contentTemplates).toHaveLength(1);
            expect(contentTemplates[0].id).toBe('test-content-card-id');
            expect(contentTemplates[0].type).toBe(TemplateType.SMALL_IMAGE);

            // Verify the map is populated
            const mappingCount = mappingManager.getMappingCount();
            expect(mappingCount).toBe(1);
            expect(mappingManager.hasMapping('test-content-card-id')).toBe(true);
        });

        it('should clear previous map when getContent is called again', async () => {
            // Mock the getPropositionsForSurfaces response for first call
            const mockContentCard1: ContentCard = {
                id: 'test-content-card-id-1',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body' },
                        title: { content: 'Test title' },
                        buttons: [],
                        image: { alt: 'Test image', url: 'https://example.com/image.jpg' },
                        dismissBtn: { style: 'circle' }
                    },
                    meta: {
                        adobe: { template: 'SmallImage' },
                        dismissState: false,
                        readState: false,
                        surface: mockSurface
                    }
                },
                schema: PersonalizationSchema.CONTENT_CARD
            };

            const mockProposition1: MessagingProposition = {
                id: 'test-proposition-id-1',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token-1' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id-1' },
                    correlationID: 'test-correlation-id-1',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard1]
            };

            const mockPropositions1 = {
                [mockSurface]: [mockProposition1]
            };

            (Messaging.getPropositionsForSurfaces as jest.Mock).mockResolvedValue(mockPropositions1);

            // First call to getContent
            await contentProvider.getContent();

            // Verify the map has the first content card
            let mappingCount = mappingManager.getMappingCount();
            expect(mappingCount).toBe(1);
            expect(mappingManager.hasMapping('test-content-card-id-1')).toBe(true);

            // Mock the getPropositionsForSurfaces response for second call
            const mockContentCard2: ContentCard = {
                id: 'test-content-card-id-2',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body 2' },
                        title: { content: 'Test title 2' },
                        buttons: [],
                        image: { alt: 'Test image 2', url: 'https://example.com/image2.jpg' },
                        dismissBtn: { style: 'circle' }
                    },
                    meta: {
                        adobe: { template: 'SmallImage' },
                        dismissState: false,
                        readState: false,
                        surface: mockSurface
                    }
                },
                schema: PersonalizationSchema.CONTENT_CARD
            };

            const mockProposition2: MessagingProposition = {
                id: 'test-proposition-id-2',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token-2' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id-2' },
                    correlationID: 'test-correlation-id-2',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard2]
            };

            const mockPropositions2 = {
                [mockSurface]: [mockProposition2]
            };

            (Messaging.getPropositionsForSurfaces as jest.Mock).mockResolvedValue(mockPropositions2);

            // Second call to getContent
            await contentProvider.getContent();

            // Verify the map now has only the second content card (previous one was cleared)
            mappingCount = mappingManager.getMappingCount();
            expect(mappingCount).toBe(2);
            expect(mappingManager.hasMapping('test-content-card-id-1')).toBe(true);
            expect(mappingManager.hasMapping('test-content-card-id-2')).toBe(true);
        });
    });
}); 