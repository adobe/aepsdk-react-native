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

import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo
} from 'react';
import {
  ComponentOverrideProps,
  ContentTemplate,
  ImageOnlyContentStyle,
  LargeImageContentStyle,
  SmallImageContentStyle
} from '../../types/Templates';
import { ContentViewEvent } from '../../types/ContentViewEvent';
import {
  Image,
  Linking,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import MessagingEdgeEventType from '../../../models/MessagingEdgeEventType';
import DismissButton from '../DismissButton/DismissButton';
import UnreadIcon from '../UnreadIcon/UnreadIcon';
import { useTheme } from '../../theme';
import useAspectRatio from '../../hooks/useAspectRatio';
import { ContentCardTemplate } from '../../../models';
import Button from '../Button/Button';
import { useContext } from 'react';
import { ContentCardContainerContext } from '../../providers/ContentCardContainerProvider';

export type ContentCardEventListener = (
  event: ContentViewEvent,
  data?: ContentTemplate,
  nativeEvent?: any
) => void;

export interface ContentViewProps
  extends PressableProps,
    ComponentOverrideProps {
  template: ContentTemplate;
  styleOverrides?: {
    smallImageStyle?: SmallImageContentStyle;
    largeImageStyle?: LargeImageContentStyle;
    imageOnlyStyle?: ImageOnlyContentStyle;
  };
  listener?: ContentCardEventListener;
  variant?: ContentCardTemplate;
}

export const ContentCardView: React.FC<ContentViewProps> = ({
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
  const [isRead, setIsRead] = useState(false);
  const isDisplayedRef = useRef(false);
  const theme = useTheme();
  const containerSettings = useContext(ContentCardContainerContext);

  // Get unread background color based on theme
  const getUnreadBackgroundColor = () => {
    if (!containerSettings?.content?.isUnreadEnabled || isRead || !containerSettings.content.unread_indicator?.unread_bg) {
      return undefined;
    }
    
    const unreadBg = containerSettings.content.unread_indicator.unread_bg;
    return colorScheme === 'dark' ? unreadBg.clr.dark : unreadBg.clr.light;
  };

  const cardVariant = useMemo<ContentCardTemplate>(
    () => variant ?? template.type ?? 'SmallImage',
    [variant, template.type]
  );

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

    // Mark as read when interacted with
    setIsRead(true);

    if (template.data?.content?.actionUrl) {
      try {
        Linking.openURL(template.data.content.actionUrl);
      } catch (error) {
        console.warn(
          `Failed to open URL: ${template.data.content.actionUrl}`,
          error
        );
      }
    }
  }, [template]);

  const imageUri = useMemo(() => {
    if (colorScheme === 'dark' && template.data?.content?.image?.darkUrl) {
      return template.data.content.image.darkUrl;
    }
    return template.data.content.image?.url;
  }, [
    colorScheme,
    template.data?.content?.image?.darkUrl,
    template.data?.content?.image?.url
  ]);

  const imageAspectRatio = useAspectRatio(imageUri);

  const styleOverrides = useMemo<
    | (SmallImageContentStyle & LargeImageContentStyle & ImageOnlyContentStyle)
    | null
  >(() => {
    switch (cardVariant) {
      case 'SmallImage':
        return _styleOverrides?.smallImageStyle as SmallImageContentStyle;
      case 'LargeImage':
        return _styleOverrides?.largeImageStyle as LargeImageContentStyle;
      case 'ImageOnly':
        return _styleOverrides?.imageOnlyStyle as ImageOnlyContentStyle;
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

  const content = template?.data?.content as any;

  if (!content) return null;

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
        style={[
          cardVariant === 'SmallImage'
            ? smallImageStyles.container
            : styles.container,
          styleOverrides?.container,
          getUnreadBackgroundColor() && { backgroundColor: getUnreadBackgroundColor() }
        ]}
        {...ContainerProps}
      >
        {imageUri && (
          <View
            style={[
              cardVariant === 'SmallImage'
                ? smallImageStyles.imageContainer
                : styles.imageContainer,
              styleOverrides?.imageContainer
            ]}
            {...ImageContainerProps}
          >
            <Image
              source={{ uri: imageUri }}
              style={[
                cardVariant === 'SmallImage'
                  ? smallImageStyles.image
                  : styles.image,
                { aspectRatio: imageAspectRatio },
                styleOverrides?.image
              ]}
              resizeMode="contain"
              {...ImageProps}
            />
          </View>
        )}
        {cardVariant !== 'ImageOnly' && (
          <View
            style={[styles.contentContainer, styleOverrides?.contentContainer]}
            {...ContentContainerProps}
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
                    textStyle={[
                      styleOverrides?.text,
                      styleOverrides?.buttonText
                    ]}
                    {...ButtonProps}
                  />
                ))}
            </View>
          </View>
        )}
        {content?.dismissBtn && content.dismissBtn?.style !== 'none' && (
          <DismissButton
            onPress={onDismiss}
            type={content.dismissBtn.style}
            {...DismissButtonProps}
          />
        )}
        {containerSettings?.content?.isUnreadEnabled && !isRead && (() => {
          const iconConfig = containerSettings.content.unread_indicator?.unread_icon;
          const hasImageUrl = iconConfig?.image?.url;
          const hasDarkUrl = iconConfig?.image?.darkUrl;
          
          // Determine icon type based on current color scheme
          const relevantUrl = colorScheme === 'dark' ? hasDarkUrl : hasImageUrl;
          const iconType = relevantUrl ? "image" : "dot";
          
          console.log('ContentCardView UnreadIcon debug:', {
            isUnreadEnabled: containerSettings?.content?.isUnreadEnabled,
            isRead,
            hasImageUrl: !!hasImageUrl,
            hasDarkUrl: !!hasDarkUrl,
            colorScheme,
            relevantUrl: !!relevantUrl,
            iconType,
            placement: iconConfig?.placement
          });
          
          return (
            <UnreadIcon
              type={iconType}
            position={
              containerSettings.content.unread_indicator?.unread_icon?.placement === 'topleft' ? 'top-left' :
              containerSettings.content.unread_indicator?.unread_icon?.placement === 'topright' ? 'top-right' :
              containerSettings.content.unread_indicator?.unread_icon?.placement === 'bottomleft' ? 'bottom-left' :
              containerSettings.content.unread_indicator?.unread_icon?.placement === 'bottomright' ? 'bottom-right' :
              'top-right'
            }
            source={containerSettings.content.unread_indicator?.unread_icon?.image?.url ? 
              { uri: containerSettings.content.unread_indicator.unread_icon.image.url } : undefined}
            darkSource={containerSettings.content.unread_indicator?.unread_icon?.image?.darkUrl ? 
              { uri: containerSettings.content.unread_indicator.unread_icon.image.darkUrl } : undefined}
            size={20}
          />
          );
        })()}
      </View>
    </Pressable>
  );
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
