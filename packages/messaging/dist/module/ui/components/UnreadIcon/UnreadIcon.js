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
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import useInboxSettings from "../../hooks/useInboxSettings.js";
import { useTheme } from "../../theme/index.js";
const Dot = ({
  size,
  backgroundColor
}) => /*#__PURE__*/React.createElement(View, {
  style: [styles.dot, {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor
  }]
});
const UnreadIcon = ({
  imageStyle,
  containerStyle,
  source,
  darkSource,
  size = 20,
  position = 'topright',
  type = 'dot',
  style,
  ...props
}) => {
  const {
    colors,
    isDark
  } = useTheme();
  const settings = useInboxSettings();
  const [imageLoadError, setImageLoadError] = useState(false);

  // Get unread indicator settings from context
  const unreadSettings = settings?.content.unread_indicator;

  // Use settings from context with fallbacks to props
  const displayPosition = unreadSettings?.unread_icon?.placement ?? position;
  const imageSource = unreadSettings?.unread_icon?.image?.url ? {
    uri: unreadSettings.unread_icon.image.url
  } : source;
  const darkImageSource = unreadSettings?.unread_icon?.image?.darkUrl ? {
    uri: unreadSettings.unread_icon.image.darkUrl
  } : darkSource;

  // Determine if we should render as image type (only if we have valid URLs)
  const hasImageUrl = Boolean(unreadSettings?.unread_icon?.image?.url || unreadSettings?.unread_icon?.image?.darkUrl || imageSource || darkImageSource);
  const renderType = hasImageUrl ? 'image' : type;

  // Reset error state when image source changes
  useEffect(() => {
    setImageLoadError(false);
  }, [imageSource, darkImageSource]);
  const positionStyle = useMemo(() => {
    switch (displayPosition) {
      case 'topleft':
        return styles.positionTopLeft;
      case 'topright':
        return styles.positionTopRight;
      case 'bottomleft':
        return styles.positionBottomLeft;
      case 'bottomright':
        return styles.positionBottomRight;
      default:
        return styles.positionTopRight;
    }
  }, [displayPosition]);
  const finalImageSource = useMemo(() => isDark && darkImageSource ? darkImageSource : imageSource, [isDark, darkImageSource, imageSource]);
  const content = useMemo(() => {
    // Check if we should show dot instead of image based on URL availability
    const isEmptyUrlForCurrentMode = () => {
      const imageSettings = unreadSettings?.unread_icon?.image;
      if (!imageSettings) return false;
      if (isDark) {
        // In dark mode, show dot if darkUrl is empty string or if both darkUrl doesn't exist and url is empty
        return imageSettings.darkUrl === '' || !imageSettings.darkUrl && imageSettings.url === '';
      }

      // In light mode, show dot if url is empty string
      return imageSettings.url === '';
    };

    // If URL is explicitly empty string for current mode, show dot
    if (isEmptyUrlForCurrentMode()) {
      return /*#__PURE__*/React.createElement(Dot, {
        size: size,
        backgroundColor: colors.dotColor
      });
    }

    // If image failed to load, fallback to dot
    if (renderType === 'image' && imageLoadError) {
      return /*#__PURE__*/React.createElement(Dot, {
        size: size,
        backgroundColor: colors.dotColor
      });
    }
    if (renderType === 'image' && (imageSource || darkImageSource)) {
      return /*#__PURE__*/React.createElement(Image, {
        source: finalImageSource,
        style: [styles.image, {
          width: size,
          height: size
        }, imageStyle],
        resizeMode: "contain",
        onError: error => {
          console.warn('Failed to load unread icon image:', error.nativeEvent.error);
          setImageLoadError(true);
        }
      });
    }

    // Default dot type
    return /*#__PURE__*/React.createElement(Dot, {
      size: size,
      backgroundColor: colors.dotColor
    });
  }, [isDark, unreadSettings?.unread_icon?.image, size, colors.dotColor, renderType, imageLoadError, imageSource, darkImageSource, finalImageSource, imageStyle]);
  return /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.container, positionStyle, {
      minWidth: size,
      minHeight: size
    }, containerStyle, style]
  }, props), content);
};
export default UnreadIcon;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  positionTopLeft: {
    top: 6,
    left: 6
  },
  positionTopRight: {
    top: 6,
    right: 6
  },
  positionBottomLeft: {
    bottom: 6,
    left: 6
  },
  positionBottomRight: {
    bottom: 6,
    right: 6
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  image: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
});
//# sourceMappingURL=UnreadIcon.js.map