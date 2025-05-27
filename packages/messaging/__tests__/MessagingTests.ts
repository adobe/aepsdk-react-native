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

import { NativeModules } from 'react-native';
import { Messaging, Message, MessagingEdgeEventType } from '../src';

// Mocking the NativeModules.AEPMessaging
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  NativeModules: {
    ...jest.requireActual('react-native').NativeModules,
    AEPMessaging: {
      extensionVersion: jest.fn(() => Promise.resolve('test-version')),
      refreshInAppMessages: jest.fn(),
      setMessagingDelegate: jest.fn(),
      setAutoTrack: jest.fn(),
      show: jest.fn(),
      dismiss: jest.fn(),
      track: jest.fn(),
      clear: jest.fn(),
      updatePropositionsForSurfaces: jest.fn(),
      getPropositionsForSurfaces: jest.fn(() => Promise.resolve({})),
      // Ensure trackPropositionInteraction is part of the mock
      trackPropositionInteraction: jest.fn(), 
      // Add any other methods from AEPMessaging that are used in tests or the module itself
      getCachedMessages: jest.fn(() => Promise.resolve([])),
      getLatestMessage: jest.fn(() => Promise.resolve(null)),
      setMessageSettings: jest.fn()
    }
  },
  NativeEventEmitter: jest.fn(() => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    removeAllListeners: jest.fn() // Added removeAllListeners based on usage in Messaging.ts
  }))
}));

describe('Messaging', () => {
  it('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'extensionVersion');
    await Messaging.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('refreshInAppMessages is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'refreshInAppMessages');
    await Messaging.refreshInAppMessages();
    expect(spy).toHaveBeenCalled();
  });

  it('setMessagingDelegate is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'setMessagingDelegate');
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
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'setAutoTrack');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    await message.setAutoTrack(false);
    expect(spy).toHaveBeenCalledWith(id, false);
  });

  it('show is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'show');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    await message.show();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('dismiss is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'dismiss');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    await message.dismiss(true);
    expect(spy).toHaveBeenCalledWith(id, true);
  });

  it('track is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'track');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    let interaction = 'display';
    let eventType = MessagingEdgeEventType.DISPLAY;
    await message.track(interaction, eventType);
    expect(spy).toHaveBeenCalledWith(id, interaction, eventType);
  });

  it('clear is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'clear');
    let id = 'id';
    let autoTrack = true;
    let message = new Message({id, autoTrack});
    await message.clear();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should call updatePropositionsForSurfaces', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'updatePropositionsForSurfaces');
    await Messaging.updatePropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(spy).toHaveBeenCalledWith(['testSurface1', 'testSurface2']);
  });

  it('should call getPropositionsForSurfaces', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'getPropositionsForSurfaces');
    await Messaging.getPropositionsForSurfaces([
      'testSurface1',
      'testSurface2'
    ]);
    expect(spy).toHaveBeenCalledWith(['testSurface1', 'testSurface2']);
  });

  it('trackContentCardDisplay is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'trackPropositionInteraction');
    const mockProposition = { id: 'propId' } as any;
    const mockContentCard = { itemId: 'itemId' } as any;

    await Messaging.trackContentCardDisplay(mockProposition, mockContentCard);
    expect(spy).toHaveBeenCalledWith(
      mockProposition,
      mockContentCard,
      MessagingEdgeEventType.DISPLAY,
      null,
      null
    );
  });

  it('trackContentCardInteract is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'trackPropositionInteraction');
    const mockProposition = { id: 'propId' } as any;
    const mockContentCard = { itemId: 'itemId' } as any;
    const interaction = 'mockInteraction';

    await Messaging.trackContentCardInteract(mockProposition, mockContentCard, interaction);
    expect(spy).toHaveBeenCalledWith(
      mockProposition,
      mockContentCard,
      MessagingEdgeEventType.INTERACT,
      interaction,
      null
    );
  });

  it('trackContentCardDismiss is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'trackPropositionInteraction');
    const mockProposition = { id: 'propId' } as any;
    const mockContentCard = { itemId: 'itemId' } as any;

    await Messaging.trackContentCardDismiss(mockProposition, mockContentCard);
    expect(spy).toHaveBeenCalledWith(
      mockProposition,
      mockContentCard,
      MessagingEdgeEventType.DISMISS,
      null,
      null
    );
  });
});
