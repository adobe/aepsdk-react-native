import { PressableProps, TextStyle } from "react-native";
/** Props for the DismissButton component. Extends the PressableProps from react-native. */
export interface DismissButtonProps extends PressableProps {
    /** The style of the text for the dismiss button */
    textStyle?: TextStyle;
    /** The function to call when the dismiss button is pressed */
    onPress?: () => void;
    /** The style of the dismiss button */
    type: "simple" | "circle";
}
declare const DismissButton: ({ onPress, type, textStyle, style, ...props }: DismissButtonProps) => import("react").JSX.Element;
export default DismissButton;
//# sourceMappingURL=DismissButton.d.ts.map