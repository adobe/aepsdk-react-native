import React from 'react';
import { ComponentOverrideProps, ContentTemplate, ImageOnlyContentStyle, LargeImageContentStyle, SmallImageContentStyle } from '../../types/Templates';
import { ContentViewEvent } from '../../types/ContentViewEvent';
import { PressableProps } from 'react-native';
import { ContentCardTemplate } from '../../../models';
export type ContentCardEventListener = (event: ContentViewEvent, data?: ContentTemplate, nativeEvent?: any) => void;
export interface ContentViewProps extends PressableProps, ComponentOverrideProps {
    template: ContentTemplate;
    styleOverrides?: {
        smallImageStyle?: SmallImageContentStyle;
        largeImageStyle?: LargeImageContentStyle;
        imageOnlyStyle?: ImageOnlyContentStyle;
    };
    listener?: ContentCardEventListener;
    variant?: ContentCardTemplate;
}
export declare const ContentCardView: React.FC<ContentViewProps>;
//# sourceMappingURL=ContentCardView.d.ts.map