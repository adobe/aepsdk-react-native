"use strict";

import { Image, Text } from "react-native";
import CenteredView from "../CenteredView/CenteredView.js";
const EmptyState = ({
  image,
  text
}) => {
  return /*#__PURE__*/React.createElement(CenteredView, null, /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: image
    },
    style: {
      width: 120,
      height: 120,
      padding: 10
    },
    resizeMode: "contain"
  }), /*#__PURE__*/React.createElement(Text, null, text));
};
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map