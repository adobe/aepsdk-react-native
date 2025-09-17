import React from 'react';
import { ButtonProps, ImageProps, ImageStyle, PressableProps, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import { LargeImageContentData } from '../../../models/ContentCard';
import { DismissButtonProps } from '../DismissButton/DismissButton';
export interface LargeImageContentStyle {
    card?: ViewStyle;
    container?: ViewStyle;
    imageContainer?: ViewStyle;
    image?: ImageStyle;
    contentContainer?: ViewStyle;
    textContent?: ViewStyle;
    title?: TextStyle;
    body?: TextStyle;
    buttonContainer?: ViewStyle;
    button?: PressableProps['style'];
    buttonText?: TextStyle;
    dismissButton?: PressableProps['style'];
}
export interface LargeImageCardProps extends PressableProps {
    content: LargeImageContentData;
    imageUri?: string;
    styleOverrides?: LargeImageContentStyle;
    onDismiss?: () => void;
    onPress?: () => void;
    ContainerProps?: ViewProps;
    ImageContainerProps?: ViewProps;
    ImageProps?: ImageProps;
    TextProps?: TextProps;
    TitleProps?: TextProps;
    BodyProps?: TextProps;
    ButtonContainerProps?: ViewProps;
    ButtonProps?: ButtonProps;
    DismissButtonProps?: DismissButtonProps;
}
declare const LargeImageCard: React.FC<LargeImageCardProps>;
export default LargeImageCard;
