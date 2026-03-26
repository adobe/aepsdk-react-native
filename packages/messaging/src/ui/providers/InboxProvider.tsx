/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import React, { createContext } from "react";

export type SettingsPlacement = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface InboxSettings {
  activityId?: string;
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
