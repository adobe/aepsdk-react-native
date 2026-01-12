"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { Image, StyleSheet, Text } from "react-native";
import useAspectRatio from "../../hooks/useAspectRatio.js";
import { useTheme } from "../../theme/index.js";
import FullScreenCenterView from "../FullScreenCenterView/FullScreenCenterView.js";
const EmptyState = ({
  image,
  text,
  styleOverrides,
  InboxProps,
  ImageProps,
  TextProps
}) => {
  const {
    colors
  } = useTheme();
  const ratio = useAspectRatio(image);
  return /*#__PURE__*/React.createElement(FullScreenCenterView, _extends({
    style: [styles.container, styleOverrides?.container]
  }, InboxProps), /*#__PURE__*/React.createElement(Image, _extends({
    source: {
      uri: image
    },
    style: [styles.image, {
      aspectRatio: ratio
    }, styleOverrides?.image],
    resizeMode: "contain"
  }, ImageProps)), /*#__PURE__*/React.createElement(Text, _extends({
    style: [styles.text, {
      color: colors.textPrimary
    }, styleOverrides?.text]
  }, TextProps), text));
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
//# sourceMappingURL=EmptyState.js.map