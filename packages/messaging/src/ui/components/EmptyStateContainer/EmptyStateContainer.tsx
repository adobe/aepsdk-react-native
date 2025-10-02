import { Text,Image, useColorScheme } from "react-native";
import { ContainerSettings } from "../../providers/ContentCardContainerProvider";
import { StyleSheet } from "react-native";

// Renders a configured empty state (optional image + message)
function EmptyStateContainer({ emptyStateSettings }: { emptyStateSettings: ContainerSettings['content']['emptyStateSettings'] }) {
    const scheme = useColorScheme();
    const img = emptyStateSettings?.image;
    const uri = (scheme === 'dark' && img?.darkUrl) ? img.darkUrl : img?.url;
  
    return (
      <>
        {uri ? (
          <Text style={styles.emptyStateImageContainer}>
            <Image source={{ uri }} resizeMode="contain" />
          </Text>
        ) : null}
        {emptyStateSettings?.message?.content ? (
          <Text style={styles.emptyStateMessageContainer}>
            {emptyStateSettings.message.content}
          </Text>
        ) : null}
      </>
    );
  }
export default EmptyStateContainer;

const styles = StyleSheet.create({
    emptyStateImageContainer: {
        marginBottom: 16,
        textAlign: "center",
    },
    emptyStateMessageContainer: {
        textAlign: "center",
        color: "#888"
    }
});
  