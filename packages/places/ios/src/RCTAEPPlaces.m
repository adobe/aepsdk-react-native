/*
Copyright 2020 Adobe. All rights reserved.
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

@implementation RCTAEPPlaces

static NSString *const EXTENSION_NAME = @"AEPPlaces";

RCT_EXPORT_MODULE(AEPPlaces);

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(extensionVersion
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  resolve([AEPMobilePlaces extensionVersion]);
}

RCT_EXPORT_METHOD(getLastKnownLocation
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPMobilePlaces getLastKnownLocation:^(CLLocation *_Nullable lastLocation) {
    resolve([RCTAEPPlacesDataBridge dictionaryFromCLLocation:lastLocation]);
  }];
}

RCT_EXPORT_METHOD(clear) { [AEPMobilePlaces clear]; }

RCT_EXPORT_METHOD(setAuthorizationStatus : (nonnull NSString *)authStatus) {
  [AEPMobilePlaces setAuthorizationStatus:[RCTAEPPlacesDataBridge
                                              authStatusFromString:authStatus]];
}

RCT_EXPORT_METHOD(getNearbyPointsOfInterest
                  : (nonnull NSDictionary *)locationDict limit
                  : (int)limit resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  [AEPMobilePlaces
      getNearbyPointsOfInterest:[RCTAEPPlacesDataBridge
                                    CLLocationFromDict:locationDict]
                          limit:limit
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

RCT_EXPORT_METHOD(processGeofence
                  : (nonnull NSDictionary *)geofenceDict transitionType
                  : (int)transitionType) {
  [AEPMobilePlaces
      processRegionEvent:[RCTAEPPlacesDataBridge
                          regionEventFromInt:transitionType]
      forRegion:[RCTAEPPlacesDataBridge clRegionFromDict:geofenceDict]];
}

RCT_EXPORT_METHOD(getCurrentPointsOfInterest
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
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
