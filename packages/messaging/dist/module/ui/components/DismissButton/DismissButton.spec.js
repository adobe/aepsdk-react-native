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
// import { useColorScheme } from 'react-native';
// import DismissButton from './DismissButton';

// // Mock useColorScheme
// jest.mock('react-native', () => {
//   const RN = jest.requireActual('react-native');
//   return {
//     ...RN,
//     useColorScheme: jest.fn()
//   };
// });

// const mockUseColorScheme = useColorScheme as jest.MockedFunction<
//   typeof useColorScheme
// >;

// describe('DismissButton', () => {
//   const mockOnPress = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockUseColorScheme.mockReturnValue('light');
//   });

//   describe('Basic rendering', () => {
//     it('should render a dismiss button with type "simple"', () => {
//       render(<DismissButton onPress={mockOnPress} type="simple" />);

//       const button = screen.getByText('x');
//       expect(button).toBeTruthy();
//     });

//     it('should render a dismiss button with type "circle"', () => {
//       render(<DismissButton onPress={mockOnPress} type="circle" />);

//       const button = screen.getByText('x');
//       expect(button).toBeTruthy();
//     });

//     it('should display "x" as the button text', () => {
//       render(<DismissButton onPress={mockOnPress} type="simple" />);

//       expect(screen.getByText('x')).toBeTruthy();
//     });
//   });

//   describe('Press handling', () => {
//     it('should call onPress when the button is pressed', () => {
//       render(<DismissButton onPress={mockOnPress} type="simple" />);

//       const button = screen.getByText('x');
//       fireEvent.press(button);

//       expect(mockOnPress).toHaveBeenCalledTimes(1);
//     });

//     it('should call onPress multiple times when pressed multiple times', () => {
//       render(<DismissButton onPress={mockOnPress} type="circle" />);

//       const button = screen.getByText('x');
//       fireEvent.press(button);
//       fireEvent.press(button);
//       fireEvent.press(button);

//       expect(mockOnPress).toHaveBeenCalledTimes(3);
//     });
//   });

//   describe('Color scheme handling', () => {
//     it('should apply light color scheme styles', () => {
//       mockUseColorScheme.mockReturnValue('light');
//       render(<DismissButton onPress={mockOnPress} type="simple" />);

//       const text = screen.getByText('x');
//       expect(text.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: 'black'
//           })
//         ])
//       );
//     });

//     it('should apply dark color scheme styles', () => {
//       mockUseColorScheme.mockReturnValue('dark');
//       render(<DismissButton onPress={mockOnPress} type="simple" />);

//       const text = screen.getByText('x');
//       expect(text.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             color: 'white'
//           })
//         ])
//       );
//     });

//     it('should apply correct background color for circle type in light mode', () => {
//       mockUseColorScheme.mockReturnValue('light');
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="circle"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'rgba(0,0,0,0.1)'
//           })
//         ])
//       );
//     });

//     it('should apply correct background color for circle type in dark mode', () => {
//       mockUseColorScheme.mockReturnValue('dark');
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="circle"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'rgba(255,255,255,0.1)'
//           })
//         ])
//       );
//     });
//   });

//   describe('Type variations', () => {
//     it('should apply simple type styles', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             backgroundColor: 'transparent'
//           })
//         ])
//       );
//     });

//     it('should apply circle type styles', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="circle"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             borderRadius: 10,
//             width: 18,
//             height: 18
//           })
//         ])
//       );
//     });
//   });

//   describe('Custom props and styles', () => {
//     it('should accept and apply custom style props', () => {
//       const customStyle = { opacity: 0.5 };
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           style={customStyle}
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             opacity: 0.5
//           })
//         ])
//       );
//     });

//     it('should accept function-based style props', () => {
//       const styleFn = jest.fn().mockReturnValue({ opacity: 0.8 });
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           style={styleFn}
//           testID="dismiss-button"
//         />
//       );

//       expect(styleFn).toHaveBeenCalled();

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             opacity: 0.8
//           })
//         ])
//       );
//     });

//     it('should accept additional Pressable props', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//           disabled={true}
//           accessibilityLabel="Close button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.disabled).toBe(true);
//       expect(button.props.accessibilityLabel).toBe('Close button');
//     });
//   });

//   describe('Accessibility', () => {
//     it('should be accessible by default', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button).toBeTruthy();
//     });

//     it('should accept custom accessibility props', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//           accessibilityLabel="Dismiss notification"
//           accessibilityHint="Double tap to close this notification"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.accessibilityLabel).toBe('Dismiss notification');
//       expect(button.props.accessibilityHint).toBe(
//         'Double tap to close this notification'
//       );
//     });
//   });

//   describe('Positioning and layout', () => {
//     it('should have absolute positioning styles', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             position: 'absolute',
//             top: 6,
//             right: 6,
//             zIndex: 1000
//           })
//         ])
//       );
//     });

//     it('should have minimum dimensions', () => {
//       const { getByTestId } = render(
//         <DismissButton
//           onPress={mockOnPress}
//           type="simple"
//           testID="dismiss-button"
//         />
//       );

//       const button = getByTestId('dismiss-button');
//       expect(button.props.style).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             minWidth: 18,
//             minHeight: 18
//           })
//         ])
//       );
//     });
//   });

//   describe('Edge cases', () => {
//     it('should handle undefined color scheme gracefully', () => {
//       mockUseColorScheme.mockReturnValue(undefined as any);

//       expect(() => {
//         render(<DismissButton onPress={mockOnPress} type="simple" />);
//       }).not.toThrow();
//     });

//     it('should handle null color scheme gracefully', () => {
//       mockUseColorScheme.mockReturnValue(null as any);

//       expect(() => {
//         render(<DismissButton onPress={mockOnPress} type="simple" />);
//       }).not.toThrow();
//     });
//   });
// });
"use strict";
//# sourceMappingURL=DismissButton.spec.js.map