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

import { render, screen, act } from '@testing-library/react-native';
import React from 'react';
import { Dimensions, Text } from 'react-native';
import EmptyState from './EmptyState';
import { ContentCardContainer } from './ContentCardContainer';

jest.mock('../../hooks', () => ({
  useContentCardUI: jest.fn(),
  useContentContainer: jest.fn(),
}));

const mockContentCardView: jest.Mock = jest.fn((..._args: any[]) => null);
jest.mock('../ContentCardView/ContentCardView', () => {
  return {
    ContentCardView: (props: any) => {
      mockContentCardView(props);
      return null;
    },
  };
});

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
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 800, scale: 2, fontScale: 2 } as any);
  });


  describe('outer container states', () => {
    it('renders loading state', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: true, error: null });

      const Loading = <Text>Loading...</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={baseSettings} isLoading LoadingComponent={Loading} />);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('renders error state', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const ErrorComp = <Text>Error!</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={baseSettings} error={new Error('x')} ErrorComponent={ErrorComp} />);
      expect(screen.getByText('Error!')).toBeTruthy();
    });

    it('renders fallback when no settings provided', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Fallback = <Text>Fallback</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={null} FallbackComponent={Fallback} />);
      expect(screen.getByText('Fallback')).toBeTruthy();
    });

    it('renders outer LoadingComponent when container is loading', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Loading = <Text testID="outer-loading">Loading outer...</Text> as any;
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={baseSettings} isLoading LoadingComponent={Loading} />);
      expect(screen.getByTestId('outer-loading')).toBeTruthy();
    });
  });

  describe('empty content rendering', () => {
    it('renders empty state when content is empty', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={baseSettings} />);
      expect(screen.getByText('No Content Available')).toBeTruthy();
    });

    it('uses light image when colorScheme is null and falls back to default message', () => {
      jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue(null);
      const settings = {
        ...baseSettings,
        content: {
          ...baseSettings.content,
          emptyStateSettings: {
            image: { url: 'https://example.com/light-only.png' }
          } as any
        }
      };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      const { UNSAFE_getByType } = render(<CC surface={surface} settings={settings} />);
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
      const { getByText } = render(<CC surface={surface} settings={baseSettings} />);
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
      render(<CC surface={surface} settings={baseSettings} ErrorComponent={ErrorComp} />);
      expect(screen.getByTestId('inner-error')).toBeTruthy();
    });

    it('uses provided EmptyComponent and passes empty state settings (inner)', () => {
      (useContentContainer as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const EmptyStub = ({ message }: any) => (
        <Text testID="inner-empty">{message?.content}</Text>
      );
      const CC: any = ContentCardContainer;
      render(<CC surface={surface} settings={baseSettings} EmptyComponent={<EmptyStub />} />);
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
      render(<CC surface={surface} settings={baseSettings} />);

      expect(mockContentCardView).toHaveBeenCalled();
      const args = mockContentCardView.mock.calls[0][0];
      expect(args.template).toEqual(template);
      expect(args.style).toEqual(expect.arrayContaining([expect.anything()]));
    });
  });

  describe('capacity and dismissal', () => {
    it('renders up to capacity and backfills after dismiss', async () => {
      const capSettings = {
        ...baseSettings,
        content: { ...baseSettings.content, capacity: 2 },
      };
      (useContentContainer as jest.Mock).mockReturnValue({ settings: capSettings, isLoading: false, error: null });
      const t1 = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T1' }, body: { content: 'B1' }, image: { url: 'u1' } } } };
      const t2 = { id: '2', type: 'SmallImage', data: { content: { title: { content: 'T2' }, body: { content: 'B2' }, image: { url: 'u2' } } } };
      const t3 = { id: '3', type: 'SmallImage', data: { content: { title: { content: 'T3' }, body: { content: 'B3' }, image: { url: 'u3' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [t1, t2, t3], isLoading: false, error: null });

      const CC: any = ContentCardContainer;
      const utils = render(<CC surface={surface} settings={capSettings} />);

      expect(mockContentCardView.mock.calls.length).toBe(2);
      const firstProps = mockContentCardView.mock.calls[0][0];

      await act(async () => {
        firstProps.listener?.('onDismiss', firstProps.template);
      });
      utils.rerender(<CC surface={surface} settings={capSettings} extraData={() => {}} />);

      const renderedIds = mockContentCardView.mock.calls.map(c => c[0].template.id);
      expect(renderedIds).toEqual(expect.arrayContaining(['3']));
      const lastTwoIds = renderedIds.slice(-2);
      expect(lastTwoIds).not.toEqual(expect.arrayContaining(['1']));
    });
  });
});