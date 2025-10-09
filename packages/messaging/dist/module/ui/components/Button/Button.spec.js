"use strict";

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
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import Button from "./Button.js";
import { ThemeProvider } from "../../theme/ThemeProvider.js";

// Mock Linking.openURL
jest.spyOn(Linking, 'openURL');

// Helper to render with theme
const renderWithTheme = (component, customThemes) => {
  return render(/*#__PURE__*/React.createElement(ThemeProvider, {
    customThemes: customThemes
  }, component));
};
describe('Button', () => {
  const mockOnPress = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Basic rendering', () => {
    it('should render a button with the provided title', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Click Me"
      }));
      const button = screen.getByText('Click Me');
      expect(button).toBeTruthy();
    });
    it('should render with different title text', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Submit"
      }));
      expect(screen.getByText('Submit')).toBeTruthy();
    });
    it('should render button as Pressable component', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Test",
        testID: "test-button"
      }));
      const button = getByTestId('test-button');
      expect(button.type).toBe('View'); // Pressable renders as View
    });
  });
  describe('Press handling', () => {
    it('should call onPress when the button is pressed', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Press Me",
        onPress: mockOnPress
      }));
      const button = screen.getByText('Press Me');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
    it('should call onPress with interactId when provided', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Press Me",
        onPress: mockOnPress,
        interactId: "test-interact-id"
      }));
      const button = screen.getByText('Press Me');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledWith('test-interact-id');
    });
    it('should call onPress multiple times when pressed multiple times', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Press Me",
        onPress: mockOnPress
      }));
      const button = screen.getByText('Press Me');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
    it('should not throw error when onPress is not provided', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Press Me"
      }));
      const button = screen.getByText('Press Me');
      expect(() => fireEvent.press(button)).not.toThrow();
    });
  });
  describe('actionUrl handling', () => {
    it('should open URL when actionUrl is provided and button is pressed', () => {
      const testUrl = 'https://example.com';
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Link",
        actionUrl: testUrl
      }));
      const button = screen.getByText('Link');
      fireEvent.press(button);
      expect(Linking.openURL).toHaveBeenCalledWith(testUrl);
    });
    it('should call both onPress and open URL when both are provided', () => {
      const testUrl = 'https://example.com';
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Link",
        actionUrl: testUrl,
        onPress: mockOnPress
      }));
      const button = screen.getByText('Link');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledWith(testUrl);
    });
    it('should call onPress with interactId and open URL', () => {
      const testUrl = 'https://example.com';
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Link",
        actionUrl: testUrl,
        onPress: mockOnPress,
        interactId: "link-interact-id"
      }));
      const button = screen.getByText('Link');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledWith('link-interact-id');
      expect(Linking.openURL).toHaveBeenCalledWith(testUrl);
    });
    it('should call openURL even if it might fail', () => {
      const testUrl = 'https://example.com';
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Link",
        actionUrl: testUrl
      }));
      const button = screen.getByText('Link');
      fireEvent.press(button);

      // Verify the URL opening was attempted
      expect(Linking.openURL).toHaveBeenCalledWith(testUrl);
    });
    it('should not try to open URL when actionUrl is not provided', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "No Link",
        onPress: mockOnPress
      }));
      const button = screen.getByText('No Link');
      fireEvent.press(button);
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });
  describe('Theme support', () => {
    it('should apply theme button text color when theme is provided', () => {
      const customThemes = {
        light: {
          colors: {
            buttonTextColor: '#FF5733'
          }
        },
        dark: {
          colors: {
            buttonTextColor: '#FF5733'
          }
        }
      };
      renderWithTheme(/*#__PURE__*/React.createElement(Button, {
        title: "Themed"
      }), customThemes);
      const text = screen.getByText('Themed');
      expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({
        color: '#FF5733'
      })]));
    });
    it('should handle theme with undefined buttonTextColor', () => {
      const customThemes = {
        light: {
          colors: {}
        },
        dark: {
          colors: {}
        }
      };
      renderWithTheme(/*#__PURE__*/React.createElement(Button, {
        title: "Default"
      }), customThemes);
      const text = screen.getByText('Default');
      expect(text).toBeTruthy();
    });
    it('should render without theme provider', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(Button, {
          title: "No Theme"
        }));
      }).not.toThrow();
    });
  });
  describe('Custom styles', () => {
    it('should accept and apply custom textStyle', () => {
      const customTextStyle = {
        fontSize: 20,
        fontWeight: 'bold'
      };
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Styled",
        textStyle: customTextStyle
      }));
      const text = screen.getByText('Styled');
      expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({
        fontSize: 20,
        fontWeight: 'bold'
      })]));
    });
    it('should accept and apply array of textStyles', () => {
      const textStyles = [{
        fontSize: 16
      }, {
        fontWeight: 'bold'
      }, {
        color: 'blue'
      }];
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Multi Style",
        textStyle: textStyles
      }));
      const text = screen.getByText('Multi Style');
      const styles = JSON.stringify(text.props.style);
      expect(styles).toContain('"fontSize":16');
      expect(styles).toContain('"fontWeight":"bold"');
      expect(styles).toContain('"color":"blue"');
    });
    it('should accept and apply custom Pressable style', () => {
      const customStyle = {
        padding: 10,
        backgroundColor: 'red'
      };
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Styled Button",
        style: customStyle,
        testID: "button"
      }));
      const button = getByTestId('button');
      expect(button.props.style).toEqual(customStyle);
    });
    it('should merge theme color with custom textStyle', () => {
      const customThemes = {
        light: {
          colors: {
            buttonTextColor: '#FF5733'
          }
        },
        dark: {
          colors: {
            buttonTextColor: '#FF5733'
          }
        }
      };
      const customTextStyle = {
        fontSize: 18
      };
      renderWithTheme(/*#__PURE__*/React.createElement(Button, {
        title: "Merged",
        textStyle: customTextStyle
      }), customThemes);
      const text = screen.getByText('Merged');
      expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({
        color: '#FF5733'
      }), expect.objectContaining({
        fontSize: 18
      })]));
    });
  });
  describe('Additional Pressable props', () => {
    it('should accept disabled prop', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Disabled",
        disabled: true,
        testID: "button"
      }));
      const button = getByTestId('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
    it('should accept accessibility props', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Accessible",
        testID: "button",
        accessibilityLabel: "Submit form",
        accessibilityHint: "Double tap to submit the form"
      }));
      const button = getByTestId('button');
      expect(button.props.accessibilityLabel).toBe('Submit form');
      expect(button.props.accessibilityHint).toBe('Double tap to submit the form');
    });
    it('should accept testID prop', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Test ID",
        testID: "my-button"
      }));
      const button = getByTestId('my-button');
      expect(button).toBeTruthy();
    });
    it('should spread additional Pressable props', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Extended",
        testID: "button",
        hitSlop: 10,
        accessibilityRole: "button"
      }));
      const button = getByTestId('button');
      expect(button.props.hitSlop).toBe(10);
      expect(button.props.accessibilityRole).toBe('button');
    });
  });
  describe('ID prop', () => {
    it('should accept id prop without error', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(Button, {
          title: "With ID",
          id: "button-123"
        }));
      }).not.toThrow();
    });
    it('should render correctly with id prop', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "ID Button",
        id: "unique-id"
      }));
      const button = screen.getByText('ID Button');
      expect(button).toBeTruthy();
    });
  });
  describe('Edge cases', () => {
    it('should handle empty title string', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: ""
      }));

      // Should not throw, but may not be visible
      expect(() => screen.getByText('')).not.toThrow();
    });
    it('should handle very long title text', () => {
      const longTitle = 'A'.repeat(1000);
      render(/*#__PURE__*/React.createElement(Button, {
        title: longTitle
      }));
      const button = screen.getByText(longTitle);
      expect(button).toBeTruthy();
    });
    it('should handle special characters in title', () => {
      const specialTitle = '!@#$%^&*()_+-={}[]|:;<>?,./~`';
      render(/*#__PURE__*/React.createElement(Button, {
        title: specialTitle
      }));
      const button = screen.getByText(specialTitle);
      expect(button).toBeTruthy();
    });
    it('should handle undefined interactId', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Test",
        onPress: mockOnPress,
        interactId: undefined
      }));
      const button = screen.getByText('Test');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledWith(undefined);
    });
    it('should handle empty string as actionUrl', () => {
      render(/*#__PURE__*/React.createElement(Button, {
        title: "Empty URL",
        actionUrl: ""
      }));
      const button = screen.getByText('Empty URL');
      fireEvent.press(button);

      // Empty string is falsy, so openURL should not be called
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });
  describe('Callback stability', () => {
    it('should maintain stable callback reference', () => {
      const {
        rerender
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Stable",
        onPress: mockOnPress,
        actionUrl: "https://example.com"
      }));
      const button = screen.getByText('Stable');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledTimes(1);

      // Rerender with same props
      rerender(/*#__PURE__*/React.createElement(Button, {
        title: "Stable",
        onPress: mockOnPress,
        actionUrl: "https://example.com"
      }));
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(2);
      expect(Linking.openURL).toHaveBeenCalledTimes(2);
    });
    it('should update callback when dependencies change', () => {
      const {
        rerender
      } = render(/*#__PURE__*/React.createElement(Button, {
        title: "Dynamic",
        onPress: mockOnPress,
        interactId: "id-1"
      }));
      const button = screen.getByText('Dynamic');
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledWith('id-1');

      // Rerender with different interactId
      rerender(/*#__PURE__*/React.createElement(Button, {
        title: "Dynamic",
        onPress: mockOnPress,
        interactId: "id-2"
      }));
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledWith('id-2');
    });
  });
});
//# sourceMappingURL=Button.spec.js.map