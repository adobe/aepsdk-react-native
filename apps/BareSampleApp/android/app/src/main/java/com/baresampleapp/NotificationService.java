package com.baresampleapp;

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
