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

import { NativeModules } from 'react-native';
import TargetPrefetchObject from './models/TargetPrefetchObject';
import TargetRequestObject from './models/TargetRequestObject';
import TargetParameters from './models/TargetParameters';

interface ITarget {
  clearPrefetchCache: () => void;
  extensionVersion: () => Promise<string>;
  getThirdPartyId: () => Promise<string>;
  getTntId: () => Promise<string>;
  getSessionId: () => Promise<string>;
  resetExperience: () => void;
  setPreviewRestartDeeplink: (deepLink: string) => void;
  setSessionId: (sessionId: string) => void;
  setTntId: (tntId: string) => void;
  setThirdPartyId: (thirdPartyId: string) => void;
  retrieveLocationContent: (
    requests: Array<TargetRequestObject>,
    parameters?: TargetParameters
  ) => void;
  prefetchContent: (
    prefetchObjectArray: Array<TargetPrefetchObject>,
    parameters?: TargetParameters
  ) => Promise<any>;
  locationsDisplayed: (
    mboxNames: Array<string>,
    parameters?: TargetParameters
  ) => void;
  locationClickedWithName: (
    name: string,
    parameters?: TargetParameters
  ) => void;
}

const RCTTarget: ITarget = NativeModules.AEPTarget;

const Target: ITarget = {
  /**
   *  @brief Clears pre-fetched mboxes.
   *
   *  Clears the cached pre-fetched TargetPrefetchObject array.
   *
   *  @see Target::prefetchContent:withProfileParameters:callback:
   */
  clearPrefetchCache() {
    RCTTarget.clearPrefetchCache();
  },

  /**
   * @brief Returns the current version of the Target Extension.
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTTarget.extensionVersion());
  },

  /**
   * @brief Gets the Target session identifier.
   * The session ID is generated locally in the SDK upon initial Target request and persisted for a period defined by `target.sessionTimeout` configuration setting.
   * If the session timeout happens upon a subsequent Target request, a new session ID will be generated for use in the request and persisted in the SDK.
   */
  getSessionId(): Promise<string> {
    return Promise.resolve(RCTTarget.getSessionId());
  },

  /**
   *  @brief Gets the custom visitor ID for Target
   *  @param callback will be invoked to return the thirdPartyId value or `nil` if
   *  no third-party ID is set
   */
  getThirdPartyId(): Promise<string> {
    return Promise.resolve(RCTTarget.getThirdPartyId());
  },

  /**
   *  @brief Gets the Test and Target user identifier
   *
   *  Retrieves the TnT ID returned by the Target server for this visitor. The TnT ID is set to the
   *  Mobile SDK after a successful call to pre-fetch content or load requests.
   *
   *  This ID is preserved between app upgrades, is saved and restored during the standard application
   *  backup process, and is removed at uninstall or when Target::resetExperience is called.
   *
   *  @param callback invoked with the current tnt id or `nil` if no tnt id is set.
   *
   *  @see Target::prefetchContent:withProfileParameters:callback:
   *  @see Target::loadRequests:withProfileParameters:
   *  @see Target::resetExperience
   */
  getTntId(): Promise<string> {
    return Promise.resolve(RCTTarget.getTntId());
  },

  /**
   *  @brief Resets the user's experience
   *
   *  Resets the user's experience by removing the visitor identifiers.
   *  Removes previously set third-party and TnT IDs from persistent storage.
   */
  resetExperience() {
    RCTTarget.resetExperience();
  },

  /**
   *  @brief Sets the Target preview restart deep link
   *
   *  Set the Target preview URL to be displayed when the preview mode is restarted.
   *
   *  @param deeplink the URL which will be set for preview restart
   */
  setPreviewRestartDeeplink(deepLink: string) {
    RCTTarget.setPreviewRestartDeeplink(deepLink);
  },

  /**
   * @brief Sets the Target session identifier.
   *
   * The provided session ID is persisted in the SDK for a period defined by `target.sessionTimeout` configuration setting.
   * If the provided session ID is nil or empty or if the privacy status is opted out, the SDK will remove the session ID value from the persistence.
   *
   * This ID is preserved between app upgrades, is saved and restored during the standard application backup process,
   *  and is removed at uninstall, upon privacy status update to opted out or when the AEPTarget.resetExperience API is called.
   *
   * @param sessionId a string containing the value of the Target session ID to be set in the SDK.
   */
  setSessionId(sessionId: string) {
    RCTTarget.setSessionId(sessionId);
  },

  /**
   * @brief Sets the Target user identifier.
   *
   * The provided tnt ID is persisted in the SDK and attached to subsequent Target requests. It is used to
   * derive the edge host value in the SDK, which is also persisted and used in future Target requests.
   * If the provided tnt ID is nil or empty or if the privacy status is opted out, the SDK will remove the tnt ID and edge host values from the persistence.
   * This ID is preserved between app upgrades, is saved and restored during the standard application backup process,
   * and is removed at uninstall, upon privacy status update to opted out or when the AEPTarget.resetExperience API is called.
   *
   * @param tntId a string containing the value of the tnt ID to be set in the SDK.
   */
  setTntId(tntId: string) {
    RCTTarget.setTntId(tntId);
  },

  /**
   *  @brief Sets the custom visitor ID for Target
   *
   *  Sets a custom ID to identify visitors (profiles). This ID is preserved between app upgrades,
   *  is saved and restored during the standard application backup process, and is removed at uninstall or
   *  when Target::resetExperience is called.
   *
   *  @param thirdPartyId a string pointer containing the value of the third party id (custom visitor id)
   *  @see Target::resetExperience
   */
  setThirdPartyId(thirdPartyId: string) {
    RCTTarget.setThirdPartyId(thirdPartyId);
  },

  /**
   *  @brief Retrieves content for multiple Target mbox locations at once.
   *
   *  Executes a batch request to your configured Target server for multiple mbox locations. Any prefetched content
   *  which matches a given mbox location is returned and not included in the batch request to the Target server.
   *  Each object in the array contains a callback function, which will be invoked when content is available for
   *  its given mbox location.
   *
   *  @param requests An array of TargetRequestObject objects to retrieve content
   *  @param parameters a TargetParameters object containing parameters for all locations in the requests array
   *
   *  @see TargetRequestObject
   */
  retrieveLocationContent(
    requests: Array<TargetRequestObject>,
    parameters?: TargetParameters
  ) {
    RCTTarget.retrieveLocationContent(requests, parameters);
  },

  /**
   *  @brief Prefetch multiple Target mboxes simultaneously.
   *
   *  Executes a prefetch request to your configured Target server with the TargetPrefetchObject list provided
   *  in the \p prefetchObjectArray parameter. This prefetch request will use the provided parameters for all of
   *  the pre-fetches made in this request. The \p callback will be executed when the prefetch has been completed, returning
   *  an error object, nil if the prefetch was successful or error description if the prefetch was unsuccessful.
   *  The pre-fetched mboxes are cached in memory for the current application session and returned when requested.
   *
   *  @param prefetchObjectArray an array of TargetPrefetchObject representing the desired mboxes to prefetch
   *  @param parameters a TargetParameters object containing parameters for all the mboxes in the request array
   *  @param callback a function pointer which will be called after the prefetch is complete.  The error parameter
   *         in the callback will be nil if the prefetch completed successfully, or will contain error message otherwise
   *
   *  @see TargetPrefetchObject
   */
  prefetchContent(
    prefetchObjectArray: Array<TargetPrefetchObject>,
    parameters?: TargetParameters
  ): Promise<any> {
    return RCTTarget.prefetchContent(prefetchObjectArray, parameters);
  },

  /**
   * Sends a display notification to Target for given prefetched mboxes. This helps Target record location display events.
   *
   * @param mboxNames (required) an array of displayed locaitons names
   * @param parameters {@link TargetParameters} for the displayed location
   */
  locationsDisplayed(mboxNames: Array<string>, parameters?: TargetParameters) {
    RCTTarget.locationsDisplayed(mboxNames, parameters);
  },

  /**
   * @brief Sends a click notification to Target if a click metric is defined for the provided location name.
   *
   * Click notification can be sent for a location provided a load request has been executed for that prefetched or regular mbox
   * location before, indicating that the mbox was viewed. This request helps Target record the clicked event for the given location or mbox.
   *
   * @param name NSString value representing the name for location/mbox
   * @param parameters a TargetParameters object containing parameters for the location clicked
   */
  locationClickedWithName(name: string, parameters?: TargetParameters) {
    RCTTarget.locationClickedWithName(name, parameters);
  }
};

export default Target;
