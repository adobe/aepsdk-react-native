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

import { act, renderHook, waitFor } from '@testing-library/react-native';
import Messaging from '../../Messaging';
import { useInbox } from './useInbox';

jest.mock('../../Messaging', () => ({
  __esModule: true,
  default: {
    updatePropositionsForSurfaces: jest.fn().mockResolvedValue(undefined),
    getInbox: jest.fn(),
  },
}));

const mockSettings = {
  content: {
    heading: { content: 'Inbox' },
    layout: { orientation: 'vertical' as const },
    capacity: 10,
  },
};

describe('useInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(Messaging.updatePropositionsForSurfaces).mockResolvedValue(undefined);
    jest.mocked(Messaging.getInbox).mockResolvedValue(mockSettings as any);
  });

  it('fetches inbox settings on mount and exposes refetch', async () => {
    const { result } = renderHook(() => useInbox('my-surface'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Messaging.updatePropositionsForSurfaces).toHaveBeenCalledWith(['my-surface']);
    expect(Messaging.getInbox).toHaveBeenCalledWith('my-surface');
    expect(result.current.settings).toEqual(mockSettings);
    expect(result.current.error).toBeNull();

    jest.mocked(Messaging.getInbox).mockResolvedValue({ ...mockSettings, activityId: 'x' } as any);
    await act(async () => {
      await result.current.refetch();
    });

    expect(Messaging.getInbox).toHaveBeenCalledTimes(2);
  });

  it('sets error when getInbox throws', async () => {
    const err = new Error('no inbox');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(Messaging.getInbox).mockRejectedValueOnce(err);

    const { result } = renderHook(() => useInbox('bad-surface'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(err);
    expect(result.current.settings).toBeNull();
    errorSpy.mockRestore();
  });

  it('refetches when surface changes', async () => {
    const { rerender } = renderHook(({ surface }: { surface: string }) => useInbox(surface), {
      initialProps: { surface: 'a' },
    });

    await waitFor(() => expect(Messaging.getInbox).toHaveBeenCalledWith('a'));

    rerender({ surface: 'b' });

    await waitFor(() => expect(Messaging.getInbox).toHaveBeenCalledWith('b'));
  });
});
