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

const mockAEPCore = {
  extensionVersion: jest.fn(() => Promise.resolve('1.0.0')),
  configureWithAppId: jest.fn(() => Promise.resolve()),
  initialize: jest.fn(() => Promise.resolve()),
  initializeWithAppId: jest.fn((_appId: string) => Promise.resolve()),
  updateConfiguration: jest.fn(() => Promise.resolve()),
  setLogLevel: jest.fn(() => Promise.resolve()),
  getLogLevel: jest.fn(() => Promise.resolve(LogLevel.ERROR)),
  setPrivacyStatus: jest.fn(() => Promise.resolve()),
  getPrivacyStatus: jest.fn(() => Promise.resolve(PrivacyStatus.OPT_IN)),
  getSdkIdentities: jest.fn(() => Promise.resolve('identities')),
  dispatchEvent: jest.fn(() => Promise.resolve(true)),
  dispatchEventWithResponseCallback: jest.fn((event: Event, _timeoutMS: Number) => Promise.resolve(event)),
  trackAction: jest.fn((_action?: string, _contextData?: Record<string, string>) => Promise.resolve()),
  trackState: jest.fn((_state?: string, _contextData?: Record<string, string>) => Promise.resolve()),
  setAdvertisingIdentifier: jest.fn((_advertisingIdentifier?: string) => Promise.resolve()),
  setPushIdentifier: jest.fn((_pushIdentifier?: string) => Promise.resolve()),
  collectPii: jest.fn((_data: Record<string, string>) => Promise.resolve()),
  setSmallIconResourceID: jest.fn((_resourceID: number) => Promise.resolve()),
  setLargeIconResourceID: jest.fn((_resourceID: number) => Promise.resolve()),
  setAppGroup: jest.fn((_appGroup?: string) => Promise.resolve()),
  resetIdentities: jest.fn(() => Promise.resolve()),
  clearUpdatedConfiguration: jest.fn(() => Promise.resolve())
};

NativeModules.AEPCore = mockAEPCore;

import { MobileCore, LogLevel, PrivacyStatus, Event } from '../src';

