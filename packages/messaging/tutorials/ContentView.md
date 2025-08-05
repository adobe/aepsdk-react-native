# ContentView Tutorial

## Overview

The ContentView approach provides a simplified, automated way to implement content cards in your React Native application. While the [ContentCards tutorial](./ContentCards.md) demonstrates the manual approach for fetching propositions and building custom UI components, ContentView offers pre-built components and automatic proposition tracking integration that significantly reduces implementation complexity.

## Prerequisites

Before implementing ContentView, ensure you have:

1. Integrated and registered the AEPMessaging extension in your app
2. Configured content card Campaigns in Adobe Experience Platform
3. Defined surfaces where content cards should appear in your app

## Getting Started with ContentView

### Step 1: Import Required Components

```typescript
import {
  ContentProvider,
  ContentView,
  ContentTemplate,
} from "@adobe/react-native-aepmessaging";
```

### Step 2: Set Up ContentProvider and Show Content Card UI

The `ContentProvider` class handles fetching propositions and converting them to `ContentTemplate` objects that work seamlessly with the `ContentView` component.

```typescript
import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import {
  ContentProvider,
  ContentView,
  ContentTemplate,
  Messaging,
} from "@adobe/react-native-aepmessaging";

const ContentCardsScreen: React.FC = () => {
  const [contentCards, setContentCards] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchContentCards();
  }, []);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);

      // 1. Update propositions for the surface (same as manual approach)
      await Messaging.updatePropositionsForSurfaces(["homepage"]);

      // 2. Create ContentProvider for your surface
      const provider = new ContentProvider("homepage");

      // 3. Fetch and extract content cards content
      const content = await provider.getContent();
      setContentCards(content);
    } catch (error) {
      console.error("Failed to fetch content cards:", error);
      setContentCards([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading content cards...</Text>
      </View>
    );
  }

  // 4. Show content card UI
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {contentCards.map((card) => (
        <ContentView key={card.id} data={card} cardHeight={200} />
      ))}
    </ScrollView>
  );
};

export default ContentCardsScreen;
```

### Step 3: Understanding ContentTemplate Types

ContentProvider automatically converts content cards into `ContentTemplate` objects based on their template type:

```typescript
export interface ContentTemplate {
  readonly id: string;
  readonly type: TemplateType;
  readonly smallImageData?: SmallImageContentData;
  readonly largeImageData?: LargeImageContentData;
  readonly imageOnlyData?: ImageOnlyContentData;
}

export enum TemplateType {
  SMALL_IMAGE = "SmallImage",
  LARGE_IMAGE = "LargeImage",
  IMAGE_ONLY = "ImageOnly",
}
```

The ContentView component automatically renders the appropriate template based on the `type` field.

## Advanced ContentView Usage

### Customizing Content Card Appearance

ContentView supports extensive customization through style overrides.

> **All style properties are optional**
> You only need to override the specific properties you want to customize, leaving the rest with their default values.

#### Selective Style Customization

Mix and match style properties only what you need:

```typescript
// Example 1: Only customize title appearance
<ContentView
  data={card}
  cardHeight={200}
  styleOverrides={{
    smallImageStyle: {
      title: {
        fontSize: 20,
        fontWeight: "bold",
      },
      // body, image, container, etc. keep their default styles
    },
  }}
/>

// Example 2: Only adjust image size and container margins
<ContentView
  data={card}
  cardHeight={180}
  styleOverrides={{
    smallImageStyle: {
      imageContainer: {
        width: "30%",
      },
      container: {
        marginHorizontal: 8,
        marginBottom: 12,
      },
      // title, body keep default styles
    },
  }}
/>

// Example 3: Mix different template customizations
<ContentView
  data={card}
  cardHeight={220}
  styleOverrides={{
    smallImageStyle: {
      title: { numberOfLines: 1 }, // Only limit title lines
    },
    largeImageStyle: {
      image: { borderRadius: 16 }, // Only round image corners
    },
    // imageOnlyStyle not specified - uses all defaults
  }}
/>

// Example 4: Single property override
<ContentView
  data={card}
  cardHeight={200}
  styleOverrides={{
    smallImageStyle: {
      body: { numberOfLines: 2 }, // Only limit body text lines
    },
  }}
/>
```

