  import { Text, View } from "react-native";

  function UnreadIcon({ placement, image }: { placement: string|undefined, image: { url: string; darkUrl?: string | undefined; } | undefined }) {
  return (
    <View>
      <Text>UnreadIcon: {placement} {image?.darkUrl} {image?.url}</Text>
    </View>
  );
}

export default UnreadIcon;
