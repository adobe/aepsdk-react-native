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

jest.mock('../src/NativeAEPTarget', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    clearPrefetchCache: jest.fn(),
    getThirdPartyId: jest.fn().mockResolvedValue('thirdPartyId'),
    getSessionId: jest.fn().mockResolvedValue('sessionId'),
    getTntId: jest.fn().mockResolvedValue('tntId'),
    resetExperience: jest.fn(),
    setPreviewRestartDeeplink: jest.fn(),
    setSessionId: jest.fn(),
    setTntId: jest.fn(),
    setThirdPartyId: jest.fn(),
    retrieveLocationContent: jest.fn(),
    prefetchContent: jest.fn().mockResolvedValue(true),
    prefetchContentWithTimeout: jest.fn().mockResolvedValue(true),
    displayedLocations: jest.fn(),
    clickedLocation: jest.fn(),
    registerTargetRequests: jest.fn()
  }
}));

import NativeAEPTarget from '../src/NativeAEPTarget';
import Target from '../src/Target';
import TargetPrefetchObject from '../src/models/TargetPrefetchObject';
import TargetRequestObject from '../src/models/TargetRequestObject';
import TargetOrder from '../src/models/TargetOrder';
import TargetProduct from '../src/models/TargetProduct';
import TargetParameters from '../src/models/TargetParameters';

