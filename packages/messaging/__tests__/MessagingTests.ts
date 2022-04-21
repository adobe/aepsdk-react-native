/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import { Messaging, Message, MessagingEdgeEventType } from '../ts';

describe('Messaging', () => {
  it('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'extensionVersion');
    await Messaging.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it("refreshInAppMessages is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'refreshInAppMessages');
    await Messaging.refreshInAppMessages();
    expect(spy).toHaveBeenCalled();
  });

  it("setMessagingDelegate is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'setMessagingDelegate');
    let delegate = {
      onShow(_: Message){},
      onDismiss(_: Message){},
      shouldShowMessage(_: Message){
        return true;
      },
      urlLoaded(_: string, __: Message){}
    };
    await Messaging.setMessagingDelegate(delegate);
    expect(spy).toHaveBeenCalled();
  });

  it("setAutoTrack is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'setAutoTrack');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    await message.setAutoTrack(false);
    expect(spy).toHaveBeenCalledWith(id, false);
  });

  it("show is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'show');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    await message.show();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it("dismiss is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'dismiss');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    await message.dismiss(true);
    expect(spy).toHaveBeenCalledWith(id, true);
  });

  it("track is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'track');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    let interaction = "display";
    let eventType = MessagingEdgeEventType.IN_APP_DISPLAY;
    await message.track(interaction, eventType);
    expect(spy).toHaveBeenCalledWith(id, interaction, eventType);
  });

  it("handleJavascriptMessage is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'handleJavascriptMessage');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    let name = "test message";
    await message.handleJavascriptMessage(name);
    expect(spy).toHaveBeenCalledWith(id, name);
  });

  it("clear is called", async () => {
    const spy = jest.spyOn(NativeModules.AEPMessaging, 'clear');
    let id = "id";
    let autoTrack = true;
    let message = new Message(id, autoTrack);
    await message.clear();
    expect(spy).toHaveBeenCalledWith(id);
  });
});
