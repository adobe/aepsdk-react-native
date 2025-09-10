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

// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react-native';
// import { Image, useColorScheme } from 'react-native';
// import SmallImageCard from './SmallImageCard';
// import { SmallImageContentData } from '../../../models/ContentCard';
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

// describe('SmallImageCard', () => {
//   const mockOnPress = jest.fn();
//   const mockOnDismiss = jest.fn();

//   const baseContent: SmallImageContentData = {
//     title: {
//       content: 'Test Title'
//     },
//     body: {
//       content: 'Test body content'
//     },
//     buttons: [
//       {
//         id: 'button1',
//         interactId: 'interact1',
//         actionUrl: 'https://example.com',
//         text: {
//           content: 'Click Me'
//         }
//       }
//     ],
//     dismissBtn: {
//       style: 'simple'
//     }
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockUseColorScheme.mockReturnValue('light');
//     mockImageGetSize.mockImplementation((uri, success) => {
//       success(300, 200);
//     });
//   });

//   describe('Basic rendering', () => {
//     it('should render the component with basic content', () => {
//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Test Title')).toBeTruthy();
//       expect(screen.getByText('Test body content')).toBeTruthy();
//       expect(screen.getByText('Click Me')).toBeTruthy();
//     });

//     it('should render with image when imageUri is provided', () => {
//       const { UNSAFE_getByType } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             imageUri="https://example.com/image.jpg"
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
//           <SmallImageCard
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
//           <SmallImageCard
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
//           <SmallImageCard
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
//           <SmallImageCard
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
//           <SmallImageCard
//             content={titleOnlyContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Title Only')).toBeTruthy();
//       expect(screen.queryByText('Test body content')).toBeNull();
//     });

