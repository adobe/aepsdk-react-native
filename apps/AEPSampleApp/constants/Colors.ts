/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    panel: '#F5F5F5',
    panelBorder: '#E0E0E0',
    inputBg: '#FFFFFF',
    inputBorder: '#CCC',
    mutedText: '#666666',
    viewBg: '#E8E8E8',
    themeBg: '#FFFFFF',
    placeholderText: '#999'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    panel: '#2A2A2A',
    panelBorder: '#444',
    inputBg: '#3A3A3A',
    inputBorder: '#555',
    mutedText: '#CCCCCC',
    viewBg: '#3A3A3A',
    themeBg: '#4A4A4A',
    placeholderText: '#888'
  },
};
