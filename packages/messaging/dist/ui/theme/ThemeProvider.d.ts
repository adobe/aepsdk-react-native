import React, { ReactNode } from 'react';
import { Theme, Themes } from './Theme';
interface ThemeProviderProps {
    children: ReactNode;
    customThemes: Themes;
}
/**
 * ThemeProvider component that provides the theme to the children components.
 *
 * @param children - The children components.
 * @param customThemes - The custom themes to override the default themes.
 * @returns The ThemeProvider component.
 */
export declare const ThemeProvider: ({ children, customThemes }: ThemeProviderProps) => React.JSX.Element;
/**
 * useTheme hook that returns the theme context.
 * @returns The theme context.
 */
export declare const useTheme: () => Theme;
export {};
