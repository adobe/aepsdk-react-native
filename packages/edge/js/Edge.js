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

import ExperienceEvent from './models/ExperienceEvent';
import EdgeEventHandle from './models/EdgeEventHandle';

module.exports = {
  /**
   * Returns the version of the Edge extension
   * @return {string} Promise that resolves with the extension version
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPEdge.extensionVersion());
  },

 /**
   * Send an Experience Event to Adobe Experience Edge
   *
   * @param experienceEvent Event to be sent to Adobe Experience Edge
   * @return Promise fulfilled when the request is complete, returning the associated 
   * response handles received from the Adobe Experience Edge or rejected 
   * if an unexpected error occured; it may return an empty array
   * if no handles were returned for the given experienceEvent
   */
  sendEvent(experienceEvent: ExperienceEvent): Promise<Array<EdgeEventHandle>> {
   const sentEventPromise = new Promise((resolve, reject) => {
    RCTAEPEdge.sendEvent(experienceEvent)
    .then(eventHandles => {
      let eventHandlesPromise = toEventHandle(eventHandles);
      resolve(eventHandlesPromise);
    })
    .catch((error) => {
      reject(error);
    });      
    });
     return(sentEventPromise);
  },
};


function toEventHandle(eventArray: Array) {
 
    let edgeEventArray = [];

    for (let prop of eventArray) {
      edgeEventArray.push(new EdgeEventHandle(prop.type, prop.payload));
    }
     
    return edgeEventArray;
  }