"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { StyleSheet, View } from "react-native";
const CenteredView = ({
  children,
  style,
  ...rest
}) => {
  return /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.container, style]
  }, rest), children);
};
export default CenteredView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
//# sourceMappingURL=CenteredView.js.map