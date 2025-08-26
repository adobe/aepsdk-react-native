import { ContentCard } from '../../models/ContentCard';

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

export type ContentTemplate = ContentCard & {
  readonly type: TemplateType;
};
