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

import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import MessagingEdgeEventType from "../../../models/MessagingEdgeEventType.js";
import DismissButton from "../DismissButton/DismissButton.js";
import UnreadIcon from "../UnreadIcon/UnreadIcon.js";
import { useTheme } from "../../theme/index.js";
import useAspectRatio from "../../hooks/useAspectRatio.js";
import Button from "../Button/Button.js";
import { useContext } from 'react';
import { ContentCardContainerContext } from "../../providers/ContentCardContainerProvider.js";
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
  isRead: isReadProp,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const [isVisible, setIsVisible] = useState(true);
  const [internalIsRead, setInternalIsRead] = useState(false);
  const isDisplayedRef = useRef(false);
  const theme = useTheme();
  const containerSettings = useContext(ContentCardContainerContext);

  // Support both controlled and uncontrolled modes
  const isRead = isReadProp !== undefined ? isReadProp : internalIsRead;

  // Get unread background color based on theme
  const unreadBackgroundColor = useMemo(() => {
    if (!containerSettings?.content?.isUnreadEnabled || isRead || !containerSettings.content.unread_indicator?.unread_bg) {
      return undefined;
    }
    const unreadBg = containerSettings.content.unread_indicator.unread_bg;
    return colorScheme === 'dark' ? unreadBg.clr.dark : unreadBg.clr.light;
  }, [containerSettings, isRead, colorScheme]);
  const cardVariant = useMemo(() => variant ?? template.type ?? 'SmallImage', [variant, template.type]);
  const onDismiss = useCallback(() => {
    listener?.('onDismiss', template);

    // Track dismiss event using propositionItem
    template.track?.(MessagingEdgeEventType.DISMISS);
    setIsVisible(false);
  }, [listener, template]);
  const onPress = useCallback(() => {
    listener?.('onInteract', template);

    // Track interaction event using propositionItem
    template.track?.('content_clicked', MessagingEdgeEventType.INTERACT, null);

    // Mark as read (only if uncontrolled mode)
    if (isReadProp === undefined) {
      setInternalIsRead(true);
    }
    if (template.data?.content?.actionUrl) {
      try {
        Linking.openURL(template.data.content.actionUrl);
      } catch (error) {
        console.warn(`Failed to open URL: ${template.data.content.actionUrl}`, error);
      }
    }
  }, [template, listener, isReadProp]);
  const imageUri = useMemo(() => {
    if (colorScheme === 'dark' && template.data?.content?.image?.darkUrl) {
      return template.data.content.image.darkUrl;
    }
    return template.data.content.image?.url;
  }, [colorScheme, template.data?.content?.image?.darkUrl, template.data?.content?.image?.url]);
  const imageAspectRatio = useAspectRatio(imageUri);
  const styleOverrides = useMemo(() => {
    switch (cardVariant) {
      case 'SmallImage':
        return _styleOverrides?.smallImageStyle;
      case 'LargeImage':
        return _styleOverrides?.largeImageStyle;
      case 'ImageOnly':
        return _styleOverrides?.imageOnlyStyle;
      default:
        return null;
    }
  }, [_styleOverrides, cardVariant]);

  // Call listener on mount to signal view display (only once to prevent duplicates)
  useEffect(() => {
    if (!isDisplayedRef.current) {
      listener?.('onDisplay', template);
      // Track display event using propositionItem
      template.track?.(MessagingEdgeEventType.DISPLAY);
      isDisplayedRef.current = true;
    }
  }, [listener, template]);

  // All validation checks after ALL hooks are called
  if (!isVisible) {
    return null;
  }
  if (!template.data) return null;
  const content = template?.data?.content;
  if (!content) return null;
  return /*#__PURE__*/React.createElement(Pressable, _extends({
    onPress: onPress,
    style: state => [styles.card, styleOverrides?.card, typeof style === 'function' ? style(state) : style]
  }, props), /*#__PURE__*/React.createElement(View, _extends({
    style: [cardVariant === 'SmallImage' ? smallImageStyles.container : styles.container, styleOverrides?.container, unreadBackgroundColor && {
      backgroundColor: unreadBackgroundColor
    }]
  }, ContainerProps), imageUri && /*#__PURE__*/React.createElement(View, _extends({
    style: [cardVariant === 'SmallImage' ? smallImageStyles.imageContainer : styles.imageContainer, styleOverrides?.imageContainer]
  }, ImageContainerProps), /*#__PURE__*/React.createElement(Image, _extends({
    source: {
      uri: imageUri
    },
    style: [cardVariant === 'SmallImage' ? smallImageStyles.image : styles.image, {
      aspectRatio: imageAspectRatio
    }, styleOverrides?.image],
    resizeMode: "contain"
  }, ImageProps))), cardVariant !== 'ImageOnly' && /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.contentContainer, styleOverrides?.contentContainer]
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
  }, ButtonProps))))), content?.dismissBtn && content.dismissBtn?.style !== 'none' && /*#__PURE__*/React.createElement(DismissButton, _extends({
    onPress: onDismiss,
    type: content.dismissBtn.style
  }, DismissButtonProps)), containerSettings?.content?.isUnreadEnabled && !isRead && /*#__PURE__*/React.createElement(UnreadIcon, null)));
};
const styles = StyleSheet.create({
  card: {
    margin: 15,
    flex: 1
  },
  container: {
    flexDirection: 'column'
  },
  imageContainer: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f0f0f0'
  },
  image: {
    width: '100%',
    resizeMode: 'contain'
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'flex-start'
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginRight: 16
  },
  body: {
    fontSize: 14,
    lineHeight: 18
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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
    flexDirection: 'row',
    gap: 8,
    maxWidth: '100%',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row'
  },
  imageContainer: {
    borderRadius: 12,
    maxWidth: '35%',
    alignSelf: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    maxWidth: '100%'
  }
});

// const largeImageStyles = StyleSheet.create({
//   card: {
//     ...styles.card,
//     borderRadius: 12,
//     gap: 8
//   },
//   container: {
//     flexDirection: 'row'
//   },
//   imageContainer: {
//     alignItems: 'center',
//     borderRadius: 12,
//     backgroundColor: '#f0f0f0'
//   },
//   image: {
//     width: '100%',
//     resizeMode: 'contain'
//   },
//   contentContainer: styles.contentContainer,
//   textContent: styles.textContent,
//   title: styles.title,
//   body: styles.body,
//   buttonContainer: styles.buttonContainer,
//   button: styles.button
// });

// const imageOnlyStyles = StyleSheet.create({
//   card: styles.card,
//   imageContainer: {
//     backgroundColor: '#f0f0f0'
//   },
//   image: {
//     width: '100%',
//     resizeMode: 'contain'
//   }
// });
//# sourceMappingURL=ContentCardView.js.map