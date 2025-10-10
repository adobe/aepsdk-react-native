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
import { render, screen } from '@testing-library/react-native';
import { Dimensions, Text } from 'react-native';
import { ContentCardContainer } from "./ContentCardContainer.js";

// Mock hooks used by the container
jest.mock('../../hooks', () => ({
  useContentCardUI: jest.fn(),
  useContentContainer: jest.fn()
}));

// Capture props passed to ContentCardView (name must start with mock for Jest scope rules)
const mockContentCardView = jest.fn((..._args) => null);
jest.mock('../ContentCardView/ContentCardView', () => {
  return {
    ContentCardView: props => {
      mockContentCardView(props);
      return null;
    }
  };
});

// Provide a pass-through for the provider
jest.mock('../../providers/ContentCardContainerProvider', () => ({
  __esModule: true,
  default: ({
    children
  }) => children
}));
const {
  useContentCardUI,
  useContentContainer
} = jest.requireMock('../../hooks');
describe('ContentCardContainer', () => {
  const surface = 'test-surface';
  const baseSettings = {
    templateType: 'inbox',
    content: {
      heading: {
        content: 'Heading'
      },
      layout: {
        orientation: 'horizontal'
      },
      capacity: 10,
      emptyStateSettings: {
        message: {
          content: 'No Content Available'
        },
        image: {
          light: {
            url: 'https://example.com/image.png'
          }
        }
      },
      unread_indicator: {
        unread_bg: {
          clr: {
            light: '#EEE',
            dark: '#111'
          }
        },
        unread_icon: {
          placement: 'topright',
          image: {
            url: 'https://example.com/icon.png'
          }
        }
      },
      isUnreadEnabled: true
    },
    showPagination: false
  };
  beforeEach(() => {
    jest.clearAllMocks();
    // Default Dimensions width for deterministic style assertions
    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 2
    });
  });
  it('renders loading state', () => {
    useContentContainer.mockReturnValue({
      settings: baseSettings,
      isLoading: false,
      error: null
    });
    useContentCardUI.mockReturnValue({
      content: undefined,
      isLoading: true,
      error: null
    });
    const Loading = /*#__PURE__*/React.createElement(Text, null, "Loading...");
    const CC = ContentCardContainer;
    render(/*#__PURE__*/React.createElement(CC, {
      surface: surface,
      LoadingComponent: Loading
    }));
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
  it('renders error state', () => {
    // Outer container handles ErrorComponent when useContentContainer has an error
    useContentContainer.mockReturnValue({
      settings: baseSettings,
      isLoading: false,
      error: new Error('x')
    });
    useContentCardUI.mockReturnValue({
      content: undefined,
      isLoading: false,
      error: null
    });
    const ErrorComp = /*#__PURE__*/React.createElement(Text, null, "Error!");
    const CC = ContentCardContainer;
    render(/*#__PURE__*/React.createElement(CC, {
      surface: surface,
      ErrorComponent: ErrorComp
    }));
    expect(screen.getByText('Error!')).toBeTruthy();
  });
  it('renders fallback when no content yet', () => {
    // Outer container handles FallbackComponent when settings are missing
    useContentContainer.mockReturnValue({
      settings: undefined,
      isLoading: false,
      error: null
    });
    useContentCardUI.mockReturnValue({
      content: undefined,
      isLoading: false,
      error: null
    });
    const Fallback = /*#__PURE__*/React.createElement(Text, null, "Fallback");
    const CC = ContentCardContainer;
    render(/*#__PURE__*/React.createElement(CC, {
      surface: surface,
      FallbackComponent: Fallback
    }));
    expect(screen.getByText('Fallback')).toBeTruthy();
  });
  it('renders empty state when content is empty', () => {
    useContentContainer.mockReturnValue({
      settings: baseSettings,
      isLoading: false,
      error: null
    });
    useContentCardUI.mockReturnValue({
      content: [],
      isLoading: false,
      error: null
    });
    const CC = ContentCardContainer;
    render(/*#__PURE__*/React.createElement(CC, {
      surface: surface
    }));
    expect(screen.getByText('No Content Available')).toBeTruthy();
  });
});
//# sourceMappingURL=ContentCardContainer.spec.js.map