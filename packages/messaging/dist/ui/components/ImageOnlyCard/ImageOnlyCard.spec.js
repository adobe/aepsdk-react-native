"use strict";
// /*
//     Copyright 2025 Adobe. All rights reserved.
//     This file is licensed to you under the Apache License, Version 2.0 (the
//     "License"); you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
//     or agreed to in writing, software distributed under the License is
//     distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
//     ANY KIND, either express or implied. See the License for the specific
//     language governing permissions and limitations under the License.
// */
Object.defineProperty(exports, "__esModule", { value: true });
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react-native';
// import { Image } from 'react-native';
// import ImageOnlyCard from './ImageOnlyCard';
// import { ImageOnlyContent } from '../../../models/ContentCard';
// // Mock dependencies
// jest.mock('react-native', () => {
//   const RN = jest.requireActual('react-native');
//   return {
//     ...RN,
//     Image: {
//       ...RN.Image,
//       getSize: jest.fn()
//     }
//   };
// });
// jest.mock('../../hooks/useAspectRatio', () => {
//   return jest.fn(() => 1.5);
// });
// const mockImageGetSize = Image.getSize as jest.MockedFunction<typeof Image.getSize>;
// describe('ImageOnlyCard', () => {
//   const mockOnPress = jest.fn();
//   const mockOnDismiss = jest.fn();
//   const baseContent: ImageOnlyContent = {
//     image: {
//       url: 'https://example.com/image.jpg',
//       alt: 'Test image'
//     },
//     dismissBtn: {
//       style: 'circle'
//     },
//     actionUrl: 'https://example.com/action'
//   };
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockImageGetSize.mockImplementation((uri, success) => {
//       success(400, 300);
//     });
//   });
//   describe('Basic rendering', () => {
//     it('should render the component with image', () => {
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const image = UNSAFE_getByType(Image);
//       expect(image).toBeTruthy();
//     });
//     it('should render dismiss button when dismissBtn style is provided', () => {
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//     it('should not render dismiss button when dismissBtn style is "none"', () => {
//       const contentWithNoDismiss = {
//         ...baseContent,
//         dismissBtn: { style: 'none' as const }
//       };
//       render(
//         <ImageOnlyCard
//           content={contentWithNoDismiss}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.queryByText('x')).toBeNull();
//     });
//     it('should not render dismiss button when dismissBtn is not provided', () => {
//       const contentWithoutDismiss = {
//         ...baseContent,
//         dismissBtn: undefined
//       };
//       render(
//         <ImageOnlyCard
//           content={contentWithoutDismiss}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.queryByText('x')).toBeNull();
//     });
//     it('should render with default image placeholder background', () => {
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Component renders successfully with default styling
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//   });
//   describe('Content variations', () => {
//     it('should handle content with only image', () => {
//       const imageOnlyContent = {
//         image: {
//           url: 'https://example.com/image.jpg'
//         }
//       };
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={imageOnlyContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//       expect(screen.queryByText('x')).toBeNull();
//     });
//     it('should handle content with image and action URL', () => {
//       const contentWithAction = {
//         ...baseContent,
//         actionUrl: 'https://example.com/action'
//       };
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={contentWithAction}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should handle different dismiss button styles', () => {
//       const contentWithSimpleDismiss = {
//         ...baseContent,
//         dismissBtn: { style: 'simple' as const }
//       };
//       render(
//         <ImageOnlyCard
//           content={contentWithSimpleDismiss}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });
//   describe('Interaction handling', () => {
//     it('should call onPress when the card is pressed', () => {
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//           ContainerProps={{ testID: 'image-only-card' }}
//         />
//       );
//       const card = getByTestId('image-only-card');
//       fireEvent.press(card);
//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });
//     it('should call onDismiss when dismiss button is pressed', () => {
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const dismissButton = screen.getByText('x');
//       fireEvent.press(dismissButton);
//       expect(mockOnDismiss).toHaveBeenCalledTimes(1);
//     });
//     it('should handle missing onPress callback gracefully', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should handle missing onDismiss callback gracefully', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             onPress={mockOnPress}
//           />
//         );
//       }).not.toThrow();
//     });
//   });
//   describe('Style overrides', () => {
//     it('should apply custom card styles', () => {
//       const customStyles = {
//         card: { backgroundColor: 'green', margin: 30 }
//       };
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//           ContainerProps={{ testID: 'image-only-card' }}
//         />
//       );
//       const card = getByTestId('image-only-card');
//       expect(card.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'green',
//             margin: 30
//           })
//         ])
//       );
//     });
//     it('should apply custom image container styles', () => {
//       const customStyles = {
//         imageContainer: { backgroundColor: 'blue', borderRadius: 15 }
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Image container styles are applied but harder to test directly
//       // This ensures no errors are thrown when applying custom styles
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should apply custom image styles', () => {
//       const customStyles = {
//         image: { opacity: 0.7, borderRadius: 10 }
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Image styles are applied but harder to test directly
//       // This ensures no errors are thrown when applying custom styles
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should apply custom dismiss button styles', () => {
//       const customStyles = {
//         dismissButton: { backgroundColor: 'red', opacity: 0.8 }
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           styleOverrides={customStyles}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });
//   describe('Component props forwarding', () => {
//     it('should forward ContainerProps', () => {
//       const containerProps = {
//         testID: 'custom-container',
//         accessibilityLabel: 'Image only card container'
//       };
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ContainerProps={containerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const container = getByTestId('custom-container');
//       expect(container.props.accessibilityLabel).toBe('Image only card container');
//     });
//     it('should forward ImageContainerProps', () => {
//       const imageContainerProps = {
//         testID: 'custom-image-container',
//         accessibilityLabel: 'Image container'
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ImageContainerProps={imageContainerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Component renders without errors when props are forwarded
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ImageContainerProps={imageContainerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should forward ImageProps', () => {
//       const imageProps = {
//         testID: 'custom-image',
//         accessibilityLabel: 'Custom image'
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ImageProps={imageProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Component renders without errors when props are forwarded
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ImageProps={imageProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should forward DismissButtonProps', () => {
//       const dismissButtonProps = {
//         testID: 'custom-dismiss-button',
//         accessibilityLabel: 'Close image'
//       };
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           DismissButtonProps={dismissButtonProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });
//   describe('Accessibility', () => {
//     it('should accept custom accessibility props through ContainerProps', () => {
//       const containerProps = {
//         testID: 'image-only-card',
//         accessibilityLabel: 'Image only content card',
//         accessibilityHint: 'Double tap to view full image'
//       };
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ContainerProps={containerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const card = getByTestId('image-only-card');
//       expect(card.props.accessibilityLabel).toBe('Image only content card');
//       expect(card.props.accessibilityHint).toBe('Double tap to view full image');
//     });
//     it('should support disabled state through ContainerProps', () => {
//       const containerProps = {
//         testID: 'image-only-card',
//         disabled: true
//       };
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ContainerProps={containerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const card = getByTestId('image-only-card');
//       expect(card.props.disabled).toBe(true);
//     });
//   });
//   describe('Props forwarding', () => {
//     it('should forward additional Pressable props through ContainerProps', () => {
//       const containerProps = {
//         testID: 'image-only-card',
//         hitSlop: 20,
//         delayLongPress: 700
//       };
//       const { getByTestId } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           ContainerProps={containerProps}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const card = getByTestId('image-only-card');
//       expect(card.props.hitSlop).toBe(20);
//       expect(card.props.delayLongPress).toBe(700);
//     });
//   });
//   describe('Edge cases', () => {
//     it('should handle undefined content gracefully', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={undefined as any}
//             imageUri="https://example.com/image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should handle empty content object', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={{} as any}
//             imageUri="https://example.com/image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should handle missing imageUri gracefully', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should handle image loading errors gracefully', () => {
//       mockImageGetSize.mockImplementation((uri, success, error) => {
//         error(new Error('Image load failed'));
//       });
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={baseContent}
//             imageUri="https://example.com/broken-image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should handle content with null dismissBtn', () => {
//       const contentWithNullDismiss = {
//         ...baseContent,
//         dismissBtn: null as any
//       };
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={contentWithNullDismiss}
//             imageUri="https://example.com/image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//   });
//   describe('Layout and styling', () => {
//     it('should apply aspect ratio to image when provided', () => {
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // useAspectRatio hook is mocked to return 1.5
//       // This ensures the component uses the hook correctly
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       expect(UNSAFE_getByType(Image)).toBeTruthy();
//     });
//     it('should handle height prop', () => {
//       expect(() => {
//         render(
//           <ImageOnlyCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             height={300}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         );
//       }).not.toThrow();
//     });
//     it('should render image with contain resize mode', () => {
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const image = UNSAFE_getByType(Image);
//       expect(image.props.resizeMode).toBe('contain');
//     });
//     it('should position dismiss button within image container', () => {
//       render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri="https://example.com/image.jpg"
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       // Dismiss button should be rendered within the image container
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });
//   describe('Image source handling', () => {
//     it('should use provided imageUri as image source', () => {
//       const testImageUri = 'https://example.com/test-image.jpg';
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri={testImageUri}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const image = UNSAFE_getByType(Image);
//       expect(image.props.source).toEqual({ uri: testImageUri });
//     });
//     it('should handle undefined imageUri', () => {
//       const { UNSAFE_getByType } = render(
//         <ImageOnlyCard
//           content={baseContent}
//           imageUri={undefined}
//           onPress={mockOnPress}
//           onDismiss={mockOnDismiss}
//         />
//       );
//       const image = UNSAFE_getByType(Image);
//       expect(image.props.source).toEqual({ uri: undefined });
//     });
//   });
// });
//# sourceMappingURL=ImageOnlyCard.spec.js.map