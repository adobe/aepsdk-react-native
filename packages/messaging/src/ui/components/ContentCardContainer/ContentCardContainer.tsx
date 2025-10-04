import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  useColorScheme,
} from "react-native";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentCardView } from "../ContentCardView/ContentCardView";
import { ContentTemplate } from "../../types/Templates";
import { cloneElement, ReactElement, useCallback } from "react";
import { useContentCardUI, useContentContainer } from "../../hooks";
import EmptyState from "./EmptyState";

export interface ContentCardContainerProps<T> extends FlatListProps<T> {
  LoadingComponent?: ReactElement | null;
  ErrorComponent?: ReactElement | null;
  FallbackComponent?: ReactElement | null;
  EmptyComponent?: ReactElement | null;
  surface: string;
}

function ContentCardContainerInner<T>({
  contentContainerStyle,
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  EmptyComponent,
  settings,
  surface,
  style,
  ...props
}: ContentCardContainerProps<T> & {
  settings: ContainerSettings;
}) {
  const colorScheme = useColorScheme();
  const { content, error, isLoading } = useContentCardUI(surface);

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return <ContentCardView template={item as ContentTemplate} />;
  }, []);

  if (isLoading) {
    return LoadingComponent;
  }

  if (error) {
    return ErrorComponent;
  }

  if (!content) {
    return FallbackComponent;
  }

  if (content.length === 0) {
    const emptyProps = settings?.content?.emptyStateSettings;

    if (EmptyComponent) {
      return cloneElement(EmptyComponent, {
        ...emptyProps,
      }) as React.ReactElement;
    }

    return (
      <EmptyState
        image={emptyProps?.image?.[colorScheme ?? "light"]?.url}
        text={
          settings?.content?.emptyStateSettings?.message?.content ||
          "No Content Available"
        }
      />
    );
  }

  return (
    <ContentCardContainerProvider settings={settings}>
      <FlatList
        {...props}
        data={content as T[]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        horizontal={settings?.content?.layout?.orientation === "horizontal"}
        renderItem={renderItem}
      />
    </ContentCardContainerProvider>
  );
}

export function ContentCardContainer<T>({
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  surface,
  ...props
}: ContentCardContainerProps<T>): React.ReactElement {
  const { settings, error, isLoading } = useContentContainer(surface);

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
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
