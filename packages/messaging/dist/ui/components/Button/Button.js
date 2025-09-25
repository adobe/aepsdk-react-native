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
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const ThemeProvider_1 = require("../../theme/ThemeProvider");
const Button = (_a) => {
    var _b;
    var { actionUrl, id, title, onPress, interactId, textStyle, style } = _a, props = tslib_1.__rest(_a, ["actionUrl", "id", "title", "onPress", "interactId", "textStyle", "style"]);
    const theme = (0, ThemeProvider_1.useTheme)();
    const handlePress = (0, react_1.useCallback)(() => {
        onPress === null || onPress === void 0 ? void 0 : onPress(interactId);
        if (actionUrl) {
            try {
                react_native_1.Linking.openURL(actionUrl);
            }
            catch (error) {
                console.warn(`Failed to open URL: ${actionUrl}`, error);
            }
        }
    }, [actionUrl, interactId, onPress]);
    return (<react_native_1.Pressable onPress={handlePress} style={style} {...props}>
      <react_native_1.Text style={[{ color: (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.buttonTextColor }, textStyle]}>
        {title}
      </react_native_1.Text>
    </react_native_1.Pressable>);
};
exports.default = Button;
//# sourceMappingURL=Button.js.map