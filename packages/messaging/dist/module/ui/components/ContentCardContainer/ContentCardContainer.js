"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { cloneElement, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, useWindowDimensions } from "react-native";
import { useContentCardUI } from "../../hooks/index.js";
import ContentCardContainerProvider from "../../providers/ContentCardContainerProvider.js";
import { ContentCardView } from "../ContentCardView/ContentCardView.js";
import EmptyState from "./EmptyState.js";
function ContentCardContainerInner({
  contentContainerStyle,
  LoadingComponent = /*#__PURE__*/React.createElement(ActivityIndicator, null),
  ErrorComponent = null,
  FallbackComponent = null,
  EmptyComponent,
  settings,
  surface,
  style,
  CardProps,
  refetch,
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
  const {
    content: contentSettings
  } = settings;
  const {
    capacity,
    heading,
    layout,
    emptyStateSettings
  } = contentSettings;
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const headingColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);
  const displayCards = useMemo(() => {
    const items = content ?? [];
    return items.filter(it => it && !dismissedIds.has(it.id)).slice(0, capacity);
  }, [content, dismissedIds, capacity]);
  const renderItem = useCallback(({
    item
  }) => {
    return /*#__PURE__*/React.createElement(ContentCardView, _extends({
      template: item
    }, CardProps, {
      listener: (...args) => {
        const [event] = args;
        if (event === 'onDismiss') {
          setDismissedIds(prev => {
            const next = new Set(prev);
            next.add(item?.id);
            return next;
          });
        }
        CardProps?.listener?.(...args);
      },
      style: [isHorizontal && [styles.horizontalCardStyles, {
        width: Math.floor(windowWidth * 0.75)
      }]]
    }));
  }, [isHorizontal, CardProps, windowWidth]);
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
      image: emptyStateSettings?.image?.[colorScheme ?? "light"]?.url ?? '',
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
    data: displayCards,
    extraData: refetch,
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
  settings,
  isLoading,
  error,
  ...props
}) {
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
    LoadingComponent: LoadingComponent,
    ErrorComponent: ErrorComponent,
    FallbackComponent: FallbackComponent
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