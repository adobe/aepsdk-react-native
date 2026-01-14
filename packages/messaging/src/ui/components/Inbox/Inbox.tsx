import { cloneElement, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  Text,
  useWindowDimensions
} from "react-native";
import { useContentCardUI } from "../../hooks";
import InboxProvider, {
  InboxSettings
} from "../../providers/InboxProvider";
import { useTheme } from "../../theme";
import { ContentViewEvent } from "../../types/ContentViewEvent";
import { ContentTemplate } from "../../types/Templates";
import { generateCardHash } from "../../utils/generateCardHash";
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
  ...props
}: InboxProps<T> & {
  settings: InboxSettings;
}) {
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
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

  useEffect(() => {
    const store = getStore();
    setDismissedIds(new Set(store.dismissed));
    if (isUnreadEnabled) setInteractedIds(new Set(store.interacted));
  }, [content, isUnreadEnabled, getStore]);

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
    } else if (event === 'onInteract' && isUnreadEnabled && !store.interacted.has(cardHash)) {
      store.interacted.add(cardHash);
      setInteractedIds((prev) => new Set(prev).add(cardHash));
    }
    CardProps?.listener?.(event, data, nativeEvent);
  }, [CardProps, isUnreadEnabled, getStore]);

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

  return (
    <InboxProvider settings={settings}>
      {heading?.content ? (
        <Text
          accessibilityRole="header"
          style={[styles.heading, { color: colors.textPrimary }]}
        >
          {heading.content}
        </Text>
      ) : null}

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
      />
    </InboxProvider>
  );
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
  },
});
