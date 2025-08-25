import { ContentCard } from "../../models/ContentCard";


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

// export type SmallImageContentTemplate = {
//   readonly type: TemplateType.SMALL_IMAGE;
//   readonly data: ContentCard;
// };

// export type LargeImageContentTemplate = {
//   readonly type: TemplateType.LARGE_IMAGE;
//   readonly data: ContentCard;
// };

// export type ImageOnlyContentTemplate = {
//   readonly type: TemplateType.IMAGE_ONLY;
//   readonly data: ContentCard;
// };

export type ContentTemplate = ContentCard & {
  readonly type: TemplateType;
}
  