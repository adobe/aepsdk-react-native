/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import React, { cloneElement, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useContentCardUI } from "../../hooks";
import InboxProvider, {
  InboxSettings
} from "../../providers/InboxProvider";
import { useTheme } from "../../theme";
import { ContentViewEvent } from "../../types/ContentViewEvent";
import { ContentTemplate } from "../../types/Templates";
import { generateCardHash } from "../../utils/generateCardHash";
import { loadInboxState, saveInboxState } from "../../utils/inboxStorage";
import { ContentCardView, ContentViewProps } from "../ContentCardView/ContentCardView";
import EmptyState from "./EmptyState";

// TODO: consider localizing in the future
const DEFAULT_EMPTY_MESSAGE = 'No Content Available';

const cardStatusStore = new Map<string, { dismissed: Set<string>; interacted: Set<string> }>();

export interface InboxProps<T> extends Partial<FlatListProps<T>> {
  LoadingComponent?: ReactElement | null;
  ErrorComponent?: ReactElement | null;
  FallbackComponent?: ReactElement | null;
  EmptyComponent?: ReactElement | null;
  surface: string;
  settings: InboxSettings | null;
  isLoading?: boolean;
  error?: boolean;
  CardProps?: Partial<ContentViewProps>;
}

function InboxInner<T extends ContentTemplate>({
  contentContainerStyle,
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  EmptyComponent,
  settings,
  surface,
  style,
  CardProps,
  ListHeaderComponent,
  ...props
}: InboxProps<T> & {
  settings: InboxSettings;
}) {
  const { colors, isDark } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const { content, error, isLoading } = useContentCardUI(surface);

  const { content: contentSettings } = settings;
  const { capacity, heading, layout, emptyStateSettings, isUnreadEnabled } = contentSettings;

  const getStore = useCallback(() => {
    if (!cardStatusStore.has(surface)) {
      cardStatusStore.set(surface, { dismissed: new Set(), interacted: new Set() });
    }
    return cardStatusStore.get(surface)!;
  }, [surface]);

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set(getStore().dismissed));
  const [interactedIds, setInteractedIds] = useState<Set<string>>(() =>
    isUnreadEnabled ? new Set(getStore().interacted) : new Set());

  const [storageLoaded, setStorageLoaded] = useState(false);
  useEffect(() => {
    const activityId = settings.activityId;
    if (!activityId) {
      setStorageLoaded(true);
      return;
    }
    let cancelled = false;
    loadInboxState(activityId).then((persisted) => {
      if (cancelled) return;
      const store = getStore();
      persisted.dismissed.forEach((id) => store.dismissed.add(id));
      persisted.interacted.forEach((id) => store.interacted.add(id));
      setDismissedIds(new Set(store.dismissed));
      if (isUnreadEnabled) setInteractedIds(new Set(store.interacted));
      setStorageLoaded(true);
    });
    return () => { cancelled = true; };
  }, [settings.activityId, isUnreadEnabled, getStore]);

  useEffect(() => {
    if (!storageLoaded) return;
    const store = getStore();
    setDismissedIds(new Set(store.dismissed));
    if (isUnreadEnabled) setInteractedIds(new Set(store.interacted));
  }, [content, isUnreadEnabled, getStore, storageLoaded]);

  const isHorizontal = layout?.orientation === 'horizontal';

  const displayCards = useMemo(() => {
    if (!content) return [] as T[];
    return content
      .filter((it) => !dismissedIds.has(generateCardHash(it)))
      .map((it) => {
        const cardHash = generateCardHash(it);
        const shouldBeRead = isUnreadEnabled && (interactedIds.has(cardHash) || it.isRead === true);
        return shouldBeRead ? { ...it, isRead: true } : it;
      })
      .slice(0, capacity) as T[];
  }, [content, capacity, isUnreadEnabled, dismissedIds, interactedIds]);

  const handleCardEvent = useCallback((event?: ContentViewEvent, data?: ContentTemplate, nativeEvent?: any) => {
    const cardHash = generateCardHash(data);
    const store = getStore();
    if (event === 'onDismiss' && !store.dismissed.has(cardHash)) {
      store.dismissed.add(cardHash);
      setDismissedIds((prev) => new Set(prev).add(cardHash));
      if (settings.activityId) {
        saveInboxState(settings.activityId, {
          dismissed: [...store.dismissed],
          interacted: [...store.interacted],
        });
      }
    } else if (event === 'onInteract' && isUnreadEnabled && !store.interacted.has(cardHash)) {
      store.interacted.add(cardHash);
      setInteractedIds((prev) => new Set(prev).add(cardHash));
      if (settings.activityId) {
        saveInboxState(settings.activityId, {
          dismissed: [...store.dismissed],
          interacted: [...store.interacted],
        });
      }
    }
    CardProps?.listener?.(event, data, nativeEvent);
  }, [CardProps, isUnreadEnabled, getStore, settings.activityId]);

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => (
    <ContentCardView
      template={item}
      {...CardProps}
      listener={handleCardEvent}
      style={isHorizontal ? [styles.horizontalCardStyles, { width: Math.floor(windowWidth * 0.75) }] : undefined}
    />
  ), [isHorizontal, CardProps, windowWidth, handleCardEvent]);

  const EmptyList = useCallback(() => EmptyComponent ?
    cloneElement(EmptyComponent, { ...emptyStateSettings }) as React.ReactElement :
    <EmptyState
      image={isDark ? emptyStateSettings?.image?.darkUrl ?? '' : emptyStateSettings?.image?.url ?? ''}
      text={emptyStateSettings?.message?.content || DEFAULT_EMPTY_MESSAGE}
    />, [isDark, emptyStateSettings, EmptyComponent]);

  if (isLoading) return LoadingComponent;
  if (error) return ErrorComponent;
  if (!content) return FallbackComponent;

  const topOfInbox =
      <View>
        {ListHeaderComponent && ListHeaderComponent as React.ReactElement}
        {heading?.content ? (
        <Text
          accessibilityRole="header"
          style={[styles.heading, { color: colors.textPrimary }]}
        >
          {heading.content}
        </Text>
      ) : null}
      </View>


  const listBody = (
    <FlatList
      {...props}
      data={displayCards}
      keyExtractor={(item: { id: string }) => item.id}
      contentContainerStyle={[
        contentContainerStyle,
        isHorizontal && styles.horizontalListContent,
        styles.inbox
      ]}
      horizontal={isHorizontal}
      renderItem={renderItem}
      ListEmptyComponent={<EmptyList />}
      ListHeaderComponent={!isHorizontal && ListHeaderComponent ? topOfInbox : undefined}
    />
  );

  const horizontalChrome =
    isHorizontal ? (
      isLandscape ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {topOfInbox}
          {listBody}
        </ScrollView>
      ) : (
        <View>
          {topOfInbox}
          {listBody}
        </View>
      )
    ) : listBody;

  return <InboxProvider settings={settings}>{horizontalChrome}</InboxProvider>;
}

export function Inbox<T extends ContentTemplate>({
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  surface,
  settings,
  isLoading,
  error,
  ...props
}: InboxProps<T>): React.ReactElement {

  if (isLoading) return LoadingComponent as React.ReactElement;
  if (error) return ErrorComponent as React.ReactElement;
  if (!settings) return FallbackComponent as React.ReactElement;;

  return (
    <InboxInner
      settings={settings}
      surface={surface}
      LoadingComponent={LoadingComponent}
      ErrorComponent={ErrorComponent}
      FallbackComponent={FallbackComponent}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  inbox: {
    flexGrow: 1
  },
  heading: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16
  },
  horizontalCardStyles: {
    flex: 0
  },
  horizontalListContent: {
    alignItems: 'center'
  }
});
