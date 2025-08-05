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

import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  Appearance,
  ColorSchemeName,
} from "react-native";
import {
  ContentProvider,
  ContentTemplate,
  ContentView,
} from "@adobe/react-native-aepmessaging";
import { useEffect } from "react";
import {
  TemplateType,
  ThemeProvider,
  Themes,
} from "@adobe/react-native-aepmessaging";
import { useColorScheme } from "../hooks/useColorScheme";
import { Messaging } from "@adobe/react-native-aepmessaging";
import { MobileCore } from "@adobe/react-native-aepcore";

const ContentCardView = () => {
  const [content, setContent] = useState<ContentTemplate[] | null>(null);
  const [selectedView, setSelectedView] = useState<string>("Remote");
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("System");
  const colorScheme = useColorScheme();

  const viewOptions = ["SmallImage", "LargeImage", "ImageOnly", "Remote"];
  const themeOptions: Array<{
    label: string;
    value: ColorSchemeName;
  }> = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: null },
  ];

  const handleThemeChange = (theme: string, value: ColorSchemeName) => {
    setSelectedTheme(theme);
    Appearance.setColorScheme(value);
  };

  const renderStyledText = (text: string) => {
    return (
      <Text style={{ color: "darkgray", textAlign: "center", fontSize: 18 }}>
        {text}
      </Text>
    );
  };

  useEffect(() => {
    Messaging.updatePropositionsForSurfaces(["rn/ios/small_image"]);
    // Note:
    // - Call above to update the propositions and cache the content locally
    // - Customers may call this function when launching the app
    // MobileCore.trackAction("xyz");
    // const provider = new ContentProvider("card/ms");
    const provider = new ContentProvider("rn/ios/small_image");
    provider
      .getContent()
      .then((content) => {
        console.log(content);
        setContent(content);
      })
      .catch((err) => console.error(err.message))
      .finally(() => console.log("Content loaded"));
  }, []);

  return (
    <View>
      {/* Theme Switcher */}
      <View
        style={{
          marginTop: 60,
          marginBottom: 15,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "65%",
            backgroundColor: colorScheme === "dark" ? "#3A3A3A" : "#E8E8E8",
            borderRadius: 12,
            padding: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
                    ? colorScheme === "dark"
                      ? "#4A4A4A"
                      : "#FFFFFF"
                    : "transparent",
                alignItems: "center",
                justifyContent: "center",
                shadowColor:
                  selectedTheme === option.label ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: selectedTheme === option.label ? 0.1 : 0,
                shadowRadius: 2,
                elevation: selectedTheme === option.label ? 2 : 0,
              }}
              onPress={() => handleThemeChange(option.label, option.value)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: selectedTheme === option.label ? "600" : "400",
                  color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
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
            borderColor: "#ccc",
            borderRadius: 5,
            justifyContent: "center",
            paddingHorizontal: 10,
            backgroundColor: "#fff",
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ fontSize: 16 }}>{selectedView}</Text>
        </TouchableOpacity>

        <Modal visible={showPicker} transparent={true} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              {viewOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={() => {
                    setSelectedView(option);
                    setShowPicker(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: selectedView === option ? "#007AFF" : "#000",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  marginTop: 10,
                }}
                onPress={() => setShowPicker(false)}
              >
                <Text style={{ fontSize: 16, color: "#FF3B30" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {selectedView === "SmallImage" && (
          <View>
            {renderStyledText("[Basic] all fields")}
            <ContentView
              key="1"
              data={SMALL_IMAGE_CONTENT_ALL_FIELDS}
              cardHeight={160}
              listener={(event, identifier) => {
                console.log("Event triggered:", event, identifier);
              }}
            />
            {renderStyledText("[dark/light]Custom theme")}
            <ThemeProvider
              customThemes={{
                light: {
                  colors: {
                    text_primary: "red",
                    background: "oldlace",
                    button_text_color: "orange",
                  },
                },
                dark: {
                  colors: {
                    text_primary: "green",
                    background: "lightblue",
                    button_text_color: "mediumorchid",
                  },
                },
              }}
            >
                            <ContentView
                key="1"
                cardHeight={160}
                data={SMALL_IMAGE_CONTENT_ALL_FIELDS}
                listener={(event, identifier) => {
                  console.log("Event triggered:", event, identifier);
                }}
              />
            </ThemeProvider>

            {renderStyledText("[dismiss button] NO ")}
            <ContentView
              key="11"
              cardHeight={160}
              data={SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON}
            />
            {renderStyledText("[dismiss button] Simple")}
            <ContentView
              key="12"
              cardHeight={160}
              data={SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE}
            />
            {renderStyledText("[image] Invalid")}
            <ContentView
              key="2"
              cardHeight={150}
              data={SMALL_IMAGE_CONTENT_INVALID_IMAGE}
            />
            {renderStyledText("[dark/light] darkUrl")}
            <ContentView
              key="3"
              cardHeight={160}
              data={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
            />
            {renderStyledText("[style]title (2 lines), body (4 lines)")}
            <ContentView
              key="4"
              data={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
              styleOverrides={{
                smallImageStyle: {
                  title: {
                    numberOfLines: 2,
                  },
                  body: {
                    numberOfLines: 4,
                  },
                },
              }}
              listener={(event, identifier) => {
                console.log("Event triggered:", event, identifier);
              }}
            />
            {renderStyledText("[button] 3")}
            <ContentView
              key="5"
              cardHeight={160}
              data={SMALL_IMAGE_CONTENT_3_BUTTONS}
            />
            {renderStyledText(
              "[style] height (150) title (1 line), body (1 line)"
            )}
            <View style={{ height: 150 }}>
              <ContentView
                key="6"
                cardHeight={200}
                data={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      numberOfLines: 1,
                    },
                    body: {
                      numberOfLines: 1,
                    },
                  },
                }}
              />
            </View>
            {renderStyledText("image width (50%)")}
            <View>
              <ContentView
                key="6"
                cardHeight={220}
                data={SMALL_IMAGE_CONTENT_IMAGE_DARK_URL}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      numberOfLines: 2,
                    },
                    body: {
                      numberOfLines: 4,
                    },
                    imageContainer: {
                      width: "50%",
                    },
                  },
                }}
              />
            </View>

            {renderStyledText(
              "No button, image width (40%), title (2 lines), body (6 lines), height (180)"
            )}
            <View>
              <ContentView
                key="7"
                cardHeight={160}
                data={SMALL_IMAGE_CONTENT_NO_BUTTON}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      numberOfLines: 2,
                    },
                    body: {
                      numberOfLines: 6,
                    },
                    imageContainer: {
                      width: "40%",
                    },
                  },
                }}
              />
            </View>
            {renderStyledText("No button, image (right aligned)")}
            <View>
              <ContentView
                key="8"
                cardHeight={160}
                data={SMALL_IMAGE_CONTENT_NO_BUTTON}
                styleOverrides={{
                  smallImageStyle: {
                    title: {
                      numberOfLines: 2,
                    },
                    body: {
                      numberOfLines: 6,
                    },
                    container: {
                      flexDirection: "row-reverse",
                    },
                    imageContainer: {
                      width: "40%",
                    },
                  },
                }}
              />
            </View>

            <View style={{ height: 200 }} />
          </View>
        )}

        {selectedView === "LargeImage" && (
          <View>
            {renderStyledText("[basic] all fields")}
            <ContentView
              key="1"
              cardHeight={200}
              data={LARGE_IMAGE_CONTENT_ALL_FIELDS}
            />
            {renderStyledText("[button] 3")}
            <ContentView
              key="2"
              cardHeight={200}
              data={LARGE_IMAGE_CONTENT_3_BUTTONS}
            />

            {renderStyledText("[dismiss button] NO ")}
            <ContentView
              key="3"
              cardHeight={200}
              data={LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON}
            />

            {renderStyledText("[image] Invalid")}
            <ContentView
              key="4"
              cardHeight={150}
              data={LARGE_IMAGE_CONTENT_INVALID_IMAGE}
            />
            {renderStyledText("[dark/light] darkUrl")}
            <ContentView
              key="5"
              cardHeight={160}
              data={LARGE_IMAGE_CONTENT_DARK_URL}
            />
            {renderStyledText(
              "[style]title (2 lines), body (2 lines), image (1:1)"
            )}
            <ContentView
              key="6"
              data={LARGE_IMAGE_CONTENT_LONG_TITLE}
              styleOverrides={{
                largeImageStyle: {
                  title: {
                    numberOfLines: 2,
                  },
                  body: {
                    numberOfLines: 2,
                  },
                  image: {
                    aspectRatio: 1 / 1,
                  },
                },
              }}
              listener={(event, identifier) => {
                console.log("Event triggered:", event, identifier);
              }}
            />
            {renderStyledText("[dark/light]Custom theme")}
            <ThemeProvider
              customThemes={{
                light: {
                  colors: {
                    text_primary: "red",
                    background: "oldlace",
                    button_text_color: "orange",
                  },
                },
                dark: {
                  colors: {
                    text_primary: "green",
                    background: "lightblue",
                    button_text_color: "mediumorchid",
                  },
                },
              }}
            >
                            <ContentView
                key="7"
                cardHeight={160}
                data={LARGE_IMAGE_CONTENT_DARK_URL}
                listener={(event, identifier) => {
                  console.log("Event triggered:", event, identifier);
                }}
              />
            </ThemeProvider>

            <View style={{ height: 200 }} />
          </View>
        )}

        {selectedView === "ImageOnly" && (
          <View>
            {renderStyledText("1. All fields")}
            <ContentView 
              key="1" 
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              listener={(event, identifier) => {
                console.log("Event triggered: - for imageOnly image 1", event, identifier);
              }}
            />
            
            {renderStyledText("2. Images with Action url, dismiss style simple - card height 800")}
            <ContentView 
              key="2" 
              data={IMAGE_ONLY_CONTENT_WITH_ACTION_URL}
              cardHeight={500}
              listener={(event, identifier) => {
                console.log("Event triggered: - for imageOnly image 2", event, identifier);
              }}
            />

            {renderStyledText("3.Adobe default image, dismiss style circle - card height 400")}
            <ContentView 
              key="3" 
              data={IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE}
              cardHeight={400}
              listener={(event, identifier) => {
                console.log("Event triggered: - for imageOnly image 3", event, identifier);
              }}
            />

            {renderStyledText("4. No dismiss button - no card height")}
            <ContentView
              key="4"
              data={IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON}
            />

            {renderStyledText("5. [image] Invalid")}
            <ContentView
              key="5"
              data={IMAGE_ONLY_CONTENT_INVALID_IMAGE}
              cardHeight={200}
            />


            {renderStyledText("6.[action] No actionUrl")}
            <ContentView
              key="6"
              data={IMAGE_ONLY_CONTENT_NO_ACTION}
              cardHeight={200}
            />

            {renderStyledText("7.[style] Custom aspect ratio (1:1)")}
            <ContentView
              key="7"
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              cardHeight={200}
              styleOverrides={{
                imageOnlyStyle: {
                  image: {
                    aspectRatio:  1/ 1,
                  },
                },
              }}
              listener={(event, identifier) => {
                console.log("Event triggered: - for imageOnly image 7", event, identifier);
              }}
            />

            {renderStyledText("8.[style] Custom height (150)")}
            <ContentView
                key="8"
                data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
                cardHeight={400}
                styleOverrides={{
                  imageOnlyStyle: {
                    image: {
                      height: 150,
                    },
                  },
                }}
              />

            {renderStyledText("9. [style] Custom width (80%), set image container backgroud color")}
            <ContentView
              key="9"
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              cardHeight={200}
              styleOverrides={{
                imageOnlyStyle: {
                  image: {
                    width: "80%",
                  },
                  imageContainer: {
                    backgroundColor: "#79f4bbff",
                  },
                },
              }}
            />

            {renderStyledText("10. [style] Card customization")}
            <ContentView
              key="10"
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              cardHeight={400}
              styleOverrides={{
                imageOnlyStyle: {
                  card: {
                    borderRadius: 80,
                    margin: 30,
                  },
                   image: {
                    width: '50%',
                    resizeMode: 'stretch'
                  },
                },
              }}
            />

            {renderStyledText("11.[style] Image container customization")}
            <ContentView
              key="11"
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              cardHeight={200}
              styleOverrides={{
                imageOnlyStyle: {
                  imageContainer: {
                    borderRadius: 15,
                    borderWidth: 5,
                    borderColor: "#FF69B4",
                    maxHeight: 100,
                  },
                   image: {
                    resizeMode: "center",
                    backgroundColor: "#79f4bbff",
                  },
                },
              }}
            />

            {renderStyledText("12.[style] Combined styles")}
            <ContentView
              key="12"
              data={IMAGE_ONLY_CONTENT_ALL_FIELDS}
              cardHeight={200}
              styleOverrides={{
                imageOnlyStyle: {
                  card: {
                    margin: 5,
                    borderRadius: 0,
                  },
                  imageContainer: {
                    backgroundColor: "#E6E6FA",
                    minHeight: 180,
                  },
                  image: {
                    resizeMode: "cover",
                  },
                },
              }}
            />

            {renderStyledText("13.[image] No darkUrl (only light mode)")}
            <ContentView
              key="13"
              data={IMAGE_ONLY_CONTENT_NO_DARK_URL}
              cardHeight={200}
            />

            {renderStyledText("1.[image] No Light Mode (only dark mode) - no actionUrl")}
            <ContentView
              key="15"
              data={IMAGE_ONLY_CONTENT_NO_LIGHT_MODE}
              cardHeight={300}
            />
            <View style={{ height: 200 }} />
          </View>
        )}
        {selectedView === "Remote" && (
          <View>
            {renderStyledText("[Remote] cards")}
            {content &&
              content.map((item) => (
                <ContentView
                  key={item.id}
                  data={item}
                  cardHeight={210}
                  styleOverrides={{
                    smallImageStyle: {
                      title: {
                        numberOfLines: 2,
                      },
                      body: {
                        numberOfLines: 4,
                      },
                    },
                  }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ContentCardView;

const SMALL_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: "small-image-all-fields",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    image: {
      alt: "",
      url: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
      darkUrl: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
    },
    buttons: [
      {
        interactId: "downloadClicked",
        actionUrl: "https://nba.com",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        text: {
          content: "Download App",
        },
      },
      {
        interactId: "OK",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        text: {
          content: "OK",
        },
      },
    ],
    dismissBtn: {
      style: "circle",
    },
    actionUrl: "",
    body: {
      content:
        "Get live scores, real-time updates, and exclusive content right at your fingertips.",
    },
    title: {
      content: "Stay connected to all the action",
    },
  },
};
const SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: "small-image-all-fields",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    image: {
      alt: "",
      url: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
      darkUrl: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
    },
    buttons: [
      {
        interactId: "downloadClicked",
        actionUrl: "https://nba.com",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        text: {
          content: "Download App",
        },
      },
    ],
    actionUrl: "",
    body: {
      content:
        "Get live scores, real-time updates, and exclusive content right at your fingertips.",
    },
    title: {
      content: "Stay connected to all the action",
    },
  },
};

const SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE: ContentTemplate = {
  id: "small-image-dismiss-button-simple",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    image: {
      alt: "",
      url: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
      darkUrl: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
    },
    buttons: [
      {
        interactId: "downloadClicked",
        actionUrl: "https://nba.com",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        text: {
          content: "Download App",
        },
      },
      {
        interactId: "OK",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        text: {
          content: "OK",
        },
      },
    ],
    dismissBtn: {
      style: "simple",
    },
    actionUrl: "",
    body: {
      content:
        "Get live scores, real-time updates, and exclusive content right at your fingertips.",
    },
    title: {
      content: "Stay connected to all the action",
    },
  },
};

const SMALL_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: "small-image-invalid-image",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    body: {
      content:
        "Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    title: {
      content: "Get Ready for the Basketball Season Kickoff!",
    },
    buttons: [
      {
        interactId: "buy",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        actionUrl: "https://nba.com",
        text: {
          content: "Get Season Pass",
        },
      },
    ],
    actionUrl: "",
    dismissBtn: {
      style: "circle",
    },
    image: {
      darkUrl:
        "https://static-00.iconduck.com/assets.00/basketball-icon-256x256-vydm63md.png",
      alt: "",
      url: "https://static-00.iconduck.com/assets.00/basketball-icon-256x256-vydm63md.png",
    },
  },
};

