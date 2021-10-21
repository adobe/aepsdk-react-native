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
package com.adobe.marketing.mobile.reactnative.edgeidentity;

import com.adobe.marketing.mobile.edge.identity.AuthenticatedState;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.adobe.marketing.mobile.edge.identity.IdentityMap;
import com.adobe.marketing.mobile.edge.identity.IdentityItem;

public final class RCTAEPEdgeIdentityDataBridge {

    //Identity Map
    private static final String AEP_Namespace = "namespace";
    final private static String ID_KEY = "id";
    final private static String IS_PRIMARY_KEY = "primary";
    private static final String AEP_AUTH_STATE_KEY = "authenticationState";

    public static WritableMap mapFromIdentityMap(final IdentityMap map) {
        if (map == null) {
            return null;
        }

        WritableMap identitymap = new WritableNativeMap();
        if (!map.isEmpty()){
            //identitymap.putArray();
        }


        return (WritableMap) map;
    }


    public static IdentityItem mapToIdentityItem(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new IdentityItem(getNullableString(map, ID_KEY), AuthenticatedState.fromString(AEP_AUTH_STATE_KEY), getNullableBoolean(map, IS_PRIMARY_KEY));
    }

    public static IdentityMap mapToIdentityMap(ReadableMap map) {
        if (map == null) {
            return null;
        }

        return new IdentityMap();
    }

//    public static WritableMap mapFromEdgeEventHandle(final EdgeEventHandle eventhandle) {
//        if (eventhandle == null) {
//            return null;
//        }
//
//        WritableMap eventHandleMap = new WritableNativeMap();
//        if (eventhandle.getType() != null) {
//            eventHandleMap.putString(TYPE_KEY, eventhandle.getType());
//        }
//        if (eventhandle.getPayload() != null) {
//            Object[] handles = new Object[] {eventhandle.getPayload().size()};
//            handles = eventhandle.getPayload().toArray();
//            eventHandleMap.putArray(PAYLOAD_KEY, RCTAEPEdgeArrayUtil.toWritableArray(handles));
//        }
//        return eventHandleMap;
//    }



    /**
     * Converts a {@link ReadableMap} into an {@line IdentityMap}
     *
     * @param map
     * @return An {@link IdentityMap}
     */
   public static IdentityMap identityMapFromReadableMap(final ReadableMap map) {
       if (map == null) {
           return null;
       }

//       Map<String, Object> xdmdata = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, XDM_DATA_KEY));
//       String datasetId = null;
//
//       if (xdmdata != null) {
//
//           Map<String, Object> data = RCTAEPEdgeMapUtil.toMap(getNullableMap(map, DATA_KEY));
//
//           try {
//               datasetId = getNullableString(map, DATASET_IDENTIFIER_KEY);
//           } catch (Exception e) {
//               Log.d(TAG, "experienceEventFromReadableMap: " + e);
//           }
//
//           ExperienceEvent event = new ExperienceEvent.Builder().setXdmSchema(xdmdata, datasetId).setData(data).build();
//
           return null;
      }

//       Log.d(TAG, "experienceEventFromReadableMap: xdmdata is required, but it is currently null.");
//       return null;
//   }

//    // Identity Item Auth State
//    private static final String AEP_AUTH_STATE_AMBIGUOUS = "AEP_AUTH_STATE_AMBIGUOUS";
//    private static final String AEP_AUTH_STATE_AUTHENTICATED = "AEP_AUTH_STATE_AUTHENTICATED";
//    private static final String AEP_AUTH_STATE_LOGGED_OUT = "AEP_AUTH_STATE_LOGGED_OUT";
//
//    /**
//     * Takes in a {@link String} and returns the associated enum {ambiguous, authenticated, logged_out}
//     *
//     * @param authStateString
//     * @return The @{link IdentityItem.AuthenticationState} authentication state
//     */
//    public static IdentityItem.AuthenticationState authenticationStateFromString(final String authStateString) {
//        if (authStateString == null) {
//            return IdentityItem.AuthenticationState.AMBIGUOUS;
//        }
//
//        if (authStateString.equals(AEP_AUTH_STATE_AUTHENTICATED)) {
//            return IdentityItem.AuthenticationState.AUTHENTICATED;
//        } else if (authStateString.equals(AEP_AUTH_STATE_LOGGED_OUT)) {
//            return IdentityItem.AuthenticationState.LOGGED_OUT;
//        }
//
//        return IdentityItem.AuthenticationState.AMBIGUOUS;
//    }
//
//    public static String stringFromAuthState(final IdentityItem.AuthenticationState authenticationState) {
//        if (authenticationState == null) {
//            return AEP_AUTH_STATE_AMBIGUOUS;
//        }
//
//        if (authenticationState == IdentityItem.AuthenticationState.AUTHENTICATED) {
//            return AEP_AUTH_STATE_AUTHENTICATED;
//        } else if (authenticationState == IdentityItem.AuthenticationState.LOGGED_OUT) {
//            return AEP_AUTH_STATE_LOGGED_OUT;
//        }
//
//        return AEP_AUTH_STATE_UNKNOWN;
//    }
//
//    public static VisitorID visitorIdentifierFromReadableMap(final ReadableMap map) {
//        if (map == null) {
//            return null;
//        }
//
//        return new VisitorID(RCTAEPCoreDataBridge.getNullableString(map, AEP_VISITOR_ID_ORIGIN),
//                RCTAEPCoreDataBridge.getNullableString(map, AEP_VISITOR_ID_TYPE),
//                RCTAEPCoreDataBridge.getNullableString(map, AEP_VISITOR_IDENTIFIER),
//                authenticationStateFromString(RCTAEPCoreDataBridge.getNullableString(map, AEP_VISITOR_AUTH_STATE)));
//    }
//
//    /**
//     * Converts a {@link VisitorID} into a {@link WritableMap}
//     * @param visitorID The visitorID object
//     * @return A {@link WritableMap} that represents the visitorID
//     */
//    public static WritableMap mapFromVisitorIdentifier(final VisitorID visitorID) {
//        if (visitorID == null) {
//            return null;
//        }
//
//        WritableMap visitorIDMap = new WritableNativeMap();
//        visitorIDMap.putString(AEP_VISITOR_ID_ORIGIN, visitorID.getIdOrigin());
//        visitorIDMap.putString(AEP_VISITOR_ID_TYPE, visitorID.getIdType());
//        visitorIDMap.putString(AEP_VISITOR_IDENTIFIER, visitorID.getId());
//        visitorIDMap.putString(AEP_VISITOR_AUTH_STATE, stringFromAuthState(visitorID.getAuthenticationState()));
//
//        return visitorIDMap;
//    }

    // Helper methods

    private static String getNullableString(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getString(key) : null;
    }

    private static ReadableMap getNullableMap(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getMap(key) : null;
    }

    private static Boolean getNullableBoolean(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getBoolean(key) : null;
    }

//    private static ReadableArray getNullableArray(final ReadableMap data, final String key) {
//        return data.hasKey(key) ? data.getArray(key) : null;
//    }

    private static Double getNullableDouble(final ReadableMap data, final String key) {
        return data.hasKey(key) ? data.getDouble(key) : null;
    }


}
