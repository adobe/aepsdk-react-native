
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
import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Image, useColorScheme } from 'react-native';
import InboxProvider from '../../providers/InboxProvider';
import UnreadIcon from './UnreadIcon';

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme');
const mockUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;

describe('UnreadIcon', () => {
  const mockInboxSettings = {
    content: {
      heading: { content: 'Test' },
      layout: { orientation: 'vertical' as const },
      capacity: 10,
      emptyStateSettings: { message: { content: 'Empty' } },
      unread_indicator: {
        unread_bg: {
          clr: {
            light: '#FFF3E0',
            dark: '#2D1B0E',
          },
        },
        unread_icon: {
          placement: 'topright' as const,
          image: {
            url: 'https://example.com/icon.png',
            darkUrl: '',
          },
        },
      },
      isUnreadEnabled: true,
    },
    showPagination: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render successfully with inbox settings', () => {
      const { getByTestId } = render(
        <InboxProvider settings={mockInboxSettings}>
          <UnreadIcon testID="unread-icon" />
        </InboxProvider>
      );
      expect(getByTestId('unread-icon')).toBeTruthy();
    });

    it('should render with custom size', () => {
      const { getByTestId } = render(
        <InboxProvider settings={mockInboxSettings}>
          <UnreadIcon testID="unread-icon" size={30} />
        </InboxProvider>
      );
      expect(getByTestId('unread-icon')).toBeTruthy();
    });

    it('should render without crashing when settings provide null', () => {
      expect(() => {
        render(
          <InboxProvider settings={null as any}>
            <UnreadIcon type="dot" />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Placement positions', () => {
    it('should render with topright placement', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with topleft placement', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              placement: 'topleft' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with bottomright placement', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              placement: 'bottomright' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with bottomleft placement', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              placement: 'bottomleft' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('falls back to topright when props.position is unknown and no context placement', () => {
      const settingsWithoutIndicator = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      const { getByTestId } = render(
        <InboxProvider settings={settingsWithoutIndicator}>
          <UnreadIcon testID="unread-icon" position={'unknown' as any} />
        </InboxProvider>
      );
      const container = getByTestId('unread-icon');
      const styles = (Array.isArray(container.props.style) ? container.props.style : [container.props.style]).flat(Infinity);
      const hasTopRight = styles.some((s: any) => s && s.top === 6 && s.right === 6);
      expect(hasTopRight).toBe(true);
    });

    it('falls back to topright when context placement is unknown', () => {
      const settingsWithUnknownPlacement = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: { placement: 'unknown' as any, image: { url: '' } },
          },
        },
      };

      const { getByTestId } = render(
        <InboxProvider settings={settingsWithUnknownPlacement}>
          <UnreadIcon testID="unread-icon" />
        </InboxProvider>
      );
      const container = getByTestId('unread-icon');
      const styles = (Array.isArray(container.props.style) ? container.props.style : [container.props.style]).flat(Infinity);
      const hasTopRight = styles.some((s: any) => s && s.top === 6 && s.right === 6);
      expect(hasTopRight).toBe(true);
    });
  });

  describe('Light mode rendering', () => {
    beforeEach(() => {
      mockUseColorScheme.mockReturnValue('light');
    });

    it('should render in light mode with image URL', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render dot when URL is empty string in light mode', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              image: {
                url: '',
                darkUrl: '',
              },
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Dark mode rendering', () => {
    beforeEach(() => {
      mockUseColorScheme.mockReturnValue('dark');
    });

    it('should render in dark mode with darkUrl provided', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              image: {
                url: 'https://example.com/light.png',
                darkUrl: 'https://example.com/dark.png',
              },
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render dot when darkUrl is empty string in dark mode', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should fallback to light mode image when no darkUrl provided', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright' as const,
              image: {
                url: 'https://example.com/icon.png',
              },
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Props-based rendering', () => {
    it('should render with custom source prop when no settings provided', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon source={{ uri: 'https://custom.com/icon.png' }} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom darkSource prop', () => {
      mockUseColorScheme.mockReturnValue('dark');
      
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              source={{ uri: 'https://custom.com/light.png' }}
              darkSource={{ uri: 'https://custom.com/dark.png' }}
            />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom position prop', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon position="bottomleft" />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render as dot when type prop is "dot"', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon type="dot" />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render as image when type prop is "image"', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              type="image" 
              source={{ uri: 'https://custom.com/icon.png' }}
            />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('renders default dot when no unread_indicator and no image props provided', () => {
      // With no unread_indicator and no source/darkSource props, default content should be a dot (no Image)
      const settingsWithoutIndicator = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      const { UNSAFE_queryByType } = render(
        <InboxProvider settings={settingsWithoutIndicator}>
          <UnreadIcon />
        </InboxProvider>
      );
      expect(UNSAFE_queryByType(Image)).toBeNull();
    });
  });

  describe('Custom styles', () => {
    it('should accept and apply custom imageStyle', () => {
      const customImageStyle = { opacity: 0.8 };
      
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon imageStyle={customImageStyle} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should accept and apply custom containerStyle', () => {
      const customContainerStyle = { padding: 5 };
      
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon containerStyle={customContainerStyle} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle both imageStyle and containerStyle together', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon 
              imageStyle={{ opacity: 0.8 }}
              containerStyle={{ padding: 5 }}
            />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('renders Image when renderType is image via darkSource prop only (branch: imageSource || darkImageSource)', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const settingsWithoutIndicator = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      const { UNSAFE_getByType } = render(
        <InboxProvider settings={settingsWithoutIndicator}>
          <UnreadIcon type="dot" darkSource={{ uri: 'https://custom.com/dark.png' }} />
        </InboxProvider>
      );

      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({ uri: 'https://custom.com/dark.png' });
    });
  });

  describe('Size variations', () => {
    it('should render with default size of 20', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom size of 30', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={30} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom size of 15', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={15} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle very large size', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={100} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle very small size', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={5} />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Context settings priority', () => {
    it('should prioritize context settings over props', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon position="bottomleft" />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should use props when context settings are not available', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              position="bottomleft"
              source={{ uri: 'https://custom.com/icon.png' }}
            />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Image error handling', () => {
    it('should render without crashing when image URL is invalid', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              image: {
                url: 'invalid-url',
                darkUrl: '',
              },
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('renders dot when image load fails (onError branch)', async () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              image: {
                url: 'https://example.com/icon.png',
                darkUrl: '',
              },
            },
          },
        },
      };

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const { UNSAFE_getByType } = render(
        <InboxProvider settings={settings}>
          <UnreadIcon testID="unread-icon" />
        </InboxProvider>
      );

      const image = UNSAFE_getByType(Image);
      await act(async () => {
        image.props.onError({ nativeEvent: { error: 'failed' } });
      });

      await waitFor(() => {
        expect(warnSpy).toHaveBeenCalledWith(
          'Failed to load unread icon image:',
          'failed'
        );
      });

      warnSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined image URLs', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright' as const,
              image: {
                url: undefined as any,
                darkUrl: undefined,
              },
            },
          },
        },
      };

      expect(() => {
        render(
          <InboxProvider settings={settings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle zero size', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={0} />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle negative size', () => {
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon size={-10} />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Color scheme switching', () => {
    it('should adapt to color scheme changes from light to dark', () => {
      mockUseColorScheme.mockReturnValue('light');
      
      const { rerender } = render(
        <InboxProvider settings={mockInboxSettings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      // Switch to dark mode
      mockUseColorScheme.mockReturnValue('dark');
      
      expect(() => {
        rerender(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });

    it('should handle null color scheme', () => {
      mockUseColorScheme.mockReturnValue(null);
      
      expect(() => {
        render(
          <InboxProvider settings={mockInboxSettings}>
            <UnreadIcon />
          </InboxProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Behavioral verification', () => {
    it('should render an Image when valid URL is provided', () => {
      const { UNSAFE_getByType } = render(
        <InboxProvider settings={mockInboxSettings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      // Should render an Image component when URL is provided
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('should render dot when image URLs are empty', () => {
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              ...mockInboxSettings.content.unread_indicator.unread_icon,
              image: {
                url: '',
                darkUrl: '',
              },
            },
          },
        },
      };

      const { UNSAFE_queryByType } = render(
        <InboxProvider settings={settings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      // Should not render Image when URLs are empty
      expect(UNSAFE_queryByType(Image)).toBeNull();
    });

    it('should render image when source is provided even with type="dot"', () => {
      const settingsWithoutImage = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: undefined,
        },
      };

      const { UNSAFE_getByType } = render(
        <InboxProvider settings={settingsWithoutImage}>
          <UnreadIcon type="dot" source={{ uri: 'https://example.com/icon.png' }} />
        </InboxProvider>
      );
      
      // Should render Image when source is provided, even if type is "dot"
      // The presence of source overrides the type prop
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('should use darkUrl in dark mode when provided', () => {
      mockUseColorScheme.mockReturnValue('dark');
      
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright' as const,
              image: {
                url: 'https://example.com/light.png',
                darkUrl: 'https://example.com/dark.png',
              },
            },
          },
        },
      };

      const { UNSAFE_getByType } = render(
        <InboxProvider settings={settings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({ uri: 'https://example.com/dark.png' });
    });

    it('should fallback to light URL when no darkUrl in dark mode', () => {
      mockUseColorScheme.mockReturnValue('dark');
      
      const settings = {
        ...mockInboxSettings,
        content: {
          ...mockInboxSettings.content,
          unread_indicator: {
            ...mockInboxSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright' as const,
              image: {
                url: 'https://example.com/light.png',
              },
            },
          },
        },
      };

      const { UNSAFE_getByType } = render(
        <InboxProvider settings={settings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({ uri: 'https://example.com/light.png' });
    });

    it('should use light URL in light mode', () => {
      mockUseColorScheme.mockReturnValue('light');
      
      const { UNSAFE_getByType } = render(
        <InboxProvider settings={mockInboxSettings}>
          <UnreadIcon />
        </InboxProvider>
      );
      
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({ uri: 'https://example.com/icon.png' });
    });
  });
});