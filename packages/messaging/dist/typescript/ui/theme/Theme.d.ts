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
//# sourceMappingURL=Theme.d.ts.map