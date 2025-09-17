/// <reference types="react" />
import { GestureResponderEvent, PressableProps, TextStyle } from 'react-native';
export interface ButtonProps extends Omit<PressableProps, 'onPress'> {
    actionUrl?: string;
    id?: string;
    title: string;
    onPress?: (interactId?: string, event?: GestureResponderEvent) => void;
    interactId?: string;
    textStyle?: (TextStyle | undefined) | (TextStyle | undefined)[];
}
declare const Button: React.FC<ButtonProps>;
export default Button;
