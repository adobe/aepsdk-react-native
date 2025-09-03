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
  /** Applies to the container wrapping the image on the content card */
  imageContainer?: ViewStyle;
  /** Applies to the image on the content card */
  image?: ImageStyle;
  /** Applies to the text content and buttons wrapper on the content card */
  contentContainer?: ViewStyle;
  /** Applies to title and body properties, will be overridden by title and body styles */
  text?: TextStyle;
  /** Applies to the title on the content card */
  title?: TextStyle;
  /** Applies to the body on the content card */
  body?: TextStyle;
  /** Applies to the container wrapping the buttons on the content card */
  buttonContainer?: ViewStyle;
  /** Applies to the buttons on the content card */
  button?: PressableProps['style'];
  /** Applies to the text on the buttons on the content card */
  buttonText?: TextStyle;
  /** Applies to the dismiss button on the content card */
  dismissButton?: PressableProps['style'];
}

export interface SmallImageCardProps extends PressableProps {
  /** The content of the content card */
  content: SmallImageContentData;
  imageUri?: string;
  /** The style overrides for the content card */
  styleOverrides?: SmallImageContentStyle;
  /** The function to call when the dismiss button is pressed */
  onDismiss?: () => void;
  /** The function to call when the content card is pressed */
  onPress?: () => void;
  /** The props to pass to the container of the content card */
  ContainerProps?: ViewProps;
  /** The props to pass to the image container of the content card */
  ImageContainerProps?: ViewProps;
  /** The props to pass to the image of the content card */
  ImageProps?: ImageProps;
  /** The props to pass to the text of the content card */
  TextProps?: TextProps;
  /** The props to pass to the body of the content card */
  BodyProps?: TextProps;
  /** The props to pass to the title of the content card */
  TitleProps?: TextProps;
  /** The props to pass to the button container of the content card */
  ButtonContainerProps?: ViewProps;
  /** The props to pass to the buttons of the content card */
  ButtonProps?: ButtonProps;
  /** The props to pass to the dismiss button of the content card */
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
                  style={styleOverrides?.button}
                  textStyle={[styleOverrides?.text, styleOverrides?.buttonText]}
                  {...ButtonProps}
                  onPress={onPress}
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
