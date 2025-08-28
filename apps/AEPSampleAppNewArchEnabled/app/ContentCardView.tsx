/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  Appearance,
  ColorSchemeName,
  Platform
} from 'react-native';
import { useEffect } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import {
  Messaging,
  ContentView,
  ContentTemplate,
  TemplateType,
  ThemeProvider
} from '@adobe/react-native-aepmessaging';
import { MobileCore } from '@adobe/react-native-aepcore';

const ContentCardView = () => {
  const [content, setContent] = useState<ContentTemplate[] | null>(null);
  const [selectedView, setSelectedView] = useState<string>('Remote');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('System');
  const colorScheme = useColorScheme();

  const viewOptions = ['SmallImage', 'LargeImage', 'ImageOnly', 'Remote'];
  const themeOptions: Array<{
    label: string;
    value: ColorSchemeName;
  }> = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: null }
  ];

  const handleThemeChange = (theme: string, value: ColorSchemeName) => {
    setSelectedTheme(theme);
    Appearance.setColorScheme(value);
  };

  const renderStyledText = (text: string) => {
    return (
      <Text style={{ color: 'darkgray', textAlign: 'center', fontSize: 18 }}>
        {text}
      </Text>
    );
  };

  useEffect(() => {
    Messaging.updatePropositionsForSurfaces([`rn/${Platform.OS}/remote_image`]);
    // Note:
    // - Call above to update the propositions and cache the content locally
    // - Customers may call this function when launching the app
    MobileCore.trackAction('xyz');
    try {
      Messaging.getContentCardUI(`rn/${Platform.OS}/remote_image`).then(
        (content) => {
          console.log('content', content);
          setContent(content);
        }
      );
    } catch (error) {
      console.error('Error fetching content cards:', error);
    }
  }, []);

  return (
    <ScrollView>
      {/* Theme Switcher */}
      <View
        style={{
          marginTop: 60,
          marginBottom: 15,
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: '65%',
            backgroundColor: colorScheme === 'dark' ? '#3A3A3A' : '#E8E8E8',
            borderRadius: 12,
            padding: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginHorizontal: 1,
                backgroundColor:
                  selectedTheme === option.label
                    ? colorScheme === 'dark'
                      ? '#4A4A4A'
                      : '#FFFFFF'
                    : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor:
                  selectedTheme === option.label ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: selectedTheme === option.label ? 0.1 : 0,
                shadowRadius: 2,
                elevation: selectedTheme === option.label ? 2 : 0
              }}
              onPress={() => handleThemeChange(option.label, option.value)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: selectedTheme === option.label ? '600' : '400',
                  color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* View Selector */}
      <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            justifyContent: 'center',
            paddingHorizontal: 10,
            backgroundColor: '#fff'
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ fontSize: 16 }}>{selectedView}</Text>
        </TouchableOpacity>

        <Modal visible={showPicker} transparent={true} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '80%'
              }}
            >
              {viewOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                  }}
                  onPress={() => {
                    setSelectedView(option);
                    setShowPicker(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: selectedView === option ? '#007AFF' : '#000'
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  marginTop: 10
                }}
                onPress={() => setShowPicker(false)}
              >
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {selectedView === 'SmallImage' && (
          <View>
            {renderStyledText('[Basic] all fields')}
            <ContentView
              key="1"
              template={SMALL_IMAGE_CONTENT_ALL_FIELDS}
              styleOverrides={{
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
              }}
              listener={(event, card) => {
                console.log('Event triggered:', event, card);
              }}
            />
            {renderStyledText('[dark/light]Custom theme')}
            <ThemeProvider
              customThemes={{
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
              }}
            >
              <ContentView
                key="1"
                template={SMALL_IMAGE_CONTENT_ALL_FIELDS}
                listener={(event, card) => {
                  console.log('Event triggered:', event, card);
                }}
              />
            </ThemeProvider>

            {renderStyledText('[dismiss button] NO ')}
            <ContentView
              key="11"
              template={SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON}
            />
            {renderStyledText('[dismiss button] Simple')}
            <ContentView
              key="12"
              template={SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE}
            />
            {renderStyledText('[image] Invalid')}
            <ContentView
              key="2"
              template={SMALL_IMAGE_CONTENT_INVALID_IMAGE}
              styleOverrides={{
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
              }}
            />
            {renderStyledText('[dark/light] darkUrl')}
            <ContentView
              key="3"
              template={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
            />
            {renderStyledText('[style]title (2 lines), body (4 lines)')}
            <ContentView
              key="4"
              template={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
              styleOverrides={{
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
              }}
              listener={(event, card) => {
                console.log('Event triggered:', event, card);
              }}
            />
            {renderStyledText('[button] 3')}
            <ContentView
              key="5"
              template={SMALL_IMAGE_CONTENT_3_BUTTONS}
            />
            {renderStyledText(
              '[style] height (150) title (1 line), body (1 line)'
            )}
            <View style={{ height: 150 }}>
              <ContentView
                key="6"
                template={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      fontSize: 16
                    },
                    body: {
                      fontSize: 14
                    }
                  }
                }}
              />
            </View>
            {renderStyledText('image width (50%)')}
            <View>
              <ContentView
                key="6"
                template={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      fontSize: 16,
                      fontWeight: '600'
                    },
                    body: {
                      fontSize: 14,
                      lineHeight: 18
                    },
                    imageContainer: {
                      width: '50%'
                    }
                  }
                }}
              />
            </View>

            {renderStyledText(
              'No button, image width (40%), title (2 lines), body (6 lines), height (180)'
            )}
            <View>
              <ContentView
                key="7"
                template={SMALL_IMAGE_CONTENT_NO_BUTTON}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      fontSize: 16,
                      fontWeight: '600'
                    },
                    body: {
                      fontSize: 14,
                      lineHeight: 18
                    },
                    imageContainer: {
                      width: '40%'
                    }
                  }
                }}
              />
            </View>
            {renderStyledText('No button, image (right aligned)')}
            <View>
              <ContentView
                key="8"
                template={SMALL_IMAGE_CONTENT_NO_BUTTON}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      fontSize: 16,
                      fontWeight: '600'
                    },
                    body: {
                      fontSize: 14,
                      lineHeight: 18
                    },
                    container: {
                      flexDirection: 'row-reverse'
                    },
                    imageContainer: {
                      width: '40%'
                    }
                  }
                }}
              />
            </View>

            <View style={{ height: 200 }} />
          </View>
        )}

        {selectedView === 'LargeImage' && (
          <View>
            {renderStyledText('[basic] all fields')}
            <ContentView key="1" template={LARGE_IMAGE_CONTENT_ALL_FIELDS} />
            {renderStyledText('[button] 3')}
            <ContentView key="2" template={LARGE_IMAGE_CONTENT_3_BUTTONS} />

            {renderStyledText('[dismiss button] NO ')}
            <ContentView
              key="3"
              template={LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON}
            />

            {renderStyledText('[image] Invalid')}
            <ContentView key="4" template={LARGE_IMAGE_CONTENT_INVALID_IMAGE} />
            {renderStyledText('[dark/light] darkUrl')}
            <ContentView key="5" template={LARGE_IMAGE_CONTENT_DARK_URL} />
            {renderStyledText(
              '[style]title (2 lines), body (2 lines), image (1:1)'
            )}
            <ContentView
              key="6"
              template={LARGE_IMAGE_CONTENT_LONG_TITLE}
              styleOverrides={{
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
              }}
              listener={(event, card) => {
                console.log('Event triggered:', event, card);
              }}
            />
            {renderStyledText('[dark/light]Custom theme')}
            <ThemeProvider
              customThemes={{
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
              }}
            >
              <ContentView
                key="7"
                template={LARGE_IMAGE_CONTENT_DARK_URL}
                listener={(event, card) => {
                  console.log('Event triggered:', event, card);
                }}
              />
            </ThemeProvider>

            <View style={{ height: 200 }} />
          </View>
        )}

        {selectedView === 'ImageOnly' && (
          <View>
            {renderStyledText('1. All fields')}
            <ContentView
              key="1"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              listener={(event, card) => {
                console.log(
                  'Event triggered: - for imageOnly image 1',
                  event,
                  card
                );
              }}
            />

            {renderStyledText(
              '2.Adobe default image, dismiss style circle'
            )}
            <ContentView
              key="2"
              template={IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE}
              listener={(event, card) => {
                console.log(
                  'Event triggered: - for imageOnly image 2',
                  event,
                  card
                );
              }}
            />

            {renderStyledText('3. No dismiss button - no card height')}
            <ContentView
              key="3"
              template={IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON}
            />

            {renderStyledText('4. [image] Invalid')}
            <ContentView key="4" template={IMAGE_ONLY_CONTENT_INVALID_IMAGE} />

            {renderStyledText('5.[action] No actionUrl')}
            <ContentView key="5" template={IMAGE_ONLY_CONTENT_NO_ACTION} />

            {renderStyledText('6.[style] Custom aspect ratio (1:1)')}
            <ContentView
              key="6"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
                imageOnlyStyle: {
                  image: {
                    aspectRatio: 1 / 1
                  }
                }
              }}
              listener={(event, card) => {
                console.log(
                  'Event triggered: - for imageOnly image 7',
                  event,
                  card
                );
              }}
            />

            {renderStyledText('7.[style] Custom height (150)')}
            <ContentView
              key="7"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
                imageOnlyStyle: {
                  image: {
                    height: 150
                  }
                }
              }}
            />

            {renderStyledText(
              '8. [style] Custom width (80%), set image container backgroud color'
            )}
            <ContentView
              key="8"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
                imageOnlyStyle: {
                  image: {
                    width: '80%'
                  },
                  imageContainer: {
                    backgroundColor: '#79f4bbff'
                  }
                }
              }}
            />

            {renderStyledText('9. [style] Card customization')}
            <ContentView
              key="9"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
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
              }}
            />

            {renderStyledText('10.[style] Image container customization')}
            <ContentView
              key="10"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
                imageOnlyStyle: {
                  imageContainer: {
                    borderRadius: 15,
                    borderWidth: 5,
                    borderColor: '#FF69B4',
                    maxHeight: 100
                  },
                  image: {
                    resizeMode: 'center',
                    backgroundColor: '#79f4bbff'
                  }
                }
              }}
            />

            {renderStyledText('11.[style] Combined styles')}
            <ContentView
              key="11"
              template={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              styleOverrides={{
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
              }}
            />

            {renderStyledText('12.[image] No darkUrl (only light mode)')}
            <ContentView key="12" template={IMAGE_ONLY_CONTENT_NO_DARK_URL} />

            {renderStyledText(
              '1.[image] No Light Mode (only dark mode) - no actionUrl'
            )}
            <ContentView key="15" template={IMAGE_ONLY_CONTENT_NO_LIGHT_MODE} />
            <View style={{ height: 200 }} />
          </View>
        )}
       {selectedView === 'Remote' && (
          <View>
                     {renderStyledText(
              '1.[image] No Light Mode (only dark mode) - no actionUrl'
            )}
            <ContentView key="15" template={IMAGE_ONLY_CONTENT_NO_LIGHT_MODE} />
            <View style={{ height: 200 }} />
          </View>
        )}
        {selectedView === 'Remote' && (
          <View>
            {renderStyledText('[Remote] cards')}
            {content?.map((item) => (
              <ContentView
                key={item.id}
                template={item}
                listener={(event, card) => {
                  console.log('Event triggered:', event, card);
                }}
                styleOverrides={{
                  smallImageStyle: {
                    // title: {
                    //   numberOfLines: 2
                    // },
                    // body: {
                    //   numberOfLines: 4
                    // }
                  }
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};
export default ContentCardView;

// All ContentTemplates updated with proper data structure

const SMALL_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: 'small-image-all-fields',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      image: {
        alt: '',
        url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
        darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
      },
      buttons: [
        {
          interactId: 'downloadClicked',
          actionUrl: 'https://nba.com',
          id: '5b4d53f5-44bd-4e5c-a5cb-6e650b1993f6',
          text: {
            content: 'Download App'
          }
        },
        {
          interactId: 'OK',
          id: '5b4d53f5-45bd-4e3c-a5cb-6e650b1993f7',
          text: {
            content: 'OK'
          }
        }
      ],
      dismissBtn: {
        style: 'circle'
      },
      actionUrl: '',
      body: {
        content: 'Get live scores, real-time updates, and exclusive content right at your fingertips.'
      },
      title: {
        content: 'Stay connected to all the action'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: 'small-image-no-dismiss',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      image: {
        alt: '',
        url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
        darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
      },
      buttons: [
        {
          interactId: 'downloadClicked',
          actionUrl: 'https://nba.com',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e65b1993f6',
          text: {
            content: 'Download App'
          }
        }
      ],
      actionUrl: '',
      body: {
        content: 'Get live scores, real-time updates, and exclusive content right at your fingertips.'
      },
      title: {
        content: 'Stay connected to all the action'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE: ContentTemplate = {
  id: 'small-image-dismiss-button-simple',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      image: {
        alt: '',
        url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
        darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
      },
      buttons: [
        {
          interactId: 'downloadClicked',
          actionUrl: 'https://nba.com',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e650b1893f6',
          text: {
            content: 'Download App'
          }
        },
        {
          interactId: 'OK',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e650a1993f6',
          text: {
            content: 'OK'
          }
        }
      ],
      dismissBtn: {
        style: 'simple'
      },
      actionUrl: '',
      body: {
        content: 'Get live scores, real-time updates, and exclusive content right at your fingertips.'
      },
      title: {
        content: 'Stay connected to all the action'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: 'small-image-invalid-image',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
     body: {
        content: 'Get live scores, real-time updates, and exclusive content right at your fingertips.'
      },
      title: {
        content: 'Stay connected to all the action'
      },
      buttons: [
        {
          interactId: 'buy',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e450b1993f6',
          actionUrl: 'https://nba.com',
          text: {
            content: 'Get Season Pass'
          }
        }
      ],
      actionUrl: '',
      dismissBtn: {
        style: 'circle'
      },
      image: {
        darkUrl: 'https://invalid-dark-url-that-will-fail.png',
        alt: '',
        url: 'https://invalid-light-url-that-will-fail.png'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_IMAGE_DARK_URL: ContentTemplate = {
  id: 'small-image-dark-url',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
      },
      title: {
        content: 'Get Ready for the Basketball Season Kickoff!'
      },
      buttons: [
        {
          interactId: 'buy',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e850b1993f6',
          actionUrl: 'https://nba.com',
          text: {
            content: 'Get Season Pass'
          }
        }
      ],
      actionUrl: '',
      dismissBtn: {
        style: 'circle'
      },
      image: {
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
        alt: '',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
  id: 'small-image-3-buttons',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
      },
      title: {
        content: 'Get Ready for the Basketball Season Kickoff!'
      },
      buttons: [
        {
          interactId: 'buy',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e610b1993f6',
          actionUrl: 'https://nba.com',
          text: {
            content: 'Buyyyyy'
          }
        },
        {
          interactId: 'ok',
          id: '5b4d53f5-41bd-4e5c-a5cb-6e650b1993f6',
          actionUrl: 'https://nba.com',
          text: {
            content: 'OK'
          }
        },
        {
          interactId: 'more',
          id: '5b4d53f5-45bd-4e5c-a5cb-6e650b1793f6',
          actionUrl: 'https://nba.com',
          text: {
            content: 'More'
          }
        }
      ],
      actionUrl: '',
      dismissBtn: {
        style: 'circle'
      },
      image: {
        alt: '',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s'
      }
    }
  }
};

const SMALL_IMAGE_CONTENT_NO_BUTTON: ContentTemplate = {
  id: 'small-image-no-button',
  type: TemplateType.SMALL_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'SmallImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
      },
      title: {
        content: 'Get Ready for the Basketball Season Kickoff!'
      },
      buttons: [],
      actionUrl: '',
      dismissBtn: {
        style: 'circle'
      },
      image: {
        alt: '',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s'
      }
    }
  }
};

// Large Image Templates
const LARGE_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: 'large-image-all-fields',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s',
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

const LARGE_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
  id: 'large-image-3-buttons',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s'
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

const LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: 'large-image-no-dismiss',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s'
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

const LARGE_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: 'large-image-invalid',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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

const LARGE_IMAGE_CONTENT_DARK_URL: ContentTemplate = {
  id: 'large-image-dark-url',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s',
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

const LARGE_IMAGE_CONTENT_LONG_TITLE: ContentTemplate = {
  id: 'large-image-long-title',
  type: TemplateType.LARGE_IMAGE,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'LargeImage' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://cardaction.com',
      body: {
        content: 'Tickets are on sale now! Don\'t miss out on securing your seat to witness the high-flying action from the best players in the game'
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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*'
      },
      dismissBtn: {
        style: 'none'
      },
      title: {
        content: 'This is large image title, it\'s very long very long very long very long'
      }
    }
  }
};

// Image Only Templates
const IMAGE_ONLY_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: 'image-only-all-fields',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://www.adobe.com/',
      image: {
        url: 'https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
        alt: 'flight offer'
      },
      dismissBtn: {
        style: 'simple'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_WITH_ACTION_URL: ContentTemplate = {
  id: 'image-only-with-action-url',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://google.com',
      image: {
        url: 'https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
        alt: 'with action URL - Google Images'
      },
      dismissBtn: {
        style: 'simple'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE: ContentTemplate = {
  id: 'image-only-dismiss-circle',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://google.com',
      image: {
        url: 'https://i.ibb.co/0X8R3TG/Messages-24.png',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
        alt: 'flight offer'
      },
      dismissBtn: {
        style: 'circle'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: 'image-only-no-dismiss',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://google.com',
      image: {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
        alt: 'flight offer'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: 'image-only-invalid-image',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://google.com',
      image: {
        url: 'https://invalid-url-that-will-fail',
        darkUrl: 'https://another-invalid-url',
        alt: 'broken image'
      },
      dismissBtn: {
        style: 'simple'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_NO_ACTION: ContentTemplate = {
  id: 'image-only-no-action',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      image: {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
        alt: 'non-clickable image'
      },
      dismissBtn: {
        style: 'simple'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_NO_DARK_URL: ContentTemplate = {
  id: 'image-only-no-dark-url',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      actionUrl: 'https://google.com',
      image: {
        url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
        alt: 'light mode only image'
      },
      dismissBtn: {
        style: 'simple'
      }
    }
  }
};

const IMAGE_ONLY_CONTENT_NO_LIGHT_MODE: ContentTemplate = {
  id: 'image-only-different-image',
  type: TemplateType.IMAGE_ONLY,
  schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
  data: {
    expiryDate: Date.now() + 86400000, // 24 hours from now
    publishedDate: Date.now(),
    contentType: 'application/json',
    meta: {
      adobe: { template: 'ImageOnly' as any },
      surface: 'rn/ios/sample'
    },
    content: {
      image: {
        url: '',
        darkUrl: 'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
        alt: 'basketball icon'
      },
      dismissBtn: {
        style: 'circle'
      }
    }
  }
} as ContentTemplate;