#### Available Style Properties

Each template type supports different style customization options:

**SmallImageStyle Properties:**

```typescript
smallImageStyle: {
  title?: TextStyle & { numberOfLines?: number };
  body?: TextStyle & { numberOfLines?: number };
  imageContainer?: ViewStyle & { width?: string | number };
  container?: ViewStyle;
  image?: ImageStyle;
}
```

**LargeImageStyle Properties:**

```typescript
largeImageStyle: {
  title?: TextStyle & { numberOfLines?: number };
  body?: TextStyle & { numberOfLines?: number };
  image?: ImageStyle & { aspectRatio?: number };
  container?: ViewStyle;
}
```

**ImageOnlyStyle Properties:**

```typescript
imageOnlyStyle: {
  image?: ImageStyle & { aspectRatio?: number };
  container?: ViewStyle;
}
```

All properties are optional, allowing you to customize only what you need while keeping the default styling for everything else.

### Event Handling and Custom Actions

ContentView provides built-in event handling with automatic proposition tracking, plus the ability to add custom listeners:

```typescript
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Linking } from "react-native";
import {
  ContentProvider,
  ContentView,
  ContentTemplate,
  ContentViewEvent,
} from "@adobe/react-native-aepmessaging";

const ContentCardsWithEventsScreen: React.FC = () => {
  const [contentCards, setContentCards] = useState<ContentTemplate[]>([]);

  useEffect(() => {
    fetchContentCards();
  }, []);

  const fetchContentCards = async (): Promise<void> => {
    try {
      await Messaging.updatePropositionsForSurfaces(["homepage"]);
      const provider = new ContentProvider("homepage");
      const content = await provider.getContent();
      setContentCards(content);
    } catch (error) {
      console.error("Failed to fetch content cards:", error);
      setContentCards([]);
    }
  };

  // 1. Define an event listener
  const handleContentViewEvent = (
    event: ContentViewEvent,
    componentIdentifier?: string
  ): void => {
    console.log(`Content card event: ${event}`, componentIdentifier);

    switch (event) {
      case "onDisplay":
        // Card was displayed - tracking handled automatically
        console.log("Content card displayed");
        break;

      case "clickButton":
        // Button was clicked - tracking handled automatically
        console.log("Content card button clicked");
        break;

      case "onDismiss":
        // Card was dismissed - view will hide automatically
        console.log("Content card dismissed");
        break;

      default:
        console.log("Unknown event:", event);
    }
  };

  // 2. Resiger the event listener on the ContenView component
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {contentCards.map((card) => (
        <ContentView
          key={card.id}
          data={card}
          cardHeight={200}
          listener={handleContentViewEvent}
          styleOverrides={{
            smallImageStyle: {
              title: { numberOfLines: 2 },
              body: { numberOfLines: 3 },
            },
          }}
        />
      ))}
    </ScrollView>
  );
};

export default ContentCardsWithEventsScreen;
```

## Automatic Proposition Tracking

One of the key advantages of ContentView is automatic proposition tracking integration. The component automatically:

1. **Tracks Display Events**: When a content card is rendered and becomes visible
2. **Tracks Interaction Events**: When users tap buttons or interact with the card

### How Automatic Proposition Tracking Works

The ContentView component uses the `ContentCardMappingManager` to maintain the relationship between `ContentTemplate` objects and their original `ContentCard` and `MessagingProposition` objects. This enables automatic tracking calls:

```typescript
// Automatically called when card is displayed
Messaging.trackContentCardDisplay(proposition, contentCard);

// Automatically called when button is clicked
Messaging.trackContentCardInteraction(proposition, contentCard);
```

