/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

'use strict';

const RCTAEPEdge = require('react-native').NativeModules.AEPEdge;

import type {AEPExperienceEvent} from './models/AEPExperienceEvent';
import type {AEPEdgeEventHandle} from './models/AEPEdgeEventHandle';

module.exports = {
  /**
   * Returns the version of the AEPEdge extension
   * @param  {string} Promise a promise that resolves with the extension verison
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPEdge.extensionVersion());
  },

 /**
   * Edge API to send an Experience Event
   *
   * @param experieneceEvent Event to be sent to Adobe Experience Edge
   */
  sendEvent(experienceEvent: AEPExperienceEvent): Promise<Array<AEPEdgeEventHandle>> {
     return Promise.resolve(RCTAEPEdge.sendEvent(experienceEvent));
  }
};
