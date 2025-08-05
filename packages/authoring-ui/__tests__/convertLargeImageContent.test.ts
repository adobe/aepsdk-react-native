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
import { convertLargeImageContentToComponent } from '../src/convertLargeImageContent';
import { LargeImageContentData, LargeImageContentStyle } from '../src/LargeImageTypes';

describe('convertLargeImageContentToComponent', () => {
    describe('Basic functionality', () => {
        it('converts basic large image content to component', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                body: { content: 'Test Body' },
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
            expect(result.children!.length).toBe(1);
        });

        it('handles data without image', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                body: { content: 'Test Body' },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });

        it('handles data with only title', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });

        it('handles data with only title (no body)', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                // body is optional, so omitting it
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });
    });

    describe('Button handling', () => {
        it('includes buttons when provided', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                buttons: [
                    {
                        interactId: 'btn1',
                        text: { content: 'Button 1' },
                        actionUrl: 'https://example.com/action1',
                    },
                    {
                        interactId: 'btn2',
                        text: { content: 'Button 2' },
                        actionUrl: 'https://example.com/action2',
                    },
                ],
            };

            const result = convertLargeImageContentToComponent(data);

            // Find the content container and button container
            const contentContainer = result.children![0].children![0];
            const buttonContainer = contentContainer.children![1];
            expect(buttonContainer.type).toBe('view');
            expect(buttonContainer.children).toHaveLength(2);
            expect(buttonContainer.children![0].type).toBe('button');
            expect(buttonContainer.children![0].content).toBe('Button 1');
            expect(buttonContainer.children![0].interactId).toBe('btn1');
        });

        it('limits buttons to maximum of 3', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                buttons: [
                    {
                        interactId: 'btn1',
                        text: { content: 'Button 1' },
                    },
                    {
                        interactId: 'btn2',
                        text: { content: 'Button 2' },
                    },
                    {
                        interactId: 'btn3',
                        text: { content: 'Button 3' },
                    },
                    {
                        interactId: 'btn4',
                        text: { content: 'Button 4' },
                    },
                ],
            };

            const result = convertLargeImageContentToComponent(data);

            const contentContainer = result.children![0].children![0];
            const buttonContainer = contentContainer.children![1];
            expect(buttonContainer.children).toHaveLength(3); // Should only have 3 buttons
        });

        it('handles empty buttons array', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                buttons: [],
            };

            const result = convertLargeImageContentToComponent(data);

            // Should not have button container when buttons array is empty
            const contentContainer = result.children![0].children![0];
            expect(contentContainer.children).toHaveLength(1); // Only text content
        });
    });

    describe('Dismiss button handling', () => {
        it('includes dismiss button when dismissType is simple', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                dismissBtn: { style: 'simple' },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.children).toHaveLength(2); // Main content + dismiss button
            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('simple');
            expect(dismissButton.interactId).toBe('dismiss_button');
        });

        it('includes dismiss button when dismissType is circle', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                dismissBtn: { style: 'circle' },
            };

            const result = convertLargeImageContentToComponent(data);

            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('circle');
        });

        it('does not include dismiss button when dismissType is none', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                dismissBtn: { style: 'none' },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.children).toHaveLength(1); // Only main content
        });

        it('does not include dismiss button when dismissBtn is not provided', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.children).toHaveLength(1); // Only main content
        });
    });

    describe('Style overrides', () => {
        it('applies style overrides correctly', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
            };

            const styleOverrides: LargeImageContentStyle = {
                card: {
                    backgroundColor: '#ff0000',
                    borderRadius: 20,
                },
                title: {
                    fontSize: 20,
                    color: '#00ff00',
                },
            };

            const result = convertLargeImageContentToComponent(data, styleOverrides);

            expect(result.style).toMatchObject({
                backgroundColor: '#ff0000',
                borderRadius: 20,
            });
        });

        it('merges default styles with overrides', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
            };

            const styleOverrides: LargeImageContentStyle = {
                title: {
                    fontSize: 24,
                },
            };

            const result = convertLargeImageContentToComponent(data, styleOverrides);

            // Should have both default and override styles
            const contentContainer = result.children![0].children![0];
            const textContainer = contentContainer.children![0];
            const titleComponent = textContainer.children![0];
            expect(titleComponent.style).toMatchObject({
                fontSize: 24,
            });
        });
    });

    describe('Image handling', () => {
        it('includes image when url is provided', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                image: {
                    url: 'https://example.com/image.jpg',
                    darkUrl: 'https://example.com/dark.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertLargeImageContentToComponent(data);

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.type).toBe('view');
            expect(imageContainer.children).toHaveLength(1);

            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.darkUrl).toBe('https://example.com/dark.jpg');
            expect(imageComponent.alt).toBe('Test Image');
        });

        it('does not include image when url is not provided', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                image: {
                    url: '', // Empty URL
                    alt: 'Test Image',
                },
            };

            const result = convertLargeImageContentToComponent(data);

            const container = result.children![0];
            expect(container.children).toHaveLength(1); // Only content container
        });
    });

    describe('Edge cases', () => {
        it('handles data with empty title content', () => {
            const data: LargeImageContentData = {
                title: { content: '' }, // Empty title content
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });

        it('handles data with empty body content', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' }, // title is required
                body: { content: '' }, // Empty body content
            };

            const result = convertLargeImageContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });

        it('handles undefined style overrides', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
            };

            const result = convertLargeImageContentToComponent(data, undefined);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });
    });

    describe('Component structure validation', () => {
        it('creates correct component hierarchy with image', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                body: { content: 'Test Body' },
                image: {
                    url: 'https://example.com/image.jpg',
                },
                buttons: [
                    {
                        interactId: 'btn1',
                        text: { content: 'Button 1' },
                    },
                ],
                dismissBtn: { style: 'simple' },
            };

            const result = convertLargeImageContentToComponent(data);

            // Root component
            expect(result.type).toBe('view');
            expect(result.children).toHaveLength(2); // Main content + dismiss button

            // Main content container
            const mainContent = result.children![0];
            expect(mainContent.type).toBe('view');
            expect(mainContent.children).toHaveLength(2); // Image container + content container

            // Image container
            const imageContainer = mainContent.children![0];
            expect(imageContainer.type).toBe('view');
            expect(imageContainer.children).toHaveLength(1);

            // Content container
            const contentContainer = mainContent.children![1];
            expect(contentContainer.type).toBe('view');
            expect(contentContainer.children).toHaveLength(2); // Text content + button container

            // Text content
            const textContainer = contentContainer.children![0];
            expect(textContainer.type).toBe('view');
            expect(textContainer.children).toHaveLength(2); // Title + body

            // Button container
            const buttonContainer = contentContainer.children![1];
            expect(buttonContainer.type).toBe('view');
            expect(buttonContainer.children).toHaveLength(1);

            // Dismiss button
            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
        });

        it('creates correct component hierarchy without image', () => {
            const data: LargeImageContentData = {
                title: { content: 'Test Title' },
                body: { content: 'Test Body' },
            };

            const result = convertLargeImageContentToComponent(data);

            // Root component
            expect(result.type).toBe('view');
            expect(result.children).toHaveLength(1); // Only main content

            // Main content container
            const mainContent = result.children![0];
            expect(mainContent.type).toBe('view');
            expect(mainContent.children).toHaveLength(1); // Only content container (no image)

            // Content container
            const contentContainer = mainContent.children![0];
            expect(contentContainer.type).toBe('view');
            expect(contentContainer.children).toHaveLength(1); // Only text content (no buttons)
        });
    });
}); 