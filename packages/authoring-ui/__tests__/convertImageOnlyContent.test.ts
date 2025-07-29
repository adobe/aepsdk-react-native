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
import { convertImageOnlyContentToComponent } from '../src/convertImageOnlyContent';
import { ImageOnlyContentData, ImageOnlyContentStyle } from '../src/ImageOnlyTypes';

describe('convertImageOnlyContentToComponent', () => {
    describe('Basic functionality', () => {
        it('converts basic image only content to component', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
            expect(result.children!.length).toBe(1);
        });

        it('includes image with dark mode url', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    darkUrl: 'https://example.com/dark.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            const imageContainer = result.children![0].children![0];
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.darkUrl).toBe('https://example.com/dark.jpg');
            expect(imageComponent.alt).toBe('Test Image');
        });

        it('handles image without alt text', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            const imageContainer = result.children![0].children![0];
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.alt).toBe(''); // Should default to empty string
        });
    });

    describe('Action URL handling', () => {
        it('includes actionUrl when provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                actionUrl: 'https://example.com/action',
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.actionUrl).toBe('https://example.com/action');
        });

        it('does not include actionUrl when not provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.actionUrl).toBeUndefined();
        });
    });

    describe('Dismiss button handling', () => {
        it('includes dismiss button when dismissType is simple', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                dismissBtn: { style: 'simple' },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.children).toHaveLength(2); // Main content + dismiss button
            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('simple');
            expect(dismissButton.interactId).toBe('dismiss_button');
        });

        it('includes dismiss button when dismissType is circle', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                dismissBtn: { style: 'circle' },
            };

            const result = convertImageOnlyContentToComponent(data);

            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('circle');
        });

        it('does not include dismiss button when dismissType is none', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                dismissBtn: { style: 'none' },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.children).toHaveLength(1); // Only main content
        });

        it('does not include dismiss button when dismissBtn is not provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.children).toHaveLength(1); // Only main content
        });
    });

    describe('Style overrides', () => {
        it('applies style overrides correctly', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const styleOverrides: ImageOnlyContentStyle = {
                card: {
                    backgroundColor: '#ff0000',
                    borderRadius: 20,
                    margin: 20,
                },
                image: {
                    borderRadius: 15,
                },
            };

            const result = convertImageOnlyContentToComponent(data, styleOverrides);

            expect(result.style).toMatchObject({
                backgroundColor: '#ff0000',
                borderRadius: 20,
                margin: 20,
            });
        });

        it('merges default styles with overrides', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const styleOverrides: ImageOnlyContentStyle = {
                imageContainer: {
                    height: 300,
                },
            };

            const result = convertImageOnlyContentToComponent(data, styleOverrides);

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                height: 300,
            });
        });

        it('handles undefined style overrides', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data, undefined);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();
        });
    });

    describe('Component structure validation', () => {
        it('creates correct component hierarchy', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                dismissBtn: { style: 'simple' },
                actionUrl: 'https://example.com/action',
            };

            const result = convertImageOnlyContentToComponent(data);

            // Root component
            expect(result.type).toBe('view');
            expect(result.children).toHaveLength(2); // Main content + dismiss button
            expect(result.actionUrl).toBe('https://example.com/action');

            // Main content container
            const mainContent = result.children![0];
            expect(mainContent.type).toBe('view');
            expect(mainContent.children).toHaveLength(1); // Only image container

            // Image container
            const imageContainer = mainContent.children![0];
            expect(imageContainer.type).toBe('view');
            expect(imageContainer.children).toHaveLength(1);

            // Image component
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.alt).toBe('Test Image');

            // Dismiss button
            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
        });

        it('creates minimal component hierarchy', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            // Root component
            expect(result.type).toBe('view');
            expect(result.children).toHaveLength(1); // Only main content
            expect(result.actionUrl).toBeUndefined();

            // Main content container
            const mainContent = result.children![0];
            expect(mainContent.type).toBe('view');
            expect(mainContent.children).toHaveLength(1); // Only image container

            // Image container
            const imageContainer = mainContent.children![0];
            expect(imageContainer.type).toBe('view');
            expect(imageContainer.children).toHaveLength(1);

            // Image component
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.alt).toBe('');
        });
    });

    describe('Edge cases', () => {
        it('handles empty image url', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: '',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.type).toBe('view');
            expect(result.children).toBeDefined();

            const imageContainer = result.children![0].children![0];
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.url).toBe('');
        });

        it('handles both actionUrl and dismiss button', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                actionUrl: 'https://example.com/action',
                dismissBtn: { style: 'circle' },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.children).toHaveLength(2); // Main content + dismiss button
            expect(result.actionUrl).toBe('https://example.com/action');

            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('circle');
        });
    });
}); 