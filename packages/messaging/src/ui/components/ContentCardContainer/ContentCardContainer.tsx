import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentCardView } from "../ContentCardView/ContentCardView";
import { ContentTemplate } from "../../types/Templates";
import { useCallback } from "react";
import { useContentCardUI, useContentContainer } from "../../hooks";

export interface ContentCardContainerProps<T> extends FlatListProps<T> {
  LoadingComponent?: React.ReactNode;
  ErrorComponent?: React.ReactNode;
  FallbackComponent?: React.ReactNode;
  surface: string;
}

function ContentCardContainerInner<T>({
  contentContainerStyle,
  LoadingComponent = <ActivityIndicator />,
  ErrorComponent = null,
  FallbackComponent = null,
  settings,
  surface,
  style,
  ...props
}: ContentCardContainerProps<T> & {
  settings: ContainerSettings;
}): React.ReactElement {
  const { content, error, isLoading } = useContentCardUI(surface);

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return <ContentCardView template={item as ContentTemplate} />;
  }, []);

  if (isLoading) {
    return LoadingComponent as React.ReactElement;
  }

  if (error) {
    return ErrorComponent as React.ReactElement;
  }

  if (!content) {
    return FallbackComponent as React.ReactElement;
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
