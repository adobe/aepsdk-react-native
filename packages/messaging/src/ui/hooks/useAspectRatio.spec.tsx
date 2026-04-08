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

import { renderHook, waitFor } from '@testing-library/react-native';
import { Image } from 'react-native';
import useAspectRatio from './useAspectRatio';

describe('useAspectRatio', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 1 when uri is undefined', () => {
    const { result } = renderHook(() => useAspectRatio());
    expect(result.current).toBe(1);
  });

  it('returns width/height when Image.getSize succeeds', async () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
      success(400, 100);
    });

    const { result } = renderHook(() => useAspectRatio('https://example.com/a.png'));

    await waitFor(() => {
      expect(result.current).toBe(4);
    });
  });

  it('returns 1 when Image.getSize reports height 0', async () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
      success(400, 0);
    });

    const { result } = renderHook(() => useAspectRatio('https://example.com/zero.png'));

    await waitFor(() => {
      expect(result.current).toBe(1);
    });
  });

  it('returns 1 when Image.getSize fails', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, _s, failure) => {
      failure?.(new Error('bad'));
    });

    const { result } = renderHook(() => useAspectRatio('https://example.com/b.png'));

    await waitFor(() => {
      expect(result.current).toBe(1);
    });

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
