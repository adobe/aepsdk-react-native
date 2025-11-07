"use strict";

import { Image, Text, useColorScheme, useWindowDimensions } from "react-native";
import CenteredView from "../CenteredView/CenteredView.js";
import { useMemo } from "react";
import useAspectRatio from "../../hooks/useAspectRatio.js";
const EmptyState = ({
  image,
  text
}) => {
  const colorScheme = useColorScheme();
  const {
    width: windowWidth
  } = useWindowDimensions();
  const ratio = useAspectRatio(image);
  const textColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  return /*#__PURE__*/React.createElement(CenteredView, null, /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: image
    },
    style: {
      width: Math.round(windowWidth * 0.5),
      aspectRatio: ratio
    },
    resizeMode: "contain"
  }), /*#__PURE__*/React.createElement(Text, {
    style: {
      color: textColor,
      fontWeight: '600',
      fontSize: 16
    }
  }, text));
};
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map