const SMALL_IMAGE_CONTENT_IMAGE_DARK_URL: ContentTemplate = {
  id: "small-image-invalid-image",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    title: {
      content: "Get Ready for the Basketball Season Kickoff!",
    },
    buttons: [
      {
        interactId: "buy",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        actionUrl: "https://nba.com",
        text: {
          content: "Get Season Pass",
        },
      },
    ],
    actionUrl: "",
    dismissBtn: {
      style: "circle",
    },
    image: {
      darkUrl:
        "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
    },
  },
};
const SMALL_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
  id: "small-image-invalid-image",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    body: {
      content:
        "Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    title: {
      content: "Get Ready for the Basketball Season Kickoff!",
    },
    buttons: [
      {
        interactId: "buy",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        actionUrl: "https://nba.com",
        text: {
          content: "Buyyyyy",
        },
      },
      {
        interactId: "ok",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        actionUrl: "https://nba.com",
        text: {
          content: "OK",
        },
      },
      {
        interactId: "more",
        id: "5b4d53f5-45bd-4e5c-a5cb-6e650b1993f6",
        actionUrl: "https://nba.com",
        text: {
          content: "More",
        },
      },
    ],
    actionUrl: "",
    dismissBtn: {
      style: "circle",
    },
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
    },
  },
};
const SMALL_IMAGE_CONTENT_NO_BUTTON: ContentTemplate = {
  id: "small-image-invalid-image",
  type: TemplateType.SMALL_IMAGE,
  smallImageData: {
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    title: {
      content: "Get Ready for the Basketball Season Kickoff!",
    },
    buttons: [],
    actionUrl: "",
    dismissBtn: {
      style: "circle",
    },
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
    },
  },
};

