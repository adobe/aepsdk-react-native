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

export interface UnreadIconProps extends ViewProps {
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  source?: ImageProps['source'];
  darkSource?: ImageProps['source'];
  size?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type?: 'dot' | 'image';
}

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
  
  // Debug logging
  console.log('UnreadIcon rendering:', {
    type,
    position,
    size,
    colorScheme,
    hasSource: !!source,
    hasDarkSource: !!darkSource
  });

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
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
    return colorScheme === 'dark' ? '#FF6B6B' : '#FF4444';
  };

  const renderContent = () => {
    if (type === 'image' && (source || darkSource)) {
      const imageSource = colorScheme === 'dark' && darkSource ? darkSource : source;
      return (
        <Image
          source={imageSource}
          style={[
            styles.image,
            { width: size, height: size },
            imageStyle
          ]}
          resizeMode="contain"
        />
      );
    }

    // Default dot type
    return (
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
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
