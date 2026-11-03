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
  setMessageSettings(
    shouldShowMessage: boolean,
    shouldSaveMessage: boolean
  ): void;
  updatePropositionsForSurfaces(surfaces: Array<string>): Promise<void>;
  trackContentCardDisplay(propositionMap: Object, contentCardMap: Object): void;
  trackContentCardInteraction(
    propositionMap: Object,
    contentCardMap: Object
  ): void;
  trackPropositionItem(
    itemId: string,
    interaction: string | null,
    eventType: number,
    tokens: Array<string> | null
  ): Promise<void>;
  setAutoTrack(messageId: string, autoTrack: boolean): void;
  show(messageId: string): void;
  // suppressAutoTrack is honoured on iOS only; Android ignores it.
  dismiss(messageId: string, suppressAutoTrack: boolean): void;
  track(messageId: string, interaction: string, eventType: number): void;
  clear(messageId: string): void;
  handleJavascriptMessage(messageId: string, handlerName: string): void;
  evaluateJavascript(messageId: string, javascriptString: string): void;
  getInboxState(activityId: string): Promise<string>;
  setInboxState(activityId: string, stateJson: string): Promise<void>;
  // Legacy event support (required for the interop path's NativeEventEmitter)
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  // TurboModule events (iOS). Names differ from the legacy sendEventWithName: names
  // (onShow, onDismiss, ...) to avoid clashes between the bridge and JSI channels.
  readonly onMessageShown: EventEmitter<Object>;
  readonly onMessageDismissed: EventEmitter<Object>;
  readonly onShouldShowMessage: EventEmitter<Object>;
  readonly onMessageUrlLoaded: EventEmitter<Object>;
  readonly onJavascriptMessageReceived: EventEmitter<Object>;
  readonly onJavascriptResultReceived: EventEmitter<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPMessaging');
