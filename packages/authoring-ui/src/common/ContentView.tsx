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
import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from "react-native";
import { ContentViewEvent } from "./ContentViewEvent";
import { Component, ComponentTextStyle, ButtonStyle } from "./Component";
import { ViewStyle, ImageStyle } from "react-native";
import { useTheme } from "./ThemeProvider";
import { Theme } from "./Theme";

/**
 * Renders a dismiss button component with appropriate styling based on dismiss type.
 *
 * @param component - The dismiss button component to render.
 * @param colorScheme - The current color scheme.
 * @param onPress - The press handler function.
 * @returns The rendered dismiss button component or null if dismiss type is "none".
 */
const renderDismissButton = (
  component: Component,
  colorScheme: "light" | "dark",
  onPress: () => void
): React.ReactElement | null => {
  if (!component.dismissType || component.dismissType === "none") {
    return null;
  }

  const getDismissStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: "absolute",
      top: 6,
      right: 6,
      zIndex: 1000,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 18,
      minHeight: 18,
    };

    switch (component.dismissType) {
      case "simple":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "circle":
        return {
          ...baseStyle,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          borderRadius: 10,
          width: 18,
          height: 18,
        };
      default:
        return baseStyle;
    }
  };
  const getTextStyle = (): ComponentTextStyle => {
    const baseTextStyle: ComponentTextStyle = {
      color: colorScheme === "dark" ? "white" : "black",
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
    };
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={getDismissStyle()}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={getTextStyle()}>{"×"}</Text>
    </TouchableOpacity>
  );
};

/**
 * Renders a view component with its children.
 */
const renderViewComponent = (
  component: Component,
  theme: Theme,
  colorScheme: "light" | "dark",
  onEvent?: (eventName: ContentViewEvent, interactId?: string) => void
): React.ReactElement => {
  const style = { ...component.style };
  const viewStyle = {
    ...(style as ViewStyle),
    backgroundColor: (style as ViewStyle)?.backgroundColor || theme.colors.background,
  };

  return (
    <View
      style={viewStyle}
      onTouchEnd={() => {
        if (
          component.actionView &&
          component.actionUrl &&
          component.actionUrl !== ""
        ) {
          console.log("viewPress", component.actionUrl);

          if (onEvent) {
            onEvent("viewPress");
          }
          
          Linking.openURL(component.actionUrl).catch((error) => {
            console.warn(`Failed to open URL: ${component.actionUrl}`, error);
          });
        }
      }}
    >
      {component.children?.map((childComponent, index) => (
        <React.Fragment key={index}>
          {renderComponent(childComponent, theme, colorScheme, onEvent)}
        </React.Fragment>
      ))}
    </View>
  );
};

/**
 * Renders a text component.
 */
