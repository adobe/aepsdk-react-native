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

import com.adobe.marketing.mobile.ExperienceEvent;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;

public final class RCTAEPEdgeDataBridge {

    public final static String XDM_DATA_KEY = "xdmData";
    public final static String DATA_KEY = "data";
    public final static String DATASET_IDENTIFIER_KEY = "datasetIdentifier";

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

        //ExperienceEvent experienceEvent = new ExperienceEvent.Builder(setData(Map<String, Object> data)) {

           // return experienceEvent;
        //}
        return null;
    }

    public static ReadableMap readableMapFromEvent(final ExperienceEvent event) {
        if (event == null) {
            return null;
        }

        WritableNativeMap map = new WritableNativeMap();
        map.putMap(XDM_DATA_KEY, RCTAEPEdgeMapUtil.toWritableMap(event.getXdmSchema()));
        map.putMap(DATA_KEY, RCTAEPEdgeMapUtil.toWritableMap(event.getData()));
        return map;
    }

    // Helper methods

    public static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }
}