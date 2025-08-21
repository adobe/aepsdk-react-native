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
import React from "react";
import { convertImageOnlyContentToComponent } from "./convertImageOnlyContent";
import { ContentView } from "./common/ContentView";
import { ImageOnlyContentData, ImageOnlyContentStyle } from "./ImageOnlyTypes";
import { ContentViewEvent } from "./common/ContentViewEvent";

export interface ImageOnlyContentProps {
  data: ImageOnlyContentData;
  height?: number;
  styleOverrides?: ImageOnlyContentStyle;
  listener?: (eventName: ContentViewEvent, interactId?: string) => void;
}

/**
 * Renders an image only card component.
 *
 * @param props - an object of type [ImageOnlyContentProps], which contains the properties for the image only card component.
 * @returns The rendered image only card component.
 */
export const ImageOnlyContent: React.FC<ImageOnlyContentProps> = (
  props: ImageOnlyContentProps
) => {
  const { data, height, styleOverrides, listener } = props;
  const component = convertImageOnlyContentToComponent(data, height, styleOverrides);
  return <ContentView component={component} onEvent={listener} />;
};
