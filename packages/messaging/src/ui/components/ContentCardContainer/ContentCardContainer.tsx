import { cloneElement, ReactElement, useCallback, useMemo, useState } from "react";
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
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { useTheme } from "../../theme";
import { ContentViewEvent } from "../../types/ContentViewEvent";
import { ContentTemplate } from "../../types/Templates";
import { ContentCardView, ContentViewProps } from "../ContentCardView/ContentCardView";
import EmptyState from "./EmptyState";

// TODO: consider localizing in the future
const DEFAULT_EMPTY_MESSAGE = 'No Content Available';

export interface ContentCardContainerProps<T> extends Partial<FlatListProps<T>> {
  LoadingComponent?: ReactElement | null;
  ErrorComponent?: ReactElement | null;
  FallbackComponent?: ReactElement | null;
  EmptyComponent?: ReactElement | null;
  surface: string;
  settings: ContainerSettings | null;
  isLoading?: boolean;
  error?: boolean;
  CardProps?: Partial<ContentViewProps>;
}

function ContentCardContainerInner<T extends ContentTemplate>({
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
}: ContentCardContainerProps<T> & {
  settings: ContainerSettings;
}) {
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { content, error, isLoading } = useContentCardUI(surface);

  const { content: contentSettings } = settings;
  const { capacity, heading, layout, emptyStateSettings } = contentSettings;

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);

  const displayCards = useMemo(() => {
    const items = (content ?? []) as any[];
    return items.filter((it) => it && !dismissedIds.has(it.id)).slice(0, capacity) as T[];
  }, [content, dismissedIds, capacity]);

  const handleCardEvent = useCallback(
    (event?: ContentViewEvent, data?: ContentTemplate, nativeEvent?: any) => {
      if (event === 'onDismiss' && data?.id) {
        setDismissedIds((prev) => {
          const next = new Set(prev);
          next.add(data.id as any);
          return next;
        });
      }
      CardProps?.listener?.(event, data, nativeEvent);
    },
    [CardProps]
  );

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return (
      <ContentCardView
        template={item}
        {...CardProps}
        listener={handleCardEvent}
        style={
          isHorizontal 
            ? [styles.horizontalCardStyles, { width: Math.floor(windowWidth * 0.75) }]
            : undefined
          }
      />
    );
  }, [isHorizontal, CardProps, windowWidth, handleCardEvent]);

  const EmptyList = useCallback(() => {
    return (
      EmptyComponent ? cloneElement(EmptyComponent, {
        ...emptyStateSettings,
      }) as React.ReactElement : (
        <EmptyState
          image={
            isDark
              ? emptyStateSettings?.image?.darkUrl ?? ''
              : emptyStateSettings?.image?.url ?? ''
          }
          text={
            emptyStateSettings?.message?.content ||
            DEFAULT_EMPTY_MESSAGE
          }
        />
      )
    )
  }, [isDark, emptyStateSettings, EmptyComponent]);

  if (isLoading) {
    return LoadingComponent;
  }

  if (error) {
    return ErrorComponent;
  }

  if (!content) {
    return FallbackComponent;
  }

  return (
    <ContentCardContainerProvider settings={settings}>
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
          styles.container
        ]}
        horizontal={isHorizontal}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList />}
      />
    </ContentCardContainerProvider>
  );
}

export function ContentCardContainer<T extends ContentTemplate>({
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  surface,
  settings,
  isLoading,
  error,
  ...props
}: ContentCardContainerProps<T>): React.ReactElement {

  if (isLoading) {
    return LoadingComponent as React.ReactElement;
  }

  if (error) {
    return ErrorComponent as React.ReactElement;
  }

  if (!settings) {
    return FallbackComponent as React.ReactElement;
  }

  return (
    <ContentCardContainerInner
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
  container: {
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
