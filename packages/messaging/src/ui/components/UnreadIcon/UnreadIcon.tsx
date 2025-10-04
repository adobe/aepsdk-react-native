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
import React, { useState, useMemo } from 'react';
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

export type SettingsPlacement = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface UnreadIconProps extends ViewProps {
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  source?: ImageProps['source'];
  darkSource?: ImageProps['source'];
  size?: number;
  position?: SettingsPlacement;
  type?: 'dot' | 'image';
}

const Dot = ({ size, backgroundColor }: { size: number; backgroundColor: string }) => (
  <View
    style={[
      styles.dot,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor
      }
    ]}
  />
);

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
}: UnreadIconProps) => {
  const colorScheme = useColorScheme();
  const settings = useContainerSettings();
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Get unread indicator settings from context
  const unreadSettings = settings.content.unread_indicator;
  
  // Use settings from context with fallbacks to props
  const displayPosition = unreadSettings?.unread_icon?.placement ?? position;
  const renderType = unreadSettings?.unread_icon?.image ? 'image' : type;
  const imageSource = unreadSettings?.unread_icon?.image?.url ? 
    { uri: unreadSettings.unread_icon.image.url } : source;
  const darkImageSource = unreadSettings?.unread_icon?.image?.darkUrl ? 
    { uri: unreadSettings.unread_icon.image.darkUrl } : darkSource;
  
  const getPositionStyle = () => {
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
  };

  // Use default contrasting colors for visibility
  // Note: unread_bg.clr is for the card background, not the dot
  const dotColor = useMemo(() => 
    colorScheme === 'dark' ? '#FF6B6B' : '#FF4444',
    [colorScheme]
  );

  const finalImageSource = useMemo(() => 
    colorScheme === 'dark' && darkImageSource ? darkImageSource : imageSource,
    [colorScheme, darkImageSource, imageSource]
  );

  const renderContent = () => {
    // Check if we should show dot instead of image based on URL availability
    const shouldShowDot = 
      (colorScheme === 'dark' && unreadSettings?.unread_icon?.image?.darkUrl === '') ||
      (colorScheme === 'light' && unreadSettings?.unread_icon?.image?.url === '');

    // If URL is explicitly empty string for current mode, show dot
    if (shouldShowDot && unreadSettings?.unread_icon?.image) {
      return <Dot size={size} backgroundColor={dotColor} />;
    }

    // If image failed to load, fallback to dot
    if (renderType === 'image' && imageLoadError) {
      return <Dot size={size} backgroundColor={dotColor} />;
    }

    if (renderType === 'image' && (imageSource || darkImageSource)) {
      return (
        <Image
          source={finalImageSource}
          style={[
            styles.image,
            { width: size, height: size },
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
    return <Dot size={size} backgroundColor={dotColor} />;
  };

  return (
    <View
      style={[
        styles.container,
        getPositionStyle(),
        { minWidth: size, minHeight: size },
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
    position: 'absolute',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionTopLeft: {
    top: 6,
    left: 6,
  },
  positionTopRight: {
    top: 6,
    right: 6,
  },
  positionBottomLeft: {
    bottom: 6,
    left: 6,
  },
  positionBottomRight: {
    bottom: 6,
    right: 6,
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
