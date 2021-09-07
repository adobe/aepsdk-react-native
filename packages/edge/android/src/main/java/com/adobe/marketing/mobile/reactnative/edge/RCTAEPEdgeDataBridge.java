/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
package com.adobe.marketing.mobile.reactnative.edge;

import android.util.Log;

import com.adobe.marketing.mobile.EdgeEventHandle;
import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableArray;

import java.util.List;
import java.util.Map;

public final class RCTAEPEdgeDataBridge {

    public final static String XDM_DATA_KEY = "xdmData";
    public final static String DATA_KEY = "data";
    public final static String DATASET_IDENTIFIER_KEY = "datasetIdentifier";

    public final static String TYPE_KEY = "type";
    public final static String PAYLOAD_KEY = "payload";
    private static final String TAG = "RCTAEPEdgeDataBridge";

    /**
     * Converts a {@link ReadableMap} into an {@link ExperienceEvent}
     *
     * @param map
     * @return An {@link ExperienceEvent}
     */
    public static ExperienceEvent experienceEventFromReadableMap(final ReadableMap map) {
        if (map == null) {
            return null;
        }

        Map<String, Object> xdmdata = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, XDM_DATA_KEY));
        String datasetId = null;

        if (xdmdata != null) {

            Map<String, Object> data = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, DATA_KEY));

            try {
                datasetId = getNullableString(map, DATASET_IDENTIFIER_KEY);
            } catch (Exception e) {
                Log.d(TAG, "experienceEventFromReadableMap: " + e);
            }

            ExperienceEvent event = new ExperienceEvent.Builder().setXdmSchema(xdmdata, datasetId).setData(data).build();

            return event;
        }

        Log.d(TAG, "experienceEventFromReadableMap: xdmdata is required, but it is currently null.");
        return null;
    }

    /**
     * Converts a {@link EdgeEventHandle} into a {@link WritableMap}
     * @param eventhandle
     * @return A {@link WritableMap} that represents the eventhandle
     */
    public static WritableMap mapFromEdgeEventHandle(final EdgeEventHandle eventhandle) {
        if (eventhandle == null) {
            return null;
        }

        WritableMap eventHandleMap = new WritableNativeMap();
        if (eventhandle.getType() != null) {
            eventHandleMap.putString(TYPE_KEY, eventhandle.getType());
        }
        if (eventhandle.getPayload() != null) {
            Object[] handles = new Object[] {eventhandle.getPayload().size()};
            handles = eventhandle.getPayload().toArray();
            eventHandleMap.putArray(PAYLOAD_KEY, RCTAEPEdgeArrayUtil.toWritableArray(handles));
        }
        return eventHandleMap;
    }

    // Helper methods

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static ReadableMap getNullableMap(final ReadableMap data, final String key) {
        return (data.hasKey(key) && data.getType(key) == ReadableType.Map) ? data.getMap(key) : null;
    }
}