/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// Handlers registered through the (mocked) iOS codegen JSI event emitters, by event name.
const mockJsiHandlers: Record<string, (event: any) => void> = {};
const mockJsiRemove = jest.fn();

jest.mock('../src/NativeAEPMessaging', () => {
  const jsiEmitter = (name: string) =>
    jest.fn((handler: (event: any) => void) => {
      mockJsiHandlers[name] = handler;
      return { remove: mockJsiRemove };
    });
  return {
    __esModule: true,
    default: {
      extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
      refreshInAppMessages: jest.fn(),
      setMessagingDelegate: jest.fn(),
      setMessageSettings: jest.fn().mockReturnValue(true),
      setAutoTrack: jest.fn(),
      show: jest.fn(),
      dismiss: jest.fn(),
      track: jest.fn(),
      clear: jest.fn(),
      handleJavascriptMessage: jest.fn(),
      evaluateJavascript: jest.fn(),
      updatePropositionsForSurfaces: jest.fn().mockResolvedValue(undefined),
      getPropositionsForSurfaces: jest.fn().mockResolvedValue({}),
      getCachedMessages: jest.fn().mockResolvedValue([]),
      getLatestMessage: jest.fn().mockResolvedValue(null),
      trackContentCardDisplay: jest.fn(),
      trackContentCardInteraction: jest.fn(),
      trackPropositionItem: jest.fn(),
      onShow: jsiEmitter('onShow'),
      onDismiss: jsiEmitter('onDismiss'),
      shouldShowMessage: jsiEmitter('shouldShowMessage'),
      urlLoaded: jsiEmitter('urlLoaded'),
      onContentLoaded: jsiEmitter('onContentLoaded'),
      onJavascriptMessage: jsiEmitter('onJavascriptMessage'),
      onJavascriptResult: jsiEmitter('onJavascriptResult')
    }
  };
});

import { DeviceEventEmitter, Platform } from 'react-native';
import { Messaging, Message, MessagingEdgeEventType } from '../src';
import NativeAEPMessaging from '../src/NativeAEPMessaging';

const native = NativeAEPMessaging as unknown as Record<string, jest.Mock>;

describe('Messaging', () => {
  it('extensionVersion is called', async () => {
    await Messaging.extensionVersion();
    expect(native.extensionVersion).toHaveBeenCalled();
  });

  it('refreshInAppMessages is called', async () => {
    await Messaging.refreshInAppMessages();
    expect(native.refreshInAppMessages).toHaveBeenCalled();
  });

  it('setMessagingDelegate is called', async () => {
    let delegate = {
      onShow(_: Message) {},
      onDismiss(_: Message) {},
      shouldShowMessage(_: Message) {
        return true;
      },
      urlLoaded(_: string, __: Message) {}
    };
    await Messaging.setMessagingDelegate(delegate);
    expect(native.setMessagingDelegate).toHaveBeenCalled();
  });

  it('setAutoTrack is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.setAutoTrack(false);
    expect(native.setAutoTrack).toHaveBeenCalledWith(id, false);
  });

  it('show is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.show();
    expect(native.show).toHaveBeenCalledWith(id);
  });

  it('dismiss is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.dismiss(true);
    expect(native.dismiss).toHaveBeenCalledWith(id, true);
  });

  it('track is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let interaction = 'display';
    let eventType = MessagingEdgeEventType.DISPLAY;
    message.track(interaction, eventType);
    expect(native.track).toHaveBeenCalledWith(id, interaction, eventType);
  });

  it('clear is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.clear();
    expect(native.clear).toHaveBeenCalledWith(id);
  });

  it('handleJavascriptMessage is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let handlerName = 'handlerName';
    let handler = jest.fn();
    message.handleJavascriptMessage(handlerName, handler);
    expect(native.handleJavascriptMessage).toHaveBeenCalledWith(id, handlerName);
  });

  it('evaluateJavascript is called', async () => {
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let javascriptString = 'javascriptString';
    let callback = jest.fn();
    await message.evaluateJavascript(javascriptString, callback);
    expect(native.evaluateJavascript).toHaveBeenCalledWith(id, javascriptString);
  });

  it('should call updatePropositionsForSurfaces', async () => {
    await Messaging.updatePropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(native.updatePropositionsForSurfaces).toHaveBeenCalledWith([
      'testSurface1',
      'testSurface2'
    ]);
  });

  it('should call getPropositionsForSurfaces', async () => {
    await Messaging.getPropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(native.getPropositionsForSurfaces).toHaveBeenCalledWith([
      'testSurface1',
      'testSurface2'
    ]);
  });

  it('should call trackContentCardDisplay', async () => {
    const mockProposition = { propositionId: 'mockPropositionId' } as any;
    const mockContentCard = { contentCardId: 'mockContentCardId' } as any;
    await Messaging.trackContentCardDisplay(mockProposition, mockContentCard);
    expect(native.trackContentCardDisplay).toHaveBeenCalledWith(
      mockProposition,
      mockContentCard
    );
  });

  it('should call trackContentCardInteraction', async () => {
    const mockProposition = { propositionId: 'mockPropositionId' } as any;
    const mockContentCard = { contentCardId: 'mockContentCardId' } as any;
    await Messaging.trackContentCardInteraction(mockProposition, mockContentCard);
    expect(native.trackContentCardInteraction).toHaveBeenCalledWith(
      mockProposition,
      mockContentCard
    );
  });
});

