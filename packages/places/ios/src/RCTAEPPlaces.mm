/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance with the License. You
may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
REPRESENTATIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

#import "RCTAEPPlaces.h"
#import "RCTAEPPlacesDataBridge.h"
#import <CoreLocation/CoreLocation.h>
@import AEPPlaces;

// Old-arch iOS (classic bridge): NativeModules only exposes methods registered via
// RCT_EXPORT_METHOD. Protocol/Turbo selectors alone are invisible to JavaScript.
#if USE_INTEROP_ROOT && !RCT_NEW_ARCH_ENABLED
#define AEP_PLACES_METHOD(method) RCT_EXPORT_METHOD(method)
#else
#define AEP_PLACES_METHOD(method) - (void)method
#endif

@implementation RCTAEPPlaces

static NSString *const EXTENSION_NAME = @"AEPPlaces";

RCT_EXPORT_MODULE(NativeAEPPlaces);

#if !USE_INTEROP_ROOT || RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAEPPlacesSpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

AEP_PLACES_METHOD(extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  resolve([AEPMobilePlaces extensionVersion]);
}

AEP_PLACES_METHOD(getLastKnownLocation:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobilePlaces getLastKnownLocation:^(CLLocation *_Nullable lastLocation) {
    resolve([RCTAEPPlacesDataBridge dictionaryFromCLLocation:lastLocation]);
  }];
}

AEP_PLACES_METHOD(clear) { [AEPMobilePlaces clear]; }

AEP_PLACES_METHOD(setAuthorizationStatus:(NSString *)authStatus) {
  [AEPMobilePlaces setAuthorizationStatus:[RCTAEPPlacesDataBridge
                                              authStatusFromString:authStatus]];
}

AEP_PLACES_METHOD(getNearbyPointsOfInterest:(NSDictionary *)locationDict
                  limit:(double)limit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobilePlaces
      getNearbyPointsOfInterest:[RCTAEPPlacesDataBridge
                                    CLLocationFromDict:locationDict]
                          limit:(int)limit
                       callback:^(NSArray<AEPPlacesPoi *> *_Nonnull nearbyPoi,
                                  enum AEPPlacesQueryResponseCode code) {
                         NSMutableArray *poiArray = [NSMutableArray array];
                         for (AEPPlacesPoi *poi in nearbyPoi) {
                           [poiArray addObject:[RCTAEPPlacesDataBridge
                                                   dictionaryFromPoi:poi]];
                         }

                         resolve(poiArray);
                       }];
}

AEP_PLACES_METHOD(processGeofence:(NSDictionary *)geofenceDict
                  transitionType:(double)transitionType) {
  [AEPMobilePlaces
      processRegionEvent:[RCTAEPPlacesDataBridge
                          regionEventFromInt:(int)transitionType]
      forRegion:[RCTAEPPlacesDataBridge clRegionFromDict:geofenceDict]];
}

AEP_PLACES_METHOD(getCurrentPointsOfInterest:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [AEPMobilePlaces getCurrentPointsOfInterest:^(
                       NSArray<AEPPlacesPoi *> *_Nullable userWithinPoi) {
    NSMutableArray *poiArray = [NSMutableArray array];
    for (AEPPlacesPoi *poi in userWithinPoi) {
      [poiArray addObject:[RCTAEPPlacesDataBridge dictionaryFromPoi:poi]];
    }

    resolve(poiArray);
  }];
}

@end
