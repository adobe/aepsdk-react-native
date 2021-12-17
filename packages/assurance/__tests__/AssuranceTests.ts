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
import { Assurance } from '../js';

describe('Assurance', () => {

  it('extensionVersion is called', async () => {
    expect(Assurance.extensionVersion).toBeDefined();
    const spy = jest.spyOn(NativeModules.AEPAssurance, 'extensionVersion');
    await Assurance.extensionVersion();
    expect(spy).toHaveBeenCalled();
  });

  it('startSession is called', async () => {
    const spy = jest.spyOn(NativeModules.AEPAssurance, 'startSession');
    await Assurance.startSession('');
    expect(spy).toHaveBeenCalled();
  });
});
