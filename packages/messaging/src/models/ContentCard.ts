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

type ContentCardTemplate = 'SmallImage';
type DismissButtonStyle = 'circle' | 'none' | 'simple';

export interface ContentCardData extends PropositionItemData {
  id: string;
  data: {
    contentType: 'application/json';
    expiryDate: number;
    publishedDate: number;
    content: {
      actionUrl: string;

      body: { content: string };
      title: { content: string };
      buttons: Array<{
        actionUrl: string;
        id: string;
        text: { content: string };
        interactId: string;
      }>;
      image: { alt: string; url: string };
      dismissBtn: { style: DismissButtonStyle };
    };
    meta: {
      [key: string]: any;
      adobe: { template: ContentCardTemplate };
      dismissState: boolean;
      readState: boolean;
      surface: string;
    };
  };
  schema: PersonalizationSchema.CONTENT_CARD;
}

export class ContentCard extends PropositionItem {
  declare data: ContentCardData['data']; // Override data type for better typing

  constructor(contentCardData: ContentCardData) {
    super(contentCardData);
    this.data = contentCardData.data;
  }

}
