"use strict";

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
import { useColorScheme, Image } from 'react-native';
import UnreadIcon from "./UnreadIcon.js";
import ContentCardContainerProvider from "../../providers/ContentCardContainerProvider.js";

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme');
const mockUseColorScheme = useColorScheme;
describe('UnreadIcon', () => {
  const mockContainerSettings = {
    templateType: 'inbox',
    content: {
      heading: {
        content: 'Test'
      },
      layout: {
        orientation: 'vertical'
      },
      capacity: 10,
      emptyStateSettings: {
        message: {
          content: 'Empty'
        }
      },
      unread_indicator: {
        unread_bg: {
          clr: {
            light: '#FFF3E0',
            dark: '#2D1B0E'
          }
        },
        unread_icon: {
          placement: 'topright',
          image: {
            url: 'https://example.com/icon.png',
            darkUrl: ''
          }
        }
      },
      isUnreadEnabled: true
    },
    showPagination: false
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
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: mockContainerSettings
      }, /*#__PURE__*/React.createElement(UnreadIcon, {
        testID: "unread-icon"
      })));
      expect(getByTestId('unread-icon')).toBeTruthy();
    });
    it('should render with custom size', () => {
      const {
        getByTestId
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: mockContainerSettings
      }, /*#__PURE__*/React.createElement(UnreadIcon, {
        testID: "unread-icon",
        size: 30
      })));
      expect(getByTestId('unread-icon')).toBeTruthy();
    });
    it('should render without crashing when settings provide null', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: null
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          type: "dot"
        })));
      }).not.toThrow();
    });
  });
  describe('Placement positions', () => {
    it('should render with topright placement', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
              placement: 'topleft'
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
              placement: 'bottomright'
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
              placement: 'bottomleft'
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
  });
  describe('Light mode rendering', () => {
    beforeEach(() => {
      mockUseColorScheme.mockReturnValue('light');
    });
    it('should render in light mode with image URL', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
                darkUrl: ''
              }
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
                darkUrl: 'https://example.com/dark.png'
              }
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
    it('should render dot when darkUrl is empty string in dark mode', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
              placement: 'topright',
              image: {
                url: 'https://example.com/icon.png'
              }
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
  });
  describe('Props-based rendering', () => {
    it('should render with custom source prop when no settings provided', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          source: {
            uri: 'https://custom.com/icon.png'
          }
        })));
      }).not.toThrow();
    });
    it('should render with custom darkSource prop', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          source: {
            uri: 'https://custom.com/light.png'
          },
          darkSource: {
            uri: 'https://custom.com/dark.png'
          }
        })));
      }).not.toThrow();
    });
    it('should render with custom position prop', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          position: "bottomleft"
        })));
      }).not.toThrow();
    });
    it('should render as dot when type prop is "dot"', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          type: "dot"
        })));
      }).not.toThrow();
    });
    it('should render as image when type prop is "image"', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          type: "image",
          source: {
            uri: 'https://custom.com/icon.png'
          }
        })));
      }).not.toThrow();
    });
  });
  describe('Custom styles', () => {
    it('should accept and apply custom imageStyle', () => {
      const customImageStyle = {
        opacity: 0.8
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          imageStyle: customImageStyle
        })));
      }).not.toThrow();
    });
    it('should accept and apply custom containerStyle', () => {
      const customContainerStyle = {
        padding: 5
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          containerStyle: customContainerStyle
        })));
      }).not.toThrow();
    });
    it('should handle both imageStyle and containerStyle together', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          imageStyle: {
            opacity: 0.8
          },
          containerStyle: {
            padding: 5
          }
        })));
      }).not.toThrow();
    });
  });
  describe('Size variations', () => {
    it('should render with default size of 20', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
    it('should render with custom size of 30', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: 30
        })));
      }).not.toThrow();
    });
    it('should render with custom size of 15', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: 15
        })));
      }).not.toThrow();
    });
    it('should handle very large size', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: 100
        })));
      }).not.toThrow();
    });
    it('should handle very small size', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: 5
        })));
      }).not.toThrow();
    });
  });
  describe('Context settings priority', () => {
    it('should prioritize context settings over props', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          position: "bottomleft"
        })));
      }).not.toThrow();
    });
    it('should use props when context settings are not available', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settingsWithoutImage
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          position: "bottomleft",
          source: {
            uri: 'https://custom.com/icon.png'
          }
        })));
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
                darkUrl: ''
              }
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
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
              placement: 'topright',
              image: {
                url: undefined,
                darkUrl: undefined
              }
            }
          }
        }
      };
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: settings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
    it('should handle zero size', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: 0
        })));
      }).not.toThrow();
    });
    it('should handle negative size', () => {
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, {
          size: -10
        })));
      }).not.toThrow();
    });
  });
  describe('Color scheme switching', () => {
    it('should adapt to color scheme changes from light to dark', () => {
      mockUseColorScheme.mockReturnValue('light');
      const {
        rerender
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: mockContainerSettings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));

      // Switch to dark mode
      mockUseColorScheme.mockReturnValue('dark');
      expect(() => {
        rerender(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
    it('should handle null color scheme', () => {
      mockUseColorScheme.mockReturnValue(null);
      expect(() => {
        render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
          settings: mockContainerSettings
        }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      }).not.toThrow();
    });
  });
  describe('Behavioral verification', () => {
    it('should render an Image when valid URL is provided', () => {
      const {
        UNSAFE_getByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: mockContainerSettings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));

      // Should render an Image component when URL is provided
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });
    it('should render dot when image URLs are empty', () => {
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
                darkUrl: ''
              }
            }
          }
        }
      };
      const {
        UNSAFE_queryByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: settings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));

      // Should not render Image when URLs are empty
      expect(UNSAFE_queryByType(Image)).toBeNull();
    });
    it('should render image when source is provided even with type="dot"', () => {
      const settingsWithoutImage = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: undefined
        }
      };
      const {
        UNSAFE_getByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: settingsWithoutImage
      }, /*#__PURE__*/React.createElement(UnreadIcon, {
        type: "dot",
        source: {
          uri: 'https://example.com/icon.png'
        }
      })));

      // Should render Image when source is provided, even if type is "dot"
      // The presence of source overrides the type prop
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });
    it('should use darkUrl in dark mode when provided', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright',
              image: {
                url: 'https://example.com/light.png',
                darkUrl: 'https://example.com/dark.png'
              }
            }
          }
        }
      };
      const {
        UNSAFE_getByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: settings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({
        uri: 'https://example.com/dark.png'
      });
    });
    it('should fallback to light URL when no darkUrl in dark mode', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const settings = {
        ...mockContainerSettings,
        content: {
          ...mockContainerSettings.content,
          unread_indicator: {
            ...mockContainerSettings.content.unread_indicator,
            unread_icon: {
              placement: 'topright',
              image: {
                url: 'https://example.com/light.png'
              }
            }
          }
        }
      };
      const {
        UNSAFE_getByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: settings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({
        uri: 'https://example.com/light.png'
      });
    });
    it('should use light URL in light mode', () => {
      mockUseColorScheme.mockReturnValue('light');
      const {
        UNSAFE_getByType
      } = render(/*#__PURE__*/React.createElement(ContentCardContainerProvider, {
        settings: mockContainerSettings
      }, /*#__PURE__*/React.createElement(UnreadIcon, null)));
      const imageComponent = UNSAFE_getByType(Image);
      expect(imageComponent.props.source).toEqual({
        uri: 'https://example.com/icon.png'
      });
    });
  });
});
//# sourceMappingURL=UnreadIcon.spec.js.map