import {
  Image,
  ImageProps,
  ImageStyle,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle
} from "react-native";
import useAspectRatio from "../../hooks/useAspectRatio";
import { useTheme } from "../../theme";
import FullScreenCenterView from "../FullScreenCenterView/FullScreenCenterView";

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

const EmptyState: React.FC<EmptyStateProps> = ({
  image,  
  text,
  styleOverrides,
  ContainerProps,
  ImageProps,
  TextProps
}) => {
  const { colors } = useTheme();
  const ratio = useAspectRatio(image);

  return (
    <FullScreenCenterView 
      style={[styles.container, styleOverrides?.container]} 
      {...ContainerProps}
    >
      <Image
        source={{ uri: image }}
        style={[styles.image, { aspectRatio: ratio }, styleOverrides?.image]}
        resizeMode="contain"
        {...ImageProps}
      />
      <Text 
        style={[styles.text, { color: colors.textPrimary }, styleOverrides?.text]} 
        {...TextProps}
      >
        {text}
      </Text>
    </FullScreenCenterView>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  image: {
    width: '50%'
  },
  text: {
    fontWeight: '600',
    fontSize: 16
  },
  container: {
    gap: 16
  }
});