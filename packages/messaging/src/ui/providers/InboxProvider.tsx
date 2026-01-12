import React, { createContext } from "react";

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
        url?: string;        // flat (light)
        darkUrl?: string;    // flat (dark)
        light?: { url?: string }; // nested (light)
        dark?:  { url?: string }; // nested (dark)
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

export const InboxContext =
  createContext<InboxSettings | null>(null);

export interface InboxProviderProps {
  children: React.ReactNode;
  settings: InboxSettings;
}

function InboxProvider({
  children,
  settings,
}: InboxProviderProps) {
  return (
    <InboxContext.Provider value={settings}>
      {children}
    </InboxContext.Provider>
  );
}

export default InboxProvider;
