"use strict";

import { StyleSheet, View } from "react-native";
const CenteredView = ({
  children
}) => /*#__PURE__*/React.createElement(View, {
  style: styles.container
}, children);
export default CenteredView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
//# sourceMappingURL=CenteredView.js.map