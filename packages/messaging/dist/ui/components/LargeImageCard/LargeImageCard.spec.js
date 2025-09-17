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
// import { Image, useColorScheme } from 'react-native';
// import LargeImageCard from './LargeImageCard';
// import { LargeImageContentData } from '../../../models/ContentCard';
// import { ThemeProvider } from '../../theme/ThemeProvider';
// // Mock dependencies
// jest.mock('react-native', () => {
//   const RN = jest.requireActual('react-native');
//   return {
//     ...RN,
//     useColorScheme: jest.fn(),
//     Image: {
//       ...RN.Image,
//       getSize: jest.fn()
//     }
//   };
// });
// jest.mock('../../hooks/useAspectRatio', () => {
//   return jest.fn(() => 1.5);
// });
// const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;
// const mockImageGetSize = Image.getSize as jest.MockedFunction<typeof Image.getSize>;
// // Test wrapper component with theme provider
// const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <ThemeProvider customThemes={{}}>{children}</ThemeProvider>
// );
// describe('LargeImageCard', () => {
//   const mockOnPress = jest.fn();
//   const mockOnDismiss = jest.fn();
//   const baseContent: LargeImageContentData = {
//     title: {
//       content: 'Large Image Title'
//     },
//     body: {
//       content: 'Large image card body content'
//     },
//     buttons: [
//       {
//         id: 'button1',
//         interactId: 'interact1',
//         actionUrl: 'https://example.com',
//         text: {
//           content: 'Action Button'
//         }
//       }
//     ],
//     dismissBtn: {
//       style: 'circle'
//     }
//   };
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockUseColorScheme.mockReturnValue('light');
//     mockImageGetSize.mockImplementation((uri, success) => {
//       success(400, 300);
//     });
//   });
//   describe('Basic rendering', () => {
//     it('should render the component with basic content', () => {
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//       expect(screen.getByText('Large image card body content')).toBeTruthy();
//       expect(screen.getByText('Action Button')).toBeTruthy();
//     });
//     it('should render with image when imageUri is provided', () => {
//       const { UNSAFE_getByType } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             imageUri="https://example.com/large-image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const images = UNSAFE_getByType(Image);
//       expect(images).toBeTruthy();
//     });
//     it('should not render image container when imageUri is not provided', () => {
//       const { UNSAFE_queryByType } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const images = UNSAFE_queryByType(Image);
//       expect(images).toBeNull();
//     });
//     it('should render dismiss button when dismissBtn style is not "none"', () => {
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//     it('should not render dismiss button when dismissBtn style is "none"', () => {
//       const contentWithNoDismiss = {
//         ...baseContent,
//         dismissBtn: { style: 'none' as const }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={contentWithNoDismiss}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.queryByText('x')).toBeNull();
//     });
//     it('should not render dismiss button when dismissBtn is not provided', () => {
//       const contentWithoutDismiss = {
//         ...baseContent,
//         dismissBtn: undefined
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={contentWithoutDismiss}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.queryByText('x')).toBeNull();
//     });
//   });
//   describe('Content variations', () => {
//     it('should handle content with only title', () => {
//       const titleOnlyContent = {
//         title: {
//           content: 'Title Only'
//         }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={titleOnlyContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Title Only')).toBeTruthy();
//       expect(screen.queryByText('Large image card body content')).toBeNull();
//     });
//     it('should handle content with only body', () => {
//       const bodyOnlyContent = {
//         body: {
//           content: 'Body Only'
//         }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={bodyOnlyContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Body Only')).toBeTruthy();
//       expect(screen.queryByText('Large Image Title')).toBeNull();
//     });
//     it('should handle content with no buttons', () => {
//       const noButtonsContent = {
//         ...baseContent,
//         buttons: undefined
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={noButtonsContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//       expect(screen.queryByText('Action Button')).toBeNull();
//     });
//     it('should handle content with empty buttons array', () => {
//       const emptyButtonsContent = {
//         ...baseContent,
//         buttons: []
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={emptyButtonsContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//       expect(screen.queryByText('Action Button')).toBeNull();
//     });
//     it('should render multiple buttons', () => {
//       const multiButtonContent = {
//         ...baseContent,
//         buttons: [
//           {
//             id: 'button1',
//             interactId: 'interact1',
//             actionUrl: 'https://example.com',
//             text: { content: 'Primary Action' }
//           },
//           {
//             id: 'button2',
//             interactId: 'interact2',
//             actionUrl: 'https://example2.com',
//             text: { content: 'Secondary Action' }
//           }
//         ]
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={multiButtonContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Primary Action')).toBeTruthy();
//       expect(screen.getByText('Secondary Action')).toBeTruthy();
//     });
//   });
//   describe('Interaction handling', () => {
//     it('should call onPress when the card is pressed', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="large-image-card"
//           />
//         </TestWrapper>
//       );
//       const card = getByTestId('large-image-card');
//       fireEvent.press(card);
//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });
//     it('should call onDismiss when dismiss button is pressed', () => {
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const dismissButton = screen.getByText('x');
//       fireEvent.press(dismissButton);
//       expect(mockOnDismiss).toHaveBeenCalledTimes(1);
//     });
//     it('should call onPress when a button is pressed', () => {
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const button = screen.getByText('Action Button');
//       fireEvent.press(button);
//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });
//     it('should handle missing onPress callback gracefully', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={baseContent}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//     it('should handle missing onDismiss callback gracefully', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={baseContent}
//               onPress={mockOnPress}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//   });
//   describe('Style overrides', () => {
//     it('should apply custom card styles', () => {
//       const customStyles = {
//         card: { backgroundColor: 'blue', margin: 25 }
//       };
//       const { getByTestId } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="large-image-card"
//           />
//         </TestWrapper>
//       );
//       const card = getByTestId('large-image-card');
//       expect(card.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'blue',
//             margin: 25
//           })
//         ])
//       );
//     });
//     it('should apply custom text styles', () => {
//       const customStyles = {
//         title: { fontSize: 24, fontWeight: 'bold' as const },
//         body: { fontSize: 16, fontStyle: 'italic' as const }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const title = screen.getByText('Large Image Title');
//       const body = screen.getByText('Large image card body content');
//       expect(title.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             fontSize: 24,
//             fontWeight: 'bold'
//           })
//         ])
//       );
//       expect(body.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             fontSize: 16,
//             fontStyle: 'italic'
//           })
//         ])
//       );
//     });
//     it('should apply custom image styles', () => {
//       const customStyles = {
//         imageContainer: { borderRadius: 25 },
//         image: { opacity: 0.9 }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       // Image styles are applied but harder to test directly
//       // This ensures no errors are thrown when applying custom styles
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//   });
//   describe('Component props forwarding', () => {
//     it('should forward ContainerProps', () => {
//       const containerProps = {
//         testID: 'custom-container',
//         accessibilityLabel: 'Custom container'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             ContainerProps={containerProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       // Component renders without errors when props are forwarded
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//     it('should forward ImageContainerProps when image is present', () => {
//       const imageContainerProps = {
//         testID: 'custom-image-container',
//         accessibilityLabel: 'Image container'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             ImageContainerProps={imageContainerProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//     it('should forward ImageProps when image is present', () => {
//       const imageProps = {
//         testID: 'custom-image',
//         accessibilityLabel: 'Large image'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             ImageProps={imageProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//     it('should forward TextProps to title and body', () => {
//       const textProps = {
//         numberOfLines: 2,
//         ellipsizeMode: 'tail' as const
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             TextProps={textProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const title = screen.getByText('Large Image Title');
//       const body = screen.getByText('Large image card body content');
//       expect(title.props.numberOfLines).toBe(2);
//       expect(body.props.numberOfLines).toBe(2);
//     });
//     it('should forward TitleProps specifically to title', () => {
//       const titleProps = {
//         numberOfLines: 1,
//         testID: 'custom-title'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             TitleProps={titleProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const title = screen.getByText('Large Image Title');
//       expect(title.props.numberOfLines).toBe(1);
//       expect(title.props.testID).toBe('custom-title');
//     });
//     it('should forward BodyProps specifically to body', () => {
//       const bodyProps = {
//         numberOfLines: 3,
//         testID: 'custom-body'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             BodyProps={bodyProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const body = screen.getByText('Large image card body content');
//       expect(body.props.numberOfLines).toBe(3);
//       expect(body.props.testID).toBe('custom-body');
//     });
//     it('should forward ButtonContainerProps', () => {
//       const buttonContainerProps = {
//         testID: 'custom-button-container'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             ButtonContainerProps={buttonContainerProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Action Button')).toBeTruthy();
//     });
//     it('should forward ButtonProps to buttons', () => {
//       const buttonProps = {
//         testID: 'custom-button'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             ButtonProps={buttonProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('Action Button')).toBeTruthy();
//     });
//     it('should forward DismissButtonProps', () => {
//       const dismissButtonProps = {
//         testID: 'custom-dismiss-button'
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             DismissButtonProps={dismissButtonProps}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });
//   describe('Theme integration', () => {
//     it('should apply light theme colors', () => {
//       mockUseColorScheme.mockReturnValue('light');
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const title = screen.getByText('Large Image Title');
//       const body = screen.getByText('Large image card body content');
//       expect(title.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: '#000000' // Default light theme primary text color
//           })
//         ])
//       );
//       expect(body.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: '#000000' // Default light theme primary text color
//           })
//         ])
//       );
//     });
//     it('should apply dark theme colors', () => {
//       mockUseColorScheme.mockReturnValue('dark');
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       const title = screen.getByText('Large Image Title');
//       const body = screen.getByText('Large image card body content');
//       expect(title.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: '#FFFFFF' // Default dark theme primary text color
//           })
//         ])
//       );
//       expect(body.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: '#FFFFFF' // Default dark theme primary text color
//           })
//         ])
//       );
//     });
//   });
//   describe('Accessibility', () => {
//     it('should accept custom accessibility props', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="large-image-card"
//             accessibilityLabel="Large content card"
//             accessibilityHint="Double tap to interact"
//           />
//         </TestWrapper>
//       );
//       const card = getByTestId('large-image-card');
//       expect(card.props.accessibilityLabel).toBe('Large content card');
//       expect(card.props.accessibilityHint).toBe('Double tap to interact');
//     });
//     it('should support disabled state', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="large-image-card"
//             disabled={true}
//           />
//         </TestWrapper>
//       );
//       const card = getByTestId('large-image-card');
//       expect(card.props.disabled).toBe(true);
//     });
//   });
//   describe('Props forwarding', () => {
//     it('should forward additional Pressable props', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="large-image-card"
//             hitSlop={15}
//             delayLongPress={600}
//           />
//         </TestWrapper>
//       );
//       const card = getByTestId('large-image-card');
//       expect(card.props.hitSlop).toBe(15);
//       expect(card.props.delayLongPress).toBe(600);
//     });
//   });
//   describe('Edge cases', () => {
//     it('should handle undefined content gracefully', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={undefined as any}
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//     it('should handle empty content object', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={{} as any}
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//     it('should handle content with empty strings', () => {
//       const emptyStringContent = {
//         title: { content: '' },
//         body: { content: '' }
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={emptyStringContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       // Empty strings should not render the text components
//       expect(screen.queryByText('')).toBeNull();
//     });
//     it('should handle image loading errors gracefully', () => {
//       mockImageGetSize.mockImplementation((uri, success, error) => {
//         error(new Error('Image load failed'));
//       });
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={baseContent}
//               imageUri="https://example.com/broken-image.jpg"
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//     it('should handle undefined color scheme gracefully', () => {
//       mockUseColorScheme.mockReturnValue(undefined as any);
//       expect(() => {
//         render(
//           <TestWrapper>
//             <LargeImageCard
//               content={baseContent}
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//   });
//   describe('Layout and styling', () => {
//     it('should render button container even when no buttons are present', () => {
//       const noButtonsContent = {
//         ...baseContent,
//         buttons: []
//       };
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={noButtonsContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       // Button container should still be rendered (but empty)
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//     it('should apply aspect ratio to image when provided', () => {
//       render(
//         <TestWrapper>
//           <LargeImageCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );
//       // useAspectRatio hook is mocked to return 1.5
//       // This ensures the component uses the hook correctly
//       expect(screen.getByText('Large Image Title')).toBeTruthy();
//     });
//   });
// });
//# sourceMappingURL=LargeImageCard.spec.js.map