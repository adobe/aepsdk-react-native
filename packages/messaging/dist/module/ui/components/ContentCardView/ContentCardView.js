"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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

import React, { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import MessagingEdgeEventType from "../../../models/MessagingEdgeEventType.js";
import DismissButton from "../DismissButton/DismissButton.js";
import UnreadIcon from "../UnreadIcon/UnreadIcon.js";
import { useTheme } from "../../theme/index.js";
import useAspectRatio from "../../hooks/useAspectRatio.js";
import Button from "../Button/Button.js";
import useContainerSettings from "../../hooks/useContainerSettings.js";

/**
 * Callback function that is called when a content card event occurs.
 */

/** Props for the ContentCardView component */

/** Renders a content card view
 * @param {ContentViewProps} props - The props for the ContentCardView component
 */
export const ContentCardView = ({
  template,
  listener,
  variant,
  styleOverrides: _styleOverrides,
  style,
  ContainerProps,
  ImageContainerProps,
  ImageProps,
  ContentContainerProps,
  TextProps,
  TitleProps,
  BodyProps,
  ButtonContainerProps,
  ButtonProps,
  DismissButtonProps,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const [isVisible, setIsVisible] = useState(true);
  const isDisplayedRef = useRef(false);
  const theme = useTheme();
  const containerSettings = useContainerSettings();
  // Track read state in component state
  const [isRead, setIsRead] = useState(template.isRead);

  // Sync state when template changes
  useEffect(() => {
    setIsRead(template.isRead);
  }, [template.isRead]);

  // Default to true if not specified
  const isUnreadEnabled = containerSettings?.content?.isUnreadEnabled ?? true;

  // Get unread background color based on theme
  const unreadBackgroundColor = useMemo(() => {
    if (!isUnreadEnabled || isRead || !containerSettings?.content?.unread_indicator?.unread_bg) {
      return undefined;
    }
    const unreadBg = containerSettings.content.unread_indicator.unread_bg;
    return colorScheme === 'dark' ? unreadBg.clr.dark : unreadBg.clr.light;
  }, [isUnreadEnabled, isRead, containerSettings, colorScheme]);
  const cardVariant = useMemo(() => variant ?? template.type ?? "SmallImage", [variant, template.type]);
  const onDismiss = useCallback(() => {
    listener?.("onDismiss", template);

    // Track dismiss event using propositionItem
    template.track?.(MessagingEdgeEventType.DISMISS);
    setIsVisible(false);
  }, [listener, template]);
  const onPress = useCallback(() => {
    listener?.("onInteract", template);

    // Track interaction event using propositionItem
    template.track?.("content_clicked", MessagingEdgeEventType.INTERACT, null);

    // Mark as read when interacted with
    template.isRead = true;
    setIsRead(true);
    if (template.data?.content?.actionUrl) {
      try {
        Linking.openURL(template.data.content.actionUrl);
      } catch (error) {
        console.warn(`Failed to open URL: ${template.data.content.actionUrl}`, error);
      }
    }
  }, [template, listener]);
  const imageUri = useMemo(() => {
    if (colorScheme === "dark" && template.data?.content?.image?.darkUrl) {
      return template.data.content.image.darkUrl;
    }
    return template.data.content.image?.url;
  }, [colorScheme, template.data?.content?.image?.darkUrl, template.data?.content?.image?.url]);
  const imageAspectRatio = useAspectRatio(imageUri);
  const styleOverrides = useMemo(() => {
    switch (cardVariant) {
      case "SmallImage":
        return _styleOverrides?.smallImageStyle;
      case "LargeImage":
        return _styleOverrides?.largeImageStyle;
      case "ImageOnly":
        return _styleOverrides?.imageOnlyStyle;
      default:
        return null;
    }
  }, [_styleOverrides, cardVariant]);

  // Call listener on mount to signal view display (only once to prevent duplicates)
  useEffect(() => {
    if (!isDisplayedRef.current) {
      listener?.("onDisplay", template);
      // Track display event using propositionItem
      template.track?.(MessagingEdgeEventType.DISPLAY);
      isDisplayedRef.current = true;
    }
  }, [listener, template]);

  // If not visible, return null to hide the entire view
  if (!isVisible) {
    return null;
  }
  if (!template.data) return null;
  const content = template?.data?.content;
  if (!content) return null;
  return /*#__PURE__*/React.createElement(Pressable, _extends({
    onPress: onPress,
    style: state => [styles.card, styleOverrides?.card, typeof style === "function" ? style(state) : style]
  }, props), /*#__PURE__*/React.createElement(View, _extends({
    style: [cardVariant === "SmallImage" ? smallImageStyles.container : styles.container, styleOverrides?.container, unreadBackgroundColor && {
      backgroundColor: unreadBackgroundColor
    }]
  }, ContainerProps), imageUri && /*#__PURE__*/React.createElement(View, _extends({
    style: [cardVariant === "SmallImage" ? smallImageStyles.imageContainer : styles.imageContainer, styleOverrides?.imageContainer]
  }, ImageContainerProps), /*#__PURE__*/React.createElement(Image, _extends({
    source: {
      uri: imageUri
    },
    style: [cardVariant === "SmallImage" ? smallImageStyles.image : styles.image, {
      aspectRatio: imageAspectRatio
    }, styleOverrides?.image],
    resizeMode: "contain"
  }, ImageProps))), cardVariant !== "ImageOnly" && /*#__PURE__*/React.createElement(View, _extends({
    style: [cardVariant === "SmallImage" ? smallImageStyles.contentContainer : styles.contentContainer, styleOverrides?.contentContainer]
  }, ContentContainerProps), content?.title?.content && /*#__PURE__*/React.createElement(Text, _extends({
    style: [styles.title, {
      color: theme.colors.textPrimary
    }, styleOverrides?.text, styleOverrides?.title]
  }, TextProps, TitleProps), content.title.content), content?.body?.content && /*#__PURE__*/React.createElement(Text, _extends({
    style: [styles.body, {
      color: theme.colors.textPrimary
    }, styleOverrides?.text, styleOverrides?.body]
  }, TextProps, BodyProps), content.body.content), /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.buttonContainer, styleOverrides?.buttonContainer]
  }, ButtonContainerProps), content?.buttons?.length && content?.buttons?.length > 0 && content.buttons.map(button => /*#__PURE__*/React.createElement(Button, _extends({
    key: button.id,
    actionUrl: button.actionUrl,
    title: button.text.content,
    onPress: onPress,
    style: styleOverrides?.button,
    textStyle: [styleOverrides?.text, styleOverrides?.buttonText]
  }, ButtonProps))))), content?.dismissBtn && content.dismissBtn?.style !== "none" && /*#__PURE__*/React.createElement(DismissButton, _extends({
    onPress: onDismiss,
    type: content.dismissBtn.style
  }, DismissButtonProps)), isUnreadEnabled && !isRead && /*#__PURE__*/React.createElement(UnreadIcon, null)));
};
const styles = StyleSheet.create({
  card: {
    margin: 15,
    flex: 1
  },
  container: {
    flexDirection: "column"
  },
  imageContainer: {
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f0f0f0"
  },
  image: {
    width: "100%",
    resizeMode: "contain"
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "flex-start"
  },
  textContent: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginRight: 16
  },
  body: {
    fontSize: 14,
    lineHeight: 18
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    paddingTop: 8,
    gap: 8
  },
  button: {
    marginHorizontal: 8
  }
});
const smallImageStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    maxWidth: "100%",
    alignItems: "center"
  },
  container: {
    flexDirection: "row"
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "flex-start"
  },
  imageContainer: {
    borderRadius: 12,
    maxWidth: "35%",
    alignSelf: "center"
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    maxWidth: "100%"
  }
});
//# sourceMappingURL=ContentCardView.js.map