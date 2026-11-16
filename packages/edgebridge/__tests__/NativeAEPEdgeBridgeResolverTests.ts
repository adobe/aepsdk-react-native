/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const bridgeModule = { extensionVersion: jest.fn() };
const turboModule = { extensionVersion: jest.fn() };
const turboGet = jest.fn();
const turboGetEnforcing = jest.fn();
const nativeModules: Record<string, unknown> = {};

jest.mock('react-native', () => ({
  NativeModules: nativeModules,
  TurboModuleRegistry: {
    get: (...args: unknown[]) => turboGet(...args),
    getEnforcing: (...args: unknown[]) => turboGetEnforcing(...args)
  }
}));

const setBridgeless = (value: boolean | undefined) => {
  (global as { RN$Bridgeless?: boolean }).RN$Bridgeless = value;
};

const resolve = () => {
  let resolver: () => unknown;
  jest.isolateModules(() => {
    resolver = require('../src/NativeAEPEdgeBridge').resolveNativeAEPEdgeBridge;
  });
  return resolver!();
};

describe('resolveNativeAEPEdgeBridge', () => {
  beforeEach(() => {
    turboGet.mockReset();
    turboGetEnforcing.mockReset();
    delete nativeModules.NativeAEPEdgeBridge;
  });

  afterAll(() => setBridgeless(undefined));

  it('prefers NativeModules on the classic bridge', () => {
    setBridgeless(undefined);
    nativeModules.NativeAEPEdgeBridge = bridgeModule;
    turboGet.mockReturnValue(turboModule);
    expect(resolve()).toBe(bridgeModule);
    expect(turboGet).not.toHaveBeenCalled();
  });

  it('prefers TurboModuleRegistry.get when bridgeless', () => {
    setBridgeless(true);
    nativeModules.NativeAEPEdgeBridge = bridgeModule;
    turboGet.mockReturnValue(turboModule);
    expect(resolve()).toBe(turboModule);
  });

  it('falls back to NativeModules when the registry has no module', () => {
    setBridgeless(true);
    nativeModules.NativeAEPEdgeBridge = bridgeModule;
    turboGet.mockReturnValue(null);
    expect(resolve()).toBe(bridgeModule);
    expect(turboGetEnforcing).not.toHaveBeenCalled();
  });

  it('uses getEnforcing as the final fallback', () => {
    setBridgeless(true);
    turboGet.mockReturnValue(null);
    turboGetEnforcing.mockReturnValue(turboModule);
    expect(resolve()).toBe(turboModule);
    expect(turboGetEnforcing).toHaveBeenCalledWith('NativeAEPEdgeBridge');
  });
});
