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
exports.IMAGE_ONLY_TEMPLATES = exports.LARGE_IMAGE_TEMPLATES = exports.SMALL_IMAGE_TEMPLATES = void 0;
var imageOnly_1 = require("./imageOnly");
var largeImage_1 = require("./largeImage");
var smallImage_1 = require("./smallImage");
// SmallImage
exports.SMALL_IMAGE_TEMPLATES = [
    {
        key: '1',
        template: smallImage_1.SMALL_IMAGE_CONTENT_ALL_FIELDS,
        renderText: '[Basic] all fields',
        styleOverrides: {
            smallImageStyle: {
                card: {
                    backgroundColor: '#800080',
                    borderRadius: 20,
                    margin: 15
                },
                title: {
                    color: '#FF0000'
                },
                body: {
                    color: '#00FF00'
                }
            }
        },
        listener: function (event, card) {
            console.log('Event triggered:', event, card);
        },
    },
    {
        key: '13',
        template: smallImage_1.SMALL_IMAGE_CONTENT_ALL_FIELDS,
        renderText: '[dark/light]Custom theme',
        listener: function (event, card) {
            console.log('Event triggered:', event, card);
        },
        customThemes: {
            light: { colors: { textPrimary: 'red', background: 'oldlace', buttonTextColor: 'orange' } },
            dark: { colors: { textPrimary: 'green', background: 'lightblue', buttonTextColor: 'mediumorchid' } }
        }
    },
    {
        key: '11',
        template: smallImage_1.SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON,
        renderText: '[dismiss button] NO ',
    },
    {
        key: '12',
        template: smallImage_1.SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE,
        renderText: '[dismiss button] Simple',
    },
    {
        key: '2',
        template: smallImage_1.SMALL_IMAGE_CONTENT_INVALID_IMAGE,
        renderText: '[image] Invalid',
        styleOverrides: {
            smallImageStyle: {
                card: {
                    backgroundColor: '#800080',
                    borderRadius: 20,
                    margin: 15,
                    padding: 10
                },
                title: {
                    color: '#FF0000'
                },
                body: {
                    color: '#00FF00'
                }
            }
        },
    },
    {
        key: '3',
        template: smallImage_1.SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
        renderText: '[dark/light] darkUrl',
    },
    {
        key: '4',
        template: smallImage_1.SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
        renderText: '[style]title (2 lines), body (4 lines)',
        styleOverrides: {
            smallImageStyle: {
                card: {
                    backgroundColor: '#800080',
                    borderRadius: 20,
                    margin: 15,
                    padding: 10
                },
                title: {
                    color: '#FF0000'
                },
                body: {
                    color: '#00FF00'
                }
            }
        },
        listener: function (event, card) {
            console.log('Event triggered:', event, card);
        }
    },
    {
        key: '5',
        template: smallImage_1.SMALL_IMAGE_CONTENT_3_BUTTONS,
        renderText: '[button] 3',
    },
    {
        key: '6',
        template: smallImage_1.SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
        renderText: '[style] height (150) title (1 line), body (1 line)',
        styleOverrides: {
            smallImageStyle: {
                title: {
                    fontSize: 16
                },
                body: {
                    fontSize: 14
                }
            }
        }
    },
    {
        key: '14',
        template: smallImage_1.SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
        renderText: 'image width (50%)',
        styleOverrides: {
            smallImageStyle: {
                title: { fontSize: 16, fontWeight: '600' },
                body: { fontSize: 14, lineHeight: 18 },
                imageContainer: {
                    width: '50%'
                }
            }
        }
    },
    {
        key: '7',
        template: smallImage_1.SMALL_IMAGE_CONTENT_NO_BUTTON,
        renderText: 'No button, image width (40%), title (2 lines), body (6 lines), height (180)',
        styleOverrides: {
            smallImageStyle: {
                title: { fontSize: 16, fontWeight: '600' },
                body: { fontSize: 14, lineHeight: 18 },
                imageContainer: {
                    width: '40%'
                }
            }
        }
    },
    {
        key: '8',
        template: smallImage_1.SMALL_IMAGE_CONTENT_NO_BUTTON,
        renderText: 'No button, image (right aligned)',
        styleOverrides: {
            smallImageStyle: {
                title: { fontSize: 16, fontWeight: '600' },
                body: { fontSize: 14, lineHeight: 18 },
                container: {
                    flexDirection: 'row-reverse'
                },
                imageContainer: {
                    width: '40%'
                }
            }
        }
    }
];
exports.LARGE_IMAGE_TEMPLATES = [
    {
        key: '1',
        template: largeImage_1.LARGE_IMAGE_CONTENT_ALL_FIELDS,
        renderText: '[Basic] all fields',
    },
    {
        key: '2',
        template: largeImage_1.LARGE_IMAGE_CONTENT_3_BUTTONS,
        renderText: '[button] 3',
    },
    {
        key: '3',
        template: largeImage_1.LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON,
        renderText: '[dismiss button] NO ',
    },
    {
        key: '4',
        template: largeImage_1.LARGE_IMAGE_CONTENT_INVALID_IMAGE,
        renderText: '[image] Invalid',
    },
    {
        key: '5',
        template: largeImage_1.LARGE_IMAGE_CONTENT_DARK_URL,
        renderText: '[dark/light] darkUrl',
    },
    {
        key: '6',
        template: largeImage_1.LARGE_IMAGE_CONTENT_LONG_TITLE,
        renderText: '[style]title (2 lines), body (2 lines), image (1:1)',
        styleOverrides: {
            largeImageStyle: {
                title: {
                    fontSize: 18,
                    fontWeight: '600'
                },
                body: {
                    fontSize: 14,
                    lineHeight: 18
                },
                image: {
                    aspectRatio: 1 / 1
                }
            }
        },
        listener: function (event, card) {
            console.log('Event triggered:', event, card);
        }
    },
    {
        key: '7',
        template: largeImage_1.LARGE_IMAGE_CONTENT_DARK_URL,
        renderText: '[dark/light]Custom theme',
        customThemes: {
            light: {
                colors: {
                    textPrimary: 'red',
                    background: 'oldlace',
                    buttonTextColor: 'orange'
                }
            },
            dark: {
                colors: {
                    textPrimary: 'green',
                    background: 'lightblue',
                    buttonTextColor: 'mediumorchid'
                }
            }
        },
        listener: function (event, card) {
            console.log('Event triggered:', event, card);
        }
    }
];
exports.IMAGE_ONLY_TEMPLATES = [
    {
        key: '1',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '1. All fields',
        listener: function (event, card) {
            console.log('Event triggered: - for imageOnly image 1', event, card);
        }
    },
    {
        key: '2',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE,
        renderText: '2.Adobe default image, dismiss style circle',
        listener: function (event, card) {
            console.log('Event triggered: - for imageOnly image 2', event, card);
        }
    },
    {
        key: '3',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON,
        renderText: '3. No dismiss button - no card height',
    },
    {
        key: '4',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_INVALID_IMAGE,
        renderText: '4. [image] Invalid',
    },
    {
        key: '5',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_NO_ACTION,
        renderText: '5. [action] No actionUrl',
    },
    {
        key: '6',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '6. [style] Custom aspect ratio (1:1)',
        styleOverrides: {
            imageOnlyStyle: {
                image: {
                    aspectRatio: 1 / 1
                }
            }
        },
        listener: function (event, card) {
            console.log('Event triggered: - for imageOnly image 7', event, card);
        }
    },
    {
        key: '7',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '7. [style] Custom height (150)',
        styleOverrides: {
            imageOnlyStyle: {
                image: {
                    height: 150
                }
            }
        }
    },
    {
        key: '8',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '8. [style] Custom width (80%), set image container backgroud color',
        styleOverrides: {
            imageOnlyStyle: {
                image: {
                    width: '80%'
                },
                imageContainer: {
                    backgroundColor: '#79f4bbff'
                }
            }
        }
    },
    {
        key: '9',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '9. [style] Card customization',
        styleOverrides: {
            imageOnlyStyle: {
                card: {
                    borderRadius: 80,
                    margin: 30
                },
                image: {
                    width: '50%',
                    resizeMode: 'stretch'
                }
            }
        }
    },
    {
        key: '10',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '10. [style] Image container customization',
        styleOverrides: {
            imageOnlyStyle: {
                imageContainer: {
                    borderRadius: 15,
                    borderWidth: 5,
                    borderColor: '#FF69B4',
                    maxHeight: 100
                },
                image: {
                    resizeMode: 'center',
                    backgroundColor: '#79f4bbff',
                    maxHeight: 90
                }
            }
        }
    },
    {
        key: '11',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_ALL_FIELDS,
        renderText: '11. [style] Combined styles',
        styleOverrides: {
            imageOnlyStyle: {
                card: {
                    margin: 5,
                    borderRadius: 0
                },
                imageContainer: {
                    backgroundColor: '#E6E6FA',
                    minHeight: 180
                },
                image: {
                    resizeMode: 'cover'
                }
            }
        }
    },
    {
        key: '12',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_NO_DARK_URL,
        renderText: '12. [image] No darkUrl (only light mode)',
    },
    {
        key: '15',
        template: imageOnly_1.IMAGE_ONLY_CONTENT_NO_LIGHT_MODE,
        renderText: '1.[image] No Light Mode (only dark mode) - no actionUrl',
    },
];
