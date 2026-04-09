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
import { useContentCardUI } from './useContentCardUI';

jest.mock('../../Messaging', () => ({
  __esModule: true,
  default: {
    updatePropositionsForSurfaces: jest.fn().mockResolvedValue(undefined),
    getContentCardUI: jest.fn(),
  },
}));

describe('useContentCardUI', () => {
  const template = { id: 'c1', type: 'SmallImage', data: {} };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(Messaging.updatePropositionsForSurfaces).mockResolvedValue(undefined);
    jest.mocked(Messaging.getContentCardUI).mockResolvedValue([template] as any);
  });

  it('fetches content cards on mount and exposes refetch', async () => {
    const { result } = renderHook(() => useContentCardUI('card-surface'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Messaging.updatePropositionsForSurfaces).toHaveBeenCalledWith(['card-surface']);
    expect(Messaging.getContentCardUI).toHaveBeenCalledWith('card-surface');
    expect(result.current.content).toEqual([template]);
    expect(result.current.error).toBeNull();

    jest.mocked(Messaging.getContentCardUI).mockResolvedValue([] as any);
    await act(async () => {
      await result.current.refetch();
    });

    expect(Messaging.getContentCardUI).toHaveBeenCalledTimes(2);
    expect(result.current.content).toEqual([]);
  });

  it('clears content and sets error when getContentCardUI throws', async () => {
    const err = new Error('fetch failed');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(Messaging.getContentCardUI).mockRejectedValueOnce(err);

    const { result } = renderHook(() => useContentCardUI('x'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.content).toEqual([]);
    expect(result.current.error).toBe(err);
    errorSpy.mockRestore();
  });

  it('refetches when surface changes', async () => {
    const { rerender } = renderHook(({ surface }: { surface: string }) => useContentCardUI(surface), {
      initialProps: { surface: 's1' },
    });

    await waitFor(() => expect(Messaging.getContentCardUI).toHaveBeenCalledWith('s1'));

    rerender({ surface: 's2' });

    await waitFor(() => expect(Messaging.getContentCardUI).toHaveBeenCalledWith('s2'));
  });
});
