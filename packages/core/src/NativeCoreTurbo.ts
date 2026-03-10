/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use it except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
*/
/**
 * NativeCoreTurbo Turbo Module spec.
 * Logs Mobile Core extension version and returns it.
 */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getExtensionVersion(): Promise<string>;
  getOptimizeVersion(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeCoreTurbo');
