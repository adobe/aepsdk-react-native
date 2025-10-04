import React from 'react';
import { ImageProps, ImageStyle, ViewProps, ViewStyle } from 'react-native';
export type SettingsPlacement = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
export interface UnreadIconProps extends ViewProps {
    imageStyle?: ImageStyle;
    containerStyle?: ViewStyle;
    source?: ImageProps['source'];
    darkSource?: ImageProps['source'];
    size?: number;
    position?: SettingsPlacement;
    type?: 'dot' | 'image';
}
declare const UnreadIcon: ({ imageStyle, containerStyle, source, darkSource, size, position, type, style, ...props }: UnreadIconProps) => React.JSX.Element;
export default UnreadIcon;
//# sourceMappingURL=UnreadIcon.d.ts.map