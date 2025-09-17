import React from 'react';
import { ImageStyle, PressableProps, ViewStyle } from 'react-native';
import { ImageOnlyContent } from '../../../models/ContentCard';
import { ComponentOverrideProps } from '../../types';
export type ImageOnlyContentProps = Pick<ComponentOverrideProps, 'ContainerProps' | 'ImageContainerProps' | 'ImageProps' | 'DismissButtonProps'> & {
    content: ImageOnlyContent;
    height?: number;
    imageUri?: string;
    styleOverrides?: ImageOnlyContentStyle;
    onDismiss?: () => void;
    onPress?: () => void;
};
export interface ImageOnlyContentStyle {
    card?: Partial<ViewStyle>;
    imageContainer?: Partial<ViewStyle>;
    image?: Partial<ImageStyle>;
    dismissButton?: PressableProps['style'];
}
/**
 * Renders an image only card component.
 *
 * @param props - an object of type [ImageOnlyContentProps], which contains the properties for the image only card component.
 * @returns The rendered image only card component.
 */
declare const ImageOnlyCard: React.FC<ImageOnlyContentProps>;
export default ImageOnlyCard;
