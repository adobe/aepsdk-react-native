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
import { convertLargeImageContentToComponent } from "./convertLargeImageContent";
import { ContentView } from "./common/ContentView";
import {
  LargeImageContentData,
  LargeImageContentStyle,
} from "./LargeImageTypes";
import { ContentViewEvent } from "./common/ContentViewEvent";

export interface LargeImageContentProps {
  data: LargeImageContentData;
  styleOverrides?: LargeImageContentStyle;
  listener?: (eventName: ContentViewEvent, interactId?: string) => void;
}

/**
 * Renders a large image card component.
 *
 * @param props - an object of type [LargeImageContentProps], which contains the properties for the large image card component.
 * @returns The rendered large image card component.
 */
export const LargeImageContent: React.FC<LargeImageContentProps> = (
  props: LargeImageContentProps
) => {
  const { data, styleOverrides, listener } = props;
  const component = convertLargeImageContentToComponent(data, styleOverrides);
  return <ContentView component={component} onEvent={listener} />;
};
