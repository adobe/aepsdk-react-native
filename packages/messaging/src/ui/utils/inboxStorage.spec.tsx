/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import { loadInboxState, saveInboxState } from './inboxStorage';

jest.mock('react-native', () => ({
  NativeModules: {
    AEPMessaging: {
      getInboxState: jest.fn(),
      setInboxState: jest.fn(),
    },
  },
}));

describe('inboxStorage', () => {
  const activityId = 'activity-123';
  const aep = NativeModules.AEPMessaging as {
    getInboxState: jest.Mock;
    setInboxState: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    aep.getInboxState.mockReset();
    aep.setInboxState.mockReset();
    aep.getInboxState = jest.fn();
    aep.setInboxState = jest.fn();
  });

  describe('loadInboxState', () => {
    it('returns empty state when activityId is empty', async () => {
      await expect(loadInboxState('')).resolves.toEqual({
        dismissed: [],
        interacted: [],
      });
      expect(aep.getInboxState).not.toHaveBeenCalled();
    });

    it('returns empty state when getInboxState is not available', async () => {
      const prev = aep.getInboxState;
      delete (aep as any).getInboxState;

      await expect(loadInboxState(activityId)).resolves.toEqual({
        dismissed: [],
        interacted: [],
      });

      aep.getInboxState = prev;
    });

    it('parses JSON from native and returns dismissed and interacted', async () => {
      aep.getInboxState.mockResolvedValue(
        JSON.stringify({ dismissed: ['a', 'b'], interacted: ['c'] })
      );

      await expect(loadInboxState(activityId)).resolves.toEqual({
        dismissed: ['a', 'b'],
        interacted: ['c'],
      });
      expect(aep.getInboxState).toHaveBeenCalledWith(activityId);
    });

    it('returns empty arrays when native returns non-string', async () => {
      aep.getInboxState.mockResolvedValue(null);

      await expect(loadInboxState(activityId)).resolves.toEqual({
        dismissed: [],
        interacted: [],
      });
    });

    it('returns empty arrays when JSON is invalid', async () => {
      aep.getInboxState.mockResolvedValue('not-json');

      await expect(loadInboxState(activityId)).resolves.toEqual({
        dismissed: [],
        interacted: [],
      });
    });

    it('normalizes non-array dismissed/interacted in parsed JSON', async () => {
      aep.getInboxState.mockResolvedValue(JSON.stringify({ dismissed: 'bad', interacted: 1 }));

      await expect(loadInboxState(activityId)).resolves.toEqual({
        dismissed: [],
        interacted: [],
      });
    });
  });

  describe('saveInboxState', () => {
    it('no-ops when activityId is empty', async () => {
      await saveInboxState('', { dismissed: ['x'], interacted: [] });
      expect(aep.setInboxState).not.toHaveBeenCalled();
    });

    it('no-ops when setInboxState is not available', async () => {
      const prev = aep.setInboxState;
      delete (aep as any).setInboxState;

      await saveInboxState(activityId, { dismissed: [], interacted: [] });

      aep.setInboxState = prev;
    });

    it('calls native setInboxState with stringified state', async () => {
      const state = { dismissed: ['d1'], interacted: ['i1'] };
      aep.setInboxState.mockResolvedValue(undefined);

      await saveInboxState(activityId, state);

      expect(aep.setInboxState).toHaveBeenCalledWith(
        activityId,
        JSON.stringify(state)
      );
    });

    it('swallows errors from setInboxState', async () => {
      aep.setInboxState.mockRejectedValue(new Error('disk full'));

      await expect(
        saveInboxState(activityId, { dismissed: [], interacted: [] })
      ).resolves.toBeUndefined();
    });
  });
});
