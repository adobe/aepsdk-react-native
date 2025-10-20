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

import { MobileCore } from "@adobe/react-native-aepcore";
import {
  ContentCardContainer,
  ContentCardView,
  ThemeProvider,
  useContentCardUI,
  useContentContainer
} from "@adobe/react-native-aepmessaging";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Appearance,
  ColorSchemeName,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";
import {
  DemoItem,
  IMAGE_ONLY_ITEMS,
  LARGE_ITEMS,
  SMALL_ITEMS,
} from "../templates/contentCards/demoitems";

const VIEW_OPTIONS = [
  "SmallImage",
  "LargeImage",
  "ImageOnly",
  "Remote",
] as const;
type ViewOption = (typeof VIEW_OPTIONS)[number];

const THEME_OPTIONS: Array<{
  label: string;
  value: ColorSchemeName;
}> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: null },
];

const ITEMS_BY_VIEW: Partial<Record<ViewOption, DemoItem[]>> = {
  SmallImage: SMALL_ITEMS,
  LargeImage: LARGE_ITEMS,
  ImageOnly: IMAGE_ONLY_ITEMS,
};

const StyledText = ({ text }: { text: string }) => {
  return <Text style={[styles.infoText, styles.textCenter]}>{text}</Text>;
};

const Header = ({
  isLoading,
  onTrackAction,
  selectedView,
  setSelectedView
}: {
  isLoading: boolean;
  onTrackAction: () => void;
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
}) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("System");
  const [trackInput, setTrackInput] = useState("");
  const colorScheme = useColorScheme();

  const handleThemeChange = useCallback(
    (theme: string, value: ColorSchemeName) => {
      setSelectedTheme(theme);
      Appearance.setColorScheme(value);
    },
    []
  );

  // Track action and refresh content cards
  const handleTrackAction = useCallback(async () => {
    if (!trackInput.trim()) {
      return;
    }

    MobileCore.trackAction(trackInput);
    await onTrackAction();
  }, [trackInput, onTrackAction]);

  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View>
      {/* View Picker */}
      <View style={[styles.section, styles.panel, { backgroundColor: colors.background, borderColor: colors.panelBorder }]}>
        <Text style={[styles.titleText, { color: colors.text }]}>Select View Type</Text>
        <TouchableOpacity
          style={[styles.buttonNeutral, { borderColor: colors.panelBorder, backgroundColor: colors.inputBg }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: colors.text }}>{selectedView}</Text>
        </TouchableOpacity>
      </View>

      {/* Track Action Input */}
      <View style={[styles.section, styles.panel, { backgroundColor: colors.background, borderColor: colors.panelBorder }]}>
        <Text style={[styles.titleText, { color: colors.text }]}>Track Action</Text>
        <View style={[styles.rowCenter, styles.trackRow]}>
          <TextInput
            style={[styles.trackInput, { borderColor: colors.inputBorder, color: colors.text }]}
            value={trackInput}
            onChangeText={setTrackInput}
            placeholder="Enter action name"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.buttonPrimary, { backgroundColor: colors.tint }]}
            onPress={handleTrackAction}
            disabled={!trackInput.trim() || isLoading}
          >
            <Text style={[styles.trackButtonText, { color: colorScheme === 'dark' ? '#000' : '#fff' }]}>
              {isLoading ? 'Loading...' : 'Track'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Switcher */}
      <View style={[styles.section, styles.panel, { backgroundColor: colors.background, borderColor: colors.panelBorder }]}>
        <Text style={[styles.titleText, { color: colors.text }]}>Theme</Text>
        <View style={[styles.themeSwitcher, { backgroundColor: colors.inputBg, borderColor: colors.panelBorder, borderWidth: 1 }]}>
          {THEME_OPTIONS.map(({ label, value }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.themeOption,
                selectedTheme === label
                  ? [styles.themeOptionSelected, { backgroundColor: colors.tint }]
                  : styles.themeOptionUnselected,
              ]}
              onPress={() => handleThemeChange(label, value)}
            >
              <Text style={[styles.textLabel, { color: selectedTheme === label ? (colorScheme === 'dark' ? '#000' : '#fff') : colors.text }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* View Picker Modal */}
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            {VIEW_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedView(option);
                  setShowPicker(false);
                }}
              >
                <Text style={{ color: colors.text }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const MemoHeader = memo(Header);

const ContentCardsView = () => {
  const [selectedView, setSelectedView] = useState<ViewOption>('Remote');

  const surface =
    Platform.OS === "android"
      ? "rn/android/remote_image"
      : "rn/ios/remote_image";
  const { isLoading, refetch } = useContentCardUI(surface);
  const { 
    settings, 
    error, 
    isLoading: isLoadingContainer, 
    refetch: refetchContainer 
  } = useContentContainer(surface);

  const items = ITEMS_BY_VIEW[selectedView];

  useEffect(() => {
    MobileCore.trackAction("small_image");
  }, []);

  if (selectedView === 'Remote') {
    return (
      <>
        <MemoHeader
          isLoading={isLoading}
          onTrackAction={refetchContainer}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
        <ContentCardContainer
          surface={surface}
          settings={settings}
          isLoading={isLoadingContainer}
          error={error}
          contentContainerStyle={styles.listContent}
          refetch={refetchContainer}
        />
      </>
    );
  }

  const renderContentCard = (item: any, isRemote: boolean) => {
    const cardView = <ContentCardView 
      template={isRemote ? item : item.template}
      styleOverrides={!isRemote ? item.styleOverrides : undefined}
      listener={!isRemote ? item.listener : undefined}
    />;

    if (!isRemote) {
      return (
        <View>
          <StyledText text={item.renderText} />
          {item.customThemes ? (
            <ThemeProvider customThemes={item.customThemes as any}>
              {cardView}
            </ThemeProvider>
          ) : (
            cardView
          )}
        </View>
      );
    }
    return cardView;
  };

  return (
    <FlatList
      data={items || []}
      keyExtractor={(item: any) => item.key}
      renderItem={({ item }: any) => 
        renderContentCard(item, false)
      }
      ListHeaderComponent={
        <MemoHeader 
          isLoading={isLoading} 
          onTrackAction={refetch}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      }
      contentContainerStyle={styles.listContent}
    />
  );
};
export default ContentCardsView;

const SPACING = { s: 10, m: 20, l: 24 };

const styles = StyleSheet.create({
  infoText: {
    color: "darkgray",
    fontSize: 18,
    paddingTop: SPACING.s,
    paddingBottom: SPACING.s,
  },
  themeSwitcher: {
    width: "80%",
    borderRadius: 12,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  themeOptionSelected: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  themeOptionUnselected: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  textLabel: {
    fontSize: 14,
  },
  buttonNeutral: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: SPACING.s,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: SPACING.s,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    borderRadius: 10,
    padding: SPACING.m,
    backgroundColor: "white",
    width: "80%",
  },
  modalOption: {
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalCancel: {
    paddingVertical: SPACING.s,
    marginTop: SPACING.s,
  },
  modalCancelText: {
    color: "#FF3B30",
  },
  panel: {
    borderRadius: SPACING.s,
    borderWidth: 1,
    padding: 15,
  },
  titleText: {
    fontWeight: "600",
    marginBottom: SPACING.s,
  },
  textCenter: {
    textAlign: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackRow: {
    marginBottom: SPACING.s,
  },
  trackInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: SPACING.s,
  },
  trackButtonText: {
    color: "white",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: SPACING.l,
  },
});