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
import React from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { LargeImageContentData } from '../../../models/ContentCard';
import Button from '../Button/Button';
import DismissButton from '../DismissButton/DismissButton';
import useAspectRatio from '../../hooks/useAspectRatio';
import { useTheme } from '../../theme/ThemeProvider';

export interface LargeImageContentStyle {
  card?: Partial<ViewStyle>;
  container?: Partial<ViewStyle>;
  imageContainer?: Partial<ViewStyle>;
  image?: Partial<ImageStyle>;
  contentContainer?: Partial<ViewStyle>;
  textContent?: Partial<ViewStyle>;
  title?: Partial<TextStyle>;
  body?: Partial<TextStyle>;
  buttonContainer?: Partial<ViewStyle>;
}

export interface LargeImageCardProps extends PressableProps {
  content: LargeImageContentData;
  imageUri?: string;
  styleOverrides?: LargeImageContentStyle;
  onDismiss?: () => void;
  onPress?: () => void;
}

const LargeImageCard: React.FC<LargeImageCardProps> = ({
  content,
  imageUri,
  styleOverrides,
  onDismiss,
  onPress,
  ...props
}) => {
  const theme = useTheme();
  const imageAspectRatio = useAspectRatio(imageUri);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, styleOverrides?.card]}
      {...props}
    >
      {imageUri && (
        <View style={[styles.imageContainer, styleOverrides?.imageContainer]}>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              { aspectRatio: imageAspectRatio },
              styleOverrides?.image
            ]}
          />
        </View>
      )}
      {content?.title?.content && (
        <Text
          style={[
            styles.title,
            { color: theme.colors.textPrimary },
            styleOverrides?.title
          ]}
        >
          {content.title.content}
        </Text>
      )}
      {content?.body?.content && (
        <Text
          style={[
            styles.body,
            { color: theme.colors.textPrimary },
            styleOverrides?.body
          ]}
        >
          {content.body.content}
        </Text>
      )}
      <View style={[styles.buttonContainer, styleOverrides?.buttonContainer]}>
        {content?.buttons?.length &&
          content?.buttons?.length > 0 &&
          content.buttons.map((button) => (
            <Button
              key={button.id}
              actionUrl={button.actionUrl}
              title={button.text.content}
              onPress={onPress}
            />
          ))}
      </View>
      {content?.dismissBtn && content.dismissBtn?.style !== 'none' && (
        <DismissButton onPress={onDismiss} type={content.dismissBtn.style} />
      )}
    </Pressable>
  );
};

export default LargeImageCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 15,
    flex: 1,
    gap: 8
  },
  container: {
    flexDirection: 'row'
  },
  imageContainer: {
    borderRadius: 12,
    alignItems: 'center'
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
    paddingTop: 8,
    gap: 8
  },
  button: {
    marginHorizontal: 8
  }
});
