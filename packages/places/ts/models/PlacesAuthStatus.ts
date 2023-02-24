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
 * Represents the current authorization status of location services of your application.
 * Used EventData for Places Events and Shared State.
 */
enum PlacesAuthStatus {
  ALWAYS = 'PLACES_AUTH_STATUS_ALWAYS',
  DENIED = 'PLACES_AUTH_STATUS_DENIED',
  RESTRICTED = 'PLACES_AUTH_STATUS_RESTRICTED',
  UNKNOWN = 'PLACES_AUTH_STATUS_UNKNOWN',
  WHEN_IN_USE = 'PLACES_AUTH_STATUS_WHEN_IN_USE'
}

export default PlacesAuthStatus;
