import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

const CenteredView = ({ children }: PropsWithChildren) => (
  <View style={styles.container}>{children}</View>
);

export default CenteredView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16
  },
});
