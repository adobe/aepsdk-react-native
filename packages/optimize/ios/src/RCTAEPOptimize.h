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

#if USE_INTEROP_ROOT
  #if RCT_NEW_ARCH_ENABLED
    // RN 0.84+ interop (new arch): SpecBase + getTurboModule: — sendEventWithName: is dead
    // when getTurboModule: exists (callableJSModules:nil). Use emitOnPropositionsUpdated:.
    #import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
    @interface RCTAEPOptimize : NativeAEPOptimizeSpecBase <NativeAEPOptimizeSpec>
  #else
    // RN 0.76 old arch: pure classic bridge module (RCT_EXPORT_METHOD + RCTEventEmitter).
    #import <React/RCTEventEmitter.h>
    @interface RCTAEPOptimize : RCTEventEmitter
  #endif
#else
  // Turbo path (RN 0.84+ default): SpecBase provides emitOnPropositionsUpdated:
  // for JSI-native event delivery on both iOS and Android.
  //
  // sendEventWithName: is dead for any module registered via getTurboModule:
  // See: https://reactnative.dev/docs/the-new-architecture/native-modules-custom-events
  #import <NativeAEPOptimizeSpec/NativeAEPOptimizeSpec.h>
  @interface RCTAEPOptimize : NativeAEPOptimizeSpecBase <NativeAEPOptimizeSpec>
#endif

@end
