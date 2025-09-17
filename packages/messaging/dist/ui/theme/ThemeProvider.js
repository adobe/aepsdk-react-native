"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = exports.ThemeProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const defaultTheme = {
    light: {
        colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            background: '#FFFFFF',
            textPrimary: '#000000',
            textSecondary: '#8E8E93',
            imagePlaceholder: '#C7C7CC',
            buttonTextColor: 'dodgerblue'
        }
    },
    dark: {
        colors: {
            primary: '#0A84FF',
            secondary: '#5E5CE6',
            background: '#262626',
            textPrimary: '#FFFFFF',
            textSecondary: '#8E8E93',
            imagePlaceholder: '#48484A',
            buttonTextColor: 'dodgerblue'
        }
    }
};
const ThemeContext = (0, react_1.createContext)(undefined);
/**
 * ThemeProvider component that provides the theme to the children components.
 *
 * @param children - The children components.
 * @param customThemes - The custom themes to override the default themes.
 * @returns The ThemeProvider component.
 */
const ThemeProvider = ({ children, customThemes }) => {
    const systemColorScheme = (0, react_native_1.useColorScheme)();
    // Memoize the merged themes to avoid recreation on every render
    const mergedThemes = (0, react_1.useMemo)(() => {
        var _a, _b;
        return ({
            light: {
                colors: Object.assign(Object.assign({}, defaultTheme.light.colors), (((_a = customThemes === null || customThemes === void 0 ? void 0 : customThemes.light) === null || _a === void 0 ? void 0 : _a.colors) || {}))
            },
            dark: {
                colors: Object.assign(Object.assign({}, defaultTheme.dark.colors), (((_b = customThemes === null || customThemes === void 0 ? void 0 : customThemes.dark) === null || _b === void 0 ? void 0 : _b.colors) || {}))
            }
        });
    }, [customThemes]);
    // Memoize the active theme
    const activeTheme = (0, react_1.useMemo)(() => mergedThemes[systemColorScheme !== null && systemColorScheme !== void 0 ? systemColorScheme : 'light'], [mergedThemes, systemColorScheme]);
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = (0, react_1.useMemo)(() => activeTheme, [activeTheme]);
    return (<ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
/**
 * useTheme hook that returns the theme context.
 * @returns The theme context.
 */
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeContext);
    const systemColorScheme = (0, react_native_1.useColorScheme)();
    if (context === undefined) {
        return defaultTheme[systemColorScheme !== null && systemColorScheme !== void 0 ? systemColorScheme : 'light'];
    }
    return context;
};
exports.useTheme = useTheme;
//# sourceMappingURL=ThemeProvider.js.map