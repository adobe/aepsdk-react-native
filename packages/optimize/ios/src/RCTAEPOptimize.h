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

#import <Foundation/Foundation.h>
#import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>

// NativeAEPOptimizeSpecBase (codegen-generated) provides emitOnPropositionsUpdated:
// for JSI-native event emission. Used on BOTH turbo and interop paths because:
//
// 1. getTurboModule: is required on both paths (RCTModuleProviders.mm checks it)
// 2. getTurboModule: → RCTTurboModuleManager creates module with callableJSModules:nil
// 3. callableJSModules:nil → sendEventWithName: silently drops events
// 4. Therefore RCTEventEmitter's sendEventWithName: is dead for any turbo-registered module
// 5. emitOnPropositionsUpdated: bypasses callableJSModules — uses JSI EventEmitterCallback
//
// See: https://reactnative.dev/docs/the-new-architecture/native-modules-custom-events
@interface RCTAEPOptimize : NativeAEPOptimizeSpecBase <NativeAEPOptimizeSpec>

@end
