import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentCardView } from "../ContentCardView/ContentCardView";
import { ContentTemplate } from "../../types/Templates";
import { useCallback } from "react";

export interface ContentCardContainerProps<T> extends FlatListProps<T> {
  children: React.ReactNode;
  settings: ContainerSettings;
}

function ContentCardContainer<T>({
  children,
  settings,
  ...props
}: ContentCardContainerProps<T>) {
  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return <ContentCardView template={item as ContentTemplate} />;
  }, []);

  return (
    <ContentCardContainerProvider settings={settings}>
      <FlatList {...props} renderItem={renderItem} />
      {children}
    </ContentCardContainerProvider>
  );
}

export default ContentCardContainer;
