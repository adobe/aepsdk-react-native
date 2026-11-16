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
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  extensionVersion(): Promise<string>;
  initialize(initOptions: Object): Promise<void>;
  configureWithAppId(appId?: string): void;
  clearUpdatedConfiguration(): void;
  updateConfiguration(configMap?: Object): void;
  setLogLevel(mode: string): void;
  getLogLevel(): Promise<string>;
  setPrivacyStatus(privacyStatus: string): void;
  getPrivacyStatus(): Promise<string>;
  getSdkIdentities(): Promise<string>;
  dispatchEvent(event: Object): Promise<boolean>;
  dispatchEventWithResponseCallback(
    event: Object,
    timeoutMS: number
  ): Promise<Object>;
  trackAction(action?: string, contextData?: Object): void;
  trackState(state?: string, contextData?: Object): void;
  setAdvertisingIdentifier(advertisingIdentifier?: string): void;
  setPushIdentifier(pushIdentifier?: string): void;
  collectPii(data: Object): void;
  setSmallIconResourceID(resourceID: number): void;
  setLargeIconResourceID(resourceID: number): void;
  setAppGroup(appGroup?: string): void;
  resetIdentities(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPCore');