describe('Messaging delegate events (iOS: codegen JSI emitters)', () => {
  const originalOS = Platform.OS;
  beforeAll(() => {
    (Platform as any).OS = 'ios';
  });
  afterAll(() => {
    (Platform as any).OS = originalOS;
  });
  beforeEach(() => {
    mockJsiRemove.mockClear();
    native.setMessageSettings.mockClear();
    native.setMessagingDelegate.mockClear();
  });

  it('registers JSI listeners for onShow/onDismiss/shouldShowMessage/urlLoaded', () => {
    Messaging.setMessagingDelegate({} as any);
    expect(native.onShow).toHaveBeenCalled();
    expect(native.onDismiss).toHaveBeenCalled();
    expect(native.shouldShowMessage).toHaveBeenCalled();
    expect(native.urlLoaded).toHaveBeenCalled();
    expect(native.setMessagingDelegate).toHaveBeenCalled();
  });

  it('routes onShow and onDismiss to the delegate as Message instances', () => {
    const onShow = jest.fn();
    const onDismiss = jest.fn();
    Messaging.setMessagingDelegate({ onShow, onDismiss } as any);

    mockJsiHandlers.onShow({ id: 'm1', autoTrack: true });
    mockJsiHandlers.onDismiss({ id: 'm2', autoTrack: false });

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onShow.mock.calls[0][0]).toBeInstanceOf(Message);
    expect(onShow.mock.calls[0][0].id).toBe('m1');
    expect(onDismiss.mock.calls[0][0].id).toBe('m2');
  });

  it('shouldShowMessage forwards the delegate answer to setMessageSettings', () => {
    Messaging.setMessagingDelegate({
      shouldShowMessage: () => false,
      shouldSaveMessage: () => true
    } as any);

    mockJsiHandlers.shouldShowMessage({ id: 'm3', autoTrack: false });

    expect(native.setMessageSettings).toHaveBeenCalledWith(false, true);
  });

  it('shouldShowMessage defaults to show=true, save=false without delegate answers', () => {
    Messaging.setMessagingDelegate({} as any);
    mockJsiHandlers.shouldShowMessage({ id: 'm4', autoTrack: false });
    expect(native.setMessageSettings).toHaveBeenCalledWith(true, false);
  });

  it('routes urlLoaded with the url and a Message', () => {
    const urlLoaded = jest.fn();
    Messaging.setMessagingDelegate({ urlLoaded } as any);

    mockJsiHandlers.urlLoaded({
      url: 'https://example.com',
      message: { id: 'm5', autoTrack: false }
    });

    expect(urlLoaded).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ id: 'm5' })
    );
  });

  it('returns an unsubscribe function that removes the subscriptions', () => {
    const unsubscribe = Messaging.setMessagingDelegate({} as any);
    unsubscribe();
    // onShow, onDismiss, shouldShowMessage, urlLoaded
    expect(mockJsiRemove).toHaveBeenCalledTimes(4);
  });

  it('routes onJavascriptMessage to the handler registered on the message', () => {
    const message = new Message({ id: 'js1', autoTrack: false });
    const handler = jest.fn();
    message.handleJavascriptMessage('myHandler', handler);

    mockJsiHandlers.onJavascriptMessage({
      messageId: 'js1',
      handlerName: 'myHandler',
      content: 'hello'
    });

    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('routes onJavascriptResult to the callback registered on the message', () => {
    const message = new Message({ id: 'js2', autoTrack: false });
    const callback = jest.fn();
    message.evaluateJavascript('1+1', callback);

    mockJsiHandlers.onJavascriptResult({
      messageId: 'js2',
      javascriptString: '1+1',
      result: 2
    });

    expect(callback).toHaveBeenCalledWith('2');
  });
});

describe('Messaging delegate events (Android: DeviceEventEmitter)', () => {
  const originalOS = Platform.OS;
  beforeAll(() => {
    (Platform as any).OS = 'android';
  });
  afterAll(() => {
    (Platform as any).OS = originalOS;
  });

  it('routes onShow and onContentLoaded from DeviceEventEmitter and unsubscribes', () => {
    const onShow = jest.fn();
    const onContentLoaded = jest.fn();
    const unsubscribe = Messaging.setMessagingDelegate({
      onShow,
      onContentLoaded
    } as any);

    DeviceEventEmitter.emit('onShow', { id: 'a1', autoTrack: 'true' });
    DeviceEventEmitter.emit('onContentLoaded', {
      message: { id: 'a2', autoTrack: 'false' }
    });
    expect(onShow.mock.calls[0][0].id).toBe('a1');
    expect(onContentLoaded.mock.calls[0][0].id).toBe('a2');

    unsubscribe();
    DeviceEventEmitter.emit('onShow', { id: 'a3', autoTrack: 'true' });
    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it('does not register the iOS-only urlLoaded listener on Android', () => {
    (native.urlLoaded as jest.Mock).mockClear();
    Messaging.setMessagingDelegate({} as any);
    expect(native.urlLoaded).not.toHaveBeenCalled();
  });
});
