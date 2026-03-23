/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions under the License.
*/

import { NativeModules } from 'react-native';

export interface InboxPersistedState {
  dismissed: string[];
  interacted: string[];
}

export type AsyncStorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

const RCTAEPMessaging = NativeModules.AEPMessaging;

/**
 * Load persisted inbox state (dismissed and read card IDs) from native storage.
 * Uses scopeDetails.activity.id as the key - this is constant across server responses.
 * Persists via SharedPreferences (Android) / UserDefaults (iOS) - no AsyncStorage needed.
 * @param activityId - From scopeDetails.activity in the inbox proposition
 * @returns Persisted state or empty defaults if not found
 */
export async function loadInboxState(
  activityId: string,
  _storage?: AsyncStorageLike | null
): Promise<InboxPersistedState> {
  if (!activityId || !RCTAEPMessaging?.getInboxState) {
    return { dismissed: [], interacted: [] };
  }
  try {
    const raw = await RCTAEPMessaging.getInboxState(activityId);
    if (!raw || typeof raw !== 'string') return { dismissed: [], interacted: [] };
    const parsed = JSON.parse(raw) as InboxPersistedState;
    return {
      dismissed: Array.isArray(parsed?.dismissed) ? parsed.dismissed : [],
      interacted: Array.isArray(parsed?.interacted) ? parsed.interacted : [],
    };
  } catch {
    return { dismissed: [], interacted: [] };
  }
}

/**
 * Save inbox state to native storage for persistence across app launches.
 * @param activityId - From scopeDetails.activity in the inbox proposition
 * @param state - Dismissed and interacted card IDs to persist
 */
export async function saveInboxState(
  activityId: string,
  state: InboxPersistedState,
  _storage?: AsyncStorageLike | null
): Promise<void> {
  if (!activityId || !RCTAEPMessaging?.setInboxState) return;
  try {
    await RCTAEPMessaging.setInboxState(activityId, JSON.stringify(state));
  } catch {
    // Silently fail - persistence is best-effort
  }
}
