# Content Cards Tutorial

## Overview

Content Cards are a powerful feature of Adobe Journey Optimizer that allows you to deliver personalized, contextual content directly within your mobile application. Unlike push notifications or in-app messages, content cards provide a persistent, non-intrusive way to present relevant information to users when they're actively engaged with your app. Content cards are ideal for showcasing promotions, product recommendations, onboarding tips, or any contextual information that enhances the user experience without interrupting their workflow.


## Fetching Content Cards

### Prerequisites

Before implementing content cards, ensure you have:

1. Integrated and registered the AEPMessaging extension in your app 
2. Configured content card campaigns in Adobe Journey Optimizer
3. Defined locations where content cards should appear in your app

### Step 1: Update Propositions for Surfaces

To fetch content cards for specific surfaces configured in Adobe Journey Optimizer campaigns, call the `updatePropositionsForSurfaces` API. This method retrieves the latest content cards from the server and caches them in-memory for the application's lifecycle.

**Best Practice**: Batch requests for multiple surfaces in a single API call when possible to optimize performance.

```typescript
import { Messaging } from '@adobe/react-native-aepmessaging';

// Define surfaces of content cards to retrieve
const surfaces: string[] = ['homepage', 'product-detail', 'checkout'];

// Fetch content cards for multiple surfaces
const updateContentCards = async (): Promise<void> => {
  try {
    await Messaging.updatePropositionsForSurfaces(surfaces);
    console.log('Content cards updated successfully');
  } catch (error) {
    console.error('Failed to update content cards:', error);
  }
};
```

### Step 2: Retrieve Content Cards

After updating propositions, retrieve the content cards for a specific surface using the `getPropositionsForSurface` API. This returns an array of `Proposition` objects that contain content cards for which the user is qualified.

**Important**: Only content cards for which the user has qualified are returned. User qualification is determined by the delivery rules configured in Adobe Journey Optimizer.

```typescript
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

// Retrieve propositions for a specific surface
const getContentCards = async (surfacePath: string): Promise<ContentCard[]> => {
  try {
    const propositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surfacePath);
    
    if (propositions && propositions.length > 0) {
      console.log(`Found ${propositions.length} propositions for surface: ${surfacePath}`);
      
      // Extract content cards from propositions
      const contentCards: ContentCard[] = propositions.flatMap(proposition => 
        proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD) as ContentCard[]
      );
      
      return contentCards;
    } else {
      console.log(`No propositions available for surface: ${surfacePath}`);
      return [];
    }
  } catch (error) {
    console.error('Error retrieving propositions:', error);
    return [];
  }
};
```

## Rendering Content Cards

Content cards can be rendered in various ways depending on your application architecture. Since React Native doesn't support the pre-built `ContentCardUI` objects, you'll need to create your own UI components based on the content card data from propositions.

### React Native Implementation

Here's how to implement content cards in a React Native component using propositions:

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface ContentCardsScreenProps {
  surfacePath?: string;
}

