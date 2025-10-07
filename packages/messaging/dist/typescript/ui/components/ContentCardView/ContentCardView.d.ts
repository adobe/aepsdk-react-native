import React from "react";
import { ComponentOverrideProps, ContentTemplate, ImageOnlyContentStyle, LargeImageContentStyle, SmallImageContentStyle } from "../../types/Templates";
import { ContentViewEvent } from "../../types/ContentViewEvent";
import { PressableProps } from 'react-native';
import { ContentCardTemplate } from '../../../models';
/**
 * Callback function that is called when a content card event occurs.
 */
export type ContentCardEventListener = (
/** The event that occurred, one of "onDismiss", "onDisplay", "onInteract" */
event?: ContentViewEvent, 
/** The full content card data associated with the event */
data?: ContentTemplate, 
/** Any additional native event data that accompanies the event */
nativeEvent?: any) => void;
/** Props for the ContentCardView component */
export interface ContentViewProps extends PressableProps, ComponentOverrideProps {
    /** The content card data to display */
    template: ContentTemplate;
    /** Style overrides per template type for the content card */
    styleOverrides?: {
        /** Style overrides for the small image content card */
        smallImageStyle?: SmallImageContentStyle;
        /** Style overrides for the large image content card */
        largeImageStyle?: LargeImageContentStyle;
        /** Style overrides for the image only content card */
        imageOnlyStyle?: ImageOnlyContentStyle;
    };
    /** The function to call when a content card event occurs */
    listener?: ContentCardEventListener;
    /** The variant of the content card to display */
    variant?: ContentCardTemplate;
    isRead?: boolean;
}
/** Renders a content card view
 * @param {ContentViewProps} props - The props for the ContentCardView component
 */
export declare const ContentCardView: React.FC<ContentViewProps>;
//# sourceMappingURL=ContentCardView.d.ts.map