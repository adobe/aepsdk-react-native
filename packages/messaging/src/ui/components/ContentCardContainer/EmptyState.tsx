import { useMemo } from "react";
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  useColorScheme,
  ViewProps,
  ViewStyle
} from "react-native";
import useAspectRatio from "../../hooks/useAspectRatio";
import CenteredView from "../CenteredView/CenteredView";

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
  const colorScheme = useColorScheme();
  const ratio = useAspectRatio(image);

  const textColor = useMemo(
    () => colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    [colorScheme]
  );

  return (
    <CenteredView 
      style={[styles.container, styleOverrides?.container, {flexGrow: 1}]} 
      {...ContainerProps}
    >
      <Image
        source={{ uri: image }}
        style={[styles.image, { aspectRatio: ratio }, styleOverrides?.image]}
        resizeMode="contain"
        {...ImageProps}
      />
      <Text 
        style={[styles.text, { color: textColor }, styleOverrides?.text]} 
        {...TextProps}
      >
        {text}
      </Text>
    </CenteredView>
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