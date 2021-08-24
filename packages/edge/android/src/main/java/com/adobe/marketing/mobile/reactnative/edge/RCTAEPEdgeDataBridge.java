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

import com.adobe.marketing.mobile.EdgeEventHandle;
import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.List;
import java.util.Map;

public final class RCTAEPEdgeDataBridge {

    public final static String XDM_DATA_KEY = "xdmData";
    public final static String DATA_KEY = "data";
    public final static String DATASET_IDENTIFIER_KEY = "datasetIdentifier";

    public final static String TYPE_KEY = "type";
    public final static String PAYLOAD_KEY = "payload";

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

        //ExperienceEvent.Builder event = new ExperienceEvent.Builder().setData(Map<String, Object> data)

        return null;
    }

//    public static ReadableMap mapFromEdegEventHandle(final ExperienceEvent event) {
//        if (event == null) {
//            return null;
//        }
//
//        WritableNativeMap map = new WritableNativeMap();
//        map.putMap(XDM_DATA_KEY, RCTAEPEdgeMapUtil.toWritableMap(event.getXdmSchema()));
//        map.putMap(DATA_KEY, RCTAEPEdgeMapUtil.toWritableMap(event.getData()));
//        map.putMap(DATASET_IDENTIFIER_KEY, RCTAEPEdgeMapUtil.toWritableMap(event.getData()));
//        return map;
//    }


    /**
     * Converts a {@link EdgeEventHandle} into a {@link WritableMap}
     * @param eventhandle The eventhandle object
     * @return A {@link WritableMap} that represents the visitorID
     */
    public static WritableMap mapFromEdegEventHandle(final EdgeEventHandle eventhandle) {
        if (eventhandle == null) {
            return null;
        }

        WritableMap eventHandleMap = new WritableNativeMap();
        eventHandleMap.putString(TYPE_KEY, eventhandle.getType());
        eventHandleMap.putArray(PAYLOAD_KEY, (ReadableArray) eventhandle.getPayload());

        return eventHandleMap;
    }

    // Helper methods

    public static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }
}