const renderTextComponent = (
  component: Component,
  theme: Theme
): React.ReactElement => {
  const style = { ...component.style };
  const textStyle = {
    ...(style as ComponentTextStyle),
    color: theme.colors.text_primary,
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Text
        adjustsFontSizeToFit={
          (style as ComponentTextStyle)?.adjustsFontSizeToFit || true
        }
        numberOfLines={(style as ComponentTextStyle)?.numberOfLines || 1}
        style={textStyle}
      >
        {component.content}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Renders a title component.
 */
const renderTitleComponent = (
  component: Component,
  theme: Theme
): React.ReactElement => {
  const style = { ...component.style };
  const titleStyle = {
    ...(style as ComponentTextStyle),
    color: theme.colors.text_primary,
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Text
        adjustsFontSizeToFit={
          (style as ComponentTextStyle)?.adjustsFontSizeToFit || true
        }
        numberOfLines={(style as ComponentTextStyle)?.numberOfLines || 1}
        style={titleStyle}
      >
        {component.content}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Renders a body component.
 */
const renderBodyComponent = (
  component: Component,
  theme: Theme
): React.ReactElement => {
  const style = { ...component.style };
  const bodyStyle = {
    ...(style as ComponentTextStyle),
    color: theme.colors.text_secondary,
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Text
        adjustsFontSizeToFit={
          (style as ComponentTextStyle)?.adjustsFontSizeToFit || true
        }
        numberOfLines={(style as ComponentTextStyle)?.numberOfLines || 1}
        style={bodyStyle}
      >
        {component.content}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Renders an image component.
 */
const renderImageComponent = (
  component: Component,
  theme: Theme,
  colorScheme: "light" | "dark"
): React.ReactElement => {
  const style = { ...component.style };
  const { interactId } = component;

  const imageUrl =
    component.darkUrl && component.darkUrl !== "" && colorScheme === "dark"
      ? component.darkUrl
      : component.url;

  const imageStyle = {
    ...(style as ImageStyle),
    backgroundColor: (style as ImageStyle)?.backgroundColor || theme.colors.image_placeholder,
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <Image style={imageStyle} source={{ uri: imageUrl }} />
    </TouchableOpacity>
  );
};

/**
 * Renders a button component.
 */
const renderButtonComponent = (
  component: Component,
  theme: Theme,
  onEvent?: (eventName: ContentViewEvent, interactId?: string) => void
): React.ReactElement => {
  const style = { ...component.style };
  const { interactId } = component;

  const handleButtonPress = async () => {
    if (interactId && onEvent) {
      onEvent("clickButton", interactId);
    }
    if (component.actionUrl) {
      try {
        await Linking.openURL(component.actionUrl);
      } catch (error) {
        console.warn(`Failed to open URL: ${component.actionUrl}`, error);
      }
    }
  };

  return (
    <View style={style as ButtonStyle}>
      <Button
        title={component.content || ""}
        color={theme.colors.button_text_color}
        onPress={handleButtonPress}
      />
    </View>
  );
};

/**
 * Renders a dismiss button component.
 */
const renderDismissButtonComponent = (
  component: Component,
  theme: Theme,
  colorScheme: "light" | "dark",
  onEvent?: (eventName: ContentViewEvent, interactId?: string) => void
): React.ReactElement | null => {
  const { interactId } = component;

  const handlePress = (eventName: ContentViewEvent) => {
    if (interactId && onEvent) {
      onEvent(eventName, interactId);
    }
  };

  return renderDismissButton(component, colorScheme, () =>
    handlePress("onDismiss")
  );
};

/**
 * Renders a component based on its type and properties.
 *
 * @param component - The component to render.
 * @param theme - The current theme object.
 * @param colorScheme - The current color scheme.
 * @param onEvent - The event handler function. If provided,
 * it will be called when the component is interacted with the components that have interactId.
 * @returns The rendered component.
 */
const renderComponent = (
  component: Component,
  theme: Theme,
  colorScheme: "light" | "dark",
  onEvent?: (eventName: ContentViewEvent, interactId?: string) => void
): React.ReactElement | null => {
  switch (component.type) {
    case "view":
      return renderViewComponent(component, theme, colorScheme, onEvent);

    case "text":
      return renderTextComponent(component, theme);

    case "title":
      return renderTitleComponent(component, theme);

    case "body":
      return renderBodyComponent(component, theme);

    case "image":
      return renderImageComponent(component, theme, colorScheme);

    case "button":
      return renderButtonComponent(component, theme, onEvent);

    case "dismissButton":
      return renderDismissButtonComponent(
        component,
        theme,
        colorScheme,
        onEvent
      );

    default:
      return null;
  }
};

/**
 * Renders a content view component.
 *
 * @param component - The component to render.
 * @param onEvent - The event handler function. If provided,
 * it will be called when the component is interacted with the components that have interactId.
 * @returns The rendered component.
 */
export const ContentView = ({
  component,
  onEvent,
}: {
  component: Component;
  onEvent?: (eventName: ContentViewEvent, interactId?: string) => void;
}) => {
  // Call hooks at the top level of the React component
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  // Memoize the rendered component for performance
  const renderedComponent = useMemo(() => {
    return (
      <View>{renderComponent(component, theme, colorScheme, onEvent)}</View>
    );
  }, [component, theme, colorScheme, onEvent]);

  return renderedComponent;
};
