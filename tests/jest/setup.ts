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

import * as ReactNative from 'react-native';

jest.doMock('react-native', () => {
    return Object.setPrototypeOf({
            NativeModules: {
                ...ReactNative.NativeModules,
                AEPEdgeConsent: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    update: jest.fn(),
                    getConsents: jest.fn(() => new Promise(resolve => resolve(null)))
                }, 
                AEPEdgeIdentity: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    getExperienceCloudId: jest.fn(() => new Promise(resolve => resolve(''))),
                    getIdentities: jest.fn(() => new Promise(resolve => resolve({"ABC":[{"id":"id1","authenticatedState":"ambiguous","primary":false}]}))),
                    updateIdentities: jest.fn(),
                    removeIdentity: jest.fn(),
                },
                AEPEdge: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    sendEvent: jest.fn(() => new Promise(resolve => resolve([{type: "example", payload: {sample: "data"}}]))),
                },
                AEPAssurance: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    startSession: jest.fn()
                },
                AEPUserProfile: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    removeUserAttributes: jest.fn(),
                    getUserAttributes: jest.fn(() => new Promise(resolve => resolve(null))),
                    updateUserAttributes: jest.fn()
                },
                AEPSignal: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve('')))
                },
                AEPLifecycle: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve('')))
                },
                AEPCore: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    configureWithAppId: jest.fn(),
                    updateConfiguration: jest.fn(),
                    setLogLevel: jest.fn(),
                    getLogLevel: jest.fn(() => new Promise(resolve => resolve('DEBUG'))),
                    log: jest.fn(),
                    setPrivacyStatus: jest.fn(),
                    getPrivacyStatus: jest.fn(() => new Promise(resolve => resolve('OPT_OUT'))),
                    getSdkIdentities: jest.fn(() => new Promise(resolve => resolve(''))),
                    dispatchEvent: jest.fn(),
                    dispatchEventWithResponseCallback: jest.fn(() => new Promise(resolve => resolve(null))),
                    trackAction: jest.fn(),
                    trackState: jest.fn(),
                    setAdvertisingIdentifier: jest.fn(),
                    setPushIdentifier: jest.fn(),
                    collectPii: jest.fn(),
                    setSmallIconResourceID: jest.fn(),
                    setLargeIconResourceID: jest.fn(),
                    setAppGroup: jest.fn(),
                    resetIdentities: jest.fn(),
                },
                AEPIdentity: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    syncIdentifiers: jest.fn(),
                    syncIdentifiersWithAuthState: jest.fn(),
                    syncIdentifier: jest.fn(),
                    appendVisitorInfoForURL: jest.fn(() => new Promise(resolve => resolve(''))),
                    getUrlVariables: jest.fn(() => new Promise(resolve => resolve(''))),
                    getIdentifiers: jest.fn(() => new Promise(resolve => resolve(null))),
                    getExperienceCloudId: jest.fn(() => new Promise(resolve => resolve(''))) 
                },
                AEPMessaging: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve('')))
                },
                AEPOptimize: {
                    extensionVersion: jest.fn(() => new Promise(resolve => resolve(''))),
                    onPropositionsUpdate: jest.fn(),                    
                    clearCachedPropositions: jest.fn(),
                    getPropositions: jest.fn(() => new Promise(resolve => {
                        let map = new Map();
                        resolve(map);
                    })),
                    updatePropositions: jest.fn(),
                    offerDisplayed: jest.fn(),
                    offerTapped: jest.fn(),
                    generateDisplayInteractionXdm: jest.fn(() => new Promise(resolve => resolve(new Map()))),
                    generateTapInteractionXdm: jest.fn(() => new Promise(resolve => resolve(new Map()))),
                    generateReferenceXdm: jest.fn(() => new Promise(resolve => resolve(new Map())))
                },                     
            },            
            NativeEventEmitter: class {
                addListener() {

                }
            }
        },
        ReactNative,
    );
});
