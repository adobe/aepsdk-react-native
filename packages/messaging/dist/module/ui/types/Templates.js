"use strict";

import { ContentCard } from "../../models/ContentCard.js";
export class ContentTemplate extends ContentCard {
  constructor(data, type, isRead = false) {
    super(data, isRead);
    this.type = type;
  }
}

/** Overrides for the structural pieces of the content card */

/** The base style overrides available for content cards */
//# sourceMappingURL=Templates.js.map