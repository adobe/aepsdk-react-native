# Inbox Tutorial

## Overview

The Inbox component provides a complete, ready-to-use inbox view for displaying content cards in your mobile application. Unlike manually rendering individual content cards, the Inbox component handles layout, loading states, error handling, empty states, card interaction, and unread indicators out of the box. The Inbox component is ideal for creating dedicated inbox screens, notification centers, or any centralized content card display area.

## Prerequisites

Before implementing the Inbox component, ensure you have:

1. **Planned and defined surface identifiers** for locations where content cards should appear in your app (see [Defining Surface Identifiers](#defining-surface-identifiers) section below)

2. **Configured content card campaigns in Adobe Journey Optimizer** using your defined surface identifiers:
   - Create a [channel](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/configure/content-card-configuration) (Define appid and surface)
   - Create [content cards](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/create-content-card) - Follow "Add Content cards to a campaign"
   - Design content cards with [templates](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/design-content-card)

3. **Integrated and registered the AEPMessaging extension** in your app (see [SDK Integration](#sdk-integration) section below)

### Defining Surface Identifiers

Surface identifiers are string values that represent specific locations in your app where content cards will be displayed. These identifiers must match between your Adobe Journey Optimizer campaigns and your app code.

#### Surface Naming Conventions

Use descriptive, hierarchical naming patterns:

**Feature-based surfaces**
```typescript
const surfaces = [
  'homepage',
  'product-detail', 
  'checkout',
  'profile',
  'inbox'
];
```

**Context-specific surfaces**
```typescript
const surfaces = [
  'rn/ios/remote_image',     // For remote image content cards
  'rn/android/local_promo',  // For local promotional cards
  'app/inbox/notifications'  // For inbox notifications
];
```

#### Where to Configure Surface Identifiers

Surface identifiers must be coordinated between two locations:

1. **Adobe Journey Optimizer**: When creating content card campaigns, specify the surface identifier in your campaign targeting configuration
2. **Your Mobile App**: Use the same surface identifiers when calling the Messaging APIs to fetch and display content cards

**Important**: The surface identifiers in your Adobe Journey Optimizer campaigns must exactly match the surface identifiers used in your app code. Mismatched identifiers will result in no content cards being returned.

## SDK Integration

Before you can use the Inbox component, you need to install and configure the AEP React Native SDK. For detailed setup instructions, see the main [SDK Installation and Configuration Guide](https://github.com/adobe/aepsdk-react-native#requirements).

**Required packages:**
- [`@adobe/react-native-aepcore`](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core) 
- [`@adobe/react-native-aepedge`](https://github.com/adobe/aepsdk-react-native/tree/main/packages/edge)
- [`@adobe/react-native-aepedgeidentity`](https://github.com/adobe/aepsdk-react-native/tree/main/packages/edgeidentity)
- [`@adobe/react-native-aepmessaging`](https://github.com/adobe/aepsdk-react-native/tree/main/packages/messaging)

**Imports for Inbox:**
```typescript
import { 
  Inbox,              // Pre-built Inbox component
  useInbox,           // Hook for fetching inbox settings
  InboxSettings,      // Type definitions
  ThemeProvider       // Optional: For theme customization
} from '@adobe/react-native-aepmessaging/ui';
```

## Using the Inbox Component

The Inbox component provides a complete inbox implementation with minimal setup required. It handles content card fetching, layout, loading states, error handling, empty states, and card management automatically.

### Basic Implementation

The simplest way to use the Inbox component is with the `useInbox` hook:

```typescript
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { Inbox, useInbox } from '@adobe/react-native-aepmessaging/ui';

const InboxScreen = () => {
  const { settings, isLoading, error } = useInbox('inbox');

  return (
    <Inbox
      surface="inbox"
      settings={settings}
      isLoading={isLoading}
      error={!!error}
      LoadingComponent={<ActivityIndicator />}
      ErrorComponent={<Text>Error loading inbox</Text>}
    />
  );
};
```

### Using useInbox Hook

The `useInbox` hook fetches inbox settings for a given surface and provides loading and error states.

```typescript
const { settings, isLoading, error, refetch } = useInbox(surface);
```

#### useInbox Hook API Reference

| Property | Type | Description |
|----------|------|-------------|
| `settings` | `InboxSettings \| null` | Inbox configuration settings (layout, capacity, heading, etc.) |
| `isLoading` | `boolean` | Loading state indicator |
| `error` | `any \| null` | Error object if fetching fails |
| `refetch` | `() => Promise<void>` | Function to manually refresh inbox settings |

**Example with refetch:**

```typescript
import React from 'react';
import { Button, View } from 'react-native';
import { Inbox, useInbox } from '@adobe/react-native-aepmessaging/ui';

const InboxScreen = () => {
  const { settings, isLoading, error, refetch } = useInbox('inbox');

  return (
    <View style={{ flex: 1 }}>
      <Button title="Refresh" onPress={refetch} />
      <Inbox
        surface="inbox"
        settings={settings}
        isLoading={isLoading}
        error={!!error}
      />
    </View>
  );
};
```

### Inbox Component Props

The `Inbox` component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `surface` | `string` | Yes | Surface identifier for the inbox |
| `settings` | `InboxSettings \| null` | Yes | Inbox settings from `useInbox` hook or `Messaging.getInbox()` |
| `isLoading` | `boolean` | No | Loading state |
| `error` | `boolean` | No | Error state |
| `LoadingComponent` | `ReactElement \| null` | No | Custom loading component (default: `<ActivityIndicator />`) |
| `ErrorComponent` | `ReactElement \| null` | No | Custom error component |
| `FallbackComponent` | `ReactElement \| null` | No | Component shown when settings are null |
| `EmptyComponent` | `ReactElement \| null` | No | Custom empty state component |
| `CardProps` | `Partial<ContentViewProps>` | No | Props passed to individual `ContentCardView` components |
| All `FlatListProps` | - | No | All `FlatList` props are supported for layout customization |

## Inbox Settings Configuration

The `InboxSettings` object controls the appearance and behavior of the inbox. Settings are typically fetched from Adobe Journey Optimizer, but you can also provide them manually for testing or fallback scenarios.

### InboxSettings Structure

```typescript
interface InboxSettings {
  content: {
    heading: {
      content: string;              // Heading text displayed above inbox
    };
    layout: {
      orientation: 'horizontal' | 'vertical';  // Layout direction
    };
    capacity: number;               // Maximum number of cards to display
    emptyStateSettings?: {
      message: {
        content: string;            // Message shown when inbox is empty
      };
      image?: {
        url?: string;               // Empty state image (light mode)
        darkUrl?: string;           // Empty state image (dark mode)
      };
    };
    unread_indicator?: {
      unread_bg: {
        clr: {
          light: string;            // Background color for unread cards (light mode)
          dark: string;             // Background color for unread cards (dark mode)
        };
      };
      unread_icon: {
        placement: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
        image: {
          url: string;              // Unread indicator icon URL
          darkUrl?: string;         // Unread indicator icon URL (dark mode)
        };
      };
    };
    isUnreadEnabled?: boolean;      // Enable/disable unread features (default: true)
  };
  showPagination?: boolean;         // Show pagination controls (default: false)
}
```

### Example Settings

```typescript
const exampleSettings: InboxSettings = {
  content: {
    heading: {
      content: 'My Inbox'
    },
    layout: {
      orientation: 'vertical'
    },
    capacity: 20,
    emptyStateSettings: {
      message: {
        content: 'No new messages'
      },
      image: {
        url: 'https://example.com/empty-state-light.png',
        darkUrl: 'https://example.com/empty-state-dark.png'
      }
    },
    unread_indicator: {
      unread_bg: {
        clr: {
          light: '#FFF3E0',
          dark: '#2D1B0E'
        }
      },
      unread_icon: {
        placement: 'topleft',
        image: {
          url: 'https://example.com/unread-icon.png'
        }
      }
    },
    isUnreadEnabled: true
  },
  showPagination: false
};
```

## Layout Options

The Inbox component supports two layout orientations:

### Vertical Layout

Vertical layout displays cards in a vertical list, ideal for inbox screens and notification centers.

```typescript
<Inbox
  surface="inbox"
  settings={{
    content: {
      heading: { content: 'Notifications' },
      layout: { orientation: 'vertical' },
      capacity: 20
    }
  }}
/>
```

### Horizontal Layout

Horizontal layout displays cards in a horizontal carousel, ideal for featured content or promotional banners.

```typescript
<Inbox
  surface="inbox"
  settings={{
    content: {
      heading: { content: 'Featured Deals' },
      layout: { orientation: 'horizontal' },
      capacity: 10
    }
  }}
/>
```

## Customization

### Custom Loading Component

```typescript
<Inbox
  surface="inbox"
  settings={settings}
  isLoading={isLoading}
  LoadingComponent={
    <View style={{ padding: 20 }}>
      <ActivityIndicator size="large" />
      <Text>Loading your inbox...</Text>
    </View>
  }
/>
```

### Custom Error Component

```typescript
<Inbox
  surface="inbox"
  settings={settings}
  error={!!error}
  ErrorComponent={
    <View style={{ padding: 20 }}>
      <Text>Failed to load inbox</Text>
      <Button title="Retry" onPress={refetch} />
    </View>
  }
/>
```

### Custom Empty State

```typescript
<Inbox
  surface="inbox"
  settings={settings}
  EmptyComponent={
    <View style={{ padding: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>📭</Text>
      <Text style={{ fontSize: 18 }}>Your inbox is empty</Text>
      <Text style={{ color: 'gray', marginTop: 5 }}>
        Check back later for new messages
      </Text>
    </View>
  }
/>
```

### Customizing Individual Cards

You can customize individual content cards using the `CardProps` prop:

```typescript
<Inbox
  surface="inbox"
  settings={settings}
  CardProps={{
    styleOverrides: {
      smallImageStyle: {
        container: {
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
          marginVertical: 8
        },
        title: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      }
    },
    listener: (event, data) => {
      console.log('Card event:', event, data);
    }
  }}
/>
```

### Custom Container Styles

You can customize the inbox container using `FlatList` props:

```typescript
<Inbox
  surface="inbox"
  settings={settings}
  contentContainerStyle={{
    padding: 16,
    backgroundColor: '#f9f9f9'
  }}
  style={{
    backgroundColor: '#ffffff'
  }}
/>
```

## Unread Indicators

The Inbox component supports unread indicators to highlight cards that haven't been interacted with yet.

### Enabling Unread Indicators

```typescript
const settings: InboxSettings = {
  content: {
    // ... other settings
    isUnreadEnabled: true,
    unread_indicator: {
      unread_bg: {
        clr: {
          light: '#FFF3E0',  // Light orange background
          dark: '#2D1B0E'    // Dark orange background
        }
      },
      unread_icon: {
        placement: 'topleft',
        image: {
          url: 'https://example.com/unread-icon.png'
        }
      }
    }
  }
};
```

### Unread Behavior

- Cards are marked as "read" when the user interacts with them (taps the card or buttons)
- Unread cards display with the configured background color
- Unread indicator icon appears at the specified placement
- The `isRead` property on content cards is automatically managed

## Card Management

The Inbox component automatically handles:

### Dismissed Cards

- Cards dismissed by the user are automatically filtered out
- Dismiss state persists for the app session
- Dismissed cards won't reappear until the app is restarted

### Interacted Cards

- Cards that have been interacted with are marked as read (if `isUnreadEnabled` is true)
- Interaction state persists for the app session
- Interacted cards maintain their read state

### Capacity Limits

- The `capacity` setting limits the maximum number of cards displayed
- Cards beyond the capacity limit are not shown
- Cards are displayed in the order returned from the server

## Complete Example

Here's a complete example combining all features:

```typescript
import React from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { Inbox, useInbox } from '@adobe/react-native-aepmessaging/ui';

const InboxScreen = () => {
  const { settings, isLoading, error, refetch } = useInbox('inbox');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading inbox...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Failed to load inbox</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Inbox
        surface="inbox"
        settings={settings}
        isLoading={false}
        error={false}
        CardProps={{
          listener: (event, data) => {
            console.log('Card event:', event, data);
          }
        }}
        contentContainerStyle={{
          padding: 16
        }}
      />
    </View>
  );
};

export default InboxScreen;
```

## Benefits of Using the Inbox Component

The Inbox component provides several advantages over manually rendering content cards:

- **Complete Solution**: Handles layout, loading, errors, and empty states automatically
- **Card Management**: Built-in support for dismissed and interacted cards
- **Unread Indicators**: Automatic unread state management
- **Flexible Layout**: Supports both vertical and horizontal layouts
- **Customizable**: Extensive customization options for all states and components
- **Performance**: Optimized rendering with proper memoization and state management
- **Less Code**: Minimal setup required compared to manual implementation

## Related Documentation

- [Content Cards Tutorial](./ContentCards.md) - Learn about content cards and the `ContentCardView` component
- [Content Card Customization Guide](./ContentCardCustomizationGuide.md) - Advanced styling and customization options

