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

import { ScopeDetails } from './ScopeDetails';
import { PersonalizationSchema } from './PersonalizationSchema';
import { ContentCard } from './ContentCard';
import { HTMLProposition } from './HTMLProposition';
import { JSONPropositionItem } from './JSONProposition';
import { PropositionItem } from './PropositionItem';

export class MessageProposition {
  id: string;
  scope: string;
  scopeDetails: ScopeDetails;
  items: PropositionItem[];

  constructor(raw: { id: string; scope: string; scopeDetails: ScopeDetails; items?: any[] }) {
    this.id = raw?.id ?? '';
    this.scope = raw?.scope ?? '';
    this.scopeDetails = (raw?.scopeDetails as ScopeDetails) ?? ({} as ScopeDetails);

    // Mirror activity.id into activity.activityID for convenience
    const activityIdFromScope = this.scopeDetails?.activity?.id ?? '';
    if (this.scopeDetails?.activity) {
      (this.scopeDetails.activity as any).activityID = activityIdFromScope;
    }

    const rawItems = Array.isArray(raw?.items) ? raw.items : [];
    this.items = rawItems.map((itemData: any) => {
      const activityId = this.scopeDetails?.activity?.id ?? '';
      let instance: any;
      switch (itemData?.schema) {
        case PersonalizationSchema.CONTENT_CARD:
          instance = new ContentCard(itemData as any);
          (instance as any).activityID = activityId;
          return instance;
        case PersonalizationSchema.HTML_CONTENT:
          instance = new HTMLProposition(itemData as any);
          (instance as any).activityID = activityId;
          return instance;
        case PersonalizationSchema.JSON_CONTENT:
          instance = new JSONPropositionItem(itemData as any);
          (instance as any).activityID = activityId;
          return instance;
        default:
          instance = new PropositionItem(itemData as any);
          (instance as any).activityID = activityId;
          return instance;
      }
    });
  }
}

export { MessageProposition as MessagingProposition };
