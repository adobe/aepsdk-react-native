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

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Dimensions, Text } from 'react-native';
import EmptyState from './EmptyState';
import { ContentCardContainer } from './ContentCardContainer';

// Mock hooks used by the container
jest.mock('../../hooks', () => ({
  useContentCardUI: jest.fn(),
  useContentContainer: jest.fn(),
}));

// Capture props passed to ContentCardView (name must start with mock for Jest scope rules)
const mockContentCardView: jest.Mock = jest.fn((..._args: any[]) => null);
jest.mock('../ContentCardView/ContentCardView', () => {
  return {
    ContentCardView: (props: any) => {
      mockContentCardView(props);
      return null;
    },
  };
});

// Provide a pass-through for the provider
jest.mock('../../providers/ContentCardContainerProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

const { useContentCardUI, useContentContainer } = jest.requireMock('../../hooks');

describe('ContentCardContainer', () => {
  const surface = 'test-surface';

  const baseSettings = {
    templateType: 'inbox',
    content: {
      heading: { content: 'Heading' },
      layout: { orientation: 'horizontal' as const },
      capacity: 10,
      emptyStateSettings: {
        message: { content: 'No Content Available' },
        image: { light: { url: 'https://example.com/image.png' } },
      },
      unread_indicator: {
        unread_bg: { clr: { light: '#EEE', dark: '#111' } },
        unread_icon: { placement: 'topright', image: { url: 'https://example.com/icon.png' } },
      },
      isUnreadEnabled: true,
    },
    showPagination: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default Dimensions width for deterministic style assertions
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 800, scale: 2, fontScale: 2 } as any);
  });


  describe('outer container states', () => {
    it('renders loading state', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: true, error: null });

      const Loading = <Text>Loading...</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} LoadingComponent={Loading} />);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('renders error state', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: new Error('x') });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const ErrorComp = <Text>Error!</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} ErrorComponent={ErrorComp} />);
      expect(screen.getByText('Error!')).toBeTruthy();
    });

    it('renders fallback when no content yet', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: undefined, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Fallback = <Text>Fallback</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} FallbackComponent={Fallback} />);
      expect(screen.getByText('Fallback')).toBeTruthy();
    });

    it('renders outer LoadingComponent when container is loading', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: undefined, isLoading: true, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Loading = <Text testID="outer-loading">Loading outer...</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} LoadingComponent={Loading} />);
      expect(screen.getByTestId('outer-loading')).toBeTruthy();
    });
  });

  describe('empty content rendering', () => {
    it('renders empty state when content is empty', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      render(<CC surface={surface} />);
      expect(screen.getByText('No Content Available')).toBeTruthy();
    });

    it('uses light image when colorScheme is null and falls back to default message', () => {
      jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue(null);
      const settings = {
        ...baseSettings,
        content: {
          ...baseSettings.content,
          emptyStateSettings: {
            image: { light: { url: 'https://example.com/light-only.png' } }
          } as any
        }
      };
      (useContentContainer as jest.Mock).mockReturnValue({ settings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      const { UNSAFE_getByType } = render(<CC surface={surface} />);
      const empty = UNSAFE_getByType(EmptyState);
      expect(empty.props.image).toBe('https://example.com/light-only.png');
      expect(empty.props.text).toBe('No Content Available');
    });
  });

  describe('heading and layout', () => {
    it('sets heading color based on color scheme: dark -> #FFFFFF', () => {
      jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('dark');
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });
      const CC: any = ContentCardContainer;
      const { getByText } = render(<CC surface={surface} />);
      const heading = getByText('Heading');
      const styles = Array.isArray(heading.props.style) ? heading.props.style : [heading.props.style];
      expect(styles.some((s: any) => s && s.color === '#FFFFFF')).toBe(true);
    });
  });

  describe('inner container states', () => {
    it('renders inner ErrorComponent when data hook errors', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: new Error('inner') });

      const ErrorComp = <Text testID="inner-error">Inner Error!</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} ErrorComponent={ErrorComp} />);
      expect(screen.getByTestId('inner-error')).toBeTruthy();
    });

    it('uses provided EmptyComponent and passes empty state settings (inner)', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const EmptyStub = ({ message }: any) => (
        <Text testID="inner-empty">{message?.content}</Text>
      );
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} EmptyComponent={<EmptyStub />} />);
      expect(screen.getByTestId('inner-empty')).toBeTruthy();
      expect(screen.getByText('No Content Available')).toBeTruthy();
    });

    it('renders inner FallbackComponent when content is undefined and settings exist', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Fallback = <Text testID="inner-fallback">Inner Fallback</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} FallbackComponent={Fallback} />);
      expect(screen.getByTestId('inner-fallback')).toBeTruthy();
    });
  });

  describe('renderItem passthrough', () => {
    it('passes expected props to ContentCardView via renderItem (horizontal)', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      render(<CC surface={surface} />);

      expect(mockContentCardView).toHaveBeenCalled();
      const args = mockContentCardView.mock.calls[0][0];
      expect(args.template).toEqual(template);
      expect(args.style).toEqual(expect.arrayContaining([expect.anything()]));
    });
  });
});