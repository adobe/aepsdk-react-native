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

/**
 * Represents the themes for the messaging UI.
 * @interface Themes
 * @property {Theme} light - The light theme.
 * @property {Theme} dark - The dark theme.
 */
export interface Themes {
  light: Theme;
  dark: Theme;
}

/**
 * Represents the theme for the messaging UI.
 * @interface Theme
 * @property {Colors} colors - The colors for the theme.
 */
export interface Theme {
  colors: Colors;
  isDark: boolean;
}

/**
 * Represents the colors for the theme.
 * @interface Colors
 * @property {string} primary - The primary color.
 * @property {string} secondary - The secondary color.
 * @property {string} background - The background color.
 * @property {string} textPrimary - The primary text color.
 * @property {string} textSecondary - The secondary text color.
 * @property {string} imagePlaceholder - The image placeholder color.
 * @property {string} buttonTextColor - The button text color.
 */
export interface Colors {
  primary?: string;
  secondary?: string;
  background?: string;
  textPrimary?: string;
  textSecondary?: string;
  imagePlaceholder?: string;
  buttonTextColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  dotColor?: string;
  imageContainerColor?: string;
}
