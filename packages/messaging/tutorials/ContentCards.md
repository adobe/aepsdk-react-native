# Content Cards Tutorial

## Overview

Content Cards are a powerful feature of Adobe Journey Optimizer that allows you to deliver personalized, contextual content directly within your mobile application. Unlike push notifications or in-app messages, content cards provide a persistent, non-intrusive way to present relevant information to users when they're actively engaged with your app. Content cards are ideal for showcasing promotions, product recommendations, onboarding tips, or any contextual information that enhances the user experience without interrupting their workflow.

## Prerequisites

Before implementing content cards, ensure you have:

1. **Planned and defined surface identifiers** for locations where content cards should appear in your app (see [Defining Surface Identifiers](#defining-surface-identifiers) section below)

2. **Configured content card campaigns in Adobe Journey Optimizer** using your defined surface identifiers:

     a. Create a [channel](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/configure/content-card-configuration).

     b. Create [content cards](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/create-content-card) - Follow "Add Content cards to a campaign".
     
     c. Design content cards with [templates](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/content-card/design-content-card)
     
3. **Integrated and registered the AEPMessaging extension** in your app (see [SDK Integration](#sdk-integration) section below) 

### Defining Surface Identifiers

Surface identifiers are string values that represent specific locations in your app where content cards will be displayed. These identifiers must match between your Adobe Journey Optimizer campaigns and your app code.

### Surface Naming Conventions

Use descriptive, hierarchical naming patterns:

```typescript
// Platform-specific surfaces
const surface = Platform.OS === 'android' 
  ? 'rn/android/homepage' 
  : 'rn/ios/homepage';

// Feature-based surfaces
const surfaces = [
  'homepage',
  'product-detail', 
  'checkout',
  'profile',
  'search-results'
];

// Context-specific surfaces
const surfaces = [
  'rn/ios/remote_image',     // For remote image content cards
  'rn/android/local_promo',  // For local promotional cards
  'app/onboarding/step1'     // For onboarding flow
];
```

### Where to Configure Surface Identifiers

Surface identifiers must be coordinated between two locations:

1. **Adobe Journey Optimizer**: When creating content card campaigns, specify the surface identifier in your campaign targeting configuration
2. **Your Mobile App**: Use the same surface identifiers when calling the Messaging APIs to fetch and display content cards

**Important**: The surface identifiers in your Adobe Journey Optimizer campaigns must exactly match the surface identifiers used in your app code. Mismatched identifiers will result in no content cards being returned.

## SDK Integration

Before you can fetch and display content cards, you need to install and configure the AEP React Native SDK. For detailed setup instructions, see the main [SDK Installation and Configuration Guide](https://github.com/adobe/aepsdk-react-native#requirements).

**Required packages:**
- `@adobe/react-native-aepcore` 
- `@adobe/react-native-aepmessaging`

**Required imports for content cards:**
```typescript
import { Messaging, ContentTemplate, ContentCardView } from '@adobe/react-native-aepmessaging';
```

## Fetching Content Cards 

### Step 1: Update Propositions for Surfaces

To fetch content cards for specific surfaces configured in Adobe Journey Optimizer campaigns, call the `updatePropositionsForSurfaces` API. This method retrieves the latest content cards from the server and caches them in-memory for the application's lifecycle.

**Best Practice**: Batch requests for multiple surfaces in a single API call when possible to optimize performance.

```typescript
import { Messaging } from '@adobe/react-native-aepmessaging';

// Single surface example
const surface = 'homepage';

// Fetch content cards for a single surface
const updateContentCardsForSurface = async (): Promise<void> => {
  try {
    await Messaging.updatePropositionsForSurfaces([surface]);
    console.log('Content cards updated successfully for surface:', surface);
  } catch (error) {
    console.error('Failed to update content cards:', error);
  }
};

// Multiple surfaces example (for batching requests)
const surfaces: string[] = ['homepage', 'product-detail', 'checkout'];

const updateContentCardsForMultipleSurfaces = async (): Promise<void> => {
  try {
    await Messaging.updatePropositionsForSurfaces(surfaces);
    console.log('Content cards updated successfully for all surfaces');
  } catch (error) {
    console.error('Failed to update content cards:', error);
  }
};
```

### Step 2: Retrieve and Render Content Cards

After updating propositions, retrieve the content cards for a specific surface using the `getContentCardUI` API. This convenience method handles proposition filtering and returns ready-to-use content card templates.

**Important**: Only content cards for which the user has qualified are returned. User qualification is determined by the delivery rules configured in Adobe Journey Optimizer.

```typescript
import { Messaging, ContentTemplate } from '@adobe/react-native-aepmessaging';

// Simple approach: Get content card UI templates for a single surface
const getContentCards = async (surface: string): Promise<ContentTemplate[]> => {
  try {
    const contentCards = await Messaging.getContentCardUI(surface);
    console.log(`Found ${contentCards.length} content cards for surface: ${surface}`);
    return contentCards;
  } catch (error) {
    console.error('Error retrieving content cards:', error);
    return [];
  }
};

// For multiple surfaces, call getContentCardUI for each surface
const getContentCardsForMultipleSurfaces = async (surfaces: string[]): Promise<ContentTemplate[]> => {
  try {
    const allContentCards: ContentTemplate[] = [];
    
    for (const surface of surfaces) {
      const contentCards = await Messaging.getContentCardUI(surface);
      allContentCards.push(...contentCards);
    }
    
    console.log(`Found ${allContentCards.length} content cards across all surfaces`);
    return allContentCards;
  } catch (error) {
    console.error('Error retrieving content cards:', error);
    return [];
  }
};
```

## Rendering Content Cards

The `getContentCardUI()` method returns `ContentTemplate` objects that can be rendered using the pre-built `ContentCardView` component provided by the SDK.

### React Native Implementation

Here's how to implement content cards using the pre-built `ContentCardView` component:

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Messaging, ContentTemplate, ContentCardView } from '@adobe/react-native-aepmessaging';

interface ContentCardsScreenProps {
  surfacePath?: string;
}

const ContentCardsScreen: React.FC<ContentCardsScreenProps> = ({ surfacePath = 'homepage' }) => {
  const [contentCards, setContentCards] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchContentCards();
  }, [surfacePath]);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Update propositions for the surface
      await Messaging.updatePropositionsForSurfaces([surfacePath]);
      
      // Get content card UI templates (already filtered and processed)
      const cards = await Messaging.getContentCardUI(surfacePath);
      
      setContentCards(cards || []);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentCardEvent = (event: string, card: ContentTemplate): void => {
    console.log('Content card event:', event, card);
    // Handle card interactions (display, dismiss, interact events)
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading content cards...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {contentCards && contentCards.length > 0 ? (
        contentCards.map((card) => (
          <ContentCardView
            key={card.id}
            template={card}
            listener={handleContentCardEvent}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text>No content cards available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ContentCardsScreen;
```

### Benefits of Using ContentCardView

The pre-built `ContentCardView` component provides several advantages:

- **Automatic Layout**: Handles different card types (SmallImage, LargeImage, ImageOnly) automatically
- **Built-in Event Tracking**: Automatically tracks display and interaction events
- **Theme Support**: Works with `ThemeProvider` for consistent styling
- **Accessibility**: Includes proper accessibility features
- **Less Code**: No need to build custom UI components

### Customizing ContentCardView

You can customize the appearance of content cards using the `styleOverrides` prop:

```typescript
<ContentCardView
  key={card.id}
  template={card}
  listener={handleContentCardEvent}
  styleOverrides={{
    smallImageStyle: {
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        numberOfLines: 2,
      },
      body: {
        fontSize: 14,
        color: '#666',
        numberOfLines: 3,
      },
      image: {
        borderRadius: 8,
      },
      button: {
        backgroundColor: '#007AFF',
        borderRadius: 6,
      }
    },
    largeImageStyle: {
      title: {
        fontSize: 20,
        fontWeight: '600',
        numberOfLines: 1,
      },
      body: {
        numberOfLines: 2,
      }
    },
    imageOnlyStyle: {
      image: {
        aspectRatio: 1,
        borderRadius: 12,
      }
    }
  }}
/>
```

**Note**: Different card types support different style properties. Refer to the [Content Card Customization Guide](./ContentCardCustomizationGuide.md) for comprehensive styling options.


## Automatic Event Tracking

When using `ContentCardView`, event tracking is handled automatically. The component tracks user interactions and sends events to Adobe Journey Optimizer for campaign measurement and optimization.

### Events Automatically Tracked

The `ContentCardView` component automatically tracks and sends the following events to Adobe Journey Optimizer:

#### Display Events
- **Triggered when**: A content card becomes visible on screen
- **Event data sent**: 
  - Proposition ID
  - Content card details
  - Surface information
  - Timestamp

#### Interaction Events  
- **Triggered when**: User taps on the content card or its action buttons
- **Event data sent**:
  - Proposition ID
  - Content card details
  - Interaction type (tap, button click)
  - Action URL (if applicable)
  - Timestamp

#### Dismiss Events
- **Triggered when**: User dismisses a content card (if dismiss button is shown)
- **Event data sent**:
  - Proposition ID
  - Content card details
  - Dismiss action
  - Timestamp

### Event Listener (Optional)

While tracking is automatic, you can still listen to events using the `listener` prop if you need to perform additional actions:

```typescript
const handleContentCardEvent = (event: string, card: ContentTemplate): void => {
  console.log('Content card event:', event, card);
  
  switch (event) {
    case 'display':
      console.log('Card displayed:', card.id);
      // Optional: Add custom analytics or logging
      break;
    case 'interact':
      console.log('Card interacted:', card.id);
      // Optional: Handle custom navigation or actions
      break;
    case 'dismiss':
      console.log('Card dismissed:', card.id);
      // Optional: Update local state or preferences
      break;
  }
};

// Use the listener in your ContentCardView
<ContentCardView
  template={card}
  listener={handleContentCardEvent}
/>
```