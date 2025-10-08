import { cloneElement, ReactElement, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  Text,
  useColorScheme
} from "react-native";
import { useContentCardUI, useContentContainer } from "../../hooks";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentTemplate } from "../../types/Templates";
import { ContentCardView } from "../ContentCardView/ContentCardView";
import EmptyState from "./EmptyState";

// Public props for the container. Extends FlatList props but manages data internally.
export interface ContentCardContainerProps<T> extends FlatListProps<T> {
  LoadingComponent?: ReactElement | null;
  ErrorComponent?: ReactElement | null;
  FallbackComponent?: ReactElement | null;
  EmptyComponent?: ReactElement | null;
  surface: string;
}

// Core renderer: fetches content for a surface, derives layout, and renders a list of cards
function ContentCardContainerInner<T extends ContentTemplate>({
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

  // Normalize/alias frequently used settings
  const { content: contentSettings } = settings;
  const { heading, layout, emptyStateSettings, unread_indicator, isUnreadEnabled } = contentSettings;

  // Derived flags used across renders
  const headingColor = useMemo(() => colorScheme === 'dark' ? '#FFFFFF' : '#000000', [colorScheme]);
  const isHorizontal = useMemo(() => layout?.orientation === 'horizontal', [layout?.orientation]);
  const unreadIcon = useMemo(() => unread_indicator?.unread_icon, [unread_indicator?.unread_icon]);
  const unreadBg = useMemo(() => unread_indicator?.unread_bg?.clr, [unread_indicator?.unread_bg?.clr]);
  const bg = useMemo(() => colorScheme === 'dark' ? unreadBg?.dark : unreadBg?.light, [colorScheme, unreadBg?.dark, unreadBg?.light]);

  // Stable item renderer: maps template -> variant, builds style overrides, overlays unread icon
  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    const template = item.type;
    const key = ({ SmallImage: 'smallImageStyle', LargeImage: 'largeImageStyle', ImageOnly: 'imageOnlyStyle' })[template];

    const styleOverrides = {
      [key]: {
        card: {
          ...(isUnreadEnabled && bg ? { backgroundColor: bg } : null),
          ...(isHorizontal && styles.horizontalCardStyles),
        },
      }
    };

    return (<ContentCardView template={item} styleOverrides={styleOverrides} />);
  }, [isHorizontal, isUnreadEnabled, bg, unreadIcon]);

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
    if (EmptyComponent) {
      return cloneElement(EmptyComponent, {
        ...emptyStateSettings,
      }) as React.ReactElement;
    }

    return (
      <EmptyState
        image={emptyStateSettings?.image?.[colorScheme ?? "light"]?.url}
        text={
          emptyStateSettings?.message?.content ||
          "No Content Available"
        }
      />
    );
  }

  return (
    <ContentCardContainerProvider settings={settings}>
      <Text accessibilityRole="header" style={[styles.heading, { color: headingColor }]}>{heading.content}</Text>
      <FlatList
        {...props}
        data={content as T[]}
        contentContainerStyle={[contentContainerStyle, isHorizontal && styles.horizontalListContent]}
        horizontal={isHorizontal}
        renderItem={renderItem}
      />
    </ContentCardContainerProvider>
  );
}

export function ContentCardContainer<T extends ContentTemplate>({
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
  heading: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16
  },
  horizontalCardStyles: {
    width: Math.floor(Dimensions.get('window').width * 0.75),
    flex: 0
  },
  horizontalListContent: {
    alignItems: 'center'
  },
});
