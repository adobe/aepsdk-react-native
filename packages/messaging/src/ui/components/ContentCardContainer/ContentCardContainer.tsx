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
  const { content: contentSettings, showPagination } = settings;
  const { heading, layout, emptyStateSettings, unread_indicator, isUnreadEnabled } = contentSettings;

  // Derived flags used across renders
  const isHorizontal = layout?.orientation === 'horizontal';
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

    // Single merged overrides object (preserves LargeImage behavior)
    const cardBase = {
      ...(isHorizontal ? { alignSelf: 'center', width: '100%' } : null),
      ...(isUnreadEnabled && bg ? { backgroundColor: bg } : null)
    } as any;

    const largeImageExtras = isHorizontal && template === 'LargeImage'
      ? {
          image: styles.imageHeight,
          imageContainer: [
            styles.imageHeight,
            isUnreadEnabled && bg ? { backgroundColor: bg } : null
          ],
          contentContainer: styles.contentContainer,
          card: isUnreadEnabled && bg ? { backgroundColor: bg } : null
        }
      : null;

    const styleOverrides = {
      [key]: {
        card: cardBase,
        ...(largeImageExtras || {})
      }
    } as any;

    return (
      <View style={isHorizontal ? styles.cardWidth : undefined}>
        <ContentCardView template={item} styleOverrides={styleOverrides} style={{ flex: 0 }} />
        <UnreadIcon placement={unreadIcon?.placement} image={unreadIcon?.image} />
      </View>
    );
  }, [isHorizontal, isUnreadEnabled, bg, unreadIcon]);

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
        data={content as T[]}
        ItemSeparatorComponent={() => (
          isHorizontal ? <View style={styles.horizontalSeparator} /> : <View style={styles.verticalSeparator} />
        )}
        ListEmptyComponent={
          settings.content.emptyStateSettings
            ? <EmptyStateContainer emptyStateSettings={emptyStateSettings} />
            : null
        }
        contentContainerStyle={[
          contentContainerStyle,
          isHorizontal && styles.listContent
        ]}
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
    width: 380,
    flexDirection: 'column',
    alignItems: 'center'
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
  listContent: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
});
