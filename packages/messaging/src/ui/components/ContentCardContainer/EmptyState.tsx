import { Image, Text } from "react-native";
import CenteredView from "../CenteredView/CenteredView";

interface EmptyStateProps {
  image: string;
  text: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ image, text }) => {
  return (
    <CenteredView>
      <Image source={{ uri: image }} style={{ width: 120, height: 120, padding: 10 }} resizeMode="contain"/>
      <Text>{text}</Text>
    </CenteredView>
  );
};

export default EmptyState;
