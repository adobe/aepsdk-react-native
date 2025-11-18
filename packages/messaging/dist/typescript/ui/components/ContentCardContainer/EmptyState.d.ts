import { ImageProps, ImageStyle, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";
interface EmptyStateProps extends ViewProps {
    image: string;
    text: string;
    styleOverrides?: {
        container?: ViewStyle;
        image?: ImageStyle;
        text?: TextStyle;
    };
    ContainerProps?: Partial<ViewProps>;
    ImageProps?: Partial<ImageProps>;
    TextProps?: Partial<TextProps>;
}
declare const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
//# sourceMappingURL=EmptyState.d.ts.map