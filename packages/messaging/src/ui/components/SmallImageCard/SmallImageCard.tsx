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
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle
} from 'react-native';
import Button, { ButtonProps } from '../Button/Button';
import { SmallImageContentData } from '../../../models/ContentCard';
import DismissButton, {
  DismissButtonProps
} from '../DismissButton/DismissButton';
import { useTheme } from '../../theme/ThemeProvider';
import useAspectRatio from '../../hooks/useAspectRatio';

export interface SmallImageContentStyle {
  /** Applies to the root of the content card */
  card?: ViewStyle;
  /** Applies to the container inside the content card, applied inside the card Pressable */
  container?: ViewStyle;

  imageContainer?: ViewStyle;
  image?: ImageStyle;
  contentContainer?: ViewStyle;
  /** Applies to title and body properties, will be overridden by title and body styles */
  text?: TextStyle;
  title?: TextStyle;
  body?: TextStyle;
  buttonContainer?: ViewStyle;
  button?: PressableProps['style'];
  buttonText?: TextStyle;
  dismissButton?: PressableProps['style'];
}

export interface SmallImageCardProps extends PressableProps {
  content: SmallImageContentData;
  imageUri?: string;
  height?: number;
  styleOverrides?: SmallImageContentStyle;
  onDismiss?: () => void;
  onPress?: () => void;
  ContainerProps?: ViewProps;
  ImageContainerProps?: ViewProps;
  ImageProps?: ImageProps;
  TextProps?: TextProps;
  BodyProps?: TextProps;
  TitleProps?: TextProps;
  ButtonContainerProps?: ViewProps;
  ButtonProps?: ButtonProps;
  DismissButtonProps?: DismissButtonProps;
}

const SmallImageCard: React.FC<SmallImageCardProps> = ({
  BodyProps,
  ButtonContainerProps,
  ButtonProps,
  ContainerProps,
  DismissButtonProps,
  ImageContainerProps,
  ImageProps,
  TextProps,
  TitleProps,
  content,
  height,
  imageUri,
  styleOverrides,
  style,
  onDismiss,
  onPress,
  ...props
}) => {
  const theme = useTheme();
  const imageAspectRatio = useAspectRatio(imageUri);

  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.card,
        styleOverrides?.card,
        typeof style === 'function' ? style(state) : style
      ]}
      {...props}
    >
      <View
        style={[styles.container, styleOverrides?.container]}
        {...ContainerProps}
      >
        {imageUri && (
          <View
            style={[styles.imageContainer, styleOverrides?.imageContainer]}
            {...ImageContainerProps}
          >
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                { aspectRatio: imageAspectRatio },
                styleOverrides?.image
              ]}
              {...ImageProps}
            />
          </View>
        )}

        <View
          style={[styles.contentContainer, styleOverrides?.contentContainer]}
        >
          {content?.title?.content && (
            <Text
              style={[
                styles.title,
                { color: theme.colors.textPrimary },
                styleOverrides?.text,
                styleOverrides?.title
              ]}
              {...TextProps}
              {...TitleProps}
            >
              {content.title.content}
            </Text>
          )}
          {content?.body?.content && (
            <Text
              {...BodyProps}
              style={[
                styles.body,
                { color: theme.colors.textPrimary },
                styleOverrides?.text,
                styleOverrides?.body
              ]}
              {...TextProps}
              {...BodyProps}
            >
              {content.body.content}
            </Text>
          )}
          <View
            {...ButtonContainerProps}
            style={[styles.buttonContainer, styleOverrides?.buttonContainer]}
            {...ButtonContainerProps}
          >
            {content?.buttons?.length &&
              content?.buttons?.length > 0 &&
              content.buttons.map((button) => (
                <Button
                  key={button.id}
                  actionUrl={button.actionUrl}
                  title={button.text.content}
                  onPress={onPress}
                  style={styleOverrides?.button}
                  textStyle={[styleOverrides?.text, styleOverrides?.buttonText]}
                  {...ButtonProps}
                />
              ))}
          </View>
          {content?.dismissBtn && content.dismissBtn?.style !== 'none' && (
            <DismissButton
              onPress={onDismiss}
              type={content.dismissBtn.style}
              {...DismissButtonProps}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default SmallImageCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 15,
    maxWidth: '100%'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  imageContainer: {
    borderRadius: 12,
    height: '100%',
    flex: 1 / 3,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    resizeMode: 'contain'
  },
  contentContainer: {
    flex: 2 / 3,
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