const LARGE_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked",
        text: {
          content: "ButtonTextOne",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
      darkUrl: "",
    },
    dismissBtn: {
      style: "simple",
    },
    title: {
      content: "This is large image title",
    },
  },
};

const LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked",
        text: {
          content: "ButtonTextOne",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
    },
    dismissBtn: {
      style: "none",
    },
    title: {
      content: "This is large image title",
    },
  },
};

const LARGE_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked",
        text: {
          content: "ButtonTextOne",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://xxx",
      darkUrl: "https://imageurl.com/dark",
    },
    dismissBtn: {
      style: "none",
    },
    title: {
      content: "This is large image title",
    },
  },
};

const LARGE_IMAGE_CONTENT_DARK_URL: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked",
        text: {
          content: "ButtonTextOne",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
      darkUrl:
        "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
    },
    dismissBtn: {
      style: "none",
    },
    title: {
      content: "This is large image title",
    },
  },
};

const LARGE_IMAGE_CONTENT_LONG_TITLE: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked",
        text: {
          content: "ButtonTextOne",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
      darkUrl:
        "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
    },
    dismissBtn: {
      style: "none",
    },
    title: {
      content:
        "This is large image title, it's very long very long very long very long",
    },
  },
};
const LARGE_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
  id: "large-image-all-fields",
  type: TemplateType.LARGE_IMAGE,
  largeImageData: {
    actionUrl: "https://cardaction.com",
    body: {
      content:
        "🎟️ Tickets are on sale now! Don’t miss out on securing your seat to witness the high-flying action from the best players in the game",
    },
    buttons: [
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        actionUrl: "https://buttonone.com/action",
        interactId: "buttonOneClicked_1",
        text: {
          content: "ButtonOne",
        },
      },
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        interactId: "buttonOneClicked_2",
        text: {
          content: "ButtonTwo",
        },
      },
      {
        id: "a41d1bff-2797-4958-a6d7-2b367e055795",
        interactId: "buttonOneClicked_3",
        text: {
          content: "ButtonThreeeeeeeee",
        },
      },
    ],
    image: {
      alt: "",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
    },
    dismissBtn: {
      style: "simple",
    },
    title: {
      content: "This is large image title",
    },
  },
};

