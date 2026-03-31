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

import { render, screen, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Dimensions, Text } from 'react-native';
import { generateCardHash } from '../../utils/generateCardHash';
import EmptyState from './EmptyState';
import { Inbox } from './Inbox';

jest.mock('../../hooks', () => ({
  useContentCardUI: jest.fn(),
  useInbox: jest.fn(),
}));

jest.mock('../../utils/inboxStorage', () => ({
  loadInboxState: jest.fn().mockResolvedValue({ dismissed: [], interacted: [] }),
  saveInboxState: jest.fn().mockResolvedValue(undefined),
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

jest.mock('../../providers/InboxProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

// jest.mock('../../hooks/useAspectRatio', () => ({
//   __esModule: true,
//   default: () => 1.5,
// }));

const { useContentCardUI, useInbox } = jest.requireMock('../../hooks');
const { loadInboxState, saveInboxState } = jest.requireMock('../../utils/inboxStorage');

describe('Inbox', () => {
  const surface = 'test-surface';

  const baseSettings = {
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


  describe('outer inbox states', () => {
    it('renders loading state', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: true, error: null });

      const Loading = <Text>Loading...</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} isLoading LoadingComponent={Loading} />);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('renders error state', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const ErrorComp = <Text>Error!</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} error={new Error('x')} ErrorComponent={ErrorComp} />);
      expect(screen.getByText('Error!')).toBeTruthy();
    });

    it('renders fallback when no settings provided', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Fallback = <Text>Fallback</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} settings={null} FallbackComponent={Fallback} />);
      expect(screen.getByText('Fallback')).toBeTruthy();
    });

    it('renders outer LoadingComponent when inbox is loading', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Loading = <Text testID="outer-loading">Loading outer...</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} isLoading LoadingComponent={Loading} />);
      expect(screen.getByTestId('outer-loading')).toBeTruthy();
    });
  });

  describe('empty content rendering', () => {
    it('renders empty state when content is empty', () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} />);
      expect(screen.getByText('No Content Available')).toBeTruthy();
    });

    it('handles empty content array', () => {
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} />);

      expect(mockContentCardView.mock.calls.length).toBe(0);
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

      const CC: any = Inbox;
      const { UNSAFE_getByType } = render(<CC surface={surface} settings={settings} />);
      const empty = UNSAFE_getByType(EmptyState);
      expect(empty.props.image).toBe('https://example.com/light-only.png');
      expect(empty.props.text).toBe('No Content Available');
    });
  });

  describe('heading and layout', () => {
    it('sets heading color based on color scheme: dark -> #FFFFFF', () => {
      jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('dark');
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });
      const CC: any = Inbox;
      const { getByText } = render(<CC surface={surface} settings={baseSettings} />);
      const heading = getByText('Heading');
      const styles = Array.isArray(heading.props.style) ? heading.props.style : [heading.props.style];
      expect(styles.some((s: any) => s && s.color === '#FFFFFF')).toBe(true);
    });
  });

  describe('inner inbox states', () => {
    it('renders inner ErrorComponent when data hook errors', () => {
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: new Error('inner') });

      const ErrorComp = <Text testID="inner-error">Inner Error!</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} ErrorComponent={ErrorComp} />);
      expect(screen.getByTestId('inner-error')).toBeTruthy();
    });

    it('uses provided EmptyComponent and passes empty state settings (inner)', () => {
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [], isLoading: false, error: null });

      const EmptyStub = ({ message }: any) => (
        <Text testID="inner-empty">{message?.content}</Text>
      );
      const CC: any = Inbox;
      render(<CC surface={surface} settings={baseSettings} EmptyComponent={<EmptyStub />} />);
      expect(screen.getByTestId('inner-empty')).toBeTruthy();
      expect(screen.getByText('No Content Available')).toBeTruthy();
    });

    it('renders inner FallbackComponent when content is undefined and settings exist', () => {
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: undefined, isLoading: false, error: null });

      const Fallback = <Text testID="inner-fallback">Inner Fallback</Text> as any;
      const CC: any = Inbox;
      render(<CC surface={surface} FallbackComponent={Fallback} />);
      expect(screen.getByTestId('inner-fallback')).toBeTruthy();
    });
  });

  describe('renderItem passthrough', () => {
    it('passes expected props to ContentCardView via renderItem (horizontal)', () => {
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const CC: any = Inbox;
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
      (useInbox as jest.Mock).mockReturnValue({ settings: capSettings, isLoading: false, error: null });
      const t1 = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T1' }, body: { content: 'B1' }, image: { url: 'u1' } } } };
      const t2 = { id: '2', type: 'SmallImage', data: { content: { title: { content: 'T2' }, body: { content: 'B2' }, image: { url: 'u2' } } } };
      const t3 = { id: '3', type: 'SmallImage', data: { content: { title: { content: 'T3' }, body: { content: 'B3' }, image: { url: 'u3' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [t1, t2, t3], isLoading: false, error: null });

      const CC: any = Inbox;
      const utils = render(<CC surface={surface} settings={capSettings} />);

      await waitFor(() => {
        expect(mockContentCardView.mock.calls.length).toBeGreaterThanOrEqual(2);
      });
      // Get the last render's calls (component may render multiple times)
      const lastTwoCalls = mockContentCardView.mock.calls.slice(-2);
      expect(lastTwoCalls.length).toBe(2);
      const firstProps = lastTwoCalls[0][0];

      await act(async () => {
        firstProps.listener?.('onDismiss', firstProps.template);
      });
      mockContentCardView.mockClear();
      utils.rerender(<CC surface={surface} settings={capSettings} extraData={() => {}} />);

      await waitFor(() => {
        expect(mockContentCardView.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
      const renderedIds = mockContentCardView.mock.calls.map(c => c[0].template.id);
      expect(renderedIds).toEqual(expect.arrayContaining(['3']));
      expect(renderedIds).not.toContain('1');
    });
  });

  describe('layout and styling', () => {
    it('renders cards vertically when layout orientation is vertical', () => {
      const verticalSettings = {
        ...baseSettings,
        content: { ...baseSettings.content, layout: { orientation: 'vertical' as const } },
      };
      (useInbox as jest.Mock).mockReturnValue({ settings: verticalSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const CC: any = Inbox;
      render(<CC surface={surface} settings={verticalSettings} />);

      expect(mockContentCardView).toHaveBeenCalled();
      const args = mockContentCardView.mock.calls[0][0];
      expect(args.style).toBeUndefined();
    });

    it('does not render heading when heading content is not provided', () => {
      const settingsWithoutHeading = {
        ...baseSettings,
        content: { ...baseSettings.content, heading: undefined },
      };
      (useInbox as jest.Mock).mockReturnValue({ settings: settingsWithoutHeading, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const CC: any = Inbox;
      const { queryByText } = render(<CC surface={surface} settings={settingsWithoutHeading} />);

      expect(queryByText('Heading')).toBeNull();
    });
  });

  describe('interaction tracking', () => {
    it('does not add duplicate entries to store on multiple interactions', async () => {
      const testSurface = 'test-surface-duplicate-interact';
      (useInbox as jest.Mock).mockReturnValue({ settings: baseSettings, isLoading: false, error: null });
      const template = { id: '1', type: 'SmallImage', data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } } };
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const CC: any = Inbox;
      render(<CC surface={testSurface} settings={baseSettings} />);

      await waitFor(() => {
        expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0);
      });

      const args = mockContentCardView.mock.calls[0][0];

      await act(async () => {
        args.listener?.('onInteract', args.template);
        args.listener?.('onInteract', args.template);
        args.listener?.('onInteract', args.template);
      });

      const newContent = [{ ...template }];
      (useContentCardUI as jest.Mock).mockReturnValue({ content: newContent, isLoading: false, error: null });
      mockContentCardView.mockClear();

      render(<CC surface={testSurface} settings={baseSettings} />);
      await waitFor(() => {
        expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0);
      });

      const updatedArgs = mockContentCardView.mock.calls[0][0];
      expect(updatedArgs.template.isRead).toBe(true);
    });
  });

  describe('loadInboxState effect (persisted state merge)', () => {
    const template = {
      id: '1',
      type: 'SmallImage',
      data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } },
    };

    it('merges persisted dismissed ids from loadInboxState into the store so those cards are not shown', async () => {
      const hash = generateCardHash(template as any);
      (loadInboxState as jest.Mock).mockResolvedValueOnce({ dismissed: [hash], interacted: [] });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const settingsWithActivity = {
        ...baseSettings,
        activityId: 'activity-load-merge',
      };
      const CC: any = Inbox;
      render(<CC surface="surface-load-merge" settings={settingsWithActivity} />);

      await waitFor(() => {
        expect(loadInboxState).toHaveBeenCalledWith('activity-load-merge');
      });
      await waitFor(() => {
        expect(screen.getByText('No Content Available')).toBeTruthy();
      });
    });

    it('merges persisted interacted ids when isUnreadEnabled and marks matching cards as read', async () => {
      const hash = generateCardHash(template as any);
      (loadInboxState as jest.Mock).mockResolvedValueOnce({ dismissed: [], interacted: [hash] });
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const settingsWithActivity = {
        ...baseSettings,
        activityId: 'activity-load-interacted',
        content: { ...baseSettings.content, isUnreadEnabled: true },
      };
      const CC: any = Inbox;
      render(<CC surface="surface-load-interacted" settings={settingsWithActivity} />);

      await waitFor(() => expect(loadInboxState).toHaveBeenCalledWith('activity-load-interacted'));
      await waitFor(() => expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0));
      const props = mockContentCardView.mock.calls[mockContentCardView.mock.calls.length - 1][0];
      expect(props.template.isRead).toBe(true);
    });

    it('applies cleanup so resolving loadInboxState after unmount does not throw', async () => {
      let resolveLoad: (v: { dismissed: string[]; interacted: string[] }) => void;
      const loadPromise = new Promise<{ dismissed: string[]; interacted: string[] }>((resolve) => {
        resolveLoad = resolve;
      });
      (loadInboxState as jest.Mock).mockImplementationOnce(() => loadPromise);
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });

      const settingsWithActivity = {
        ...baseSettings,
        activityId: 'activity-load-cancel',
      };
      const CC: any = Inbox;
      const { unmount } = render(<CC surface="surface-load-cancel" settings={settingsWithActivity} />);

      unmount();
      await act(async () => {
        resolveLoad!({ dismissed: [], interacted: [] });
        await loadPromise;
      });
    });
  });

  describe('saveInboxState on card events', () => {
    const template = {
      id: '1',
      type: 'SmallImage',
      data: { content: { title: { content: 'T' }, body: { content: 'B' }, image: { url: 'u' } } },
    };

    it('calls saveInboxState on onDismiss when activityId is set', async () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });
      const settingsWithActivity = {
        ...baseSettings,
        activityId: 'activity-save-dismiss',
      };
      const CC: any = Inbox;
      render(<CC surface="surface-save-dismiss" settings={settingsWithActivity} />);

      await waitFor(() => expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0));
      const props = mockContentCardView.mock.calls[0][0];
      const expectedHash = generateCardHash(template as any);

      await act(async () => {
        props.listener?.('onDismiss', props.template);
      });

      expect(saveInboxState).toHaveBeenCalledWith(
        'activity-save-dismiss',
        expect.objectContaining({
          dismissed: expect.arrayContaining([expectedHash]),
          interacted: [],
        })
      );
    });

    it('calls saveInboxState on onInteract when activityId is set and unread is enabled', async () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });
      const settingsWithActivity = {
        ...baseSettings,
        activityId: 'activity-save-interact',
        content: { ...baseSettings.content, isUnreadEnabled: true },
      };
      const CC: any = Inbox;
      render(<CC surface="surface-save-interact" settings={settingsWithActivity} />);

      await waitFor(() => expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0));
      const props = mockContentCardView.mock.calls[0][0];
      const expectedHash = generateCardHash(template as any);

      await act(async () => {
        props.listener?.('onInteract', props.template);
      });

      expect(saveInboxState).toHaveBeenCalledWith(
        'activity-save-interact',
        expect.objectContaining({
          dismissed: [],
          interacted: expect.arrayContaining([expectedHash]),
        })
      );
    });

    it('does not call saveInboxState on dismiss when activityId is missing', async () => {
      (useContentCardUI as jest.Mock).mockReturnValue({ content: [template], isLoading: false, error: null });
      (saveInboxState as jest.Mock).mockClear();

      const CC: any = Inbox;
      render(<CC surface="surface-no-activity" settings={baseSettings} />);

      await waitFor(() => expect(mockContentCardView.mock.calls.length).toBeGreaterThan(0));
      const props = mockContentCardView.mock.calls[0][0];

      await act(async () => {
        props.listener?.('onDismiss', props.template);
      });

      expect(saveInboxState).not.toHaveBeenCalled();
    });
  });
});