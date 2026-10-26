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

import type { TurboModule } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  extensionVersion(): Promise<string>;
  getCachedMessages(): Promise<Array<Object>>;
  getLatestMessage(): Promise<Object>;
  getPropositionsForSurfaces(surfaces: Array<string>): Promise<Object>;
  refreshInAppMessages(): void;
  setMessagingDelegate(): void;
  // Synchronous: releases the native thread blocked in shouldShowMessage/canShow.
  setMessageSettings(
    shouldShowMessage: boolean,
    shouldSaveMessage: boolean
  ): boolean;
  updatePropositionsForSurfaces(surfaces: Array<string>): Promise<void>;
  trackContentCardDisplay(proposition: Object, contentCard: Object): void;
  trackContentCardInteraction(proposition: Object, contentCard: Object): void;
  trackPropositionItem(
    uuid: string,
    interaction: string | null,
    eventType: number,
    tokens: Array<string> | null
  ): void;
  getInboxState(activityId: string): Promise<string | null>;
  setInboxState(activityId: string, stateJson: string): Promise<void>;

  // Message instance methods
  setAutoTrack(messageId: string, autoTrack: boolean): void;
  show(messageId: string): void;
  // suppressAutoTrack is honoured on iOS only; Android ignores it.
  dismiss(messageId: string, suppressAutoTrack?: boolean): void;
  track(messageId: string, interaction: string, eventType: number): void;
  clear(messageId: string): void;
  handleJavascriptMessage(messageId: string, handlerName: string): void;
  evaluateJavascript(messageId: string, javascriptString: string): void;

  // Legacy event listener shims (required for the interop path's NativeEventEmitter)
  addListener(eventName: string): void;
  removeListeners(count: number): void;

  // Native -> JS events (codegen JSI emitters on iOS; Android emits via DeviceEventEmitter).
  readonly onShow: EventEmitter<Object>;
  readonly onDismiss: EventEmitter<Object>;
  readonly shouldShowMessage: EventEmitter<Object>;
  readonly urlLoaded: EventEmitter<Object>;
  readonly onContentLoaded: EventEmitter<Object>;
  readonly onJavascriptMessage: EventEmitter<Object>;
  readonly onJavascriptResult: EventEmitter<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPMessaging');
