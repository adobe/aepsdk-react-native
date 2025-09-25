/// <reference types="react" />
import { PressableProps, TextStyle } from 'react-native';
export interface DismissButtonProps extends PressableProps {
    textStyle?: TextStyle;
    onPress?: () => void;
    type: 'simple' | 'circle';
}
declare const DismissButton: ({ onPress, type, textStyle, style, ...props }: DismissButtonProps) => import("react").JSX.Element;
export default DismissButton;
//# sourceMappingURL=DismissButton.d.ts.map