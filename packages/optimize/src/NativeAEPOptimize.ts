// specs/RCTAEPOptimize.ts

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  extensionVersion(): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeAEPOptimize'
);