const ContentCardsScreen: React.FC<ContentCardsScreenProps> = ({ surfacePath = 'homepage' }) => {
  const [contentCards, setContentCards] = useState<ContentCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchContentCards();
  }, [surfacePath]);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First, update propositions for the surface
      await Messaging.updatePropositionsForSurfaces([surfacePath]);
      
      // Then retrieve the propositions and extract content cards
      const propositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surfacePath);
      const cards: ContentCard[] = propositions.flatMap(proposition => 
        proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD) as ContentCard[]
      );
      
      setContentCards(cards || []);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContentCard = (card: ContentCard, index: number): JSX.Element => {
    const { data } = card;
    
    return (
      <TouchableOpacity key={index} style={styles.cardContainer}>
        {data.content.image?.url && (
          <Image source={{ uri: data.content.image.url }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          {data.content.title?.content && (
            <Text style={styles.cardTitle}>{data.content.title.content}</Text>
          )}
          {data.content.body?.content && (
            <Text style={styles.cardBody}>{data.content.body.content}</Text>
          )}
          {data.content.actionUrl && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Learn More</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
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
      {contentCards.map((card, index) => renderContentCard(card, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContentCardsScreen;
```

## Tracking Content Card Events

Content cards support event tracking to measure user engagement and campaign effectiveness. The AEPMessaging extension provides methods to track three key events: display, dismiss, and interact. These events help you understand how users engage with your content cards and optimize your campaigns accordingly.

### Event Types

- **Display**: Triggered when a content card is shown to the user
- **Dismiss**: Triggered when a user dismisses or closes a content card
- **Interact**: Triggered when a user taps or interacts with a content card

### Implementing Event Tracking

Here's how to implement event tracking in your content card components:

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface ContentCardsWithTrackingProps {
  surfacePath?: string;
}

const ContentCardsWithTracking: React.FC<ContentCardsWithTrackingProps> = ({ 
  surfacePath = 'homepage' 
}) => {
  const [contentCards, setContentCards] = useState<ContentCard[]>([]);
  const [propositions, setPropositions] = useState<MessagingProposition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const displayedCards = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchContentCards();
  }, [surfacePath]);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await Messaging.updatePropositionsForSurfaces([surfacePath]);
      const fetchedPropositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surfacePath);
      
      const cards: ContentCard[] = fetchedPropositions.flatMap(proposition => 
        proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD) as ContentCard[]
      );
      
      setContentCards(cards || []);
      setPropositions(fetchedPropositions || []);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
      setPropositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Track display event when card becomes visible
  const trackDisplayEvent = (proposition: MessagingProposition): void => {
    const propositionId = proposition.id;
    
    // Prevent duplicate display events for the same card
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackPropositionDisplay(proposition);
        displayedCards.current.add(propositionId);
        console.log(`Display event tracked for proposition: ${propositionId}`);
      } catch (error) {
        console.error('Failed to track display event:', error);
      }
    }
  };

  // Track interact event when user taps on card
  const trackInteractEvent = (proposition: MessagingProposition, actionId?: string): void => {
    try {
      if (actionId) {
        // Track interaction with specific action
        Messaging.trackPropositionInteract(proposition, actionId);
      } else {
        // Track general card interaction
        Messaging.trackPropositionInteract(proposition);
      }
      console.log(`Interact event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track interact event:', error);
    }
  };

  // Track dismiss event when user dismisses card
  const trackDismissEvent = (proposition: MessagingProposition): void => {
    try {
      Messaging.trackPropositionDismiss(proposition);
      console.log(`Dismiss event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track dismiss event:', error);
    }
  };

  const handleCardPress = (card: ContentCard, proposition: MessagingProposition): void => {
    // Track interaction
    trackInteractEvent(proposition);
    
    // Handle card action (e.g., navigate to URL)
    if (card.data.content.actionUrl) {
      // Navigate to action URL or handle custom action
      console.log(`Navigating to: ${card.data.content.actionUrl}`);
    }
  };

  const handleCardDismiss = (cardIndex: number, proposition: MessagingProposition): void => {
    // Track dismiss event
    trackDismissEvent(proposition);
    
    // Remove card from display
    setContentCards(prevCards => prevCards.filter((_, index) => index !== cardIndex));
  };

  const renderContentCard = (card: ContentCard, index: number): JSX.Element => {
    const { data } = card;
    const proposition = propositions.find(prop => 
      prop.items.some(item => item.id === card.id)
    );

    // Track display event when card is rendered
    useEffect(() => {
      if (proposition) {
        trackDisplayEvent(proposition);
      }
    }, [proposition]);

    return (
      <View key={index} style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => proposition && handleCardDismiss(index, proposition)}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => proposition && handleCardPress(card, proposition)}
        >
          {data.content.image?.url && (
            <Image source={{ uri: data.content.image.url }} style={styles.cardImage} />
          )}
          <View style={styles.cardTextContent}>
            {data.content.title?.content && (
              <Text style={styles.cardTitle}>{data.content.title.content}</Text>
            )}
            {data.content.body?.content && (
              <Text style={styles.cardBody}>{data.content.body.content}</Text>
            )}
            {data.content.actionUrl && (
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>Learn More</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
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
      {contentCards.map((card, index) => renderContentCard(card, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dismissText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTextContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContentCardsWithTracking;
```

### Event Tracking Best Practices

1. **Display Events**: Track display events only once per card per session to avoid duplicate analytics
2. **Interact Events**: Track interactions immediately when they occur to ensure accurate measurement
3. **Dismiss Events**: Always track dismiss events to understand user preferences and card effectiveness
4. **Error Handling**: Implement proper error handling for tracking calls to prevent app crashes

### Custom Event Tracking Hook

For reusable event tracking logic, consider creating a custom hook:

```typescript
import { useCallback, useRef } from 'react';
import { Messaging, MessagingProposition } from '@adobe/react-native-aepmessaging';

interface ContentCardTracking {
  trackDisplay: (proposition: MessagingProposition) => void;
  trackInteract: (proposition: MessagingProposition, actionId?: string) => void;
  trackDismiss: (proposition: MessagingProposition) => void;
}

const useContentCardTracking = (): ContentCardTracking => {
  const displayedCards = useRef<Set<string>>(new Set());

  const trackDisplay = useCallback((proposition: MessagingProposition): void => {
    const propositionId = proposition.id;
    
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackPropositionDisplay(proposition);
        displayedCards.current.add(propositionId);
        console.log(`Display tracked: ${propositionId}`);
      } catch (error) {
        console.error('Display tracking failed:', error);
      }
    }
  }, []);

  const trackInteract = useCallback((proposition: MessagingProposition, actionId?: string): void => {
    try {
      if (actionId) {
        Messaging.trackPropositionInteract(proposition, actionId);
      } else {
        Messaging.trackPropositionInteract(proposition);
      }
      console.log(`Interact tracked: ${proposition.id}`);
    } catch (error) {
      console.error('Interact tracking failed:', error);
    }
  }, []);

  const trackDismiss = useCallback((proposition: MessagingProposition): void => {
    try {
      Messaging.trackPropositionDismiss(proposition);
      console.log(`Dismiss tracked: ${proposition.id}`);
    } catch (error) {
      console.error('Dismiss tracking failed:', error);
    }
  }, []);

  return {
    trackDisplay,
    trackInteract,
    trackDismiss,
  };
};

export default useContentCardTracking;
```

### FlatList Implementation with Viewport Tracking

For better performance and more accurate display tracking, use a FlatList with viewport detection to track display events only when cards actually appear on screen:

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ViewToken } from 'react-native';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface ContentCardWithProposition extends ContentCard {
  proposition: MessagingProposition;
  uniqueId: string;
}

interface ContentCardsFlatListProps {
  surfacePath?: string;
}

interface ViewabilityConfig {
  itemVisiblePercentThreshold: number;
  minimumViewTime: number;
}

interface ViewableItemsChangedInfo {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const ContentCardsFlatList: React.FC<ContentCardsFlatListProps> = ({ 
  surfacePath = 'homepage' 
}) => {
  const [contentCards, setContentCards] = useState<ContentCardWithProposition[]>([]);
  const [propositions, setPropositions] = useState<MessagingProposition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const displayedCards = useRef<Set<string>>(new Set());
  const flatListRef = useRef<FlatList<ContentCardWithProposition>>(null);

  useEffect(() => {
    fetchContentCards();
  }, [surfacePath]);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await Messaging.updatePropositionsForSurfaces([surfacePath]);
      const fetchedPropositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surfacePath);
      
      const cards: ContentCardWithProposition[] = fetchedPropositions.flatMap((proposition, propIndex) => 
        proposition.items
          .filter(item => item.schema === PersonalizationSchema.CONTENT_CARD)
          .map((item, itemIndex) => ({
            ...(item as ContentCard),
            proposition,
            uniqueId: `${proposition.id}-${itemIndex}`, // Unique ID for FlatList
          }))
      );
      
      setContentCards(cards || []);
      setPropositions(fetchedPropositions || []);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
      setPropositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Track display event when card appears in viewport
  const trackDisplayEvent = useCallback((proposition: MessagingProposition): void => {
    const propositionId = proposition.id;
    
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackPropositionDisplay(proposition);
        displayedCards.current.add(propositionId);
        console.log(`Display event tracked for proposition: ${propositionId}`);
      } catch (error) {
        console.error('Failed to track display event:', error);
      }
    }
  }, []);

  // Track interact event
  const trackInteractEvent = useCallback((proposition: MessagingProposition, actionId?: string): void => {
    try {
      if (actionId) {
        Messaging.trackPropositionInteract(proposition, actionId);
      } else {
        Messaging.trackPropositionInteract(proposition);
      }
      console.log(`Interact event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track interact event:', error);
    }
  }, []);

  // Track dismiss event
  const trackDismissEvent = useCallback((proposition: MessagingProposition): void => {
    try {
      Messaging.trackPropositionDismiss(proposition);
      console.log(`Dismiss event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track dismiss event:', error);
    }
  }, []);

  // Handle viewable items changed - track display events for visible cards
  const onViewableItemsChanged = useCallback(({ viewableItems }: ViewableItemsChangedInfo): void => {
    viewableItems.forEach(({ item }) => {
      if (item.proposition) {
        trackDisplayEvent(item.proposition);
      }
    });
  }, [trackDisplayEvent]);

  // Viewport configuration for determining when items are "viewable"
  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Card must be 50% visible to trigger display event
    minimumViewTime: 500, // Card must be visible for 500ms
  };

  const handleCardPress = useCallback((card: ContentCardWithProposition): void => {
    trackInteractEvent(card.proposition);
    
    if (card.data.content.actionUrl) {
      console.log(`Navigating to: ${card.data.content.actionUrl}`);
      // Handle navigation or custom action here
    }
  }, [trackInteractEvent]);

  const handleCardDismiss = useCallback((cardId: string): void => {
    const cardToRemove = contentCards.find(card => card.uniqueId === cardId);
    if (cardToRemove) {
      trackDismissEvent(cardToRemove.proposition);
      setContentCards(prevCards => prevCards.filter(card => card.uniqueId !== cardId));
    }
  }, [contentCards, trackDismissEvent]);

  const renderContentCard = ({ item: card }: { item: ContentCardWithProposition }): JSX.Element => {
    const { data } = card;

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => handleCardDismiss(card.uniqueId)}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => handleCardPress(card)}
          activeOpacity={0.8}
        >
          {data.content.image?.url && (
            <Image 
              source={{ uri: data.content.image.url }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardTextContent}>
            {data.content.title?.content && (
              <Text style={styles.cardTitle}>{data.content.title.content}</Text>
            )}
            {data.content.body?.content && (
              <Text style={styles.cardBody}>{data.content.body.content}</Text>
            )}
            {data.content.actionUrl && (
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>Learn More</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = (): JSX.Element => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No content cards available</Text>
    </View>
  );

  const keyExtractor = (item: ContentCardWithProposition): string => item.uniqueId;

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading content cards...</Text>
      </View>
    );
  }

  return (
    <FlatList<ContentCardWithProposition>
      ref={flatListRef}
      data={contentCards}
      renderItem={renderContentCard}
      keyExtractor={keyExtractor}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={styles.flatListContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true} // Optimize performance for large lists
      maxToRenderPerBatch={5} // Render 5 items per batch
      windowSize={10} // Keep 10 items in memory
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    padding: 16,
    flexGrow: 1,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  dismissButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dismissText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardTextContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ContentCardsFlatList;
```

### Key Features of the FlatList Implementation

1. **Viewport-Based Display Tracking**: Uses `onViewableItemsChanged` to track display events only when cards are actually visible to the user
2. **Viewability Configuration**: Cards must be 50% visible for 500ms before triggering a display event
3. **Performance Optimization**: Includes `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize` for better performance with large lists
4. **Unique Key Generation**: Each card gets a unique ID for proper FlatList rendering
5. **Empty State Handling**: Shows appropriate message when no content cards are available

### Viewability Configuration Options

You can customize the viewability behavior based on your tracking requirements:

```typescript
// More strict viewability - card must be fully visible
const strictViewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 100,
  minimumViewTime: 1000,
};

// More lenient viewability - card just needs to appear
const lenientViewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 25,
  minimumViewTime: 250,
};

// Custom viewability for different card types
interface CustomViewabilityConfig {
  viewAreaCoveragePercentThreshold: number;
  waitForInteraction: boolean;
}

const customViewabilityConfig: CustomViewabilityConfig = {
  viewAreaCoveragePercentThreshold: 75, // 75% of viewport must be covered
  waitForInteraction: false, // Don't wait for user interaction
};
```

### Advanced Usage with Multiple Surfaces

For applications with multiple content card locations, you can create a more sophisticated implementation:

```typescript
import React, { useState, useEffect } from 'react';
import { View, SectionList, Text, Image, TouchableOpacity, StyleSheet, SectionListData } from 'react-native';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface Surface {
  id: string;
  title: string;
}

interface CardSection {
  title: string;
  data: ContentCard[];
  surfaceId: string;
}

const MultiSurfaceContentCards: React.FC = () => {
  const [cardSections, setCardSections] = useState<CardSection[]>([]);

  const surfaces: Surface[] = [
    { id: 'homepage', title: 'Featured Content' },
    { id: 'product-recommendations', title: 'Recommended for You' },
    { id: 'promotions', title: 'Special Offers' }
  ];

  useEffect(() => {
    fetchAllContentCards();
  }, []);

  const fetchAllContentCards = async (): Promise<void> => {
    try {
      // Update propositions for all surfaces
      const surfacePaths: string[] = surfaces.map(surface => surface.id);
      await Messaging.updatePropositionsForSurfaces(surfacePaths);

      // Fetch content cards for each surface
      const sections: CardSection[] = await Promise.all(
        surfaces.map(async (surface): Promise<CardSection> => {
          const propositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surface.id);
          const cards: ContentCard[] = propositions.flatMap(proposition => 
            proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD) as ContentCard[]
          );
          
          return {
            title: surface.title,
            data: cards || [],
            surfaceId: surface.id
          };
        })
      );

      // Filter out sections with no cards
      const sectionsWithCards: CardSection[] = sections.filter(section => section.data.length > 0);
      setCardSections(sectionsWithCards);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
    }
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<ContentCard, CardSection> }): JSX.Element => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderContentCard = ({ item }: { item: ContentCard }): JSX.Element => {
    const { data } = item;
    
    return (
      <TouchableOpacity style={styles.cardWrapper}>
        {data.content.image?.url && (
          <Image source={{ uri: data.content.image.url }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          {data.content.title?.content && (
            <Text style={styles.cardTitle}>{data.content.title.content}</Text>
          )}
          {data.content.body?.content && (
            <Text style={styles.cardBody}>{data.content.body.content}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: ContentCard, index: number): string => `card-${item.id}-${index}`;

  return (
    <SectionList<ContentCard, CardSection>
      sections={cardSections}
      renderItem={renderContentCard}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Performance Considerations

1. **Caching**: Content cards are cached in-memory by the Messaging extension and persist through the application's lifecycle
2. **Batching**: Always batch surface requests when fetching content cards for multiple locations
3. **Lazy Loading**: Consider implementing lazy loading for content cards in long lists
4. **Refresh Strategy**: Implement a refresh strategy based on your app's usage patterns

```typescript
import { useState, useCallback, useEffect } from 'react';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface UseContentCardRefreshResult {
  cards: ContentCard[];
  refreshCards: (force?: boolean) => Promise<void>;
}

// Example refresh strategy
const useContentCardRefresh = (
  surfacePath: string, 
  refreshInterval: number = 300000 // 5 minutes
): UseContentCardRefreshResult => {
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const refreshCards = useCallback(async (force: boolean = false): Promise<void> => {
    const now = Date.now();
    if (force || (now - lastRefresh) > refreshInterval) {
      try {
        await Messaging.updatePropositionsForSurfaces([surfacePath]);
        const propositions: MessagingProposition[] = await Messaging.getPropositionsForSurface(surfacePath);
        const newCards: ContentCard[] = propositions.flatMap(proposition => 
          proposition.items.filter(item => item.schema === PersonalizationSchema.CONTENT_CARD) as ContentCard[]
        );
        setCards(newCards || []);
        setLastRefresh(now);
      } catch (error) {
        console.error('Failed to refresh content cards:', error);
      }
    }
  }, [surfacePath, refreshInterval, lastRefresh]);

  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  return { cards, refreshCards };
};
```

# Wrap Up
This implementation provides a comprehensive foundation for fetching and rendering content cards in your React Native application. Using the examples shown here, you can render content cards inside your application using whatever styles you would like. Happy coding!