//     it('should handle content with only body', () => {
//       const bodyOnlyContent = {
//         body: {
//           content: 'Body Only'
//         }
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={bodyOnlyContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Body Only')).toBeTruthy();
//       expect(screen.queryByText('Test Title')).toBeNull();
//     });

//     it('should handle content with no buttons', () => {
//       const noButtonsContent = {
//         ...baseContent,
//         buttons: undefined
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={noButtonsContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Test Title')).toBeTruthy();
//       expect(screen.queryByText('Click Me')).toBeNull();
//     });

//     it('should handle content with empty buttons array', () => {
//       const emptyButtonsContent = {
//         ...baseContent,
//         buttons: []
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={emptyButtonsContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Test Title')).toBeTruthy();
//       expect(screen.queryByText('Click Me')).toBeNull();
//     });

//     it('should render multiple buttons', () => {
//       const multiButtonContent = {
//         ...baseContent,
//         buttons: [
//           {
//             id: 'button1',
//             interactId: 'interact1',
//             actionUrl: 'https://example.com',
//             text: { content: 'Button 1' }
//           },
//           {
//             id: 'button2',
//             interactId: 'interact2',
//             actionUrl: 'https://example2.com',
//             text: { content: 'Button 2' }
//           }
//         ]
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={multiButtonContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       expect(screen.getByText('Button 1')).toBeTruthy();
//       expect(screen.getByText('Button 2')).toBeTruthy();
//     });
//   });

//   describe('Interaction handling', () => {
//     it('should call onPress when the card is pressed', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//           />
//         </TestWrapper>
//       );

//       const card = getByTestId('small-image-card');
//       fireEvent.press(card);

//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });

//     it('should call onDismiss when dismiss button is pressed', () => {
//       render(
//         <TestWrapper>
//           <SmallImageCard
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
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       const button = screen.getByText('Click Me');
//       fireEvent.press(button);

//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });

//     it('should handle missing onPress callback gracefully', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <SmallImageCard
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
//             <SmallImageCard
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
//         card: { backgroundColor: 'red', margin: 20 }
//       };

//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//           />
//         </TestWrapper>
//       );

//       const card = getByTestId('small-image-card');
//       expect(card.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'red',
//             margin: 20
//           })
//         ])
//       );
//     });

//     it('should apply custom container styles', () => {
//       const customStyles = {
//         container: { padding: 20 }
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       // Container styles are applied but harder to test directly
//       // This ensures no errors are thrown when applying custom styles
//       expect(screen.getByText('Test Title')).toBeTruthy();
//     });

//     it('should apply custom text styles', () => {
//       const customStyles = {
//         text: { fontSize: 20 },
//         title: { fontWeight: 'bold' as const },
//         body: { fontStyle: 'italic' as const }
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             styleOverrides={customStyles}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       const title = screen.getByText('Test Title');
//       const body = screen.getByText('Test body content');

//       expect(title.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             fontSize: 20,
//             fontWeight: 'bold'
//           })
//         ])
//       );

//       expect(body.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             fontSize: 20,
//             fontStyle: 'italic'
//           })
//         ])
//       );
//     });

//     it('should apply custom image styles', () => {
//       const customStyles = {
//         imageContainer: { borderRadius: 20 },
//         image: { opacity: 0.8 }
//       };

//       render(
//         <TestWrapper>
//           <SmallImageCard
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
//       expect(screen.getByText('Test Title')).toBeTruthy();
//     });

//     it('should handle function-based style prop', () => {
//       const styleFn = jest.fn().mockReturnValue({ opacity: 0.9 });

//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             style={styleFn}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//           />
//         </TestWrapper>
//       );

//       expect(styleFn).toHaveBeenCalled();

//       const card = getByTestId('small-image-card');
//       expect(card.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             opacity: 0.9
//           })
//         ])
//       );
//     });
//   });

//   describe('Theme integration', () => {
//     it('should apply light theme colors', () => {
//       mockUseColorScheme.mockReturnValue('light');

//       render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       const title = screen.getByText('Test Title');
//       const body = screen.getByText('Test body content');

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
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </TestWrapper>
//       );

//       const title = screen.getByText('Test Title');
//       const body = screen.getByText('Test body content');

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

//     it('should work with custom theme colors', () => {
//       const customThemes = {
//         light: {
//           colors: {
//             primary: '#007AFF',
//             secondary: '#5856D6',
//             background: '#FFFFFF',
//             textPrimary: '#FF0000', // Custom red text
//             textSecondary: '#8E8E93',
//             imagePlaceholder: '#C7C7CC',
//             buttonTextColor: 'dodgerblue'
//           }
//         },
//         dark: {
//           colors: {
//             primary: '#0A84FF',
//             secondary: '#5E5CE6',
//             background: '#262626',
//             textPrimary: '#00FF00', // Custom green text
//             textSecondary: '#8E8E93',
//             imagePlaceholder: '#48484A',
//             buttonTextColor: 'dodgerblue'
//           }
//         }
//       };

//       const CustomThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//         <ThemeProvider customThemes={customThemes}>{children}</ThemeProvider>
//       );

//       mockUseColorScheme.mockReturnValue('light');

//       render(
//         <CustomThemeWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//           />
//         </CustomThemeWrapper>
//       );

//       const title = screen.getByText('Test Title');
//       expect(title.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: '#FF0000' // Custom red text color
//           })
//         ])
//       );
//     });
//   });

//   describe('Accessibility', () => {
//     it('should accept custom accessibility props', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//             accessibilityLabel="Content card"
//             accessibilityHint="Double tap to open"
//           />
//         </TestWrapper>
//       );

//       const card = getByTestId('small-image-card');
//       expect(card.props.accessibilityLabel).toBe('Content card');
//       expect(card.props.accessibilityHint).toBe('Double tap to open');
//     });

//     it('should support disabled state', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//             disabled={true}
//           />
//         </TestWrapper>
//       );

//       const card = getByTestId('small-image-card');
//       expect(card.props.disabled).toBe(true);
//     });
//   });

//   describe('Props forwarding', () => {
//     it('should forward additional Pressable props', () => {
//       const { getByTestId } = render(
//         <TestWrapper>
//           <SmallImageCard
//             content={baseContent}
//             onPress={mockOnPress}
//             onDismiss={mockOnDismiss}
//             testID="small-image-card"
//             hitSlop={10}
//             delayLongPress={500}
//           />
//         </TestWrapper>
//       );

//       const card = getByTestId('small-image-card');
//       expect(card.props.hitSlop).toBe(10);
//       expect(card.props.delayLongPress).toBe(500);
//     });
//   });

//   describe('Edge cases', () => {
//     it('should handle undefined content gracefully', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <SmallImageCard
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
//             <SmallImageCard
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
//           <SmallImageCard
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
//             <SmallImageCard
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
//             <SmallImageCard
//               content={baseContent}
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//   });

//   describe('Height prop', () => {
//     it('should accept height prop', () => {
//       expect(() => {
//         render(
//           <TestWrapper>
//             <SmallImageCard
//               content={baseContent}
//               height={200}
//               onPress={mockOnPress}
//               onDismiss={mockOnDismiss}
//             />
//           </TestWrapper>
//         );
//       }).not.toThrow();
//     });
//   });
// });
