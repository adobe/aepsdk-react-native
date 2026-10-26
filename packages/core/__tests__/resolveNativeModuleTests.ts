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

interface TestSpec {
  extensionVersion(): Promise<string>;
  other: string;
  emitter: () => void;
}

const loadUtil = (
  nativeModules: Record<string, unknown>,
  turboModules: Record<string, unknown>,
  bridgeless: boolean
) => {
  const getEnforcing = jest.fn((name: string) => {
    throw new Error(`${name} not found`);
  });
  (global as any).RN$Bridgeless = bridgeless;
  jest.resetModules();
  jest.doMock('react-native', () => ({
    NativeModules: nativeModules,
    TurboModuleRegistry: {
      get: jest.fn((name: string) => turboModules[name] ?? null),
      getEnforcing
    }
  }));
  return {
    util: require('../src/utils/resolveNativeModule'),
    getEnforcing
  };
};

describe('resolveNativeModule', () => {
  afterEach(() => {
    delete (global as any).RN$Bridgeless;
  });

  it('prefers NativeModules on the classic bridge', () => {
    const bridge = { extensionVersion: jest.fn() };
    const turbo = { extensionVersion: jest.fn() };
    const { util } = loadUtil({ M: bridge }, { M: turbo }, false);
    expect(util.resolveNativeModule('M', 'extensionVersion')).toBe(bridge);
  });

  it('prefers TurboModuleRegistry when bridgeless', () => {
    const bridge = { extensionVersion: jest.fn() };
    const turbo = { extensionVersion: jest.fn() };
    const { util } = loadUtil({ M: bridge }, { M: turbo }, true);
    expect(util.resolveNativeModule('M', 'extensionVersion')).toBe(turbo);
  });

  it('falls back to NativeModules when the turbo module is missing', () => {
    const bridge = { extensionVersion: jest.fn() };
    const { util } = loadUtil({ M: bridge }, {}, true);
    expect(util.resolveNativeModule('M', 'extensionVersion')).toBe(bridge);
  });

  it('ignores registered modules missing the probe method', () => {
    const turbo = { extensionVersion: jest.fn() };
    const { util } = loadUtil({ M: {} }, { M: turbo }, false);
    expect(util.resolveNativeModule('M', 'extensionVersion')).toBe(turbo);
  });

  it('throws via getEnforcing when the module is not registered', () => {
    const { util, getEnforcing } = loadUtil({}, {}, true);
    expect(() => util.resolveNativeModule('M', 'extensionVersion')).toThrow(
      'M not found'
    );
    expect(getEnforcing).toHaveBeenCalledWith('M');
  });
});

describe('createNativeModuleProxy', () => {
  afterEach(() => {
    delete (global as any).RN$Bridgeless;
  });

  it('resolves lazily and binds functions to the native module', async () => {
    const mod = {
      version: '1',
      extensionVersion: jest.fn(function (this: unknown) {
        return Promise.resolve(this === mod ? 'bound' : 'unbound');
      })
    };
    const { util, getEnforcing } = loadUtil({}, { M: mod }, true);
    const proxy = util.createNativeModuleProxy('M', {
      probeMethod: 'extensionVersion'
    }) as TestSpec;
    expect(getEnforcing).not.toHaveBeenCalled();
    await expect(proxy.extensionVersion()).resolves.toBe('bound');
    expect((proxy as any).version).toBe('1');
  });

  it('does not bind properties listed in unboundProps', () => {
    const emitter = jest.fn();
    const mod = { extensionVersion: jest.fn(), emitter };
    const { util } = loadUtil({}, { M: mod }, true);
    const proxy = util.createNativeModuleProxy('M', {
      probeMethod: 'extensionVersion',
      unboundProps: ['emitter']
    }) as TestSpec;
    expect(proxy.emitter).toBe(emitter);
  });
});
