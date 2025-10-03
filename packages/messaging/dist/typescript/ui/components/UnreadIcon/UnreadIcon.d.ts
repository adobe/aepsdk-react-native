import React from 'react';
import { ImageProps, ImageStyle, ViewProps, ViewStyle } from 'react-native';
export interface UnreadIconProps extends ViewProps {
    imageStyle?: ImageStyle;
    containerStyle?: ViewStyle;
    source?: ImageProps['source'];
    darkSource?: ImageProps['source'];
    size?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    type?: 'dot' | 'image';
}
declare const UnreadIcon: ({ imageStyle, containerStyle, source, darkSource, size, position, type, style, ...props }: UnreadIconProps) => React.JSX.Element;
export default UnreadIcon;
//# sourceMappingURL=UnreadIcon.d.ts.map