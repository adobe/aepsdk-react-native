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
import { Edge, ExperienceEvent } from '../ts';

describe('Edge', () => {
  it('extensionVersion is called', async () => {
    expect(Edge.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPEdge, 'extensionVersion');
    await Edge.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('sendEvent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let data = { dataKey: 'dataValue' };
    let experienceEvent = new ExperienceEvent(xdmData, data, 'indentifierID');
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with only xdmData parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let experienceEvent = new ExperienceEvent(xdmData);
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with null data parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let experienceEvent = new ExperienceEvent(xdmData, null, 'indentifierID');
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with empty dataidentifier', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let data = { dataKey: 'dataValue' };
    let experienceEvent = new ExperienceEvent(xdmData, data, ' ');
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with null data and empty dataidentifier', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let experienceEvent = new ExperienceEvent(xdmData, null, ' ');
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with xdmData and data parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let data = { dataKey: 'dataValue' };
    let experienceEvent = new ExperienceEvent(xdmData, data);
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with incorrect type data parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let experienceEvent = new ExperienceEvent(xdmData, null);
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with incorrect type of xdmData parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let data = { dataKey: 'dataValue' };
    let experienceEvent = new ExperienceEvent(null, data);
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent is called with null parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let experienceEvent = new ExperienceEvent(null);
    await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
  });

  it('sendEvent returns promise with correct type Array<EdgeEventHandle>', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'sendEvent');
    let xdmData = { eventType: 'SampleXDMEvent' };
    let experienceEvent = new ExperienceEvent(xdmData);
    let result = await Edge.sendEvent(experienceEvent);
    expect(spy).toHaveBeenCalledWith(experienceEvent);
    expect(result.length).toEqual(1);
    expect(result[0].type).toEqual('example');
    expect(result[0].payload).toEqual({ sample: 'data' });
  });

  it('setLocationHint is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'setLocationHint');
    Edge.setLocationHint('or2');
    expect(spy).toHaveBeenCalledWith('or2');
  });

  it('setLocationHint is called with null', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'setLocationHint');
    Edge.setLocationHint(null);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('setLocationHint is called with empty string', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'setLocationHint');
    Edge.setLocationHint('');
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('getLocationHint is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPEdge, 'getLocationHint');
    const locationHint = await Edge.getLocationHint();
    expect(spy).toHaveBeenCalled();
    expect(locationHint).toEqual('va6');
  });
});