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
import { NativeModules } from 'react-native';

interface ITargetRequests {
  registerTargetRequests: (
    requestMap: TargetRequestObject,
    callback: (error: Error | null, content: string | null) => void
  ) => void;
}

const RCTTarget: ITargetRequests = NativeModules.AEPTarget;

class TargetRequestObject extends TargetPrefetchObject {
  defaultContent: string;
  id: string;

  constructor(
    name: string,
    targetParameters: TargetParameters,
    defaultContent: string,
    callback: (error: Error | null, content: string | null) => void
  ) {
    super(name, targetParameters);
    this.defaultContent = defaultContent;
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    RCTTarget.registerTargetRequests(this, callback);
  }
}

export default TargetRequestObject;
