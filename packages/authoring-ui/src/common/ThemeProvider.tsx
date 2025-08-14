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
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Theme, Themes } from "./Theme";

interface ThemeProviderProps {
  children: ReactNode;
  customThemes: Themes;
}

export interface ThemeContextType {
  theme: Theme;
}

const defaultTheme: Themes = {
  light: {
    colors: {
      primary: "#007AFF",
      secondary: "#5856D6",
      background: "#FFFFFF",
      text_primary: "#000000",
      text_secondary: "#8E8E93",
      image_placeholder: "#C7C7CC",
      button_text_color: "dodgerblue",
    },
  },
  dark: {
    colors: {
      primary: "#0A84FF",
      secondary: "#5E5CE6",
      background: "#262626",
      text_primary: "#FFFFFF",
      text_secondary: "#8E8E93",
      image_placeholder: "#48484A",
      button_text_color: "dodgerblue",
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component that provides the theme to the children components.
 *
 * @param children - The children components.
 * @param customThemes - The custom themes to override the default themes.
 * @returns The ThemeProvider component.
 */
export const ThemeProvider = ({
  children,
  customThemes,
}: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();

  // Memoize the merged themes to avoid recreation on every render
  const mergedThemes: Themes = useMemo(
    () => ({
      light: {
        colors: {
          ...defaultTheme.light.colors,
          ...(customThemes?.light?.colors || {}),
        },
      },
      dark: {
        colors: {
          ...defaultTheme.dark.colors,
          ...(customThemes?.dark?.colors || {}),
        },
      },
    }),
    [customThemes]
  );

  // Memoize the active theme
  const activeTheme = useMemo(() => {
    return mergedThemes[systemColorScheme] || mergedThemes.light;
  }, [mergedThemes, systemColorScheme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme: activeTheme,
    }),
    [activeTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook that returns the theme context.
 *
 * @returns The theme context.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    const systemColorScheme = useColorScheme();
    return {
      theme: defaultTheme[systemColorScheme] || defaultTheme.light,
    };
  }
  return context;
};
