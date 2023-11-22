/*
    Copyright 2023 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
 */

package com.adobe.marketing.mobile.reactnative.messaging;

import android.app.Activity;
import com.adobe.marketing.mobile.Message;
import com.adobe.marketing.mobile.MessagingEdgeEventType;
import com.adobe.marketing.mobile.messaging.MessagingProposition;
import com.adobe.marketing.mobile.messaging.MessagingPropositionItem;
import com.adobe.marketing.mobile.messaging.Surface;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

/**
 * Utility class for converting data models to {@link
 * com.facebook.react.bridge.WritableMap}
 */

class RCTAEPMessagingUtil {

  private static final String TAG = "RCTAEPMessaging";

  private RCTAEPMessagingUtil() {}

  // From React Native
  static MessagingEdgeEventType getEventType(final int eventType) {
    switch (eventType) {
    case 0:
      return MessagingEdgeEventType.IN_APP_DISMISS;
    case 1:
      return MessagingEdgeEventType.IN_APP_INTERACT;
    case 2:
      return MessagingEdgeEventType.IN_APP_TRIGGER;
    case 3:
      return MessagingEdgeEventType.IN_APP_DISPLAY;
    case 4:
      return MessagingEdgeEventType.PUSH_APPLICATION_OPENED;
    case 5:
      return MessagingEdgeEventType.PUSH_CUSTOM_ACTION;
    default:
      return null;
    }
  }

  static List<Surface> convertSurfaces(final ReadableArray rawSurfaces) {
    List<Surface> surfaces = new ArrayList<>();

    for (int i = 0; i < rawSurfaces.size(); i++) {
      surfaces.add(new Surface(rawSurfaces.getString(i)));
    }

    return surfaces;
  }

  // To React Native

  static Map convertMessageToMap(final Message message) {
    Map data = new HashMap<>();
    data.put("id", message.getId());
    data.put("autoTrack", message.getAutoTrack());
    return data;
  }

  static ReadableArray convertMessagesToJS(final Collection<Message> messages) {
    WritableArray result = new WritableNativeArray();

    for (Iterator<Message> iterator = messages.iterator();
         iterator.hasNext();) {
      result.pushMap((ReadableMap)convertMessageToMap(iterator.next()));
    }

    return result;
  }

  static Map
  convertMessagingPropositionToJS(final MessagingProposition proposition) {
    Map data = new HashMap<>();
    ArrayList<Map> propositionItems = new ArrayList();
    ListIterator<MessagingPropositionItem> it =
        proposition.getItems().listIterator();

    while (it.hasNext()) {
      Map item = new HashMap<>();
      item.put("uniqueId", it.next().getUniqueId());
      item.put("uniqueId", it.next().getContent());
      item.put("uniqueId", it.next().getSchema());

      propositionItems.add(item);
    }

    data.put("scope", proposition.getScope());
    data.put("uniqueId", proposition.getUniqueId());
    data.put("items", propositionItems);

    return data;
  }

  static Map convertSurfacePropositions(
      final Map<Surface, List<MessagingProposition>> propositionMap,
      String packageName) {
    Map data = new HashMap<>();

    for (Map.Entry<Surface, List<MessagingProposition>> entry :
         propositionMap.entrySet()) {
      data.put(entry.getKey().getUri().replace(
                   "mobileapp://" + packageName + "/", ""),
               entry.getValue());
    }

    return data;
  }
}
