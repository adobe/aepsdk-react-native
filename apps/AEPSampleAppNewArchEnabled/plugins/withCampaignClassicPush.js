const {
  withAppBuildGradle,
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FIREBASE_DEPS_MARKER = '// withCampaignClassicPush: firebase-messaging for NotificationService';
const FIREBASE_DEPS = `dependencies {
    ${FIREBASE_DEPS_MARKER}
    implementation platform("com.google.firebase:firebase-bom:35.0.2")
    implementation "com.google.firebase:firebase-messaging"
`;

const RNFB_SERVICE = 'io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService';

const serviceSource = (packageName) => `package ${packageName};

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import com.adobe.marketing.mobile.AEPMessagingService;
import com.adobe.marketing.mobile.CampaignClassic;
import com.google.firebase.messaging.RemoteMessage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

// Same flow as the native Campaign Classic test app: hand the whole RemoteMessage to the SDK.
// Extends the React Native Firebase service so onNewToken keeps reaching JS.
public class NotificationService extends ReactNativeFirebaseMessagingService {
  @Override
  public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
    if (AEPMessagingService.handleRemoteMessage(this, remoteMessage)) {
      return;
    }
    displayNotification(remoteMessage);
    super.onMessageReceived(remoteMessage);
  }

  // Fallback for pushes the SDK did not handle, mirroring the native test app's displayNotification.
  private void displayNotification(RemoteMessage remoteMessage) {
    Map<String, String> data = remoteMessage.getData();
    RemoteMessage.Notification notification = remoteMessage.getNotification();
    String messageId = data.get("_mId");
    String deliveryId = data.get("_dId");
    String message = data.get("_msg");
    if (message == null && notification != null) {
      message = notification.getBody();
    }
    String title = notification != null && notification.getTitle() != null
        ? notification.getTitle()
        : "Push Message Received";
    String channelId = notification != null && notification.getChannelId() != null
        ? notification.getChannelId()
        : "acc_push_channel";

    if (messageId != null && deliveryId != null) {
      Map<String, String> trackInfo = new HashMap<>();
      trackInfo.put("_mId", messageId);
      trackInfo.put("_dId", deliveryId);
      CampaignClassic.trackNotificationReceive(trackInfo);
    }

    NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      manager.createNotificationChannel(
          new NotificationChannel(channelId, "acc push channel", NotificationManager.IMPORTANCE_HIGH));
    }

    Intent intent = getPackageManager().getLaunchIntentForPackage(getPackageName());
    if (intent != null) {
      intent.putExtra("_mId", messageId);
      intent.putExtra("_dId", deliveryId);
    }
    PendingIntent pendingIntent =
        PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
        .setSmallIcon(android.R.drawable.ic_popup_reminder)
        .setContentTitle(title)
        .setContentText(message)
        .setContentIntent(pendingIntent)
        .setAutoCancel(true);

    String attachmentUrl = data.get("attachment-url");
    if (attachmentUrl != null) {
      Bitmap image = downloadBitmap(attachmentUrl);
      if (image != null) {
        builder.setStyle(new NotificationCompat.BigPictureStyle().bigPicture(image));
      }
    }
    manager.notify(1002, builder.build());
  }

  private Bitmap downloadBitmap(String imageUrl) {
    try {
      HttpURLConnection connection = (HttpURLConnection) new URL(imageUrl).openConnection();
      connection.setDoInput(true);
      connection.connect();
      return BitmapFactory.decodeStream(connection.getInputStream());
    } catch (Exception e) {
      return null;
    }
  }
}
`;

/**
 * Android only. Adds a FirebaseMessagingService that gives every FCM message to
 * AEPMessagingService.handleRemoteMessage (as the native Campaign Classic test app does) and
 * swaps it in for the React Native Firebase service. Runs on every `expo prebuild`, since
 * android/ is generated.
 */
const withCampaignClassicPush = (config) => {
  config = withDangerousMod(config, [
    'android',
    (cfg) => {
      const packageName = cfg.android?.package;
      if (!packageName) {
        throw new Error('withCampaignClassicPush: expo.android.package is required');
      }
      const dir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app/src/main/java',
        ...packageName.toLowerCase().split('.'),
      );
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'NotificationService.java'), serviceSource(packageName));
      return cfg;
    },
  ]);

  config = withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes(FIREBASE_DEPS_MARKER)) {
      cfg.modResults.contents = cfg.modResults.contents.replace(/dependencies\s*\{\n/, FIREBASE_DEPS);
    }
    return cfg;
  });

  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    const app = manifest.application[0];
    const services = (app.service ?? []).filter(
      (s) =>
        s.$['android:name'] !== '.NotificationService' &&
        !(s.$['android:name'] === RNFB_SERVICE && s.$['tools:node'] === 'remove'),
    );
    services.push(
      { $: { 'android:name': RNFB_SERVICE, 'tools:node': 'remove' } },
      {
        $: { 'android:name': '.NotificationService', 'android:exported': 'false' },
        'intent-filter': [
          { action: [{ $: { 'android:name': 'com.google.firebase.MESSAGING_EVENT' } }] },
        ],
      },
    );
    app.service = services;
    return cfg;
  });
};

module.exports = withCampaignClassicPush;
