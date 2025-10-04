import React from "react";
import { SettingsPlacement } from "../components/UnreadIcon/UnreadIcon";
export interface ContainerSettings {
    templateType: 'inbox' | 'banner' | 'custom';
    content: {
        heading: {
            content: string;
        };
        layout: {
            orientation: 'horizontal' | 'vertical';
        };
        capacity: number;
        emptyStateSettings: {
            message: {
                content: string;
            };
            image?: {
                url: string;
                darkUrl?: string;
            };
        };
        unread_indicator?: {
            unread_bg: {
                clr: {
                    light: string;
                    dark: string;
                };
            };
            unread_icon: {
                placement: SettingsPlacement;
                image: {
                    url: string;
                    darkUrl?: string;
                };
            };
        };
        isUnreadEnabled: boolean;
    };
    showPagination?: boolean;
}
export declare const ContentCardContainerContext: React.Context<ContainerSettings | null>;
export interface ContentCardContainerProviderProps {
    children: React.ReactNode;
    settings: ContainerSettings;
}
declare function ContentCardContainerProvider({ children, settings, }: ContentCardContainerProviderProps): React.JSX.Element;
export default ContentCardContainerProvider;
//# sourceMappingURL=ContentCardContainerProvider.d.ts.map