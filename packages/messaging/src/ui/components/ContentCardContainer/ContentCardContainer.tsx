import { cloneElement, ReactElement, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions
} from "react-native";
import { useContentCardUI } from "../../hooks";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentTemplate } from "../../types/Templates";
import { ContentCardView, ContentViewProps } from "../ContentCardView/ContentCardView";
import EmptyState from "./EmptyState";

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
  refetch?: () => Promise<void>;
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
  refetch,
  ...props
}: ContentCardContainerProps<T> & {
  settings: ContainerSettings;
}) {
  const colorScheme = useColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const { content, error, isLoading } = useContentCardUI(surface);

  const { content: contentSettings } = settings;
  const { capacity, heading, layout, emptyStateSettings } = contentSettings;

  const [dismissedIds, setDismissedIds] = useState(new Set());

  const headingColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);

  const displayCards = useMemo(() => {
    const items = (content ?? []) as any[];
    return items.filter((it) => it && !dismissedIds.has(it.id)).slice(0, capacity) as T[];
  }, [content, dismissedIds, capacity]);

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return (
      <ContentCardView
        template={item}
        {...CardProps}
        listener={(...args) => {
          const [event] = args;
          if (event === 'onDismiss') {
            setDismissedIds((prev) => {
              const next = new Set(prev);
              next.add((item as any)?.id);
              return next;
            });
          }
          CardProps?.listener?.(...args);
        }}
        style={[
          isHorizontal && [
            styles.horizontalCardStyles,
            { width: Math.floor(windowWidth * 0.75) },
          ],
        ]}
      />
    );
  }, [isHorizontal, CardProps, windowWidth]);

  if (isLoading) {
    return LoadingComponent;
  }

  if (error) {
    return ErrorComponent;
  }

  if (!content) {
    return FallbackComponent;
  }

  const EmptyList = () => {
    return (
      EmptyComponent ? cloneElement(EmptyComponent, {
        ...emptyStateSettings,
      }) as React.ReactElement : (
        <EmptyState
          image={
            colorScheme === 'dark'
              ? emptyStateSettings?.image?.darkUrl ?? ''
              : emptyStateSettings?.image?.url ?? ''
          }
          text={
            emptyStateSettings?.message?.content ||
            "No Content Available"
          }
        />
      )
    )
  }

  return (
    <ContentCardContainerProvider settings={settings}>
      <Text accessibilityRole="header" style={[styles.heading, { color: headingColor }]}>{heading.content}</Text>
      <FlatList
        {...props}
        data={displayCards}
        extraData={refetch}
        contentContainerStyle={[
          contentContainerStyle, 
          isHorizontal && styles.horizontalListContent, 
          { flexGrow: 1 }
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
