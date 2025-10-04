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
  ContentCardView,
  ThemeProvider,
  useContentCardUI,
  Pagination,
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

  return <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />;
};

const MemoHeader = memo(Header);

const ContentCardsView = () => {
  const [selectedView, setSelectedView] = useState<ViewOption>('Remote');
  const [trackInput, setTrackInput] = useState('');
  const colorScheme = useColorScheme();
  const [currentPage, setCurrentPage] = useState(1);

  const surface =
    Platform.OS === "android"
      ? "rn/android/remote_image"
      : "rn/ios/remote_image";
  const { content, isLoading, refetch } = useContentCardUI(surface);

  const items = ITEMS_BY_VIEW[selectedView];

  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    MobileCore.trackAction("small_image");
  }, []);

  return (
    <FlatList
      data={selectedView !== 'Remote' ? items || [] : content || []}
      keyExtractor={(item: any) =>
        selectedView !== 'Remote' ? item.key : item.id
      }
      renderItem={({ item }: any) => {
        if (selectedView !== 'Remote') {
          const node = (
            <ContentCardView
              template={item.template}
              styleOverrides={item.styleOverrides}
              listener={item.listener}
            />
          );
          return (
            <View>
              <StyledText text={item.renderText} />
              {item.customThemes ? (
                <ThemeProvider customThemes={item.customThemes as any}>
                  {node}
                </ThemeProvider>
              ) : (
                node
              )}
            </View>
          );
        }
        return <ContentCardView template={item} />;
      }}
      ListHeaderComponent={
        <MemoHeader 
          isLoading={isLoading} 
          onTrackAction={refetch}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      }
      ListEmptyComponent={() =>
        selectedView === 'Remote' && (
          <View
            style={[
              styles.section,
              styles.panel,
              { backgroundColor: colors.background, borderWidth: 0 },
              styles.emptyContainer
            ]}
          >
            <Text
              style={[
                styles.titleText,
                styles.textCenter,
                styles.textTitle,
                { color: colors.text }
              ]}
            >
              No Content Cards Available
            </Text>
            <Text
              style={[
                styles.textCenter,
                styles.textBody,
                styles.textLabel,
                { color: colors.mutedText }
              ]}
            >
              Content cards will appear here when they are configured in Adobe
              Journey Optimizer for surface: "rn/ios/remote_image"
            </Text>
            <Text
              style={[
                styles.textCenter,
                styles.textCaption,
                { color: colors.mutedText }
              ]}
            >
              Try tracking an action above to refresh content cards.
            </Text>
          </View>
        )
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
  headerContainer: {
    marginTop: 60,
    marginBottom: 15,
    alignItems: "center",
  },
  themeSwitcher: {
    width: "65%",
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
  textTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  textBody: {
    fontSize: 14,
    lineHeight: SPACING.m,
  },
  textCaption: {
    fontSize: 12,
    fontStyle: "italic",
  },
  textLabel: {
    fontSize: 14,
  },
  buttonNeutral: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: SPACING.s,
    backgroundColor: "#fff",
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
  emptyContainer: {
    borderRadius: SPACING.s,
    padding: SPACING.m,
    margin: SPACING.m,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: SPACING.l,
  },
});
