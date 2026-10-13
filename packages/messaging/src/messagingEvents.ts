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
  Platform,
} from 'react-native';
import NativeAEPMessaging from './NativeAEPMessaging';

export type MessagingEventName =
  | 'onShow'
  | 'onDismiss'
  | 'shouldShowMessage'
  | 'urlLoaded'
  | 'onContentLoaded'
  | 'onJavascriptMessage'
  | 'onJavascriptResult';

type JsiEmitter = (handler: (event: any) => void) => EventSubscription;

/**
 * Subscribes to a native -> JS messaging event.
 * - Android (turbo + interop): DeviceEventEmitter. The codegen EventEmitter is not used on Android.
 * - iOS turbo / new-arch interop: the codegen JSI EventEmitter exposed on the module.
 * - iOS old architecture: NativeEventEmitter over the classic RCTEventEmitter module.
 */
export function subscribeMessagingEvent(
  name: MessagingEventName,
  handler: (event: any) => void
): EventSubscription {
  if (Platform.OS === 'android') {
    return DeviceEventEmitter.addListener(name, handler);
  }

  const jsiEmitter = (NativeAEPMessaging as unknown as Record<string, unknown>)[name];
  if (typeof jsiEmitter === 'function') {
    return (jsiEmitter as JsiEmitter)(handler);
  }

  return new NativeEventEmitter(NativeAEPMessaging as any).addListener(
    name,
    handler
  );
}
