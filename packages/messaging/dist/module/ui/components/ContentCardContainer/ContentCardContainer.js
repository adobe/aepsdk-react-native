"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { cloneElement, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, useWindowDimensions } from "react-native";
import { useContentCardUI, useContentContainer } from "../../hooks/index.js";
import ContentCardContainerProvider from "../../providers/ContentCardContainerProvider.js";
import { ContentCardView } from "../ContentCardView/ContentCardView.js";
import EmptyState from "./EmptyState.js";
// Core renderer: fetches content for a surface, derives layout, and renders a list of cards
function ContentCardContainerInner({
  contentContainerStyle,
  LoadingComponent = /*#__PURE__*/React.createElement(ActivityIndicator, null),
  ErrorComponent = null,
  FallbackComponent = null,
  EmptyComponent,
  settings,
  surface,
  style,
  contentCardViewProps,
  ...props
}) {
  const colorScheme = useColorScheme();
  const {
    width: windowWidth
  } = useWindowDimensions();
  const {
    content,
    error,
    isLoading
  } = useContentCardUI(surface);

  // Normalize/alias frequently used settings
  const {
    content: contentSettings
  } = settings;
  const {
    heading,
    layout,
    emptyStateSettings
  } = contentSettings;

  // Derived flags used across renders
  const headingColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);
  const renderItem = useCallback(({
    item
  }) => {
    return /*#__PURE__*/React.createElement(ContentCardView, _extends({
      template: item
    }, contentCardViewProps, {
      style: [isHorizontal && [styles.horizontalCardStyles, {
        width: Math.floor(windowWidth * 0.75)
      }]]
    }));
  }, [isHorizontal, contentCardViewProps, windowWidth]);
  if (isLoading) {
    return LoadingComponent;
  }
  if (error) {
    return ErrorComponent;
  }
  if (!content) {
    return FallbackComponent;
  }
  if (content.length === 0) {
    if (EmptyComponent) {
      return /*#__PURE__*/cloneElement(EmptyComponent, {
        ...emptyStateSettings
      });
    }
    return /*#__PURE__*/React.createElement(EmptyState, {
      image: emptyStateSettings?.image?.[colorScheme ?? "light"]?.url,
      text: emptyStateSettings?.message?.content || "No Content Available"
    });
  }
  return /*#__PURE__*/React.createElement(ContentCardContainerProvider, {
    settings: settings
  }, /*#__PURE__*/React.createElement(Text, {
    accessibilityRole: "header",
    style: [styles.heading, {
      color: headingColor
    }]
  }, heading.content), /*#__PURE__*/React.createElement(FlatList, _extends({}, props, {
    data: content,
    contentContainerStyle: [contentContainerStyle, isHorizontal && styles.horizontalListContent],
    horizontal: isHorizontal,
    renderItem: renderItem
  })));
}
export function ContentCardContainer({
  LoadingComponent = /*#__PURE__*/React.createElement(ActivityIndicator, null),
  ErrorComponent = null,
  FallbackComponent = null,
  surface,
  ...props
}) {
  const {
    settings,
    error,
    isLoading
  } = useContentContainer(surface);
  if (isLoading) {
    return LoadingComponent;
  }
  if (error) {
    return ErrorComponent;
  }
  if (!settings) {
    return FallbackComponent;
  }
  return /*#__PURE__*/React.createElement(ContentCardContainerInner, _extends({
    settings: settings,
    surface: surface,
    LoadingComponent: LoadingComponent
  }, props));
}
const styles = StyleSheet.create({
  heading: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16
  },
  horizontalCardStyles: {
    flex: 0
  },
  horizontalListContent: {
    alignItems: 'center'
  }
});
//# sourceMappingURL=ContentCardContainer.js.map