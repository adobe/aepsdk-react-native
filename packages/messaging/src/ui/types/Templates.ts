import {
  ButtonProps,
  ImageProps,
  ImageStyle,
  PressableProps,
  TextProps,
  TextStyle,
  ViewStyle
} from 'react-native';
import { ViewProps } from 'react-native';
import {
  ContentCard,
  ContentCardData,
  ContentCardTemplate
} from '../../models/ContentCard';
import { DismissButtonProps } from '../components/DismissButton/DismissButton';

export class ContentTemplate extends ContentCard {
  readonly type: ContentCardTemplate;

  constructor(data: ContentCardData, type: ContentCardTemplate, isRead: boolean = false) {
    super(data, isRead);
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

/** The base style overrides available for content cards */
export interface ContentCardStyles {
  /** Applies to the root of the content card */
  card?: ViewStyle;
  /** Applies to the container inside the content card, applied inside the card Pressable */
  container?: ViewStyle;
  imageContainer?: ViewStyle;
  image?: ImageStyle;
  contentContainer?: ViewStyle;
  /** Applies to title and body properties, will be overridden by title and body styles */
  text?: TextStyle;
  title?: TextStyle;
  body?: TextStyle;
  buttonContainer?: ViewStyle;
  button?: PressableProps['style'];
  buttonText?: TextStyle;
  dismissButton?: PressableProps['style'];
}

export type SmallImageContentStyle = ContentCardStyles;
export type LargeImageContentStyle = ContentCardStyles;
export type ImageOnlyContentStyle = Pick<
  ContentCardStyles,
  'card' | 'imageContainer' | 'image' | 'dismissButton'
>;
