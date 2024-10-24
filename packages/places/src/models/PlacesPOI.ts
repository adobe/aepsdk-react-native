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
/**
 * Object that represents a Point of Interest created in the Adobe Places UI
 */
class PlacesPOI {
  identifier: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  userIsWithin: boolean;
  library: string;
  weight: number;
  metadata: { [key: string]: string };

  constructor(
    name: string,
    userIsWithin: boolean,
    library: string,
    weight: number,
    metadata: { [key: string]: string },
    identifier: string,
    latitude: number,
    longitude: number,
    radius: number,
  ) {
    this.identifier = identifier;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
    this.userIsWithin = userIsWithin;
    this.library = library;
    this.weight = weight;
    this.metadata = metadata;
  }
}

export default PlacesPOI;
