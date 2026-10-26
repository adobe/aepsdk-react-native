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
  clearPrefetchCache(): void;
  getThirdPartyId(): Promise<string>;
  getSessionId(): Promise<string>;
  getTntId(): Promise<string>;
  resetExperience(): void;
  setPreviewRestartDeeplink(deepLink: string): void;
  setSessionId(sessionId: string): void;
  setTntId(tntId: string): void;
  setThirdPartyId(thirdPartyId: string): void;
  retrieveLocationContent(requests: Array<Object>, parameters?: Object): void;
  prefetchContent(prefetchObjectArray: Array<Object>, parameters?: Object): Promise<Object>;
  displayedLocations(mboxNames: Array<string>, parameters?: Object): void;
  clickedLocation(name: string, parameters?: Object): void;
  // Registers the callback for a TargetRequestObject (invoked once, with (null, content)).
  registerTargetRequests(
    requestMap: Object,
    callback: (error: Object | null, content: string | null) => void
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAEPTarget');
