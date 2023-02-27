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
import ExperienceEvent from './models/ExperienceEvent';
import EdgeEventHandle from './models/EdgeEventHandle';

interface IEdge {
  extensionVersion: () => Promise<string>;
  sendEvent: (
    experienceEvent: ExperienceEvent
  ) => Promise<Array<EdgeEventHandle>>;
  setLocationHint: (hint?: string) => void;
  getLocationHint: () => Promise<string>;
}

const RCTAEPEdge: IEdge = NativeModules.AEPEdge;

const Edge: IEdge = {
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
    const sentEventPromise = new Promise<Array<EdgeEventHandle>>(
      (resolve, reject) => {
        RCTAEPEdge.sendEvent(experienceEvent)
          .then((eventHandles) => {
            let eventHandlesPromise = toEventHandle(eventHandles);
            resolve(eventHandlesPromise);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
    return sentEventPromise;
  },

  /**
   * Set the Edge Network location hint used in requests to the Adobe Experience Platform Edge Network.
   * Sets the Edge Network location hint used in requests to the AEP Edge Network causing requests to "stick" to a specific server cluster.
   * Passing null or an empty string will clear the existing location hint. Edge Network responses may overwrite the location hint to a new value when necessary to manage network traffic.
   * Use caution when setting the location hint. Only use location hints for the 'EdgeNetwork' scope. An incorrect location hint value will cause all Edge Network requests to fail.
   * @param {hint} the Edge Network location hint to use when connecting to the Adobe Experience Platform Edge Network
   */

  setLocationHint(hint?: string) {
    RCTAEPEdge.setLocationHint(hint);
  },

  /**
   * Gets the Edge Network location hint used in requests to the Adobe Experience Platform Edge Network.
   * The Edge Network location hint may be used when building the URL for Adobe Experience Platform Edge Network
   * requests to hint at the server cluster to use.
   * @return the Edge Network location hint, or null if the location hint expired or is not set.
   */
  getLocationHint(): Promise<string> {
  return RCTAEPEdge.getLocationHint();
  }
};

function toEventHandle(eventArray: Array<EdgeEventHandle>) {
  let edgeEventArray: Array<EdgeEventHandle> = [];

  if (eventArray) {
    for (let prop of eventArray) {
      edgeEventArray.push(new EdgeEventHandle(prop.type, prop.payload));
    }
  }

  return edgeEventArray;
}

export default Edge;
