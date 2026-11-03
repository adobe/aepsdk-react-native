/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import {
  DeviceEventEmitter,
  EventSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import NativeAEPMessaging from './NativeAEPMessaging';

export type MessagingJsiEvent =
  | 'onMessageShown'
  | 'onMessageDismissed'
  | 'onShouldShowMessage'
  | 'onMessageUrlLoaded'
  | 'onJavascriptMessageReceived'
  | 'onJavascriptResultReceived';

type JsiEmitter =
  | ((handler: (event: any) => void) => EventSubscription)
  | { addListener?: (handler: (event: any) => void) => EventSubscription };

function trySubscribeJsi(
  jsiName: MessagingJsiEvent,
  handler: (event: any) => void
): EventSubscription | null {
  const emitter = (NativeAEPMessaging as unknown as Record<string, JsiEmitter | undefined>)[
    jsiName
  ];
  if (emitter == null) {
    return null;
  }
  try {
    if (typeof emitter === 'function') {
      return emitter(handler);
    }
    if (typeof emitter === 'object' && typeof emitter.addListener === 'function') {
      return emitter.addListener(handler);
    }
  } catch {
    // Codegen EventEmitter not callable on this runtime; fall back to the bridge.
  }
  return null;
}

/**
 * Subscribes to a native Messaging event across runtimes:
 * - Android (old and new arch): DeviceEventEmitter, using the legacy event name.
 * - iOS turbo / new-arch interop: the codegen JSI EventEmitter (`jsiName`).
 * - iOS old-arch interop: NativeEventEmitter over the classic bridge module.
 */
export function subscribeMessagingEvent(
  eventName: string,
  jsiName: MessagingJsiEvent,
  handler: (event: any) => void
): EventSubscription {
  const subs: EventSubscription[] = [];

  if (Platform.OS === 'android') {
    const sub = DeviceEventEmitter?.addListener(eventName, handler);
    if (sub) subs.push(sub);
  } else {
    const jsiSub = trySubscribeJsi(jsiName, handler);
    if (jsiSub) {
      subs.push(jsiSub);
    } else {
      const bridgeModule = (NativeModules as { NativeAEPMessaging?: object })
        .NativeAEPMessaging;
      if (bridgeModule) {
        const sub = new NativeEventEmitter(bridgeModule as any).addListener(
          eventName,
          handler
        );
        if (sub) subs.push(sub);
      }
    }
  }

  return {
    remove: () => {
      subs.forEach((s) => s.remove());
    },
  } as EventSubscription;
}
