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

import { ContentCardMappingManager } from '../src/ContentCardMappingManager';
import { ContentCard } from '../src/models/ContentCard';
import { MessagingProposition } from '../src/models/MessagingProposition';
import { PersonalizationSchema } from '../src/models/PersonalizationSchema';

describe('ContentCardMappingManager', () => {
    let mappingManager: ContentCardMappingManager;
    const mockSurface = 'testSurface';

    beforeEach(() => {
        // Get the singleton instance and clear any existing mappings
        mappingManager = ContentCardMappingManager.getInstance();
        mappingManager.clearMappings();
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance when called multiple times', () => {
            const instance1 = ContentCardMappingManager.getInstance();
            const instance2 = ContentCardMappingManager.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('mapping management', () => {
        it('should have no mappings initially', () => {
            expect(mappingManager.getMappingCount()).toBe(0);
            expect(mappingManager.getAllContentCardIds()).toEqual([]);
        });

        it('should track mappings after adding them', () => {
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

            mappingManager.addMapping('test-content-card-id', mockContentCard, mockProposition);

            expect(mappingManager.getMappingCount()).toBe(1);
            expect(mappingManager.hasMapping('test-content-card-id')).toBe(true);
            expect(mappingManager.getAllContentCardIds()).toContain('test-content-card-id');
        });
    });

    describe('getContentCardMapping', () => {
        it('should return undefined for non-existent content card ID', () => {
            const mapping = mappingManager.getContentCardMapping('non-existent-id');
            expect(mapping).toBeUndefined();
        });

        it('should return correct mapping for existing content card ID', () => {
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

            mappingManager.addMapping('test-content-card-id', mockContentCard, mockProposition);

            const mapping = mappingManager.getContentCardMapping('test-content-card-id');
            expect(mapping).toBeDefined();
            expect(mapping?.contentCard).toEqual(mockContentCard);
            expect(mapping?.proposition).toEqual(mockProposition);
        });
    });

    describe('addMapping', () => {
        it('should add a new mapping', () => {
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

            mappingManager.addMapping('test-content-card-id', mockContentCard, mockProposition);

            expect(mappingManager.hasMapping('test-content-card-id')).toBe(true);
            expect(mappingManager.getMappingCount()).toBe(1);
        });

        it('should overwrite existing mapping when adding with same ID', () => {
            const mockContentCard1: ContentCard = {
                id: 'test-content-card-id',
                data: {
                    contentType: 'application/json',
                    expiryDate: 1234567890,
                    publishedDate: 1234567890,
                    content: {
                        actionUrl: 'https://example.com',
                        body: { content: 'Test body 1' },
                        title: { content: 'Test title 1' },
                        buttons: [],
                        image: { alt: 'Test image 1', url: 'https://example.com/image1.jpg' },
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

            const mockContentCard2: ContentCard = {
                id: 'test-content-card-id',
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

            const mockProposition: MessagingProposition = {
                id: 'test-proposition-id',
                scope: 'test-scope',
                scopeDetails: {
                    characteristics: { eventToken: 'test-event-token' },
                    activity: { matchedSurfaces: [mockSurface], id: 'test-activity-id' },
                    correlationID: 'test-correlation-id',
                    decisionProvider: 'test-decision-provider'
                },
                items: [mockContentCard1]
            };

            mappingManager.addMapping('test-content-card-id', mockContentCard1, mockProposition);
            mappingManager.addMapping('test-content-card-id', mockContentCard2, mockProposition);

            const mapping = mappingManager.getContentCardMapping('test-content-card-id');
            expect(mapping?.contentCard).toEqual(mockContentCard2);
            expect(mappingManager.getMappingCount()).toBe(1);
        });
    });

    describe('removeMapping', () => {
        it('should return false when removing non-existent mapping', () => {
            const result = mappingManager.removeMapping('non-existent-id');
            expect(result).toBe(false);
        });

        it('should return true and remove existing mapping', () => {
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

            mappingManager.addMapping('test-content-card-id', mockContentCard, mockProposition);
            expect(mappingManager.getMappingCount()).toBe(1);

            const result = mappingManager.removeMapping('test-content-card-id');
            expect(result).toBe(true);
            expect(mappingManager.getMappingCount()).toBe(0);
            expect(mappingManager.hasMapping('test-content-card-id')).toBe(false);
        });
    });

    describe('clearMappings', () => {
        it('should clear all mappings', () => {
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

            mappingManager.addMapping('test-content-card-id-1', mockContentCard, mockProposition);
            mappingManager.addMapping('test-content-card-id-2', mockContentCard, mockProposition);
            expect(mappingManager.getMappingCount()).toBe(2);

            mappingManager.clearMappings();
            expect(mappingManager.getMappingCount()).toBe(0);
            expect(mappingManager.hasMapping('test-content-card-id-1')).toBe(false);
            expect(mappingManager.hasMapping('test-content-card-id-2')).toBe(false);
        });
    });

    describe('hasMapping', () => {
        it('should return false for non-existent mapping', () => {
            expect(mappingManager.hasMapping('non-existent-id')).toBe(false);
        });

        it('should return true for existing mapping', () => {
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

            mappingManager.addMapping('test-content-card-id', mockContentCard, mockProposition);
            expect(mappingManager.hasMapping('test-content-card-id')).toBe(true);
        });
    });

    describe('getMappingCount', () => {
        it('should return 0 for empty manager', () => {
            expect(mappingManager.getMappingCount()).toBe(0);
        });

        it('should return correct count after adding mappings', () => {
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

            expect(mappingManager.getMappingCount()).toBe(0);
            mappingManager.addMapping('test-content-card-id-1', mockContentCard, mockProposition);
            expect(mappingManager.getMappingCount()).toBe(1);
            mappingManager.addMapping('test-content-card-id-2', mockContentCard, mockProposition);
            expect(mappingManager.getMappingCount()).toBe(2);
        });
    });

    describe('getAllContentCardIds', () => {
        it('should return empty array for empty manager', () => {
            const ids = mappingManager.getAllContentCardIds();
            expect(ids).toEqual([]);
        });

        it('should return all content card IDs', () => {
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

            mappingManager.addMapping('test-content-card-id-1', mockContentCard, mockProposition);
            mappingManager.addMapping('test-content-card-id-2', mockContentCard, mockProposition);

            const ids = mappingManager.getAllContentCardIds();
            expect(ids).toContain('test-content-card-id-1');
            expect(ids).toContain('test-content-card-id-2');
            expect(ids.length).toBe(2);
        });
    });
}); 