describe('Target', () => {
  test('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'extensionVersion');
    await Target.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  test('clearPrefetchCache is called', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'clearPrefetchCache');
    await Target.clearPrefetchCache();
    expect(spy).toHaveBeenCalled();
  });

  test('getSessionId is called', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'getSessionId');
    await Target.getSessionId();
    expect(spy).toHaveBeenCalled();
  });

  test('getTntId is called', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'getTntId');
    await Target.getTntId();
    expect(spy).toHaveBeenCalled();
  });

  test('resetExperience is called', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'resetExperience');
    await Target.resetExperience();
    expect(spy).toHaveBeenCalled();
  });

  test('setPreviewRestartDeeplink is called with correct parameter', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'setPreviewRestartDeeplink');
    let url = 'adobe.com';
    await Target.setPreviewRestartDeeplink(url);
    expect(spy).toHaveBeenCalledWith(url);
  });

  test('setSessionId is called with the correct parameter', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'setSessionId');
    let id = 'sessionTestId';
    await Target.setSessionId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('setThirdPartyId is called with correct parameter', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'setThirdPartyId');
    let id = 'thirdPartyTestId';
    await Target.setThirdPartyId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('setTntId is called with the correct parameter', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'setTntId');
    let id = 'tntTestId';
    await Target.setTntId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('retrieveLocationContent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'retrieveLocationContent');
    var mboxParameters1 = { status: 'platinum' };
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var parameters1 = new TargetParameters(mboxParameters1);
    var request1 = new TargetRequestObject(
      'mboxName2',
      parameters1,
      'defaultContent1',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      }
    );

    var parameters2 = new TargetParameters(
      mboxParameters1,
      { profileParameters: 'parameterValue' },
      targetProduct,
      targetOrder
    );
    var request2 = new TargetRequestObject(
      'mboxName2',
      parameters2,
      'defaultContent2',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      }
    );

    var locationRequests = [request1, request2];
    var profileParameters1 = { ageGroup: '20-32' };

    var parameters = new TargetParameters(
      { parameters: 'parametervalue' },
      profileParameters1,
      targetProduct,
      targetOrder
    );
    await Target.retrieveLocationContent(locationRequests, parameters);

    expect(spy).toHaveBeenCalledWith(locationRequests, parameters);
  });

  test('displayedLocations is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'displayedLocations');
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var profileParameters1 = { ageGroup: '20-32' };
    var parameters = new TargetParameters(
      { parameters: 'parametervalue' },
      profileParameters1,
      targetProduct,
      targetOrder
    );

    await Target.displayedLocations(
      ['locationName', 'locationName1'],
      parameters
    );
    expect(spy).toHaveBeenCalledWith(
      ['locationName', 'locationName1'],
      parameters
    );
  });

  test('clickedLocation is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeAEPTarget as any, 'clickedLocation');
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var profileParameters1 = { ageGroup: '20-32' };
    var parameters = new TargetParameters(
      { parameters: 'parametervalue' },
      profileParameters1,
      targetProduct,
      targetOrder
    );

    await Target.clickedLocation('locationName', parameters);

    expect(spy).toHaveBeenCalledWith('locationName', parameters);
  });

 test('prefetchContent is called with correct parameters', async () => {
   
    const spy = jest.spyOn(NativeAEPTarget as any, 'prefetchContent');
    var mboxParameters1 = { status: 'platinum' };
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var parameters1 = new TargetParameters(mboxParameters1);
    var prefetch1 = new TargetPrefetchObject('mboxName2', parameters1);

    var parameters2 = new TargetParameters(
      mboxParameters1,
      { profileParameters: 'parameterValue' },
      targetProduct,
      targetOrder
    );
    var prefetch2 = new TargetPrefetchObject('mboxName2', parameters2);

    var prefetchList = [prefetch1, prefetch2];
    var profileParameters1 = { ageGroup: '20-32' };

    var parameters = new TargetParameters(
      { parameters: 'parametervalue' },
      profileParameters1,
      targetProduct,
      targetOrder
    );

  
   await Target.prefetchContent(prefetchList, parameters)
      .then((success) => console.log(success))
      .catch((err) => console.log(err));

    expect(spy).toHaveBeenCalledWith(prefetchList, parameters);
 });

  describe('prefetchContent with timeout', () => {
    const prefetchList = [new TargetPrefetchObject('mbox', new TargetParameters())];
    const parameters = new TargetParameters({ key: 'value' });

    beforeEach(() => {
      (NativeAEPTarget as any).prefetchContent.mockClear();
      (NativeAEPTarget as any).prefetchContentWithTimeout.mockClear();
    });

    test('routes to the timeout variant when a timeout is given', async () => {
      await Target.prefetchContent(prefetchList, parameters, 5);
      expect((NativeAEPTarget as any).prefetchContentWithTimeout).toHaveBeenCalledWith(prefetchList, parameters, 5);
      expect((NativeAEPTarget as any).prefetchContent).not.toHaveBeenCalled();
    });

    test('passes null parameters when none are given', async () => {
      await Target.prefetchContent(prefetchList, undefined, 2.5);
      expect((NativeAEPTarget as any).prefetchContentWithTimeout).toHaveBeenCalledWith(prefetchList, null, 2.5);
    });

    test('uses the regular prefetch when no timeout is given', async () => {
      await Target.prefetchContent(prefetchList, parameters);
      expect((NativeAEPTarget as any).prefetchContent).toHaveBeenCalledWith(prefetchList, parameters);
      expect((NativeAEPTarget as any).prefetchContentWithTimeout).not.toHaveBeenCalled();
    });

    test.each([0, -1, NaN, Infinity, '5'])('rejects an invalid timeout (%p)', async (timeout) => {
      await expect(Target.prefetchContent(prefetchList, parameters, timeout as any)).rejects.toThrow(
        'timeout must be a positive number of seconds'
      );
      expect((NativeAEPTarget as any).prefetchContentWithTimeout).not.toHaveBeenCalled();
    });
  });

  describe('TargetRequestObject callbacks', () => {
    const register = NativeAEPTarget.registerTargetRequests as unknown as jest.Mock;

    beforeEach(() => register.mockClear());

    test('a function callback is registered as a plain request and receives (error, content)', () => {
      const callback = jest.fn();
      const request = new TargetRequestObject('mbox', new TargetParameters(), 'default', callback);

      expect(request.detailedCallback).toBe(false);
      expect(register).toHaveBeenCalledWith(request, expect.any(Function));

      register.mock.calls[0][1](null, 'content', { responseTokens: {} });
      expect(callback).toHaveBeenCalledWith(null, 'content');
    });

    test('a detailed callback is flagged for the native layer and receives (content, data)', () => {
      const call = jest.fn();
      const fail = jest.fn();
      const request = new TargetRequestObject('mbox', new TargetParameters(), 'default', { call, fail });

      expect(request.detailedCallback).toBe(true);
      expect(register).toHaveBeenCalledWith(request, expect.any(Function));

      const data = { responseTokens: { 'activity.name': 'a' }, 'analytics.payload': { pe: 'tnt' } };
      register.mock.calls[0][1](null, 'content', data);

      expect(call).toHaveBeenCalledWith('content', data);
      expect(fail).not.toHaveBeenCalled();
    });

    test('a detailed callback receives null data when the response has none', () => {
      const call = jest.fn();
      new TargetRequestObject('mbox', new TargetParameters(), 'default', { call });

      register.mock.calls[0][1](null, 'content', undefined);
      expect(call).toHaveBeenCalledWith('content', null);
    });

    test('a detailed callback reports errors through fail', () => {
      const call = jest.fn();
      const fail = jest.fn();
      new TargetRequestObject('mbox', new TargetParameters(), 'default', { call, fail });

      const error = { code: 1, message: 'NETWORK_ERROR' };
      register.mock.calls[0][1](error, null, null);

      expect(fail).toHaveBeenCalledWith(error);
      expect(call).not.toHaveBeenCalled();
    });

    test('an error without a fail handler is ignored', () => {
      const call = jest.fn();
      new TargetRequestObject('mbox', new TargetParameters(), 'default', { call });

      expect(() => register.mock.calls[0][1]({ code: 1, message: 'x' }, null, null)).not.toThrow();
      expect(call).not.toHaveBeenCalled();
    });

    test.each([[null], [{}], [{ fail: () => {} }], ['callback']])('rejects an invalid callback (%p)', (callback) => {
      expect(() => new TargetRequestObject('mbox', new TargetParameters(), 'default', callback as any)).toThrow(TypeError);
      expect(register).not.toHaveBeenCalled();
    });
  });
});
