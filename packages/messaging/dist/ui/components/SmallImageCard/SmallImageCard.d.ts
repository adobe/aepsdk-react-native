import { ImageStyle, PressableProps, TextStyle, ViewStyle } from 'react-native';
import { SmallImageContentData } from '../../../models/ContentCard';
import { ComponentOverrideProps } from '../../types';
export interface SmallImageContentStyle {
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
export type SmallImageCardProps = PressableProps & ComponentOverrideProps & {
    content: SmallImageContentData;
    imageUri?: string;
    height?: number;
    styleOverrides?: SmallImageContentStyle;
    onDismiss?: () => void;
    onPress?: () => void;
};
declare const SmallImageCard: React.FC<SmallImageCardProps>;
export default SmallImageCard;