### Tracking Events Reference

| Event         | When Triggered            | Tracking Method Called          |
| ------------- | ------------------------- | ------------------------------- |
| `onDisplay`   | Card rendered and visible | `trackContentCardDisplay()`     |
| `clickButton` | Button pressed            | `trackContentCardInteraction()` |
| `onDismiss`   | Dismiss button pressed    | None (dismissal is UI-only)     |

## Theme Support and Dark Mode

ContentView supports automatic theme switching and custom themes through the `ThemeProvider` component.

### Understanding ThemeProvider

The `ThemeProvider` is a React context provider that manages theme configuration for all ContentView components. It serves as the centralized theme management system that:

1. **Automatic Theme Detection**: Automatically detects and responds to system-level theme changes (light/dark mode)
2. **Custom Theme Support**: Allows you to define your own color schemes and styling themes
3. **Context-Based Theming**: Uses React Context to provide theme data to all nested ContentView components
4. **Dynamic Theme Switching**: Supports runtime theme switching without component remounting

#### Key Features

- **Zero Configuration**: Works out-of-the-box with system themes when no custom themes are provided
- **Flexible Theme Definition**: Supports defining both light and dark theme variants
- **Color Mapping**: Maps semantic color names (like `text_primary`, `background`) to actual color values
- **Automatic Inheritance**: All ContentView components automatically inherit the theme from the nearest ThemeProvider
- **Performance Optimized**: Efficiently updates only when theme actually changes

#### When to Use ThemeProvider

- **Custom Branding**: When you need content cards to match your app's specific color scheme
- **Enhanced Dark Mode**: When the default dark mode colors don't fit your design requirements
- **Consistent Theming**: When you want all content cards across your app to use the same theme
- **Brand Compliance**: When you need to ensure content cards follow your brand guidelines

ContentView supports automatic theme switching and custom themes:

### Basic Theme Support (by default)

```typescript
import React from "react";
import { View } from "react-native";
import { ContentView, ThemeProvider } from "@adobe/react-native-aepmessaging";

const ThemedContentCardsScreen: React.FC = () => {
  // ContentView automatically adapts to system theme
  return (
    <View style={{ flex: 1 }}>
      <ContentView data={contentCard} cardHeight={200} />
    </View>
  );
};
```

### Custom Theme Configuration

```typescript
import React from "react";
import { View } from "react-native";
import { ContentView, ThemeProvider } from "@adobe/react-native-aepmessaging";

const CustomThemedContentCardsScreen: React.FC = () => {
  return (
    <ThemeProvider
      customThemes={{
        light: {
          colors: {
            text_primary: "#333333",
            text_secondary: "#666666",
            background: "#ffffff",
            button_background: "#007AFF",
            button_text_color: "#ffffff",
          },
        },
        dark: {
          colors: {
            text_primary: "#ffffff",
            text_secondary: "#cccccc",
            background: "#1a1a1a",
            button_background: "#0A84FF",
            button_text_color: "#ffffff",
          },
        },
      }}
    >
      <View style={{ flex: 1 }}>
        <ContentView data={contentCard} cardHeight={200} />
      </View>
    </ThemeProvider>
  );
};
```

## Performance Considerations

1. **Efficient Rendering**: ContentView uses optimized React Native components
2. **Automatic Caching**: ContentProvider leverages Messaging extension's built-in caching
3. **Memory Management**: ContentCardMappingManager handles cleanup automatically
4. **Lazy Loading**: Only fetches content when ContentProvider.getContent() is called

## Best Practices

1. **Surface Management**: Use descriptive surface names that match your AJO configuration
2. **Error Handling**: Always wrap ContentProvider calls in try-catch blocks
3. **Loading States**: Provide appropriate loading indicators for better UX
4. **Style Consistency**: Use consistent style overrides across your app
5. **Selective Styling**: Only override the specific style properties you need - all properties are optional
6. **Event Monitoring**: Implement custom listeners for debugging and analytics
