import { ContentCard, ContentCardData } from '../../models/ContentCard';

/** Represents template types for Content Card templates. */
export enum TemplateType {
  /** Represents a small image template type. */
  SMALL_IMAGE = 'SmallImage',
  /** Represents a large image template type. */
  LARGE_IMAGE = 'LargeImage',
  /** Represents a image only template type. */
  IMAGE_ONLY = 'ImageOnly'
}

export type BaseContentTemplate = {
  readonly id: string;
};

export type TemplateTypeLiteral = `${TemplateType}`

export class ContentTemplate extends ContentCard {
  readonly type: string;

  constructor(data: ContentCardData, type: TemplateType) {
    super(data);
    this.type = type;
  }
};
