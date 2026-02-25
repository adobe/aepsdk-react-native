import React from "react";
export type SettingsPlacement = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
export interface InboxSettings {
    content: {
        heading: {
            content: string;
        };
        layout: {
            orientation: 'horizontal' | 'vertical';
        };
        capacity: number;
        emptyStateSettings?: {
            message: {
                content: string;
            };
            image?: {
                url?: string;
                darkUrl?: string;
                light?: {
                    url?: string;
                };
                dark?: {
                    url?: string;
                };
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
        /** Whether the unread feature is enabled. Defaults to true. */
        isUnreadEnabled?: boolean;
    };
    showPagination?: boolean;
}
export declare const InboxContext: React.Context<InboxSettings | null>;
export interface InboxProviderProps {
    children: React.ReactNode;
    settings: InboxSettings;
}
declare function InboxProvider({ children, settings, }: InboxProviderProps): React.JSX.Element;
export default InboxProvider;
//# sourceMappingURL=InboxProvider.d.ts.map