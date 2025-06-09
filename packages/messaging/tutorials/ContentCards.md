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

After updating propositions, retrieve the content cards for a specific surface using the `getPropositionsForSurfaces` API. This returns a record of surface names with their corresponding propositions that contain content cards for which the user is qualified.

**Important**: Only content cards for which the user has qualified are returned. User qualification is determined by the delivery rules configured in Adobe Journey Optimizer.

```typescript
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

// Retrieve propositions for specific surfaces
const getContentCards = async (surfacePaths: string[]): Promise<ContentCard[]> => {
  try {
    const propositionsMap: Record<string, MessagingProposition[]> = await Messaging.getPropositionsForSurfaces(surfacePaths);
    
    const allContentCards: ContentCard[] = [];
    
    // Extract content cards from all surfaces
    Object.values(propositionsMap).forEach(propositions => {
      propositions.forEach(proposition => {
        const contentCards = proposition.items.filter(
          item => item.schema === PersonalizationSchema.CONTENT_CARD
        ) as ContentCard[];
        allContentCards.push(...contentCards);
      });
    });
    
    console.log(`Found ${allContentCards.length} content cards across all surfaces`);
    return allContentCards;
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
      const propositionsMap: Record<string, MessagingProposition[]> = await Messaging.getPropositionsForSurfaces([surfacePath]);
      const propositions = propositionsMap[surfacePath] || [];
      
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

Content cards support event tracking to measure user engagement and campaign effectiveness. The AEPMessaging extension provides methods to track two key events: display and interact. These events help you understand how users engage with your content cards and optimize your campaigns accordingly.

### Event Types

- **Display**: Triggered when a content card is shown to the user
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
      const propositionsMap: Record<string, MessagingProposition[]> = await Messaging.getPropositionsForSurfaces([surfacePath]);
      const fetchedPropositions = propositionsMap[surfacePath] || [];
      
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
  const trackDisplayEvent = (proposition: MessagingProposition, contentCard: ContentCard): void => {
    const propositionId = proposition.id;
    
    // Prevent duplicate display events for the same card
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackContentCardDisplay(proposition, contentCard);
        displayedCards.current.add(propositionId);
        console.log(`Display event tracked for proposition: ${propositionId}`);
      } catch (error) {
        console.error('Failed to track display event:', error);
      }
    }
  };

  // Track interact event when user taps on card
  const trackInteractEvent = (proposition: MessagingProposition, contentCard: ContentCard): void => {
    try {
      Messaging.trackContentCardInteraction(proposition, contentCard);
      console.log(`Interact event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track interact event:', error);
    }
  };

  const handleCardPress = (card: ContentCard, proposition: MessagingProposition): void => {
    // Track interaction
    trackInteractEvent(proposition, card);
    
    // Handle card action (e.g., navigate to URL)
    if (card.data.content.actionUrl) {
      // Navigate to action URL or handle custom action
      console.log(`Navigating to: ${card.data.content.actionUrl}`);
    }
  };

  const handleCardDismiss = (cardIndex: number): void => {
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
        trackDisplayEvent(proposition, card);
      }
    }, [proposition]);

    return (
      <View key={index} style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => handleCardDismiss(index)}
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
3. **Error Handling**: Implement proper error handling for tracking calls to prevent app crashes

### Custom Event Tracking Hook

For reusable event tracking logic, consider creating a custom hook:

```typescript
import { useCallback, useRef } from 'react';
import { Messaging, MessagingProposition, ContentCard } from '@adobe/react-native-aepmessaging';

interface ContentCardTracking {
  trackDisplay: (proposition: MessagingProposition, contentCard: ContentCard) => void;
  trackInteract: (proposition: MessagingProposition, contentCard: ContentCard) => void;
}

const useContentCardTracking = (): ContentCardTracking => {
  const displayedCards = useRef<Set<string>>(new Set());

  const trackDisplay = useCallback((proposition: MessagingProposition, contentCard: ContentCard): void => {
    const propositionId = proposition.id;
    
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackContentCardDisplay(proposition, contentCard);
        displayedCards.current.add(propositionId);
        console.log(`Display tracked: ${propositionId}`);
      } catch (error) {
        console.error('Display tracking failed:', error);
      }
    }
  }, []);

  const trackInteract = useCallback((proposition: MessagingProposition, contentCard: ContentCard): void => {
    try {
      Messaging.trackContentCardInteraction(proposition, contentCard);
      console.log(`Interact tracked: ${proposition.id}`);
    } catch (error) {
      console.error('Interact tracking failed:', error);
    }
  }, []);

  return {
    trackDisplay,
    trackInteract,
  };
};

export default useContentCardTracking;
```

