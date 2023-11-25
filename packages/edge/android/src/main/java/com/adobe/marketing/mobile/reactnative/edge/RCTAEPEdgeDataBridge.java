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
package com.adobe.marketing.mobile.reactnative.edge;

import android.util.Log;

import com.adobe.marketing.mobile.EdgeEventHandle;
import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.Map;

final class RCTAEPEdgeDataBridge {
    private static final String XDM_DATA_KEY = "xdmData";
    private static final String DATA_KEY = "data";
    private static final String DATASET_IDENTIFIER_KEY = "datasetIdentifier";
    private static final String DATASTREAM_ID_OVERRIDE_KEY = "datastreamIdOverride";
    private static final String DATASTREAM_CONFIG_OVERRIDE_KEY = "datastreamConfigOverride";
    private static final String TYPE_KEY = "type";
    private static final String PAYLOAD_KEY = "payload";
    private static final String TAG = "RCTAEPEdgeDataBridge";

    /**
     * Converts a {@link ReadableMap} into an {@link ExperienceEvent}
     *
     * @param map representing the experience event data
     * @return an {@link ExperienceEvent}
     */
    static ExperienceEvent experienceEventFromReadableMap(final ReadableMap map) {
        if (map == null) {
            return null;
        }

        Map<String, Object> xdmdata = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, XDM_DATA_KEY));
        String datasetId = null;
        String datastreamOverrideId = null;
        
        if (xdmdata != null) {

            Map<String, Object> data = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, DATA_KEY));
            Map<String, Object> datastreamConfigOverride = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, DATASTREAM_CONFIG_OVERRIDE_KEY));

            try {
                datasetId = getNullableString(map, DATASET_IDENTIFIER_KEY);
                datastreamOverrideId = getNullableString(map, DATASTREAM_ID_OVERRIDE_KEY);
            } catch (Exception e) {
                Log.d(TAG, "experienceEventFromReadableMap: " + e);
            }

            ExperienceEvent event;
            if (datastreamOverrideId != null || datastreamConfigOverride != null) {
                event = new ExperienceEvent.Builder().setXdmSchema(xdmdata, datasetId).setData(data).setDatastreamIdOverride(datastreamOverrideId).setDatastreamConfigOverride(datastreamConfigOverride).build();
            } else {
                event = new ExperienceEvent.Builder().setXdmSchema(xdmdata, datasetId).setData(data).build();
            }
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
    static WritableMap mapFromEdgeEventHandle(final EdgeEventHandle eventhandle) {
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