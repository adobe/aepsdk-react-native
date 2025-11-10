"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { useMemo } from "react";
import { Image, StyleSheet, Text, useColorScheme } from "react-native";
import useAspectRatio from "../../hooks/useAspectRatio.js";
import CenteredView from "../CenteredView/CenteredView.js";
const EmptyState = ({
  image,
  text,
  styleOverrides,
  ContainerProps,
  ImageProps,
  TextProps
}) => {
  const colorScheme = useColorScheme();
  const ratio = useAspectRatio(image);
  const textColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  return /*#__PURE__*/React.createElement(CenteredView, _extends({
    style: [styles.container, styleOverrides?.container, {
      flexGrow: 1
    }]
  }, ContainerProps), /*#__PURE__*/React.createElement(Image, _extends({
    source: {
      uri: image
    },
    style: [styles.image, {
      aspectRatio: ratio
    }, styleOverrides?.image],
    resizeMode: "contain"
  }, ImageProps)), /*#__PURE__*/React.createElement(Text, _extends({
    style: [styles.text, {
      color: textColor
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