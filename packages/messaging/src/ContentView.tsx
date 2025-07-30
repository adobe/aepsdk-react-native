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
import React, { useEffect, useCallback, useState } from "react";
import { ContentTemplate, TemplateType } from "./ContentProvider";
import {
  SmallImageContent,
  SmallImageContentStyle,
  LargeImageContent,
  LargeImageContentStyle,
  ImageOnlyContent,
  ImageOnlyContentStyle,
} from "@adobe/react-native-aepui";
import { ContentCardMappingManager } from "./ContentCardMappingManager";
import Messaging from "./Messaging";
import { ContentViewEvent } from "@adobe/react-native-aepui";

export interface ContentViewProps {
  data: ContentTemplate;
  cardHeight?: number;
  styleOverrides?: {
    smallImageStyle?: SmallImageContentStyle;
    largeImageStyle?: LargeImageContentStyle;
    imageOnlyStyle?: ImageOnlyContentStyle;
  };
  listener?: (event: ContentViewEvent, componentIdentifier?: string) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  data,
  cardHeight = 200,
  styleOverrides,
  listener,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const contentCardMapping =
    ContentCardMappingManager.getInstance().getContentCardMapping(data.id);

  // Create a default listener that always listens to all events and forwards to client listener if not null
  const defaultListener = useCallback(
    (event: ContentViewEvent, componentIdentifier?: string) => {
      // Handle dismiss event by hiding the content view
      if (event === "onDismiss") {
        setIsVisible(false);
      }

      if (event === "clickButton" && contentCardMapping) {
        console.log("trackContentCardInteraction", contentCardMapping);
        Messaging.trackContentCardInteraction(
          contentCardMapping.proposition,
          contentCardMapping.contentCard
        );
      }
      if (event === "onDisplay" && contentCardMapping) {
        console.log("trackContentCardDisplay", contentCardMapping);
        Messaging.trackContentCardDisplay(
          contentCardMapping.proposition,
          contentCardMapping.contentCard
        );
      }

      if (listener) {
        listener(event, componentIdentifier);
      }
    },
    [listener]
  );

  // Call listener on mount to signal view display
  useEffect(() => {
    defaultListener("onDisplay");
  }, [defaultListener]);

  // If not visible, return null to hide the entire view
  if (!isVisible) {
    return null;
  }

  switch (data.type) {
    case TemplateType.SMALL_IMAGE:
      if (!data.smallImageData) return null;
      return (
        <SmallImageContent
          data={data.smallImageData}
          height={cardHeight}
          styleOverrides={styleOverrides?.smallImageStyle}
          listener={defaultListener}
        />
      );
    case TemplateType.LARGE_IMAGE:
      if (!data.largeImageData) return null;
      return (
        <LargeImageContent
          data={data.largeImageData}
          styleOverrides={styleOverrides?.largeImageStyle}
          listener={defaultListener}
        />
      );
    case TemplateType.IMAGE_ONLY:
      if (!data.imageOnlyData) return null;
      return (
        <ImageOnlyContent
          data={data.imageOnlyData}
          styleOverrides={styleOverrides?.imageOnlyStyle}
          listener={defaultListener}
        />
      );
    default:
      return null;
  }
};
