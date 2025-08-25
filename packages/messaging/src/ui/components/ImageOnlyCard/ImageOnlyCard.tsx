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
import React, { useMemo } from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle
} from 'react-native';
import DismissButton from '../DismissButton/DismissButton';
import { ImageOnlyContentData } from '../../../models/ContentCard';

export interface ImageOnlyContentProps {
  data: ImageOnlyContentData;
  height?: number;
  styleOverrides?: ImageOnlyContentStyle;
  onDismiss?: () => void;
  onPress?: () => void;
}

export interface ImageOnlyContentStyle {
  card?: Partial<ViewStyle>;
  container?: Partial<ViewStyle>;
  imageContainer?: Partial<ViewStyle>;
  image?: Partial<ImageStyle>;
}

/**
 * Renders an image only card component.
 *
 * @param props - an object of type [ImageOnlyContentProps], which contains the properties for the image only card component.
 * @returns The rendered image only card component.
 */
const ImageOnlyCard: React.FC<ImageOnlyContentProps> = ({
  data,
  onDismiss,
  onPress,
  styleOverrides
}) => {
  const colorScheme = useColorScheme();
  console.log('imageonlycard', data);

  const imageSource = useMemo(() => {
    if (colorScheme === 'dark' && data?.image?.darkUrl) {
      return { uri: data.image.darkUrl };
    }
    return { uri: data.image?.url };
  }, [colorScheme, data.image?.darkUrl, data.image?.url]);

  return (
    <Pressable onPress={onPress} style={styleOverrides?.container}>
      <View style={[styles.imageContainer, styleOverrides?.imageContainer]}>
        <Image
          source={imageSource}
          style={[styles.image, styleOverrides?.image]}
        />
        {data.dismissBtn?.style && data.dismissBtn.style !== 'none' && (
          <DismissButton onPress={onDismiss} type={data.dismissBtn.style} />
        )}
      </View>
    </Pressable>
  );
};

export default ImageOnlyCard;

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    margin: 15,
    position: 'relative',
    flex: 1
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
});
