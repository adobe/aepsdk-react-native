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

#import "RCTAEPPlacesDataBridge.h"
#import <CoreLocation/CoreLocation.h>

// @{link PlacesAuthorizationStatus}
static NSString *const AEP_PLACES_AUTH_STATUS_DENIED =
    @"AEP_PLACES_AUTH_STATUS_DENIED";
static NSString *const AEP_PLACES_AUTH_STATUS_ALWAYS =
    @"AEP_PLACES_AUTH_STATUS_ALWAYS";
static NSString *const AEP_PLACES_AUTH_STATUS_UNKNOWN =
    @"AEP_PLACES_AUTH_STATUS_UNKNOWN";
static NSString *const AEP_PLACES_AUTH_STATUS_RESTRICTED =
    @"AEP_PLACES_AUTH_STATUS_RESTRICTED";
static NSString *const AEP_PLACES_AUTH_STATUS_WHEN_IN_USE =
    @"AEP_PLACES_AUTH_STATUS_WHEN_IN_USE";

// AccuracyStatus
static NSString *const FULL_ACCURACY_STATUS = @"fullAccuracy";
static NSString *const REDUCED_ACCURACY_STATUS = @"reducedAccuracy";

// Location
static NSString *const LOCATION_LATITUDE = @"latitude";
static NSString *const LOCATION_LONGITUDE = @"longitude";

// PlacesPOI
static NSString *const AEP_PLACES_POI_IDENTIFIER = @"identifier";
static NSString *const AEP_PLACES_POI_NAME = @"name";
static NSString *const AEP_PLACES_POI_LATITUDE = @"latitude";
static NSString *const AEP_PLACES_POI_LONGITUDE = @"longitude";
static NSString *const AEP_PLACES_POI_RADIUS = @"radius";
static NSString *const AEP_PLACES_POI_USER_IS_WITHIN = @"userIsWithin";
static NSString *const AEP_PLACES_POI_METADATA = @"metadata";

// GeoFence
static NSString *const AEP_PLACES_GEOFENCE_IDENTIFIER = @"identifier";
static NSString *const AEP_PLACES_GEOFENCE_RADIUS = @"radius";
static NSString *const AEP_PLACES_GEOFENCE_EXPIRATION_DURATION =
    @"expirationDuration";

@implementation RCTAEPPlacesDataBridge

+ (NSDictionary *)dictionaryFromCLLocation:(CLLocation *)lastLocation {
  NSMutableDictionary *lastLocationDict = [NSMutableDictionary dictionary];
  NSNumber *latitude =
      [[NSNumber alloc] initWithDouble:lastLocation.coordinate.latitude];
  NSNumber *longitude =
      [[NSNumber alloc] initWithDouble:lastLocation.coordinate.longitude];

  [lastLocationDict setValue:latitude forKey:LOCATION_LATITUDE];
  [lastLocationDict setValue:longitude forKey:LOCATION_LONGITUDE];

  return lastLocationDict;
}

+ (CLLocation *)CLLocationFromDict:(nonnull NSDictionary *)locationDict {
  double latitude = [[locationDict objectForKey:LOCATION_LATITUDE] doubleValue];
  double longitude =
      [[locationDict objectForKey:LOCATION_LONGITUDE] doubleValue];

  CLLocation *location = [[CLLocation alloc] initWithLatitude:latitude
                                                    longitude:longitude];

  return location;
}

+ (CLAuthorizationStatus)authStatusFromString:(NSString *)authStatusString {
  if ([authStatusString isEqualToString:AEP_PLACES_AUTH_STATUS_DENIED]) {
    return kCLAuthorizationStatusDenied;
  } else if ([authStatusString isEqualToString:AEP_PLACES_AUTH_STATUS_ALWAYS]) {
    return kCLAuthorizationStatusAuthorizedAlways;
  } else if ([authStatusString
                 isEqualToString:AEP_PLACES_AUTH_STATUS_RESTRICTED]) {
    return kCLAuthorizationStatusRestricted;
  } else if ([authStatusString
                 isEqualToString:AEP_PLACES_AUTH_STATUS_WHEN_IN_USE]) {
    return kCLAuthorizationStatusAuthorizedWhenInUse;
  } else {
    return kCLAuthorizationStatusNotDetermined;
  }
}

+ (CLAccuracyAuthorization)accuracyAuthoriztionFromString:(NSString *)accuracy {
  if ([accuracy isEqualToString:FULL_ACCURACY_STATUS]) {
    return CLAccuracyAuthorizationFullAccuracy;
  }
  if ([accuracy isEqualToString:REDUCED_ACCURACY_STATUS]) {
    return CLAccuracyAuthorizationReducedAccuracy;
  }
  return CLAccuracyAuthorizationFullAccuracy;
}

+ (NSDictionary *)dictionaryFromPoi:(AEPPlacesPoi *)poi {
  NSMutableDictionary *poiDict = [NSMutableDictionary dictionary];

  poiDict[AEP_PLACES_POI_IDENTIFIER] = poi.identifier;
  poiDict[AEP_PLACES_POI_NAME] = poi.name;
  poiDict[AEP_PLACES_POI_LATITUDE] =
      [[NSNumber alloc] initWithDouble:poi.latitude];
  poiDict[AEP_PLACES_POI_LONGITUDE] =
      [[NSNumber alloc] initWithDouble:poi.longitude];
  poiDict[AEP_PLACES_POI_RADIUS] = [[NSNumber alloc] initWithInt:poi.radius];
  poiDict[AEP_PLACES_POI_USER_IS_WITHIN] =
      [NSNumber numberWithBool:poi.userIsWithin];
  poiDict[AEP_PLACES_POI_METADATA] = poi.metaData;

  return poiDict;
}

+ (CLRegion *)clRegionFromDict:(NSDictionary *)clRegionDict {
  CLLocationCoordinate2D center = CLLocationCoordinate2DMake(
      [[clRegionDict objectForKey:LOCATION_LATITUDE] doubleValue],
      [[clRegionDict objectForKey:LOCATION_LONGITUDE] doubleValue]);
  double radius =
      [[clRegionDict objectForKey:AEP_PLACES_GEOFENCE_RADIUS] doubleValue];
  NSString *identifier =
      [clRegionDict objectForKey:AEP_PLACES_GEOFENCE_IDENTIFIER];

  CLCircularRegion *eachRegion =
      [[CLCircularRegion alloc] initWithCenter:center
                                        radius:radius
                                    identifier:identifier];

  return eachRegion;
}

+ (AEPPlacesRegionEvent)regionEventFromInt:(int)typeInt {
  if (typeInt == 0) {
    return AEPPlacesRegionEventEntry;
  } else if (typeInt == 1) {
    return AEPPlacesRegionEventExit;
  } else {
    return typeInt;
  }
}

@end
