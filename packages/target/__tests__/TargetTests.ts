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
import Target from '../ts/Target';
import TargetPrefetchObject from '../ts/models/TargetPrefetchObject';
import TargetRequestObject from '../ts/models/TargetRequestObject';
import TargetOrder from '../ts/models/TargetOrder';
import TargetProduct from '../ts/models/TargetProduct';
import TargetParameters from '../ts/models/TargetParameters';

describe('Target', () => {
  test('extensionVersion is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'extensionVersion');
    await Target.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  test('clearPrefetchCache is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'clearPrefetchCache');
    await Target.clearPrefetchCache();
    expect(spy).toHaveBeenCalled();
  });

  test('getSessionId is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'getSessionId');
    await Target.getSessionId();
    expect(spy).toHaveBeenCalled();
  });

  test('getTntId is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'getTntId');
    await Target.getTntId();
    expect(spy).toHaveBeenCalled();
  });

  test('resetExperience is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'resetExperience');
    await Target.resetExperience();
    expect(spy).toHaveBeenCalled();
  });

  test('setPreviewRestartDeeplink is called with correct parameter', async () => {
    const spy = jest.spyOn(
      NativeModules.AEPTarget,
      'setPreviewRestartDeeplink'
    );
    let url = 'adobe.com';
    await Target.setPreviewRestartDeeplink(url);
    expect(spy).toHaveBeenCalledWith(url);
  });

  test('setSessionId is called with the correct parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'setSessionId');
    let id = 'sessionTestId';
    await Target.setSessionId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('setThirdPartyId is called with correct parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'setThirdPartyId');
    let id = 'thirdPartyTestId';
    await Target.setThirdPartyId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('setTntId is called with the correct parameter', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'setTntId');
    let id = 'tntTestId';
    await Target.setTntId(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  test('retrieveLocationContent is called with correct parameters', async () => {
    const spy = jest.spyOn(NativeModules.AEPTarget, 'retrieveLocationContent');
    var mboxParameters1 = { status: 'platinum' };
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
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
    const spy = jest.spyOn(NativeModules.AEPTarget, 'displayedLocations');
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
    const spy = jest.spyOn(NativeModules.AEPTarget, 'clickedLocation');
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
   
    const spy = jest.spyOn(NativeModules.AEPTarget, 'prefetchContent');
    var mboxParameters1 = { status: 'platinum' };
    var purchaseIDs = ['34', '125'];

    var targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    var targetProduct = new TargetProduct('24D3412', 'Books');
    var parameters1 = new TargetParameters(mboxParameters1, null, null, null);
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
});
