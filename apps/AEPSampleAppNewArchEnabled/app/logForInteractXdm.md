2026-04-21 09:29:42.910 17908-18071 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       V  Optimize/DecisionScope - Scope name (mboxAug), when decoded, does not contain a JSON stringor does have the required JSON keys. Error: Value ��1� of type java.lang.String cannot be converted to JSONObject
2026-04-21 09:29:42.910   388-20413 audioserver             audioserver                          D  FGS Logger Transaction failed
2026-04-21 09:29:42.910   388-20413 audioserver             audioserver                          D  -129
2026-04-21 09:29:42.911 17908-17958 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       D  MobileCore/EventHub - Dispatching Event #78 - ({
                                                                                                        class: Event,
                                                                                                        name: Optimize Get Propositions Request,
                                                                                                        uniqueIdentifier: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        source: com.adobe.eventSource.requestContent,
                                                                                                        type: com.adobe.eventType.optimize,
                                                                                                        responseId: null,
                                                                                                        parentId: null,
                                                                                                        timestamp: 1776743982910,
                                                                                                        data: {
                                                                                                        "requesttype": "getpropositions",
                                                                                                        "decisionscopes": [
                                                                                                            {
                                                                                                                "name": "mboxAug"
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                        mask: null,
                                                                                                    })
2026-04-21 09:29:42.912 17908-18015 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       D  MobileCore/EventHub - Dispatched Event #78 to extensions after processing rules - ({
                                                                                                        class: Event,
                                                                                                        name: Optimize Get Propositions Request,
                                                                                                        uniqueIdentifier: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        source: com.adobe.eventSource.requestContent,
                                                                                                        type: com.adobe.eventType.optimize,
                                                                                                        responseId: null,
                                                                                                        parentId: null,
                                                                                                        timestamp: 1776743982910,
                                                                                                        data: {
                                                                                                        "requesttype": "getpropositions",
                                                                                                        "decisionscopes": [
                                                                                                            {
                                                                                                                "name": "mboxAug"
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                        mask: null,
                                                                                                    })
2026-04-21 09:29:42.941 17908-17992 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       V  Optimize/DecisionScope - Scope name (mboxAug), when decoded, does not contain a JSON stringor does have the required JSON keys. Error: Value ��1� of type java.lang.String cannot be converted to JSONObject
2026-04-21 09:29:42.941 17908-17992 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       V  Optimize/OptimizeExtension - handleOptimizeRequestContent - All scopes are cached and none are in progress, dispatching event directly.
2026-04-21 09:29:42.941 17908-17992 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       V  Optimize/DecisionScope - Scope name (mboxAug), when decoded, does not contain a JSON stringor does have the required JSON keys. Error: Value ��1� of type java.lang.String cannot be converted to JSONObject
2026-04-21 09:29:42.946 17908-18070 ReactNativeJS           com.AEPSampleAppNewArchEnabled       I  'offers', [ { id: '563703-2',
                                                                                                        etag: undefined,
                                                                                                        schema: 'https://ns.adobe.com/personalization/html-content-item',
                                                                                                        data: 
                                                                                                         { content: '<html><body><p style="color:black; font-size:40px;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%)">This is a sample HTML Offer.</p></body></html>\n',
                                                                                                           format: 'text/html',
                                                                                                           id: '563703-2' },
                                                                                                        score: 0,
                                                                                                        meta: 
                                                                                                         { 'geo.countryCode': 'in',
                                                                                                           'profile.daysSinceLastVisit': '0',
                                                                                                           'geo.country': 'india',
                                                                                                           'geo.state': 'uttar pradesh',
                                                                                                           'experience.name': 'Experience A',
                                                                                                           'activity.id': '563703',
                                                                                                           'profile.tntId': '67481258612876698886356065233943078990-RICqtP',
                                                                                                           'profile.marketingCloudVisitorId': '67481258612876698886356065233943078990',
                                                                                                           'activity.name': 'SS - Aug' },
                                                                                                        uniquePropositionId: '563703' } ]
2026-04-21 09:29:42.947 17908-18071 RCTAEPOptimizeModule    com.AEPSampleAppNewArchEnabled       D  multipleOffersGenerateDisplayInteractionXdm: calling generateDisplayInteractionXdm for: 1 offers: [com.adobe.marketing.mobile.optimize.Offer@b93eb510]
2026-04-21 09:29:42.947 17908-17958 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       D  EventHub - Dispatching Event #79 - ({
                                                                                                        class: Event,
                                                                                                        name: Optimize Response,
                                                                                                        uniqueIdentifier: b883dea9-d70b-40f1-831c-4512ba4f2460,
                                                                                                        source: com.adobe.eventSource.responseContent,
                                                                                                        type: com.adobe.eventType.optimize,
                                                                                                        responseId: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        parentId: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        timestamp: 1776743982942,
                                                                                                        data: {
                                                                                                        "propositions": [
                                                                                                            {
                                                                                                                "scopeDetails": {
                                                                                                                    "characteristics": {
                                                                                                                        "eventToken": "LE3eZtww0I7zZm4YcIGiAp3BNhkKdJh9FdggP2851yfZ9ODJEg5+xiJvnW45OpL4Pse33DhMsKeqt8fFw79Kf7YG3VM2wujhdRlKSFck1z4="
                                                                                                                    },
                                                                                                                    "activity": {
                                                                                                                        "id": "563703"
                                                                                                                    },
                                                                                                                    "strategies": [
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "entry"
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "display"
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "conversion"
                                                                                                                        }
                                                                                                                    ],
                                                                                                                    "correlationID": "563703:0:0",
                                                                                                                    "decisionProvider": "TGT",
                                                                                                                    "experience": {
                                                                                                                        "id": "0"
                                                                                                                    }
                                                                                                                },
                                                                                                                "activity": {},
                                                                                                                "scope": "mboxAug",
                                                                                                                "id": "AT:eyJhY3Rpdml0eUlkIjoiNTYzNzAzIiwiZXhwZXJpZW5jZUlkIjoiMCJ9",
                                                                                                                "placement": {},
                                                                                                                "items": [
                                                                                                                    {
                                                                                                                        "schema": "https:\/\/ns.adobe.com\/personalization\/html-content-item",
                                                                                                                        "score": 0,
                                                                                                                        "data": {
                                                                                                                            "characteristics": null,
                                                                                                                            "language": null,
                                                                                                                            "id": "563703-2",
                                                                                                                            "type": "text\/html",
                                                                                                                            "content": "<html><body><p style=\"color:black; font-size:40px;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%)\">This is a sample HTML Offer.<\/p><\/body><\/html>\n"
                                                                                                                        },
                                                                                                                        "meta": {
                                                                                                                            "activity.name": "SS - Aug",
                                                                                                                            "profile.marketingCloudVisitorId": "67481258612876698886356065233943078990",
                                                                                                                            "profile.tntId": "67481258612876698886356065233943078990-RICqtP",
                                                                                                                            "geo.state": "uttar pradesh",
                                                                                                                            "activity.id": "563703",
                                                                                                                            "profile.daysSinceLastVisit": "0",
                                                                                                                            "experience.name": "Experience A",
                                                                                                                            "geo.country": "india",
                                                                                                                            "geo.countryCode": "in"
                                                                                                                        },
                                                                                                                        "etag": null,
                                                                                                                        "id": "563703-2"
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                        mask: null,
                                                                                                    })
2026-04-21 09:29:42.949 17908-18070 ReactNativeJS           com.AEPSampleAppNewArchEnabled       I  'displayInteractionXdm', '{\n  "eventType": "decisioning.propositionDisplay",\n  "_experience": {\n    "decisioning": {\n      "propositions": [\n        {\n          "scopeDetails": {\n            "decisionProvider": "TGT",\n            "correlationID": "563703:0:0",\n            "strategies": [\n              {\n                "step": "entry",\n                "trafficType": "0"\n              },\n              {\n                "step": "display",\n                "trafficType": "0"\n              },\n              {\n                "step": "conversion",\n                "trafficType": "0"\n              }\n            ],\n            "experience": {\n              "id": "0"\n            },\n            "activity": {\n              "id": "563703"\n            },\n            "characteristics": {\n              "eventToken": "LE3eZtww0I7zZm4YcIGiAp3BNhkKdJh9FdggP2851yfZ9ODJEg5+xiJvnW45OpL4Pse33DhMsKeqt8fFw79Kf7YG3VM2wujhdRlKSFck1z4="\n            }\n          },\n          "items": [\n            {\n              "id": "563703-2"\n            }\n          ],\n          "scope": "mboxAug",\n          "id": "AT:eyJhY3Rpdml0eUlkIjoiNTYzNzAzIiwiZXhwZXJpZW5jZUlkIjoiMCJ9"\n        }\n      ]\n    }\n  }\n}'
2026-04-21 09:29:42.950 17908-18015 AdobeExperienceSDK      com.AEPSampleAppNewArchEnabled       D  EventHub - Dispatched Event #79 to extensions after processing rules - ({
                                                                                                        class: Event,
                                                                                                        name: Optimize Response,
                                                                                                        uniqueIdentifier: b883dea9-d70b-40f1-831c-4512ba4f2460,
                                                                                                        source: com.adobe.eventSource.responseContent,
                                                                                                        type: com.adobe.eventType.optimize,
                                                                                                        responseId: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        parentId: db4a39cf-bae1-42eb-bca9-d336ec21b6b4,
                                                                                                        timestamp: 1776743982942,
                                                                                                        data: {
                                                                                                        "propositions": [
                                                                                                            {
                                                                                                                "scopeDetails": {
                                                                                                                    "characteristics": {
                                                                                                                        "eventToken": "LE3eZtww0I7zZm4YcIGiAp3BNhkKdJh9FdggP2851yfZ9ODJEg5+xiJvnW45OpL4Pse33DhMsKeqt8fFw79Kf7YG3VM2wujhdRlKSFck1z4="
                                                                                                                    },
                                                                                                                    "activity": {
                                                                                                                        "id": "563703"
                                                                                                                    },
                                                                                                                    "strategies": [
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "entry"
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "display"
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "trafficType": "0",
                                                                                                                            "step": "conversion"
                                                                                                                        }
                                                                                                                    ],
                                                                                                                    "correlationID": "563703:0:0",
                                                                                                                    "decisionProvider": "TGT",
                                                                                                                    "experience": {
                                                                                                                        "id": "0"
                                                                                                                    }
                                                                                                                },
                                                                                                                "activity": {},
                                                                                                                "scope": "mboxAug",
                                                                                                                "id": "AT:eyJhY3Rpdml0eUlkIjoiNTYzNzAzIiwiZXhwZXJpZW5jZUlkIjoiMCJ9",
                                                                                                                "placement": {},
                                                                                                                "items": [
                                                                                                                    {
                                                                                                                        "schema": "https:\/\/ns.adobe.com\/personalization\/html-content-item",
                                                                                                                        "score": 0,
                                                                                                                        "data": {
                                                                                                                            "characteristics": null,
                                                                                                                            "language": null,
                                                                                                                            "id": "563703-2",
                                                                                                                            "type": "text\/html",
                                                                                                                            "content": "<html><body><p style=\"color:black; font-size:40px;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%)\">This is a sample HTML Offer.<\/p><\/body><\/html>\n"
                                                                                                                        },
                                                                                                                        "meta": {
                                                                                                                            "activity.name": "SS - Aug",
                                                                                                                            "profile.marketingCloudVisitorId": "67481258612876698886356065233943078990",
                                                                                                                            "profile.tntId": "67481258612876698886356065233943078990-RICqtP",
                                                                                                                            "geo.state": "uttar pradesh",
                                                                                                                            "activity.id": "563703",
                                                                                                                            "profile.daysSinceLastVisit": "0",
                                                                                                                            "experience.name": "Experience A",
                                                                                                                            "geo.country": "india",
                                                                                                                            "geo.countryCode": "in"
                                                                                                                        },
                                                                                                                        "etag": null,
                                                                                                                        "id": "563703-2"
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                        mask: null,
                                                                                                    })
2026-04-21 09:29:42.988   388-479   AudioFlinger            audioserver                          D  mixer(0xb4000076b00c1930) throttle end: throttle time(33)
2026-04-21 09:29:43.102   388-479   audioserver             audioserver                          D  FGS Logger Transaction failed
2026-04-21 09:29:43.102   388-479   audioserver             audioserver                          D  -129
2026-04-21 09:29:44.312   867-867   StatusBarIconController com.android.systemui                 D  ignoring old pipeline callbacks, because the new mobile icons are enabled
2026-04-21 09:29:44.380   867-961   EGL_emulation           com.android.systemui                 D  app_time_stats: avg=40046.82ms min=40046.82ms max=40046.82ms count=1
2026-04-21 09:29:45.981   351-4957  android.ha...mpl.ranchu android.hardware.audio.service       D  threadLoop: entering standby, frames: 43312192
2026-04-21 09:29:54.310   867-867   StatusBarIconController com.android.systemui                 D  ignoring old pipeline callbacks, because the new mobile icons are enabled
2026-04-21 09:30:00.006   521-547   ActivityManager         system_server                        D  sync unfroze 8182 com.google.android.apps.wellbeing for 3
2026-04-21 09:30:00.029   521-547   ActivityManager         system_server                        D  sync unfroze 17861 com.google.android.settings.intelligence for 3
2026-04-21 09:30:00.030   521-547   ActivityManager         system_server                        D  sync unfroze 15095 com.android.settings for 3