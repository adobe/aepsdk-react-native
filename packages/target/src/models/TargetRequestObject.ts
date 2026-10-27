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

import TargetPrefetchObject from './TargetPrefetchObject';
import TargetParameters from './TargetParameters';
import NativeAEPTarget from '../NativeAEPTarget';
import type {
  TargetCallbackError,
  TargetDetailedCallback,
  TargetResponseData
} from './TargetDetailedCallback';

/** Callback receiving only the mbox content. */
type TargetContentCallback = (
  error: Error | null,
  content: string | null
) => void;

interface ITargetRequests {
  registerTargetRequests: (
    requestMap: TargetRequestObject,
    callback: (
      error: Error | TargetCallbackError | null,
      content: string | null,
      data?: TargetResponseData | null
    ) => void
  ) => void;
}

const RCTTarget: ITargetRequests = NativeAEPTarget as unknown as ITargetRequests;

class TargetRequestObject extends TargetPrefetchObject {
  defaultContent: string;
  id: string;
  // Tells the native layer to build the request with the detailed (content + data) callback.
  detailedCallback: boolean;

  /**
   * @param name the mbox name
   * @param targetParameters parameters for this request
   * @param defaultContent content to use when no content is available
   * @param callback either a function receiving `(error, content)`, or a {@link TargetDetailedCallback}
   *        whose `call(content, data)` also receives the response tokens and A4T payloads
   */
  constructor(
    name: string,
    targetParameters: TargetParameters,
    defaultContent: string,
    callback: TargetContentCallback | TargetDetailedCallback
  ) {
    super(name, targetParameters);
    this.defaultContent = defaultContent;
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    if (typeof callback === 'function') {
      this.detailedCallback = false;
      RCTTarget.registerTargetRequests(this, (error, content) =>
        callback(error as Error | null, content)
      );
      return;
    }

    if (callback == null || typeof callback.call !== 'function') {
      throw new TypeError(
        'TargetRequestObject callback must be a function or an object with a call(content, data) function'
      );
    }

    this.detailedCallback = true;
    RCTTarget.registerTargetRequests(this, (error, content, data) => {
      if (error) {
        callback.fail?.(error as TargetCallbackError);
      } else {
        callback.call(content, data ?? null);
      }
    });
  }
}

export default TargetRequestObject;
