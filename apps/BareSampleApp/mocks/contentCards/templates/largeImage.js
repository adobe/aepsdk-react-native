"use strict";
/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LARGE_IMAGE_CONTENT_LONG_TITLE = exports.LARGE_IMAGE_CONTENT_DARK_URL = exports.LARGE_IMAGE_CONTENT_INVALID_IMAGE = exports.LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON = exports.LARGE_IMAGE_CONTENT_3_BUTTONS = exports.LARGE_IMAGE_CONTENT_ALL_FIELDS = void 0;
// Large Image Templates
exports.LARGE_IMAGE_CONTENT_ALL_FIELDS = {
    id: 'large-image-all-fields',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e0554595',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked',
                    text: {
                        content: 'ButtonTextOne'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
                darkUrl: ''
            },
            dismissBtn: {
                style: 'simple'
            },
            title: {
                content: 'This is large image title'
            }
        }
    }
};
exports.LARGE_IMAGE_CONTENT_3_BUTTONS = {
    id: 'large-image-3-buttons',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e035795',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked_1',
                    text: {
                        content: 'ButtonOne'
                    }
                },
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e055796',
                    interactId: 'buttonOneClicked_2',
                    text: {
                        content: 'ButtonTwo'
                    }
                },
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e055797',
                    interactId: 'buttonOneClicked_3',
                    text: {
                        content: 'ButtonThreeeeeeeee'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
            },
            dismissBtn: {
                style: 'simple'
            },
            title: {
                content: 'This is large image title'
            }
        }
    }
};
exports.LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON = {
    id: 'large-image-no-dismiss',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e055798',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked',
                    text: {
                        content: 'ButtonTextOne'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
            },
            dismissBtn: {
                style: 'none'
            },
            title: {
                content: 'This is large image title'
            }
        }
    }
};
exports.LARGE_IMAGE_CONTENT_INVALID_IMAGE = {
    id: 'large-image-invalid',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b365e055795',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked',
                    text: {
                        content: 'ButtonTextOne'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://xxx',
                darkUrl: 'https://imageurl.com/dark'
            },
            dismissBtn: {
                style: 'none'
            },
            title: {
                content: 'This is large image title'
            }
        }
    }
};
exports.LARGE_IMAGE_CONTENT_DARK_URL = {
    id: 'large-image-dark-url',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e055745',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked',
                    text: {
                        content: 'ButtonTextOne'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
                darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*'
            },
            dismissBtn: {
                style: 'none'
            },
            title: {
                content: 'This is large image title'
            }
        }
    }
};
exports.LARGE_IMAGE_CONTENT_LONG_TITLE = {
    id: 'large-image-long-title',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card',
    data: {
        expiryDate: Date.now() + 86400000, // 24 hours from now
        publishedDate: Date.now(),
        contentType: 'application/json',
        meta: {
            adobe: { template: 'LargeImage' },
            surface: 'rn/ios/sample'
        },
        content: {
            actionUrl: 'https://cardaction.com',
            body: {
                content: "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
            },
            buttons: [
                {
                    id: 'a41d1bff-2797-4958-a6d7-2b367e055748',
                    actionUrl: 'https://buttonone.com/action',
                    interactId: 'buttonOneClicked',
                    text: {
                        content: 'ButtonTextOne'
                    }
                }
            ],
            image: {
                alt: '',
                url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
                darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*'
            },
            dismissBtn: {
                style: 'none'
            },
            title: {
                content: "This is large image title, it's very long very long very long very long"
            }
        }
    }
};
