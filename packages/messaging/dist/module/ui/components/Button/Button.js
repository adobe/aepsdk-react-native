"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
import { useCallback } from 'react';
import { Linking, Pressable, Text } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider.js";
const Button = ({
  actionUrl,
  id,
  title,
  onPress,
  interactId,
  textStyle,
  style,
  ...props
}) => {
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onPress?.(interactId);
    if (actionUrl) {
      try {
        Linking.openURL(actionUrl);
      } catch (error) {
        console.warn(`Failed to open URL: ${actionUrl}`, error);
      }
    }
  }, [actionUrl, interactId, onPress]);
  return /*#__PURE__*/React.createElement(Pressable, _extends({
    onPress: handlePress,
    style: style
  }, props), /*#__PURE__*/React.createElement(Text, {
    style: [{
      color: theme?.colors?.buttonTextColor
    }, textStyle]
  }, title));
};
export default Button;
//# sourceMappingURL=Button.js.map