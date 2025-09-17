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
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
const DismissButton = ({
  onPress,
  type,
  textStyle,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  return /*#__PURE__*/React.createElement(Pressable, _extends({
    onPress: onPress,
    style: state => [styles.container, type === 'simple' && styles.simple, type === 'circle' && [styles.circle, {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    }], state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]
  }, props), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: colorScheme === 'dark' ? 'white' : 'black'
    }, textStyle]
  }, "x"));
};
export default DismissButton;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 18,
    minHeight: 18
  },
  pressed: {
    opacity: 0.7
  },
  simple: {
    backgroundColor: 'transparent'
  },
  circle: {
    borderRadius: 10,
    width: 18,
    height: 18
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
//# sourceMappingURL=DismissButton.js.map