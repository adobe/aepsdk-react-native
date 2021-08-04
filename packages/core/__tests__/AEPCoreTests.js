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
import AEPCore from '../js/AEPCore';
import AEPMobileLogLevel from '../js/models/AEPMobileLogLevel';
import AEPMobilePrivacyStatus from '../js/models/AEPMobilePrivacyStatus';
import AEPExtensionEvent from '../js/models/AEPExtensionEvent';

describe('AEPCore', () => {

  test('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'extensionVersion');
    await AEPCore.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  test('configureWithAppId is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'configureWithAppId');
    let appId = "testAppId";
    await AEPCore.configureWithAppId(appId);
    expect(spy).toHaveBeenCalledWith(appId);
  });

  test('updateConfiguration is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'updateConfiguration');
    let config = {"ssl": "false"};
    await AEPCore.updateConfiguration(config);
    expect(spy).toHaveBeenCalledWith(config);
  });

  test('setLogLevel is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setLogLevel');
    let logLevel = AEPMobileLogLevel.DEBUG;
    await AEPCore.setLogLevel(logLevel);
    expect(spy).toHaveBeenCalledWith(logLevel);
  });

  test('getLogLevel is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getLogLevel');
    await AEPCore.getLogLevel();
    expect(spy).toHaveBeenCalled();
  });

  test('log is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'log');
    let logLevel = AEPMobileLogLevel.DEBUG;
    let tag = "AEPCoreTests";
    let message = "Hello from jest tests!";
    await AEPCore.log(logLevel, tag, message);
    expect(spy).toHaveBeenCalledWith(logLevel, tag, message);
  });

  test('setPrivacyStatus is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setPrivacyStatus');
    let privacyStatus = AEPMobilePrivacyStatus.UNKNOWN;
    await AEPCore.setPrivacyStatus(privacyStatus);
    expect(spy).toHaveBeenCalledWith(privacyStatus);
  });

  test('getPrivacyStatus is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getPrivacyStatus');
    await AEPCore.getPrivacyStatus();
    expect(spy).toHaveBeenCalled();
  });

  test('getSdkIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getSdkIdentities');
    await AEPCore.getSdkIdentities();
    expect(spy).toHaveBeenCalled();
  });

  test('dispatchEvent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'dispatchEvent');
    let testEvent = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
    await AEPCore.dispatchEvent(testEvent);
    expect(spy).toHaveBeenCalledWith(testEvent);
  });

  test('dispatchEventWithResponseCallback is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'dispatchEventWithResponseCallback');
    let testEvent = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
    await AEPCore.dispatchEventWithResponseCallback(testEvent);
    expect(spy).toHaveBeenCalledWith(testEvent);
  });

  test('dispatchResponseEvent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'dispatchResponseEvent');
    let testEvent = new AEPExtensionEvent("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
    let testEvent1 = new AEPExtensionEvent("eventName1", "eventType1", "eventSource1", {"testDataKey1": "testDataValue1"});
    await AEPCore.dispatchResponseEvent(testEvent, testEvent1);
    expect(spy).toHaveBeenCalledWith(testEvent, testEvent1);
  });

  test('trackAction is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'trackAction');
    let actionName = "testAction";
    let contextData = {"testKey": "testValue"};
    await AEPCore.trackAction(actionName, contextData);
    expect(spy).toHaveBeenCalledWith(actionName, contextData);
  });

  test('trackState is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'trackState');
    let stateName = "testState";
    let contextData = {"testKey": "testValue"};
    await AEPCore.trackState(stateName, contextData);
    expect(spy).toHaveBeenCalledWith(stateName, contextData);
  });

  test('setAdvertisingIdentifier is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setAdvertisingIdentifier');
    let adId = "testAdId";
    await AEPCore.setAdvertisingIdentifier(adId);
    expect(spy).toHaveBeenCalledWith(adId);
  });

  test('setPushIdentifier is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setPushIdentifier');
    let pushIdentifier = "testPushId";
    await AEPCore.setPushIdentifier(pushIdentifier);
    expect(spy).toHaveBeenCalledWith(pushIdentifier);
  });

  test('collectPii is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'collectPii');
    let contextData = {"testKey": "testValue"};
    await AEPCore.collectPii(contextData);
    expect(spy).toHaveBeenCalledWith(contextData);
  });

  test('setSmallIconResourceID is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setSmallIconResourceID');
    let resourceID = 1
    await AEPCore.setSmallIconResourceID(resourceID);
    expect(spy).toHaveBeenCalledWith(resourceID);
  });

  test('setLargeIconResourceID is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setLargeIconResourceID');
    let resourceID = 1
    await AEPCore.setLargeIconResourceID(resourceID);
    expect(spy).toHaveBeenCalledWith(resourceID);
  });

  test('setAppGroup is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setAppGroup');
    let appGroup = "testAppGroup"
    await AEPCore.setAppGroup(appGroup);
    expect(spy).toHaveBeenCalledWith(appGroup);
  });

});
