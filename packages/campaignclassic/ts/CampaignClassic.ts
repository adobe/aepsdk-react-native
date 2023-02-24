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
import { UserInfo } from './models/UserInfo';

interface ICampaignClassic {
  extensionVersion(): Promise<string>;
  registerDeviceWithToken(
    token: string,
    userKey: string,
    additionalParameters?: Record<string, any>
  ): void;
  trackNotificationClickWithUserInfo(userInfo: UserInfo): void;
  trackNotificationReceiveWithUserInfo(userInfo: UserInfo): void;
}

const RCTAEPCampaignClassic = NativeModules.AEPCampaignClassic;

/**
 * Public APIs for Campaign Classic extension
 */
const CampaignClassic: ICampaignClassic = {
  /**
   * Returns the version of the AEPCampaignClassic extension
   * @return {string} - Promise a promise that resolves with the extension version
   */
  async extensionVersion(): Promise<string> {
    return await RCTAEPCampaignClassic.extensionVersion();
  },
  /**
   * @brief Registers a device with the configured Adobe Campaign Classic server instance.
   * @param token A unique device token received after registering your app with Push Notification servers
   * @param userKey An optional `String` containing the user identifier
   * @param additionalParameters A record of custom key-value pairs to be sent along with the registration call
   */
  registerDeviceWithToken(
    token: string,
    userKey: string,
    additionalParameters?: Record<string, any>
  ): void {
    RCTAEPCampaignClassic.registerDeviceWithToken(
      token,
      userKey,
      additionalParameters
    );
  },

  /**
   * Sends tracking information to the configured Adobe Campaign Classic server.
   * Use this API to send tracking info when the application is opened following a notification click.
   * If the userInfo does not contain the necessary tracking identifiers, messageId (_mId) and deliveryId (_dId), no track request is sent.`
   * @param userInfo a dictionary containing `_mId` and `_dId` received in the push message payload, or in the launch options before opening the application
   */
  trackNotificationClickWithUserInfo(userInfo: UserInfo): void {
    RCTAEPCampaignClassic.trackNotificationClickWithUserInfo(userInfo);
  },

  /**
   * Sends tracking information to the configured Adobe Campaign Classic server.
   * Use this API to send tracking info on receiving a notification (silent push).
   * If the userInfo does not contain the necessary tracking identifiers, messageId (_mId) and deliveryId (_dId), no track request is sent.
   * @param userInfo a dictionary containing `_mId` and `_dId` received in the push message payload, or in the launch options before opening the application
   */
  trackNotificationReceiveWithUserInfo(userInfo: UserInfo): void {
    RCTAEPCampaignClassic.trackNotificationReceiveWithUserInfo(userInfo);
  }
};

export default CampaignClassic;
