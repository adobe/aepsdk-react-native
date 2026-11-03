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

jest.mock('../src/NativeAEPMessaging', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    getCachedMessages: jest.fn().mockResolvedValue([]),
    getLatestMessage: jest.fn().mockResolvedValue(null),
    getPropositionsForSurfaces: jest.fn().mockResolvedValue({}),
    refreshInAppMessages: jest.fn(),
    setMessagingDelegate: jest.fn(),
    setMessageSettings: jest.fn(),
    updatePropositionsForSurfaces: jest.fn().mockResolvedValue(undefined),
    trackContentCardDisplay: jest.fn(),
    trackContentCardInteraction: jest.fn(),
    trackPropositionItem: jest.fn().mockResolvedValue(undefined),
    setAutoTrack: jest.fn(),
    show: jest.fn(),
    dismiss: jest.fn(),
    track: jest.fn(),
    clear: jest.fn(),
    handleJavascriptMessage: jest.fn(),
    evaluateJavascript: jest.fn(),
    getInboxState: jest.fn().mockResolvedValue(null),
    setInboxState: jest.fn().mockResolvedValue(undefined),
    addListener: jest.fn(),
    removeListeners: jest.fn()
  }
}));

import NativeAEPMessaging from '../src/NativeAEPMessaging';
import { Messaging, Message, MessagingEdgeEventType } from '../src';

describe('Messaging', () => {
  it('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'extensionVersion');
    await Messaging.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('refreshInAppMessages is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'refreshInAppMessages');
    await Messaging.refreshInAppMessages();
    expect(spy).toHaveBeenCalled();
  });

  it('setMessagingDelegate is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'setMessagingDelegate');
    let delegate = {
      onShow(_: Message) {},
      onDismiss(_: Message) {},
      shouldShowMessage(_: Message) {
        return true;
      },
      urlLoaded(_: string, __: Message) {}
    };
    await Messaging.setMessagingDelegate(delegate);
    expect(spy).toHaveBeenCalled();
  });

  it('setAutoTrack is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'setAutoTrack');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.setAutoTrack(false);
    expect(spy).toHaveBeenCalledWith(id, false);
  });

  it('show is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'show');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.show();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('dismiss is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'dismiss');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.dismiss(true);
    expect(spy).toHaveBeenCalledWith(id, true);
  });

  it('track is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'track');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let interaction = 'display';
    let eventType = MessagingEdgeEventType.DISPLAY;
    message.track(interaction, eventType);
    expect(spy).toHaveBeenCalledWith(id, interaction, eventType);
  });

  it('clear is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'clear');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    message.clear();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('handleJavascriptMessage is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'handleJavascriptMessage');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let handlerName = 'handlerName';
    let handler = jest.fn();
    message.handleJavascriptMessage(handlerName, handler);
    expect(spy).toHaveBeenCalledWith(id, handlerName);
  });

  it('evaluateJavascript is called', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'evaluateJavascript');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let javascriptString = 'javascriptString';
    let callback = jest.fn();
    await message.evaluateJavascript(javascriptString, callback);
    expect(spy).toHaveBeenCalledWith(id, javascriptString);
  });

  it('should call updatePropositionsForSurfaces', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'updatePropositionsForSurfaces');
    await Messaging.updatePropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(spy).toHaveBeenCalledWith(['testSurface1', 'testSurface2']);
  });

  it('should call getPropositionsForSurfaces', async () => {
    const spy = jest.spyOn(NativeAEPMessaging, 'getPropositionsForSurfaces');
    await Messaging.getPropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(spy).toHaveBeenCalledWith(['testSurface1', 'testSurface2']);
  });

  it('should call trackContentCardDisplay', async () => {
    const spy = jest.spyOn(
      NativeAEPMessaging,
      'trackContentCardDisplay'
    );
    const mockProposition = { propositionId: 'mockPropositionId' } as any;
    const mockContentCard = { contentCardId: 'mockContentCardId' } as any;
    await Messaging.trackContentCardDisplay(mockProposition, mockContentCard);
    expect(spy).toHaveBeenCalledWith(mockProposition, mockContentCard);
  });

  it('should call trackContentCardInteraction', async () => {
    const spy = jest.spyOn(
      NativeAEPMessaging,
      'trackContentCardInteraction'
    );
    const mockProposition = { propositionId: 'mockPropositionId' } as any;
    const mockContentCard = { contentCardId: 'mockContentCardId' } as any;
    await Messaging.trackContentCardInteraction(mockProposition, mockContentCard);
    expect(spy).toHaveBeenCalledWith(mockProposition, mockContentCard);
  });
});
