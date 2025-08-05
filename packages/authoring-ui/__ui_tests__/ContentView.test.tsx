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
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { useColorScheme } from "react-native";
import { ContentView } from "../src/common/ContentView";
import { Component } from "../src/common/Component";

// Mock useColorScheme
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    useColorScheme: jest.fn(),
  };
});

const mockUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;

describe("ContentView", () => {
  const mockOnEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue("light");
  });

  describe("View component", () => {
    it("should render a view with children", () => {
      const component: Component = {
        type: "view",
        style: { backgroundColor: "red" },
        children: [
          {
            type: "text",
            content: "Child text",
            style: { color: "black" },
          },
        ],
      };

      render(<ContentView obj={component} />);

      expect(screen.getByText("Child text")).toBeTruthy();
    });

    it("should render an empty view without children", () => {
      const component: Component = {
        type: "view",
        style: { backgroundColor: "blue" },
      };

      const { toJSON } = render(<ContentView obj={component} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("Text component", () => {
    it("should render text content", () => {
      const component: Component = {
        type: "text",
        content: "Hello World",
        style: { fontSize: 16, color: "black" },
      };

      render(<ContentView obj={component} />);

      expect(screen.getByText("Hello World")).toBeTruthy();
    });

    it("should render text with custom text style properties", () => {
      const component: Component = {
        type: "text",
        content: "Custom Text",
        style: {
          fontSize: 20,
          color: "red",
          numberOfLines: 2,
          adjustsFontSizeToFit: false,
        },
      };

      const { getByText } = render(<ContentView obj={component} />);
      const textElement = getByText("Custom Text");

      expect(textElement).toBeTruthy();
      expect(textElement.props.numberOfLines).toBe(2);
      expect(textElement.props.adjustsFontSizeToFit).toBe(false);
    });

    it("should use default text style properties when not specified", () => {
      const component: Component = {
        type: "text",
        content: "Default Text",
        style: { color: "blue" },
      };

      const { getByText } = render(<ContentView obj={component} />);
      const textElement = getByText("Default Text");

      expect(textElement.props.numberOfLines).toBe(1);
      expect(textElement.props.adjustsFontSizeToFit).toBe(true);
    });
  });

  describe("Image component", () => {
    it("should render image with light mode URL", () => {
      const component: Component = {
        type: "image",
        url: "https://example.com/light.jpg",
        darkUrl: "https://example.com/dark.jpg",
        style: { width: 100, height: 100 },
      };

      mockUseColorScheme.mockReturnValue("light");

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const imageElement = screen.getByRole("image");
      expect(imageElement).toBeTruthy();
      expect(imageElement.props.source.uri).toBe(
        "https://example.com/light.jpg"
      );
    });

    it("should render image with dark mode URL when in dark mode", () => {
      const component: Component = {
        type: "image",
        url: "https://example.com/light.jpg",
        darkUrl: "https://example.com/dark.jpg",
        style: { width: 100, height: 100 },
      };

      mockUseColorScheme.mockReturnValue("dark");

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const imageElement = screen.getByRole("image");
      expect(imageElement.props.source.uri).toBe(
        "https://example.com/dark.jpg"
      );
    });

    it("should fallback to light URL when dark URL is not provided", () => {
      const component: Component = {
        type: "image",
        url: "https://example.com/light.jpg",
        style: { width: 100, height: 100 },
      };

      mockUseColorScheme.mockReturnValue("dark");

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const imageElement = screen.getByRole("image");
      expect(imageElement.props.source.uri).toBe(
        "https://example.com/light.jpg"
      );
    });

    it("should handle image press event", () => {
      const component: Component = {
        type: "image",
        url: "https://example.com/image.jpg",
        interactId: "image-1",
        style: { width: 100, height: 100 },
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const imageElement = screen.getByRole("image");
      fireEvent.press(imageElement);

      expect(mockOnEvent).toHaveBeenCalledWith("image-1", "press");
    });
  });

  describe("Button component", () => {
    it("should render button with content", () => {
      const component: Component = {
        type: "button",
        content: "Click Me",
        interactId: "button-1",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      expect(screen.getByRole("button", { name: "Click Me" })).toBeTruthy();
    });

    it("should handle button press event", () => {
      const component: Component = {
        type: "button",
        content: "Test Button",
        interactId: "button-test",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const buttonElement = screen.getByRole("button", { name: "Test Button" });
      fireEvent.press(buttonElement);

      expect(mockOnEvent).toHaveBeenCalledWith("button-test", "clickButton");
    });

    it("should render button with empty content", () => {
      const component: Component = {
        type: "button",
        content: "",
        interactId: "empty-button",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      expect(screen.getByRole("button")).toBeTruthy();
    });
  });

  describe("Dismiss button component", () => {
    it("should render simple dismiss button", () => {
      const component: Component = {
        type: "dismissButton",
        dismissType: "simple",
        interactId: "dismiss-simple",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const dismissButton = screen.getByText("×");
      expect(dismissButton).toBeTruthy();
    });

    it("should render circle dismiss button", () => {
      const component: Component = {
        type: "dismissButton",
        dismissType: "circle",
        interactId: "dismiss-circle",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const dismissButton = screen.getByText("×");
      expect(dismissButton).toBeTruthy();
    });

    it("should not render dismiss button when type is none", () => {
      const component: Component = {
        type: "dismissButton",
        dismissType: "none",
        interactId: "dismiss-none",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      expect(screen.queryByText("×")).toBeNull();
    });

    it("should not render dismiss button when dismissType is undefined", () => {
      const component: Component = {
        type: "dismissButton",
        interactId: "dismiss-undefined",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      expect(screen.queryByText("×")).toBeNull();
    });

    it("should handle dismiss button press event", () => {
      const component: Component = {
        type: "dismissButton",
        dismissType: "simple",
        interactId: "dismiss-test",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const dismissButton = screen.getByText("×");
      fireEvent.press(dismissButton);

      expect(mockOnEvent).toHaveBeenCalledWith("dismiss-test", "onDismiss");
    });
  });

  describe("Event handling", () => {
    it("should not call onEvent when interactId is not provided", () => {
      const component: Component = {
        type: "button",
        content: "No Interact ID",
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const buttonElement = screen.getByRole("button", {
        name: "No Interact ID",
      });
      fireEvent.press(buttonElement);

      expect(mockOnEvent).not.toHaveBeenCalled();
    });

    it("should not call onEvent when onEvent handler is not provided", () => {
      const component: Component = {
        type: "button",
        content: "No Handler",
        interactId: "button-no-handler",
      };

      render(<ContentView obj={component} />);

      const buttonElement = screen.getByRole("button", { name: "No Handler" });
      fireEvent.press(buttonElement);

      // Should not throw any errors
      expect(mockOnEvent).not.toHaveBeenCalled();
    });
  });

  describe("Complex nested components", () => {
    it("should render nested components with multiple levels", () => {
      const component: Component = {
        type: "view",
        style: { padding: 10 },
        children: [
          {
            type: "text",
            content: "Header Text",
            style: { fontSize: 18, fontWeight: "bold" },
          },
          {
            type: "view",
            style: { marginTop: 10 },
            children: [
              {
                type: "image",
                url: "https://example.com/nested.jpg",
                style: { width: 50, height: 50 },
              },
              {
                type: "button",
                content: "Nested Button",
                interactId: "nested-btn",
              },
            ],
          },
          {
            type: "dismissButton",
            dismissType: "circle",
            interactId: "nested-dismiss",
          },
        ],
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      expect(screen.getByText("Header Text")).toBeTruthy();
      expect(screen.getByRole("image")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Nested Button" })
      ).toBeTruthy();
      expect(screen.getByText("×")).toBeTruthy();
    });

    it("should handle events from nested components", () => {
      const component: Component = {
        type: "view",
        children: [
          {
            type: "view",
            children: [
              {
                type: "button",
                content: "Deep Nested Button",
                interactId: "deep-nested",
              },
            ],
          },
        ],
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const buttonElement = screen.getByRole("button", {
        name: "Deep Nested Button",
      });
      fireEvent.press(buttonElement);

      expect(mockOnEvent).toHaveBeenCalledWith("deep-nested", "clickButton");
    });
  });

  describe("Unknown component type", () => {
    it("should return null for unknown component type", () => {
      const component = {
        type: "unknown" as any,
        content: "Should not render",
      } as Component;

      const { toJSON } = render(<ContentView obj={component} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty children array", () => {
      const component: Component = {
        type: "view",
        children: [],
      };

      const { toJSON } = render(<ContentView obj={component} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("should handle missing content for text component", () => {
      const component: Component = {
        type: "text",
        style: { color: "black" },
      };

      render(<ContentView obj={component} />);
      expect(screen.getByText("")).toBeTruthy();
    });

    it("should handle missing url for image component", () => {
      const component: Component = {
        type: "image",
        style: { width: 100, height: 100 },
      };

      render(<ContentView obj={component} onEvent={mockOnEvent} />);

      const imageElement = screen.getByRole("image");
      expect(imageElement.props.source.uri).toBeUndefined();
    });
  });
});
