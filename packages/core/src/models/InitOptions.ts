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
 * Interface representing the initialization options for the SDK.
 */
export interface InitOptions {
  /**
   * A unique identifier assigned to the app instance by Adobe Mobile Services.
   * This is the Adobe Mobile Services App ID.
   * A `null` value has no effect.
   */
  appId?: string;

  /**
   * Optional flag to enable or disable automatic lifecycle tracking.
   * If not provided, the default value is `true`.
   */
  lifecycleAutomaticTrackingEnabled?: boolean;

  /**
   * Optional additional context data to be included with lifecycle events.
   * This is a key-value pair object where both key and value are strings.
   */
  lifecycleAdditionalContextData?: { [key: string]: string };

  /**
   * Optional application group identifier for iOS.
   *
   * Used to share user defaults and files between the main app and its extension apps on iOS.
   */
  appGroupIOS?: string;
}
