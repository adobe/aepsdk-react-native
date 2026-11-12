/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { CampaignClassic } from '@adobe/react-native-aepcampaignclassic';
import {
  getAPNSToken,
  getMessaging,
  onMessage,
  onRegistered,
  register,
} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Button, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/styles';

// Android: the Firebase Installation ID (FID) that replaces the deprecated FCM registration token.
// It is delivered through onRegistered once register() has run (opt-in lives in firebase.json).
// onRegistered can fire synchronously with a cached FID, so cleanup must not depend on the
// unsubscribe handle having been assigned yet.
const fetchFid = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const messaging = getMessaging();
    let settled = false;
    let unsubscribe: (() => void) | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const finish = (action: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      unsubscribe?.();
      action();
    };

    unsubscribe = onRegistered(messaging, (fid) => finish(() => resolve(fid)));
    if (settled) {
      unsubscribe();
      return;
    }
    timeout = setTimeout(
      () => finish(() => reject(new Error('Timed out waiting for the Firebase Installation ID'))),
      15000
    );
    register(messaging).catch((e) => finish(() => reject(e)));
  });

// iOS: Campaign Classic expects the APNs device token.
const fetchPushToken = async (): Promise<string | null> =>
  Platform.OS === 'ios' ? getAPNSToken(getMessaging()) : fetchFid();

function CampaignClassicView() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState('Unknown');
  const [pushToken, setPushToken] = useState('Unknown');

  // Mirrors the native test app: ask for notification permission and load the token on launch.
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
        setPushToken((await fetchPushToken()) ?? 'Unknown');
      } catch (e) {
        console.log(`AdobeExperienceSDK: fetching push token failed: ${e}`);
      }
    })();
  }, []);

  // Foreground pushes are displayed natively by NotificationService; this only logs them.
  useEffect(() => {
    return onMessage(getMessaging(), async (remoteMessage) => {
      console.log('AdobeExperienceSDK: foreground push received', JSON.stringify(remoteMessage));
    });
  }, []);

  const registerDevice = async (userKey: string, additionalParams?: Record<string, any>) => {
    const token = await fetchPushToken();
    if (!token) {
      console.log('AdobeExperienceSDK: no push token available, check notification permission');
      return;
    }
    setPushToken(token);
    CampaignClassic.registerDeviceWithToken(token, userKey, additionalParams);
    console.log(`Device registered for ${userKey}`);
  };

  const registerDeviceSameUser = () => registerDevice('new-ACC-Extension-Test-User');

  const registerDeviceNewUser = () => registerDevice('new-ACC-Extension-Test-NewUser');

  const registerDeviceWithAdditionalParams = () =>
    registerDevice('ACC-Extension-Test-User', {
      firstName: 'mansi',
      lastName: 'arora',
      region: 'someRegion',
      age: 30,
    });

  const extensionVersion = async () => {
    const version = await CampaignClassic.extensionVersion();
    console.log(`AdobeExperienceSDK: Campaign Classic version: ${version}`);
  };

  const trackNotificationClickWithUserInfo = () => {
    CampaignClassic.trackNotificationClickWithUserInfo({ _mId: '4005', _dId: '4d9' });
    console.log('Notification clicked!');
  };

  const trackNotificationReceiveWithUserInfo = () => {
    CampaignClassic.trackNotificationReceiveWithUserInfo({ _mId: '4005', _dId: '4d9' });
    console.log('Notification received!');
  };

  return (
    <View style={{ ...styles.container, marginTop: 30 }}>
      <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={router.back} title="Go to main page" />
        <Text style={styles.welcome}>Campaign Classic</Text>
        <View style={{ margin: 5 }}>
          <Button title="Extension Version" onPress={extensionVersion} />
          <Button title="Re-register Device with same token" onPress={registerDeviceSameUser} />
          <Button title="Register Device with new user key" onPress={registerDeviceNewUser} />
          <Button
            title="Register Device with additional param"
            onPress={registerDeviceWithAdditionalParams}
          />
          <Button title="Track User Click" onPress={trackNotificationClickWithUserInfo} />
          <Button title="Track User Receive" onPress={trackNotificationReceiveWithUserInfo} />
          <View style={{margin: 10}}>
          <Text>Notification permission: {permissionStatus}</Text>
          <Text>Device registration token:</Text>
          <Text selectable>{pushToken}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default CampaignClassicView;
