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
  // useMemo
} from 'react';
import {
  SmallImageContentStyle,
  LargeImageContentStyle,
  ImageOnlyContentStyle
} from '..';
import { ContentTemplate, TemplateType } from '../../types/Templates';
import { ContentViewEvent } from '../../types/ContentViewEvent';
import { Linking, PressableProps, useColorScheme } from 'react-native';
import SmallImageCard from '../SmallImageCard/SmallImageCard';
import ImageOnlyCard from '../ImageOnlyCard/ImageOnlyCard';
import LargeImageCard from '../LargeImageCard/LargeImageCard';
import {
  LargeImageContentData,
  SmallImageContentData
} from '../../../models/ContentCard';

export type ContentCardEventListener = (
  event: ContentViewEvent,
  data?: ContentTemplate,
  nativeEvent?: any
) => void;

export interface ContentViewProps extends PressableProps {
  template: ContentTemplate;
  styleOverrides?: {
    smallImageStyle?: SmallImageContentStyle;
    largeImageStyle?: LargeImageContentStyle;
    imageOnlyStyle?: ImageOnlyContentStyle;
  };
  listener?: ContentCardEventListener;
}

export const ContentView: React.FC<ContentViewProps> = ({
  template,
  styleOverrides,
  listener
}) => {
  const colorScheme = useColorScheme();
  const [isVisible, setIsVisible] = useState(true);
  // Track if onDisplay was already called to prevent duplicates
  const displayedRef = useRef(false);

  const onDismiss = useCallback(() => {
    listener?.('onDismiss', template);
    setIsVisible(false);
  }, [listener]);

  const onPress = useCallback(() => {
    listener?.('onInteract', template);
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
  }, [template.data?.content?.actionUrl]);

  // Call listener on mount to signal view display (only once to prevent duplicates)
  useEffect(() => {
    if (!displayedRef.current) {
      listener?.('onDisplay', template);
      displayedRef.current = true;
    }
  }, [listener]);

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

  // If not visible, return null to hide the entire view
  if (!isVisible) {
    return null;
  }

  if (!template.data) return null;

  switch (template.type) {
    case TemplateType.SMALL_IMAGE:
      return (
        <SmallImageCard
          content={template.data.content as SmallImageContentData}
          imageUri={imageUri}
          onPress={onPress}
          onDismiss={onDismiss}
          styleOverrides={styleOverrides?.smallImageStyle}
        />
      );
    case TemplateType.LARGE_IMAGE:
      return (
        <LargeImageCard
          content={template.data.content as LargeImageContentData}
          imageUri={imageUri}
          onDismiss={onDismiss}
          onPress={onPress}
          styleOverrides={styleOverrides?.largeImageStyle}
        />
      );
    case TemplateType.IMAGE_ONLY:
      return (
        <ImageOnlyCard
          content={template.data.content}  
          imageUri={imageUri}
          onDismiss={onDismiss}
          onPress={onPress}
          styleOverrides={styleOverrides?.imageOnlyStyle}
        />
      );
    default:
      console.error('Unknown template type:', template.type);
      return null;
  }
};
