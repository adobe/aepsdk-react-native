/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@format
*/

import { NativeModules } from 'react-native';
import {AEPEdge, AEPExperienceEvent} from '../';

describe('AEPEdge', () => {

  it('extensionVersion is called', async () => {
    expect(AEPEdge.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPEdge, 'extensionVersion');
    await AEPEdge.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

   it('sendEvent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData  = {"eventType" : "SampleXDMEvent"};
    let data  = {"dataKey" : "dataValue"};
    let experienceEvent = new AEPExperienceEvent(xdmData, data, "indentifierID");
    await AEPEdge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

   it('sendEvent is called with null parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData  = {"eventType" : "SampleXDMEvent"};
    let experienceEvent = new AEPExperienceEvent(xdmData, null, "");
    await AEPEdge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });
});