describe('MobileCore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('extensionVersion is called', async () => {
    await MobileCore.extensionVersion();
    expect(mockAEPCore.extensionVersion).toHaveBeenCalled();
  });

  it('configureWithAppId is called with correct parameters', async () => {
    let appId = 'testAppId';
    MobileCore.configureWithAppId(appId);
    expect(mockAEPCore.configureWithAppId).toHaveBeenCalledWith(appId);
  });

  it('updateConfiguration is called with correct parameters', async () => {
    let config = { ssl: 'false' };
    MobileCore.updateConfiguration(config);
    expect(mockAEPCore.updateConfiguration).toHaveBeenCalledWith(config);
  });

  it('setLogLevel is called with correct parameters', async () => {
    let logLevel = LogLevel.DEBUG;
    MobileCore.setLogLevel(logLevel);
    expect(mockAEPCore.setLogLevel).toHaveBeenCalledWith('DEBUG');
  });

  it('getLogLevel is called', async () => {
    await MobileCore.getLogLevel();
    expect(mockAEPCore.getLogLevel).toHaveBeenCalled();
  });

  it('setPrivacyStatus is called with correct parameters', async () => {
    let privacyStatus = PrivacyStatus.UNKNOWN;
    MobileCore.setPrivacyStatus(privacyStatus);
    expect(mockAEPCore.setPrivacyStatus).toHaveBeenCalledWith('UNKNOWN');
  });

  it('getPrivacyStatus is called', async () => {
    await MobileCore.getPrivacyStatus();
    expect(mockAEPCore.getPrivacyStatus).toHaveBeenCalled();
  });

  it('getSdkIdentities is called', async () => {
    await MobileCore.getSdkIdentities();
    expect(mockAEPCore.getSdkIdentities).toHaveBeenCalled();
  });

  it('dispatchEvent is called with correct parameters', async () => {
    let testEvent = new Event('eventName', 'eventType', 'eventSource', {
      testDataKey: 'testDataValue',
    });
    await MobileCore.dispatchEvent(testEvent);
    expect(mockAEPCore.dispatchEvent).toHaveBeenCalledWith(testEvent);
  });

  it('dispatchEventWithResponseCallback is called with correct parameters', async () => {
    let testEvent = new Event('eventName', 'eventType', 'eventSource', {
      testDataKey: 'testDataValue',
    });
    await MobileCore.dispatchEventWithResponseCallback(testEvent, 5000);
    expect(mockAEPCore.dispatchEventWithResponseCallback).toHaveBeenCalledWith(testEvent, 5000);
  });

  it('trackAction is called with correct parameters', async () => {
    let actionName = 'testAction';
    let contextData = { testKey: 'testValue' };
    MobileCore.trackAction(actionName, contextData);
    expect(mockAEPCore.trackAction).toHaveBeenCalledWith(actionName, contextData);
  });

  it('trackState is called with correct parameters', async () => {
    let stateName = 'testState';
    let contextData = { testKey: 'testValue' };
    MobileCore.trackState(stateName, contextData);
    expect(mockAEPCore.trackState).toHaveBeenCalledWith(stateName, contextData);
  });

  it('setAdvertisingIdentifier is called with correct parameters', async () => {
    let adId = 'testAdId';
    MobileCore.setAdvertisingIdentifier(adId);
    expect(mockAEPCore.setAdvertisingIdentifier).toHaveBeenCalledWith(adId);
  });

  it('setPushIdentifier is called with correct parameters', async () => {
    let pushIdentifier = 'testPushId';
    MobileCore.setPushIdentifier(pushIdentifier);
    expect(mockAEPCore.setPushIdentifier).toHaveBeenCalledWith(pushIdentifier);
  });

  it('collectPii is called with correct parameters', async () => {
    let contextData = { testKey: 'testValue' };
    MobileCore.collectPii(contextData);
    expect(mockAEPCore.collectPii).toHaveBeenCalledWith(contextData);
  });

  it('setSmallIconResourceID is called with correct parameters', async () => {
    let resourceID = 1;
    MobileCore.setSmallIconResourceID(resourceID);
    expect(mockAEPCore.setSmallIconResourceID).toHaveBeenCalledWith(resourceID);
  });

  it('setLargeIconResourceID is called with correct parameters', async () => {
    let resourceID = 1;
    MobileCore.setLargeIconResourceID(resourceID);
    expect(mockAEPCore.setLargeIconResourceID).toHaveBeenCalledWith(resourceID);
  });

  it('setAppGroup is called with correct parameters', async () => {
    let appGroup = 'testAppGroup';
    MobileCore.setAppGroup(appGroup);
    expect(mockAEPCore.setAppGroup).toHaveBeenCalledWith(appGroup);
  });

  it('resetIdentities is called', async () => {
    MobileCore.resetIdentities();
    expect(mockAEPCore.resetIdentities).toHaveBeenCalled();
  });

    it('resolves successfully with full initialization options', async () => {
      const initOptions = {
        appId: 'test-app-id',
        lifecycleAutomaticTrackingEnabled: true,
        lifecycleAdditionalContextData: { contextDataKey: 'contextDataValue' }
      };
      mockAEPCore.initialize.mockResolvedValueOnce();
      
      await expect(MobileCore.initialize(initOptions)).resolves.not.toThrow();
      expect(mockAEPCore.initialize).toHaveBeenCalledWith(initOptions);
    });

    it('resolves successfully with only appId', async () => {
      const initOptions = {
        appId: 'test-app-id'
      };
      mockAEPCore.initialize.mockResolvedValueOnce();
      
      await expect(MobileCore.initialize(initOptions)).resolves.not.toThrow();
      expect(mockAEPCore.initialize).toHaveBeenCalledWith(initOptions);
    });

    it('rejects when initialization fails', async () => {
      const initOptions = {
        appId: 'test-app-id',
        lifecycleAutomaticTrackingEnabled: true,
        lifecycleAdditionalContextData: { contextDataKey: 'contextDataValue' }
      };
      const error = new Error('Initialization failed');
      mockAEPCore.initialize.mockRejectedValueOnce(error);

      await expect(MobileCore.initialize(initOptions)).rejects.toThrow('Initialization failed');
      expect(mockAEPCore.initialize).toHaveBeenCalledWith(initOptions);
    });


    it('resolves successfully when initialization succeeds', async () => {
      const appId = 'test-app-id';
      mockAEPCore.initialize.mockResolvedValueOnce();
      
      await expect(MobileCore.initializeWithAppId(appId)).resolves.not.toThrow();
      expect(mockAEPCore.initialize).toHaveBeenCalledWith({ appId });
    });

    it('rejects when initialization fails', async () => {
      const appId = 'test-app-id';
      const error = new Error('Initialization failed');
      mockAEPCore.initialize.mockRejectedValueOnce(error);

      await expect(MobileCore.initializeWithAppId(appId)).rejects.toThrow('Initialization failed');
      expect(mockAEPCore.initialize).toHaveBeenCalledWith({ appId });
    });

});
