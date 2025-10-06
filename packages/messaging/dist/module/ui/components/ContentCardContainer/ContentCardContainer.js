"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { ActivityIndicator, FlatList, StyleSheet, useColorScheme } from "react-native";
import ContentCardContainerProvider from "../../providers/ContentCardContainerProvider.js";
import { ContentCardView } from "../ContentCardView/ContentCardView.js";
import { cloneElement, useCallback } from "react";
import { useContentCardUI, useContentContainer } from "../../hooks/index.js";
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
  ...props
}) {
  const colorScheme = useColorScheme();
  const {
    content,
    error,
    isLoading
  } = useContentCardUI(surface);
  const renderItem = useCallback(({
    item
  }) => {
    return /*#__PURE__*/React.createElement(ContentCardView, {
      template: item
    });
  }, []);
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
    const emptyProps = settings?.content?.emptyStateSettings;
    if (EmptyComponent) {
      return /*#__PURE__*/cloneElement(EmptyComponent, {
        ...emptyProps
      });
    }
    return /*#__PURE__*/React.createElement(EmptyState, {
      image: emptyProps?.image?.[colorScheme ?? "light"]?.url,
      text: settings?.content?.emptyStateSettings?.message?.content || "No Content Available"
    });
  }
  return /*#__PURE__*/React.createElement(ContentCardContainerProvider, {
    settings: settings
  }, /*#__PURE__*/React.createElement(FlatList, _extends({}, props, {
    data: content,
    contentContainerStyle: [styles.contentContainer, contentContainerStyle],
    horizontal: settings?.content?.layout?.orientation === "horizontal",
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
  contentContainer: {
    flex: 1
  }
});
//# sourceMappingURL=ContentCardContainer.js.map