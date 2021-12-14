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
import {MobileCore, LogLevel, PrivacyStatus, Event} from '../';

describe('MobileCore', () => {

  it('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'extensionVersion');
    await MobileCore.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('configureWithAppId is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'configureWithAppId');
    let appId = "testAppId";
    await MobileCore.configureWithAppId(appId);
    expect(spy).toHaveBeenCalledWith(appId);
  });

  it('updateConfiguration is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'updateConfiguration');
    let config = {"ssl": "false"};
    await MobileCore.updateConfiguration(config);
    expect(spy).toHaveBeenCalledWith(config);
  });

  it('setLogLevel is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setLogLevel');
    let logLevel = LogLevel.DEBUG;
    await MobileCore.setLogLevel(logLevel);
    expect(spy).toHaveBeenCalledWith("DEBUG");
  });

  it('getLogLevel is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getLogLevel');
    const logLevel = await MobileCore.getLogLevel();
    expect(spy).toHaveBeenCalled();
    expect(logLevel).toEqual(LogLevel.DEBUG);
  });

  it('log is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'log');
    let logLevel = LogLevel.DEBUG;
    let tag = "MobileCoreTests";
    let message = "Hello from jest tests!";
    await MobileCore.log(logLevel, tag, message);
    expect(spy).toHaveBeenCalledWith(logLevel, tag, message);
  });

  it('setPrivacyStatus is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setPrivacyStatus');
    let privacyStatus = PrivacyStatus.UNKNOWN;
    await MobileCore.setPrivacyStatus(privacyStatus);
    expect(spy).toHaveBeenCalledWith("UNKNOWN");
  });

  it('getPrivacyStatus is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getPrivacyStatus');
    const privacyStatus = await MobileCore.getPrivacyStatus();
    expect(spy).toHaveBeenCalled();
    expect(privacyStatus).toEqual('OPT_OUT');
  });

  it('getSdkIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'getSdkIdentities');
    await MobileCore.getSdkIdentities();
    expect(spy).toHaveBeenCalled();
  });

  it('dispatchEvent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'dispatchEvent');
    let testEvent = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
    await MobileCore.dispatchEvent(testEvent);
    expect(spy).toHaveBeenCalledWith(testEvent);
  });

  it('dispatchEventWithResponseCallback is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'dispatchEventWithResponseCallback');
    let testEvent = new Event("eventName", "eventType", "eventSource", {"testDataKey": "testDataValue"});
    await MobileCore.dispatchEventWithResponseCallback(testEvent);
    expect(spy).toHaveBeenCalledWith(testEvent);
  });

  it('trackAction is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'trackAction');
    let actionName = "testAction";
    let contextData = {"testKey": "testValue"};
    await MobileCore.trackAction(actionName, contextData);
    expect(spy).toHaveBeenCalledWith(actionName, contextData);
  });

  it('trackState is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'trackState');
    let stateName = "testState";
    let contextData = {"testKey": "testValue"};
    await MobileCore.trackState(stateName, contextData);
    expect(spy).toHaveBeenCalledWith(stateName, contextData);
  });

  it('setAdvertisingIdentifier is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setAdvertisingIdentifier');
    let adId = "testAdId";
    await MobileCore.setAdvertisingIdentifier(adId);
    expect(spy).toHaveBeenCalledWith(adId);
  });

  it('setPushIdentifier is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setPushIdentifier');
    let pushIdentifier = "testPushId";
    await MobileCore.setPushIdentifier(pushIdentifier);
    expect(spy).toHaveBeenCalledWith(pushIdentifier);
  });

  it('collectPii is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'collectPii');
    let contextData = {"testKey": "testValue"};
    await MobileCore.collectPii(contextData);
    expect(spy).toHaveBeenCalledWith(contextData);
  });

  it('setSmallIconResourceID is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setSmallIconResourceID');
    let resourceID = 1
    await MobileCore.setSmallIconResourceID(resourceID);
    expect(spy).toHaveBeenCalledWith(resourceID);
  });

  it('setLargeIconResourceID is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setLargeIconResourceID');
    let resourceID = 1
    await MobileCore.setLargeIconResourceID(resourceID);
    expect(spy).toHaveBeenCalledWith(resourceID);
  });

  it('setAppGroup is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'setAppGroup');
    let appGroup = "testAppGroup"
    await MobileCore.setAppGroup(appGroup);
    expect(spy).toHaveBeenCalledWith(appGroup);
  });

  it('resetIdentities is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPCore, 'resetIdentities');
    await MobileCore.resetIdentities();
    expect(spy).toHaveBeenCalled();
  });

});
