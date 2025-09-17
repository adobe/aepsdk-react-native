"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_native_1 = require("react-native");
const DismissButton = (_a) => {
    var { onPress, type, textStyle, style } = _a, props = tslib_1.__rest(_a, ["onPress", "type", "textStyle", "style"]);
    const colorScheme = (0, react_native_1.useColorScheme)();
    return (<react_native_1.Pressable onPress={onPress} style={(state) => [
            styles.container,
            type === 'simple' && styles.simple,
            type === 'circle' && [
                styles.circle,
                {
                    backgroundColor: colorScheme === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)'
                }
            ],
            state.pressed && styles.pressed,
            typeof style === 'function' ? style(state) : style
        ]} {...props}>
      <react_native_1.Text style={[
            styles.text,
            { color: colorScheme === 'dark' ? 'white' : 'black' },
            textStyle
        ]}>
        x
      </react_native_1.Text>
    </react_native_1.Pressable>);
};
exports.default = DismissButton;
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 18,
        minHeight: 18,
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