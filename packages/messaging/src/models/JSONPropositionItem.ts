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

export interface JSONPropositionItemData extends PropositionItemData {
  id: string;
  data: {
    content: string;
  };
  schema: PersonalizationSchema.JSON_CONTENT;
}

export class JSONPropositionItem extends PropositionItem {
  declare data: JSONPropositionItemData['data']; // Override data type for better typing

  constructor(jsonPropositionItemData: JSONPropositionItemData) {
    super(jsonPropositionItemData);
    this.data = jsonPropositionItemData.data;
  }

  /**
   * Gets the JSON content string of this proposition item.
   * 
   * @returns {string} The JSON content
   */
  getContent(): string {
    return this.data.content;
  }

  /**
   * Attempts to parse the content as JSON.
   * 
   * @returns {object | null} Parsed JSON object or null if parsing fails
   */
  getParsedContent(): object | null {
    try {
      return JSON.parse(this.data.content);
    } catch (error) {
      return null;
    }
  }
}
