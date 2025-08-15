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

            const mainContent = result.children![0];
            expect(mainContent.actionUrl).toBe('https://example.com/action');
        });

        it('does not include actionUrl when not provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            const mainContent = result.children![0];
            expect(mainContent.actionUrl).toBeUndefined();
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

            const result = convertImageOnlyContentToComponent(data, undefined, styleOverrides);

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

            const result = convertImageOnlyContentToComponent(data, undefined, styleOverrides);

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
            
            // Main content should have actionUrl
            const mainContent = result.children![0];
            expect(mainContent.actionUrl).toBe('https://example.com/action');

            // Main content container
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
            
            const mainContent = result.children![0];
            expect(mainContent.actionUrl).toBeUndefined();

            // Main content container
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
            
            const mainContent = result.children![0];
            expect(mainContent.actionUrl).toBe('https://example.com/action');

            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('circle');
        });
    });

    describe('Height parameter handling', () => {
        it('applies height to card and imageContainer maxHeight', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const height = 250;
            const result = convertImageOnlyContentToComponent(data, height);

            expect(result.style).toMatchObject({
                maxHeight: 250,
            });

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                maxHeight: 250,
            });
        });

        it('combines height with style overrides correctly', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const height = 200;
            const styleOverrides: ImageOnlyContentStyle = {
                card: {
                    backgroundColor: '#ff0000',
                    borderRadius: 20,
                },
                imageContainer: {
                    borderRadius: 15,
                },
            };

            const result = convertImageOnlyContentToComponent(data, height, styleOverrides);

            // Height should be applied to maxHeight
            expect(result.style).toMatchObject({
                backgroundColor: '#ff0000',
                borderRadius: 20,
                maxHeight: 200,
            });

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                borderRadius: 15,
                maxHeight: 200,
            });
        });

        it('works without height parameter', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            expect(result.style).not.toHaveProperty('maxHeight');
            
            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                maxHeight: 300, // Default maxHeight from styles
            });
        });

        it('overrides existing maxHeight in style overrides when height is provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const height = 180;
            const styleOverrides: ImageOnlyContentStyle = {
                card: {
                    maxHeight: 300, // This should be overridden by height parameter
                },
                imageContainer: {
                    maxHeight: 400, // This should be overridden by height parameter
                },
            };

            const result = convertImageOnlyContentToComponent(data, height, styleOverrides);

            expect(result.style).toMatchObject({
                maxHeight: 180, // Height parameter takes precedence
            });

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                maxHeight: 180, // Height parameter takes precedence
            });
        });
    });

    describe('ActionView property validation', () => {
        it('sets actionView to true on main content container', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            const mainContent = result.children![0];
            expect(mainContent.actionView).toBe(true);
        });

        it('sets actionView to true even when actionUrl is not provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
            };

            const result = convertImageOnlyContentToComponent(data);

            const mainContent = result.children![0];
            expect(mainContent.actionView).toBe(true);
            expect(mainContent.actionUrl).toBeUndefined();
        });

        it('sets actionView to true and includes actionUrl when provided', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    alt: 'Test Image',
                },
                actionUrl: 'https://example.com/action',
            };

            const result = convertImageOnlyContentToComponent(data);

            const mainContent = result.children![0];
            expect(mainContent.actionView).toBe(true);
            expect(mainContent.actionUrl).toBe('https://example.com/action');
        });
    });

    describe('Parameter combinations', () => {
        it('handles all parameters together', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                    darkUrl: 'https://example.com/dark.jpg',
                    alt: 'Test Image',
                },
                actionUrl: 'https://example.com/action',
                dismissBtn: { style: 'circle' },
            };

            const height = 220;
            const styleOverrides: ImageOnlyContentStyle = {
                card: {
                    backgroundColor: '#00ff00',
                    borderRadius: 25,
                },
                image: {
                    borderRadius: 10,
                },
            };

            const result = convertImageOnlyContentToComponent(data, height, styleOverrides);

            // Root component
            expect(result.type).toBe('view');
            expect(result.style).toMatchObject({
                backgroundColor: '#00ff00',
                borderRadius: 25,
                maxHeight: 220,
            });
            expect(result.children).toHaveLength(2);

            // Main content
            const mainContent = result.children![0];
            expect(mainContent.actionView).toBe(true);
            expect(mainContent.actionUrl).toBe('https://example.com/action');

            // Image container
            const imageContainer = mainContent.children![0];
            expect(imageContainer.style).toMatchObject({
                maxHeight: 220,
            });

            // Image
            const imageComponent = imageContainer.children![0];
            expect(imageComponent.type).toBe('image');
            expect(imageComponent.url).toBe('https://example.com/image.jpg');
            expect(imageComponent.darkUrl).toBe('https://example.com/dark.jpg');
            expect(imageComponent.alt).toBe('Test Image');
            expect(imageComponent.style).toMatchObject({
                borderRadius: 10,
            });

            // Dismiss button
            const dismissButton = result.children![1];
            expect(dismissButton.type).toBe('dismissButton');
            expect(dismissButton.dismissType).toBe('circle');
            expect(dismissButton.interactId).toBe('dismiss_button');
        });

        it('handles height parameter only', () => {
            const data: ImageOnlyContentData = {
                image: {
                    url: 'https://example.com/image.jpg',
                },
            };

            const height = 160;
            const result = convertImageOnlyContentToComponent(data, height);

            expect(result.style).toMatchObject({
                maxHeight: 160,
            });

            const imageContainer = result.children![0].children![0];
            expect(imageContainer.style).toMatchObject({
                maxHeight: 160,
            });
        });
    });
}); 