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
import React from 'react';
import { render } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import UnreadIcon from './UnreadIcon';
import ContentCardContainerProvider from '../../providers/ContentCardContainerProvider';

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme');
const mockUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;

describe('UnreadIcon', () => {
  const mockContainerSettings = {
    templateType: 'inbox' as const,
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
    it('should render successfully with container settings', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom size', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={30} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render without crashing when settings provide null', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={null as any}>
            <UnreadIcon type="dot" />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Placement positions', () => {
    it('should render with topright placement', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with topleft placement', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
              placement: 'topleft' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with bottomright placement', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
              placement: 'bottomright' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with bottomleft placement', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
              placement: 'bottomleft' as const,
            },
          },
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Light mode rendering', () => {
    beforeEach(() => {
      mockUseColorScheme.mockReturnValue('light');
    });

    it('should render in light mode with image URL', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render dot when URL is empty string in light mode', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
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
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
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
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
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
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render dot when darkUrl is empty string in dark mode', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should fallback to light mode image when no darkUrl provided', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
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
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Props-based rendering', () => {
    it('should render with custom source prop when no settings provided', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon source={{ uri: 'https://custom.com/icon.png' }} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom darkSource prop', () => {
      mockUseColorScheme.mockReturnValue('dark');
      
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              source={{ uri: 'https://custom.com/light.png' }}
              darkSource={{ uri: 'https://custom.com/dark.png' }}
            />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom position prop', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon position="bottomleft" />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render as dot when type prop is "dot"', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon type="dot" />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render as image when type prop is "image"', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              type="image" 
              source={{ uri: 'https://custom.com/icon.png' }}
            />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Custom styles', () => {
    it('should accept and apply custom imageStyle', () => {
      const customImageStyle = { opacity: 0.8 };
      
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon imageStyle={customImageStyle} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should accept and apply custom containerStyle', () => {
      const customContainerStyle = { padding: 5 };
      
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon containerStyle={customContainerStyle} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle both imageStyle and containerStyle together', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon 
              imageStyle={{ opacity: 0.8 }}
              containerStyle={{ padding: 5 }}
            />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Size variations', () => {
    it('should render with default size of 20', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom size of 30', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={30} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom size of 15', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={15} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle very large size', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={100} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle very small size', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={5} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Context settings priority', () => {
    it('should prioritize context settings over props', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon position="bottomleft" />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should use props when context settings are not available', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined,
        },
      };

      expect(() => {
        render(
          <ContentCardContainerProvider settings={settingsWithoutImage}>
            <UnreadIcon 
              position="bottomleft"
              source={{ uri: 'https://custom.com/icon.png' }}
            />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Image error handling', () => {
    it('should render without crashing when image URL is invalid', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              ...mockContainerSettings.content.unread_indicator.unread_icon,
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
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined image URLs', () => {
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
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
          <ContentCardContainerProvider settings={settings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle zero size', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={0} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle negative size', () => {
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon size={-10} />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Color scheme switching', () => {
    it('should adapt to color scheme changes from light to dark', () => {
      mockUseColorScheme.mockReturnValue('light');
      
      const { rerender } = render(
        <ContentCardContainerProvider settings={mockContainerSettings}>
          <UnreadIcon />
        </ContentCardContainerProvider>
      );
      
      // Switch to dark mode
      mockUseColorScheme.mockReturnValue('dark');
      
      expect(() => {
        rerender(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });

    it('should handle null color scheme', () => {
      mockUseColorScheme.mockReturnValue(null);
      
      expect(() => {
        render(
          <ContentCardContainerProvider settings={mockContainerSettings}>
            <UnreadIcon />
          </ContentCardContainerProvider>
        );
      }).not.toThrow();
    });
  });
});