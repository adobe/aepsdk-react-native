"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { cloneElement, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions } from "react-native";
import { useContentCardUI } from "../../hooks/index.js";
import ContentCardContainerProvider from "../../providers/ContentCardContainerProvider.js";
import { useTheme } from "../../theme/index.js";
import { ContentCardView } from "../ContentCardView/ContentCardView.js";
import EmptyState from "./EmptyState.js";

// TODO: consider localizing in the future
const DEFAULT_EMPTY_MESSAGE = 'No Content Available';
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
  ...props
}) {
  const {
    colors,
    isDark
  } = useTheme();
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
  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);
  const displayCards = useMemo(() => {
    const items = content ?? [];
    return items.filter(it => it && !dismissedIds.has(it.id)).slice(0, capacity);
  }, [content, dismissedIds, capacity]);
  const handleCardEvent = useCallback((event, data, nativeEvent) => {
    if (event === 'onDismiss' && data?.id) {
      setDismissedIds(prev => {
        const next = new Set(prev);
        next.add(data.id);
        return next;
      });
    }
    CardProps?.listener?.(event, data, nativeEvent);
  }, [CardProps]);
  const renderItem = useCallback(({
    item
  }) => {
    return /*#__PURE__*/React.createElement(ContentCardView, _extends({
      template: item
    }, CardProps, {
      listener: handleCardEvent,
      style: isHorizontal ? [styles.horizontalCardStyles, {
        width: Math.floor(windowWidth * 0.75)
      }] : undefined
    }));
  }, [isHorizontal, CardProps, windowWidth, handleCardEvent]);
  const EmptyList = useCallback(() => {
    return EmptyComponent ? /*#__PURE__*/cloneElement(EmptyComponent, {
      ...emptyStateSettings
    }) : /*#__PURE__*/React.createElement(EmptyState, {
      image: isDark ? emptyStateSettings?.image?.darkUrl ?? '' : emptyStateSettings?.image?.url ?? '',
      text: emptyStateSettings?.message?.content || DEFAULT_EMPTY_MESSAGE
    });
  }, [isDark, emptyStateSettings, EmptyComponent]);
  if (isLoading) {
    return LoadingComponent;
  }
  if (error) {
    return ErrorComponent;
  }
  if (!content) {
    return FallbackComponent;
  }
  return /*#__PURE__*/React.createElement(ContentCardContainerProvider, {
    settings: settings
  }, heading?.content ? /*#__PURE__*/React.createElement(Text, {
    accessibilityRole: "header",
    style: [styles.heading, {
      color: colors.textPrimary
    }]
  }, heading.content) : null, /*#__PURE__*/React.createElement(FlatList, _extends({}, props, {
    data: displayCards,
    keyExtractor: item => item.id,
    contentContainerStyle: [contentContainerStyle, isHorizontal && styles.horizontalListContent, styles.container],
    horizontal: isHorizontal,
    renderItem: renderItem,
    ListEmptyComponent: /*#__PURE__*/React.createElement(EmptyList, null)
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
  container: {
    flexGrow: 1
  },
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