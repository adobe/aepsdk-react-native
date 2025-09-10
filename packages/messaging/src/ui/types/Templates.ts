import { ButtonProps, ImageProps, TextProps } from 'react-native';
import { ViewProps } from 'react-native';
import { ContentCard, ContentCardData } from '../../models/ContentCard';
import { DismissButtonProps } from '../components/DismissButton/DismissButton';

/** Represents template types for Content Card templates. */
export type ContentCardTemplate = 'SmallImage' | 'LargeImage' | 'ImageOnly';

export class ContentTemplate extends ContentCard {
  readonly type: ContentCardTemplate;

  constructor(data: ContentCardData, type: ContentCardTemplate) {
    super(data);
    this.type = type;
  }
}

/** Overrides for the structural pieces of the content card */
export interface ComponentOverrideProps {
  BodyProps?: Partial<TextProps>;
  ButtonContainerProps?: Partial<ViewProps>;
  ButtonProps?: Partial<Omit<ButtonProps, 'onPress'>>;
  ContainerProps?: Partial<ViewProps>;
  ContentContainerProps?: Partial<ViewProps>;
  DismissButtonProps?: DismissButtonProps;
  ImageContainerProps?: Partial<ViewProps>;
  ImageProps?: Partial<ImageProps>;
  TextProps?: Partial<TextProps>;
  TitleProps?: Partial<TextProps>;
}
