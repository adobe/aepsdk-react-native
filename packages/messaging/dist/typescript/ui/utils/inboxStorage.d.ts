export interface InboxPersistedState {
    dismissed: string[];
    interacted: string[];
}
export type AsyncStorageLike = {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
};
/**
 * Load persisted inbox state (dismissed and read card IDs) from native storage.
 * Uses scopeDetails.activity.id as the key - this is constant across server responses.
 * Persists via SharedPreferences (Android) / UserDefaults (iOS) - no AsyncStorage needed.
 * @param activityId - From scopeDetails.activity in the inbox proposition
 * @returns Persisted state or empty defaults if not found
 */
export declare function loadInboxState(activityId: string, _storage?: AsyncStorageLike | null): Promise<InboxPersistedState>;
/**
 * Save inbox state to native storage for persistence across app launches.
 * @param activityId - From scopeDetails.activity in the inbox proposition
 * @param state - Dismissed and interacted card IDs to persist
 */
export declare function saveInboxState(activityId: string, state: InboxPersistedState, _storage?: AsyncStorageLike | null): Promise<void>;
//# sourceMappingURL=inboxStorage.d.ts.map