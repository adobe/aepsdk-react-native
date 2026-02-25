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

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Image, Linking } from 'react-native';
import MessagingEdgeEventType from "../../../models/MessagingEdgeEventType.js";
import UnreadIcon from "../UnreadIcon/UnreadIcon.js";
import { ContentCardView } from "./ContentCardView.js";

// Mock aspect ratio hook to a stable value
jest.mock('../../hooks/useAspectRatio', () => ({
  __esModule: true,
  default: () => 1.5
}));

// Mock inbox settings (unread enabled)
jest.mock('../../hooks/useInboxSettings', () => {
  const fn = jest.fn(() => ({
    content: {
      isUnreadEnabled: true,
      unread_indicator: {
        unread_bg: {
          clr: {
            light: '#EEE',
            dark: '#111'
          }
        }
      }
    }
  }));
  return {
    __esModule: true,
    default: fn
  };
});
const makeTemplate = (overrides = {}) => ({
  id: 'card-1',
  type: 'SmallImage',
  isRead: false,
  data: {
    content: {
      title: {
        content: 'Title'
      },
      body: {
        content: 'Body'
      },
      image: {
        url: 'https://example.com/img.png'
      },
      dismissBtn: {
        style: 'close'
      },
      actionUrl: 'https://adobe.com'
    }
  },
  track: jest.fn(),
  ...overrides
});
describe('ContentCardView - rendering variants', () => {
  it('renders SmallImage with title and body', () => {
    const template = makeTemplate({
      type: 'SmallImage'
    });
    const {
      getByText
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
  });
  it('falls back to SmallImage when variant and template.type are missing', () => {
    const template = makeTemplate({
      type: undefined
    });
    // remove variant prop
    const {
      getByText
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
  });
  it('renders LargeImage with title, body, and buttons', () => {
    const template = makeTemplate({
      type: 'LargeImage',
      data: {
        content: {
          title: {
            content: 'Title'
          },
          body: {
            content: 'Body'
          },
          image: {
            url: 'https://example.com/img.png'
          },
          dismissBtn: {
            style: 'close'
          },
          buttons: [{
            id: 'btn1',
            text: {
              content: 'Go'
            },
            actionUrl: 'https://example.com/go'
          }]
        }
      }
    });
    const {
      getByText
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
    // Button rendered from buttons map
    expect(getByText('Go')).toBeTruthy();
  });
  it('renders ImageOnly without text sections but with image', () => {
    const template = makeTemplate({
      type: 'ImageOnly'
    });
    const {
      queryByText,
      UNSAFE_getAllByType
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    expect(queryByText('Title')).toBeNull();
    expect(queryByText('Body')).toBeNull();
    // Ensure an Image is rendered
    const images = UNSAFE_getAllByType(Image);
    expect(images.length).toBeGreaterThan(0);
  });
  it('uses darkUrl for images when in dark mode', () => {
    const rn = require('react-native');
    const colorSpy = jest.spyOn(rn, 'useColorScheme');
    colorSpy.mockReturnValue('dark');
    const template = makeTemplate({
      data: {
        content: {
          image: {
            url: 'https://light.png',
            darkUrl: 'https://dark.png'
          },
          title: {
            content: 'Title'
          },
          body: {
            content: 'Body'
          },
          dismissBtn: {
            style: 'close'
          }
        }
      }
    });
    const {
      UNSAFE_getAllByType
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    const images = UNSAFE_getAllByType(Image);
    expect(images[0].props.source.uri).toBe('https://dark.png');
    colorSpy.mockRestore();
  });
  it('falls back gracefully for unknown variant (default case)', () => {
    const template = makeTemplate({
      type: 'UnknownVariant'
    });
    const {
      getByText
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    // Should still render content without throwing
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
  });
});
describe('ContentCardView - interactions and tracking', () => {
  it('does not crash if Linking.openURL throws (error case)', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(true);
    const openSpy = jest.spyOn(Linking, 'openURL').mockImplementationOnce(() => Promise.reject(new Error('open failed')));
    const template = makeTemplate();
    const listener = jest.fn();
    const {
      getByTestId
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template,
      listener: listener,
      testID: "card"
    }));
    expect(() => fireEvent.press(getByTestId('card'))).not.toThrow();
    await waitFor(() => expect(openSpy).toHaveBeenCalled());
    expect(listener).toHaveBeenCalledWith('onInteract', template);
  });
  it('onPress with no track and no actionUrl does not throw or open URL', () => {
    const openSpy = jest.spyOn(Linking, 'openURL').mockClear();
    const base = makeTemplate();
    const tpl = JSON.parse(JSON.stringify(base));
    tpl.track = undefined;
    delete tpl.data.content.actionUrl;
    const {
      getByTestId
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: tpl,
      testID: "card"
    }));
    expect(() => fireEvent.press(getByTestId('card'))).not.toThrow();
    expect(openSpy).not.toHaveBeenCalled();
  });
  it('calls onDisplay once and tracks DISPLAY', () => {
    const template = makeTemplate();
    const listener = jest.fn();
    render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template,
      listener: listener,
      testID: "card"
    }));
    expect(listener).toHaveBeenCalledWith('onDisplay', template);
    expect(template.track).toHaveBeenCalledWith(MessagingEdgeEventType.DISPLAY);
  });
  it('tracks INTERACT and opens URL on press', async () => {
    const template = makeTemplate();
    const listener = jest.fn();
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined);
    const {
      getByTestId
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template,
      listener: listener,
      testID: "card"
    }));
    fireEvent.press(getByTestId('card'));
    expect(listener).toHaveBeenCalledWith('onInteract', template);
    expect(template.track).toHaveBeenCalledWith('content_clicked', MessagingEdgeEventType.INTERACT, null);
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith('https://adobe.com'));
  });
  it('calls onDismiss, tracks DISMISS, and hides the card', () => {
    const template = makeTemplate();
    const listener = jest.fn();
    const {
      queryByText,
      getByText
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template,
      listener: listener
    }));
    // Dismiss button renders as 'x'
    fireEvent.press(getByText('\u00D7'));
    expect(listener).toHaveBeenCalledWith('onDismiss', template);
    expect(template.track).toHaveBeenCalledWith(MessagingEdgeEventType.DISMISS);
    // Card should no longer render title after dismiss
    expect(queryByText('Title')).toBeNull();
  });
});
describe('ContentCardView - unread indicator and styles', () => {
  it('renders UnreadIcon by default when settings are missing', () => {
    const useInboxSettings = require('../../hooks/useInboxSettings').default;
    useInboxSettings.mockReturnValueOnce({});
    const template = makeTemplate({
      isRead: false
    });
    const {
      UNSAFE_getAllByType
    } = render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: template
    }));
    expect(UNSAFE_getAllByType(UnreadIcon).length).toBeGreaterThan(0);
  });
  it('applies dynamic Pressable style function', () => {
    const tpl = makeTemplate();
    const styleFn = jest.fn(() => ({}));
    render(/*#__PURE__*/React.createElement(ContentCardView, {
      template: tpl,
      style: styleFn
    }));
    expect(styleFn).toHaveBeenCalled();
  });
});
//# sourceMappingURL=ContentCardView.spec.js.map