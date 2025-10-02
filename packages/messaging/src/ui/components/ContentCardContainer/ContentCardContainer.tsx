import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  Platform,
  DynamicColorIOS,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useContentCardUI, useContentContainer } from "../../hooks";
import ContentCardContainerProvider, {
  ContainerSettings,
} from "../../providers/ContentCardContainerProvider";
import { ContentTemplate } from "../../types/Templates";
import { ContentCardView } from "../ContentCardView/ContentCardView";
import EmptyStateContainer from "../EmptyStateContainer/EmptyStateContainer";
import Pagination from "../Pagination/Pagination";
import UnreadIcon from "../UnreadIcon/UnreadIcon";

// Public props for the container. Extends FlatList props but manages data internally.
export interface ContentCardContainerProps<T> extends FlatListProps<T> {
  LoadingComponent?: React.ReactNode;
  ErrorComponent?: React.ReactNode;
  FallbackComponent?: React.ReactNode;
  surface: string;
}

// Core renderer: fetches content for a surface, derives layout, and renders a list of cards
function ContentCardContainerInner<T extends ContentTemplate>({
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
  // Pull content cards for the given surface
  const { content, error, isLoading } = useContentCardUI(surface);
  const scheme = useColorScheme();
  const headingColor = Platform.OS === 'ios'
    ? DynamicColorIOS({ light: '#000000', dark: '#FFFFFF' })
    : (scheme === 'dark' ? '#FFFFFF' : '#000000');

  // Normalize/alias frequently used settings
  const { content: contentSettings, templateType, showPagination } = settings;
  const { heading, layout, capacity, emptyStateSettings, unread_indicator, isUnreadEnabled } = contentSettings;

  // Derived flags used across renders
  const isHorizontal = layout?.orientation === 'horizontal';
  const showUnread = Boolean(
    isUnreadEnabled && (templateType === 'inbox' || templateType === 'custom')
  );
  const unreadIcon = unread_indicator?.unread_icon;
  const unreadBg = unread_indicator?.unread_bg?.clr;
  const bg = scheme === 'dark' ? unreadBg?.dark : unreadBg?.light;

  // Stable item renderer: maps template -> variant, builds style overrides, overlays unread icon
  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    const template = item.type;
    let key: 'smallImageStyle' | 'largeImageStyle' | 'imageOnlyStyle';
    switch (template) {
      case 'SmallImage':
        key = 'smallImageStyle';
        break;
      case 'LargeImage':
        key = 'largeImageStyle';
        break;
      default:
        key = 'imageOnlyStyle';
        break;
    }

    // Base override: unread background color
    let styleOverrides: any = showUnread
      ? { [key]: { card: { backgroundColor: bg } } }
      : undefined;

    // LargeImage + horizontal: cap image height and ensure min content height
    if (isHorizontal && template === 'LargeImage') {
      styleOverrides = {
        [key]: {
          ...styleOverrides?.[key],
          image: styles.imageHeight,
          imageContainer: styles.imageHeight,
          contentContainer: styles.contentContainer,
        },
      } as any;
    }

    return (
      <View style={isHorizontal && styles.cardWidth}>
        <ContentCardView
          template={item}
          styleOverrides={styleOverrides}
        />
        {
          showUnread
            ? <UnreadIcon placement={unreadIcon?.placement} image={unreadIcon?.image} />
            : null
        }
      </View>
    );
  }, [isHorizontal, showUnread, bg, unreadIcon]);

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
      {showPagination ? <Pagination /> : null}
      <Text accessibilityRole="header" style={[styles.heading, { color: headingColor }]}>{heading.content}</Text>
      <FlatList
        {...props}
        data={(content as T[]).slice(0, capacity)}
        ItemSeparatorComponent={() => (
          isHorizontal ? <View style={styles.horizontalSeparator} /> : <View style={styles.verticalSeparator} />
        )}
        ListEmptyComponent={
          templateType === 'inbox' || templateType === 'custom'
            ? <EmptyStateContainer emptyStateSettings={emptyStateSettings} />
            : null
        }
        contentContainerStyle={contentContainerStyle}
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
  contentContainer: {
    minHeight: 140,
  },
  imageHeight: {
    height: 180
  },
  cardWidth: {
    width: 380
  },
  heading: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000',
  },
  horizontalSeparator: { width: 12 },
  verticalSeparator: { height: 12 },
});
