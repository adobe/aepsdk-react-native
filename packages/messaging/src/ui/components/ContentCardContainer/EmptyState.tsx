import { Image, Text, useColorScheme, useWindowDimensions } from "react-native";
import CenteredView from "../CenteredView/CenteredView";
import { useMemo } from "react";
import useAspectRatio from "../../hooks/useAspectRatio";

interface EmptyStateProps {
  image: string;
  text: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ image, text }) => {
  const colorScheme = useColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const ratio = useAspectRatio(image);

  const textColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  return (
    <CenteredView>
      <Image 
        source={{ uri: image }} 
        style={{ width: Math.round(windowWidth * 0.5), aspectRatio: ratio }} 
        resizeMode="contain" 
      />
      <Text style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>
        {text}
      </Text>
    </CenteredView>
  );
};

export default EmptyState;
