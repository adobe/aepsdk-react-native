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

package com.adobe.marketing.mobile.reactnative.target;

import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.target.TargetOrder;
import com.adobe.marketing.mobile.target.TargetParameters;
import com.adobe.marketing.mobile.target.TargetPrefetch;
import com.adobe.marketing.mobile.target.TargetProduct;
import com.adobe.marketing.mobile.target.TargetRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.List;
import java.util.Map;

public class RCTAEPTargetDataBridge {

    final private static String NAME_KEY = "name";
    final private static String PARAMETERS_KEY = "parameters";
    final private static String DEFAULT_CONTENT_KEY = "defaultContent";

    final private static String TARGET_PARAMETERS_KEY = "targetParameters";
    final private static String PROFILE_PARAMETERS_KEY = "profileParameters";
    final private static String ORDER_KEY = "order";
    final private static String PRODUCT_KEY = "product";

    final private static String ORDER_ID_KEY = "orderId";
    final private static String TOTAL_KEY = "total";
    final private static String PURCHASED_PRODUCTS_IDS_KEY = "purchasedProductIds";

    final private static String PRODUCT_ID_KEY = "productId";
    final private static String CATEGORY_ID_KEY = "categoryId";

    public static TargetPrefetch mapToPrefetch(ReadableMap map) {
        if (map == null) {
            return null;
        }

        TargetParameters parameters = mapToParameters(getNullableMap(map, TARGET_PARAMETERS_KEY));
        return new TargetPrefetch(getNullableString(map, NAME_KEY), parameters);
    }

    public static TargetRequest mapToRequest(ReadableMap map, final Callback successCallback) {
        if (map == null) {
            return null;
        }

        TargetParameters parameters = mapToParameters(getNullableMap(map, TARGET_PARAMETERS_KEY));
        return new TargetRequest(getNullableString(map, NAME_KEY), parameters, getNullableString(map, DEFAULT_CONTENT_KEY), new AdobeCallback<String>() {
            @Override
            public void call(String content) {
                successCallback.invoke(null, content);
            }
        });
    }

    public static TargetParameters mapToParameters(ReadableMap map) {
        if (map == null) {
            return null;
        }

        TargetOrder order = mapToOrder(getNullableMap(map, ORDER_KEY));
        TargetProduct product = mapToProduct(getNullableMap(map, PRODUCT_KEY));

        Map<String, String> parameters = RCTAEPTargetMapUtil.toStringMap(getNullableMap(map, PARAMETERS_KEY));
        Map<String, String> profileParameters = RCTAEPTargetMapUtil.toStringMap(getNullableMap(map, PROFILE_PARAMETERS_KEY));

        return new TargetParameters.Builder().order(order).product(product).parameters(parameters).profileParameters(profileParameters).build();
    }


    public static TargetOrder mapToOrder(ReadableMap map) {
        if (map == null) {
            return null;
        }

        List<String> purchasedProductsIds = RCTAEPTargetArrayUtil.toStringArray(getNullableArray(map, PURCHASED_PRODUCTS_IDS_KEY));
        return new TargetOrder(getNullableString(map, ORDER_ID_KEY), getNullableDouble(map, TOTAL_KEY), purchasedProductsIds);
    }

    public static TargetProduct mapToProduct(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new TargetProduct(getNullableString(map, PRODUCT_ID_KEY), getNullableString(map, CATEGORY_ID_KEY));
    }

    // Helper methods

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static ReadableMap getNullableMap(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getMap(key) : null;
    }

    private static ReadableArray getNullableArray(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getArray(key) : null;
    }

    private static Double getNullableDouble(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getDouble(key) : null;
    }


}
