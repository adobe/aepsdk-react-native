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
import { convertSmallImageContentToComponent } from "./convertSmallImageContent";
import { ContentView } from "./common/ContentView";
import {
  SmallImageContentData,
  SmallImageContentStyle,
} from "./SmallImageTypes";
import { ContentViewEvent } from "./common/ContentViewEvent";

export interface SmallImageContentProps {
  data: SmallImageContentData;
  height?: number;
  styleOverrides?: SmallImageContentStyle;
  listener?: (eventName: ContentViewEvent, interactId?: string) => void;
}

/**
 * Renders a small image card component.
 *
 * @param props - an object of type [SmallImageContentProps], which contains the properties for the small image card component.
 * @returns The rendered small image card component.
 */
export const SmallImageContent: React.FC<SmallImageContentProps> = (
  props: SmallImageContentProps
) => {
  const { data, height, styleOverrides, listener } = props;
  const component = convertSmallImageContentToComponent(
    data,
    styleOverrides,
    height
  );
  return <ContentView component={component} onEvent={listener} />;
};
