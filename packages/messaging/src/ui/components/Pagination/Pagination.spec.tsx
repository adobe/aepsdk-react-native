/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Pagination } from './Pagination';

// Use fake timers for animation timing
jest.useFakeTimers();

// Stub Animated APIs to avoid act warnings and native errors
beforeAll(() => {
  jest.spyOn(Animated, 'timing').mockReturnValue({ start: (cb?: any) => cb && cb() } as any);
  jest.spyOn(Animated, 'spring').mockReturnValue({ start: (cb?: any) => cb && cb() } as any);
  jest.spyOn(Animated, 'parallel').mockReturnValue({ start: (cb?: any) => cb && cb() } as any);
  jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('light');
});

afterAll(() => {
  (Animated.timing as unknown as jest.Mock)?.mockRestore?.();
  (Animated.spring as unknown as jest.Mock)?.mockRestore?.();
  (Animated.parallel as unknown as jest.Mock)?.mockRestore?.();
});

describe('Pagination - rendering', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { toJSON } = render(
      <Pagination currentPage={0} totalPages={1} onPageChange={() => {}} />
    );
    expect(toJSON()).toBeNull();
  });

});

describe('Pagination - interactions', () => {
  it('renders dots and calls onPageChange when a dot is pressed', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    const touchables = screen.UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(3);
    // press the last dot (page index 2)
    fireEvent.press(touchables[2]);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

});

describe('Pagination - theming and sizing', () => {
  it('uses theme default colors when activeColor/inactiveColor not provided (light)', () => {
    jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('light');
    render(<Pagination currentPage={0} totalPages={2} onPageChange={() => {}} />);
    const views = screen.UNSAFE_getAllByType(Animated.View);
    // Filter to dot views by borderRadius style (unique to dot style)
    const dotViews = views.filter((v) => {
      const styles = (Array.isArray(v.props.style) ? v.props.style : [v.props.style]).flat(Infinity).filter(Boolean);
      return styles.some((s: any) => s && s.borderRadius === 50);
    });
    const dot0Styles = (Array.isArray(dotViews[0].props.style) ? dotViews[0].props.style : [dotViews[0].props.style]).flat(Infinity);
    const dot1Styles = (Array.isArray(dotViews[1].props.style) ? dotViews[1].props.style : [dotViews[1].props.style]).flat(Infinity);
    expect(dot0Styles.some((s: any) => s && s.backgroundColor === '#0a7ea4')).toBe(true); // active
    expect(dot1Styles.some((s: any) => s && s.backgroundColor === '#687076')).toBe(true); // inactive
  });

  it('uses theme default colors when activeColor/inactiveColor not provided (dark)', () => {
    jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('dark');
    render(<Pagination currentPage={0} totalPages={2} onPageChange={() => {}} />);
    const views = screen.UNSAFE_getAllByType(Animated.View);
    const dotViews = views.filter((v) => {
      const styles = (Array.isArray(v.props.style) ? v.props.style : [v.props.style]).flat(Infinity).filter(Boolean);
      return styles.some((s: any) => s && s.borderRadius === 50);
    });
    const dot0Styles = (Array.isArray(dotViews[0].props.style) ? dotViews[0].props.style : [dotViews[0].props.style]).flat(Infinity);
    const dot1Styles = (Array.isArray(dotViews[1].props.style) ? dotViews[1].props.style : [dotViews[1].props.style]).flat(Infinity);
    expect(dot0Styles.some((s: any) => s && s.backgroundColor === '#fff')).toBe(true); // active
    expect(dot1Styles.some((s: any) => s && s.backgroundColor === '#9BA1A6')).toBe(true); // inactive
  });

  it('respects custom active/inactive colors and dot size/spacing', () => {
    render(
      <Pagination
        currentPage={0}
        totalPages={2}
        onPageChange={() => {}}
        activeColor="red"
        inactiveColor="gray"
        dotSize={12}
        spacing={10}
      />
    );
    const views = screen.UNSAFE_getAllByType(Animated.View);
    const dotViews = views.filter((v) => {
      const styles = (Array.isArray(v.props.style) ? v.props.style : [v.props.style]).flat(Infinity).filter(Boolean);
      return styles.some((s: any) => s && s.borderRadius === 50);
    });
    const dot0Styles = (Array.isArray(dotViews[0].props.style) ? dotViews[0].props.style : [dotViews[0].props.style]).flat(Infinity);
    expect(dot0Styles.some((s: any) => s && s.backgroundColor === 'red')).toBe(true);
    expect(dot0Styles.some((s: any) => s && s.width === 12 && s.height === 12)).toBe(true);
  });

});

describe('Pagination - sliding and windowing', () => {
  it('slides when the visible window changes (Animated.timing called)', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');
    const { rerender } = render(
      <Pagination currentPage={0} totalPages={10} maxVisibleDots={5} onPageChange={() => {}} />
    );
    // Move within the same window (no slide expected)
    rerender(<Pagination currentPage={4} totalPages={10} maxVisibleDots={5} onPageChange={() => {}} />);
    const callsBefore = (timingSpy as unknown as jest.Mock).mock.calls.length;
    // Move to next window (should slide)
    rerender(<Pagination currentPage={5} totalPages={10} maxVisibleDots={5} onPageChange={() => {}} />);
    const callsAfter = (timingSpy as unknown as jest.Mock).mock.calls.length;
    expect(callsAfter).toBeGreaterThan(callsBefore);
  });

  it('adjusts start page near the end (endPage === totalPages - 1 branch)', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={9} totalPages={10} maxVisibleDots={5} onPageChange={onPageChange} />
    );
    // Expect visible pages to be [5,6,7,8,9]; pressing first dot should send 5
    const touchables = screen.UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(5);
    fireEvent.press(touchables[0]);
    expect(onPageChange).toHaveBeenCalledWith(5);
    fireEvent.press(touchables[4]);
    expect(onPageChange).toHaveBeenCalledWith(9);
  });

  it('slides backward when the visible window shifts left (direction -1)', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');
    const setValueSpy = jest.spyOn((Animated.Value as any).prototype, 'setValue');

    const { rerender } = render(
      <Pagination currentPage={9} totalPages={10} maxVisibleDots={5} onPageChange={() => {}} />
    );
    rerender(<Pagination currentPage={4} totalPages={10} maxVisibleDots={5} onPageChange={() => {}} />);

    expect((timingSpy as unknown as jest.Mock).mock.calls.length).toBeGreaterThan(0);

    const calls = (setValueSpy as unknown as jest.Mock).mock.calls as any[];
    const lastNumericArg = [...calls].reverse().map(c => c[0]).find(a => typeof a === 'number');
    expect(lastNumericArg).toBeLessThan(0); // negative offset indicates sliding left

    (setValueSpy as unknown as jest.Mock).mockRestore?.();
  });
});