### Advanced Usage Example

Here's a more comprehensive example showing how to use the tracking methods in a production-ready implementation:

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ViewToken } from 'react-native';
import { Messaging, MessagingProposition, ContentCard, PersonalizationSchema } from '@adobe/react-native-aepmessaging';

interface ContentCardWithProposition extends ContentCard {
  proposition: MessagingProposition;
  uniqueId: string;
}

interface ContentCardsFlatListProps {
  surfacePaths?: string[];
}

const ContentCardsFlatList: React.FC<ContentCardsFlatListProps> = ({ 
  surfacePaths = ['homepage'] 
}) => {
  const [contentCards, setContentCards] = useState<ContentCardWithProposition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const displayedCards = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchContentCards();
  }, [surfacePaths]);

  const fetchContentCards = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await Messaging.updatePropositionsForSurfaces(surfacePaths);
      const propositionsMap: Record<string, MessagingProposition[]> = await Messaging.getPropositionsForSurfaces(surfacePaths);
      
      const cards: ContentCardWithProposition[] = [];
      
      Object.entries(propositionsMap).forEach(([surface, propositions]) => {
        propositions.forEach((proposition, propIndex) => {
          proposition.items
            .filter(item => item.schema === PersonalizationSchema.CONTENT_CARD)
            .forEach((item, itemIndex) => {
              cards.push({
                ...(item as ContentCard),
                proposition,
                uniqueId: `${surface}-${proposition.id}-${itemIndex}`,
              });
            });
        });
      });
      
      setContentCards(cards);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Track display event when card appears in viewport
  const trackDisplayEvent = useCallback((proposition: MessagingProposition, contentCard: ContentCard): void => {
    const propositionId = proposition.id;
    
    if (!displayedCards.current.has(propositionId)) {
      try {
        Messaging.trackContentCardDisplay(proposition, contentCard);
        displayedCards.current.add(propositionId);
        console.log(`Display event tracked for proposition: ${propositionId}`);
      } catch (error) {
        console.error('Failed to track display event:', error);
      }
    }
  }, []);

  // Track interact event
  const trackInteractEvent = useCallback((proposition: MessagingProposition, contentCard: ContentCard): void => {
    try {
      Messaging.trackContentCardInteraction(proposition, contentCard);
      console.log(`Interact event tracked for proposition: ${proposition.id}`);
    } catch (error) {
      console.error('Failed to track interact event:', error);
    }
  }, []);

  // Handle viewable items changed - track display events for visible cards
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }): void => {
    viewableItems.forEach(({ item }) => {
      if (item.proposition) {
        trackDisplayEvent(item.proposition, item);
      }
    });
  }, [trackDisplayEvent]);

  const handleCardPress = useCallback((card: ContentCardWithProposition): void => {
    trackInteractEvent(card.proposition, card);
    
    if (card.data.content.actionUrl) {
      console.log(`Navigating to: ${card.data.content.actionUrl}`);
      // Handle navigation or custom action here
    }
  }, [trackInteractEvent]);

  const renderContentCard = ({ item: card }: { item: ContentCardWithProposition }): JSX.Element => {
    const { data } = card;

    return (
      <TouchableOpacity 
        style={styles.cardContainer}
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
    );
  };

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
      data={contentCards}
      renderItem={renderContentCard}
      keyExtractor={keyExtractor}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 500,
      }}
      contentContainerStyle={styles.flatListContainer}
      showsVerticalScrollIndicator={false}
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
    overflow: 'hidden',
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
});

export default ContentCardsFlatList;
```

## Performance Considerations

1. **Caching**: Content cards are cached in-memory by the Messaging extension and persist through the application's lifecycle
2. **Batching**: Always batch surface requests when fetching content cards for multiple locations
3. **Viewport Tracking**: Use FlatList with `onViewableItemsChanged` for accurate display tracking
4. **Error Handling**: Implement proper error handling for all tracking calls

## Wrap Up

This implementation provides a comprehensive foundation for fetching, rendering, and tracking content cards in your React Native application using the `trackContentCardDisplay` and `trackContentCardInteraction` methods. These methods provide specific tracking for content card interactions, allowing for better analytics and campaign optimization.

The key benefits of these tracking methods:
- **Simplified API**: Direct methods for content card tracking without needing to handle proposition-level details
- **Better Analytics**: More specific event data for content card interactions
- **Easier Implementation**: Cleaner code with dedicated methods for content card events

Happy coding! 