const IMAGE_ONLY_CONTENT_ALL_FIELDS: ContentTemplate = {
  id: "image-only-all-fields",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://www.adobe.com/",
    image: {
      url: "https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg",
      alt: "flight offer",
    },
    dismissBtn: {
      style: "simple",
    },
  },
};

const IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
  id: "image-only-no-dismiss",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://google.com",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg",
      alt: "flight offer",
    },
  },
};

const IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE: ContentTemplate = {
  id: "image-only-dismiss-circle",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://google.com",
    image: {
      url: "https://i.ibb.co/0X8R3TG/Messages-24.png",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
      alt: "flight offer",
    },
    dismissBtn: {
      style: "circle",
    },
  },
};

const IMAGE_ONLY_CONTENT_INVALID_IMAGE: ContentTemplate = {
  id: "image-only-invalid-image",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://google.com",
    image: {
      url: "https://invalid-url-that-will-fail",
      darkUrl: "https://another-invalid-url",
      alt: "broken image",
    },
    dismissBtn: {
      style: "simple",
    },
  },
};


const IMAGE_ONLY_CONTENT_NO_ACTION: ContentTemplate = {
  id: "image-only-no-action",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8gAa1wUx9Ox2M6cZNwUJe32xE-l_4oqPVA&s",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg",
      alt: "non-clickable image",
    },
    dismissBtn: {
      style: "simple",
    },
  },
};

const IMAGE_ONLY_CONTENT_NO_DARK_URL: ContentTemplate = {
  id: "image-only-no-dark-url",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://google.com",
    image: {
      url: "https://cdn-icons-png.flaticon.com/256/3303/3303838.png",
      alt: "light mode only image",
    },
    dismissBtn: {
      style: "simple",
    },
  },
};

const IMAGE_ONLY_CONTENT_NO_LIGHT_MODE: ContentTemplate = {
  id: "image-only-different-image",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    image: {
      url: "",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
      alt: "basketball icon",
    },
    dismissBtn: {
      style: "circle",
    },
  },
};

const IMAGE_ONLY_CONTENT_WITH_ACTION_URL: ContentTemplate = {
  id: "image-only-with-action-url",
  type: TemplateType.IMAGE_ONLY,
  imageOnlyData: {
    actionUrl: "https://google.com",
    image: {
      url: "https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg",
      darkUrl: "https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*",
      alt: "with action URL - Google Images",
    },
    dismissBtn: {
      style: "simple",
    },
  },
};
