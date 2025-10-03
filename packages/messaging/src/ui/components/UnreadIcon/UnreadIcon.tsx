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
import React, { useState } from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  useColorScheme
} from 'react-native';
import useContainerSettings from '../../hooks/useContainerSettings';

export interface UnreadIconProps extends ViewProps {
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  source?: ImageProps['source'];
  darkSource?: ImageProps['source'];
  size?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type?: 'dot' | 'image';
}

// Helper function to convert placement from settings to component position
const convertPlacement = (placement: 'topleft' | 'topright' | 'bottomleft' | 'bottomright'): 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' => {
  switch (placement) {
    case 'topleft':
      return 'top-left';
    case 'topright':
      return 'top-right';
    case 'bottomleft':
      return 'bottom-left';
    case 'bottomright':
      return 'bottom-right';
    default:
      return 'top-right';
  }
};

const UnreadIcon = ({
  imageStyle,
  containerStyle,
  source,
  darkSource,
  size = 20,
  position = 'top-right',
  type = 'dot',
  style,
  ...props
}: UnreadIconProps) => {
  const colorScheme = useColorScheme();
  const settings = useContainerSettings();
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Get unread indicator settings from context
  const unreadSettings = settings.content.unread_indicator;
  
  // Use settings from context with fallbacks to props
  const displaySize = size;
  const displayPosition = unreadSettings?.unread_icon?.placement ? 
    convertPlacement(unreadSettings.unread_icon.placement) : position;
  const renderType = unreadSettings?.unread_icon?.image ? 'image' : type;
  const imageSource = unreadSettings?.unread_icon?.image?.url ? 
    { uri: unreadSettings.unread_icon.image.url } : source;
  const darkImageSource = unreadSettings?.unread_icon?.image?.darkUrl ? 
    { uri: unreadSettings.unread_icon.image.darkUrl } : darkSource;
  
  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (displayPosition) {
      case 'top-left':
        return { ...baseStyle, top: 6, left: 6 };
      case 'top-right':
        return { ...baseStyle, top: 6, right: 6 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 6, left: 6 };
      case 'bottom-right':
        return { ...baseStyle, bottom: 6, right: 6 };
      default:
        return { ...baseStyle, top: 6, right: 6 };
    }
  };

  const getDotColor = () => {
    // Use default contrasting colors for visibility
    // Note: unread_bg.clr is for the card background, not the dot
    return colorScheme === 'dark' ? '#FF6B6B' : '#FF4444';
  };

  const renderContent = () => {
    // Check if we should show dot instead of image based on URL availability
    const shouldShowDot = 
      (colorScheme === 'dark' && unreadSettings?.unread_icon?.image?.darkUrl === '') ||
      (colorScheme === 'light' && unreadSettings?.unread_icon?.image?.url === '');

    // If URL is explicitly empty string for current mode, show dot
    if (shouldShowDot && unreadSettings?.unread_icon?.image) {
      return (
        <View
          style={[
            styles.dot,
            {
              width: displaySize,
              height: displaySize,
              borderRadius: displaySize / 2,
              backgroundColor: getDotColor()
            }
          ]}
        />
      );
    }

    // If image failed to load, fallback to dot
    if (renderType === 'image' && imageLoadError) {
      return (
        <View
          style={[
            styles.dot,
            {
              width: displaySize,
              height: displaySize,
              borderRadius: displaySize / 2,
              backgroundColor: getDotColor()
            }
          ]}
        />
      );
    }

    if (renderType === 'image' && (imageSource || darkImageSource)) {
      const finalImageSource = colorScheme === 'dark' && darkImageSource ? darkImageSource : imageSource;
      return (
        <Image
          source={finalImageSource}
          style={[
            styles.image,
            { width: displaySize, height: displaySize },
            imageStyle
          ]}
          resizeMode="contain"
          onError={(error) => {
            console.warn('Failed to load unread icon image:', error.nativeEvent.error);
            setImageLoadError(true);
          }}
        />
      );
    }

    // Default dot type
    return (
      <View
        style={[
          styles.dot,
          {
            width: displaySize,
            height: displaySize,
            borderRadius: displaySize / 2,
            backgroundColor: getDotColor()
          }
        ]}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        getPositionStyle(),
        { minWidth: displaySize, minHeight: displaySize },
        containerStyle,
        typeof style === 'object' ? style : undefined
      ]}
      {...props}
    >
      {renderContent()}
    </View>
  );
};

export default UnreadIcon;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }
});
