/*
    Copyright 2024 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import { PersonalizationSchema } from './PersonalizationSchema';
import { PropositionItem, PropositionItemData } from './PropositionItem';

export type ContentCardTemplate = 'SmallImage' | 'LargeImage' | 'ImageOnly';
export type DismissButtonStyle = 'circle' | 'none' | 'simple';

export interface ContentCardButton {
  readonly interactId: string;
  readonly actionUrl?: string;
  readonly id?: string;
  readonly text: {
    readonly content: string;
  };
}

export interface ContentCardContent {
  readonly image?: {
    readonly alt?: string;
    readonly url: string;
    readonly darkUrl?: string;
  };
  readonly buttons?: readonly ContentCardButton[];
  readonly dismissBtn?: {
    readonly style: DismissButtonStyle;
  };
  readonly actionUrl?: string;
  readonly body?: {
    readonly content: string;
  };
  readonly title: {
    readonly content: string;
  };
}

export type ImageOnlyContent = Pick<
  ContentCardContent,
  'image' | 'dismissBtn' | 'actionUrl'
>;

export type LargeImageContentData = ContentCardContent;

export type SmallImageContentData = ContentCardContent;

export interface ContentCardMeta {
  [key: string]: any;
  adobe: { template: ContentCardTemplate };
  surface?: string;
}

export interface ContentCardData extends PropositionItemData {
  id: string;
  schema: PersonalizationSchema.CONTENT_CARD;
  data: {
    contentType: 'application/json';
    expiryDate: number;
    publishedDate: number;
    meta: ContentCardMeta;
    content: SmallImageContentData | LargeImageContentData | ImageOnlyContent;
  };
}
export class ContentCard extends PropositionItem {
  declare data: ContentCardData['data'];

  constructor(contentCardData: ContentCardData) {
    super(contentCardData);
    this.data = contentCardData.data;
  }
}
