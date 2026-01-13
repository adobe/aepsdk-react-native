import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const FullScreenCenterView = ({ children, style, ...rest }: PropsWithChildren<ViewProps>) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

export default FullScreenCenterView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
