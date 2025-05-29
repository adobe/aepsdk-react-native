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

```javascript
import { Messaging } from '@adobe/react-native-aepmessaging';

// Define surfaces of content cards to retrieve
const surfaces = ['homepage', 'product-detail', 'checkout'];

// Fetch content cards for multiple surfaces
try {
  await Messaging.updatePropositionsForSurfaces(surfaces);
  console.log('Content cards updated successfully');
} catch (error) {
  console.error('Failed to update content cards:', error);
}
```

### Step 2: Retrieve Content Cards

After updating propositions, retrieve the content cards for a specific surface using the `getPropositionsForSurface` API. This returns an array of `Proposition` objects that contain content cards for which the user is qualified.

**Important**: Only content cards for which the user has qualified are returned. User qualification is determined by the delivery rules configured in Adobe Journey Optimizer.

```javascript
import { Messaging } from '@adobe/react-native-aepmessaging';

// Retrieve propositions for a specific surface
const getContentCards = async (surfacePath) => {
  try {
    const propositions = await Messaging.getPropositionsForSurface(surfacePath);
    
    if (propositions && propositions.length > 0) {
      console.log(`Found ${propositions.length} propositions for surface: ${surfacePath}`);
      
      // Extract content cards from propositions
      const contentCards = propositions.flatMap(proposition => 
        proposition.items.filter(item => item.schema === 'https://ns.adobe.com/personalization/message/content-card')
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

```javascript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Messaging } from '@adobe/react-native-aepmessaging';

const ContentCardsScreen = ({ surfacePath = 'homepage' }) => {
  const [contentCards, setContentCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentCards();
  }, [surfacePath]);

  const fetchContentCards = async () => {
    try {
      setLoading(true);
      
      // First, update propositions for the surface
      await Messaging.updatePropositionsForSurfaces([surfacePath]);
      
      // Then retrieve the propositions and extract content cards
      const propositions = await Messaging.getPropositionsForSurface(surfacePath);
      const cards = propositions.flatMap(proposition => 
        proposition.items.filter(item => item.schema === 'https://ns.adobe.com/personalization/message/content-card')
      );
      
      setContentCards(cards || []);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
      setContentCards([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContentCard = (card, index) => {
    const { data } = card;
    
    return (
      <TouchableOpacity key={index} style={styles.cardContainer}>
        {data.imageUrl && (
          <Image source={{ uri: data.imageUrl }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          {data.title && <Text style={styles.cardTitle}>{data.title}</Text>}
          {data.body && <Text style={styles.cardBody}>{data.body}</Text>}
          {data.actionUrl && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>{data.actionText || 'Learn More'}</Text>
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

### Advanced Usage with Multiple Surfaces

For applications with multiple content card locations, you can create a more sophisticated implementation:

```javascript
import React, { useState, useEffect } from 'react';
import { View, SectionList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Messaging } from '@adobe/react-native-aepmessaging';

const MultiSurfaceContentCards = () => {
  const [cardSections, setCardSections] = useState([]);

  const surfaces = [
    { id: 'homepage', title: 'Featured Content' },
    { id: 'product-recommendations', title: 'Recommended for You' },
    { id: 'promotions', title: 'Special Offers' }
  ];

  useEffect(() => {
    fetchAllContentCards();
  }, []);

  const fetchAllContentCards = async () => {
    try {
      // Update propositions for all surfaces
      const surfacePaths = surfaces.map(surface => surface.id);
      await Messaging.updatePropositionsForSurfaces(surfacePaths);

      // Fetch content cards for each surface
      const sections = await Promise.all(
        surfaces.map(async (surface) => {
          const propositions = await Messaging.getPropositionsForSurface(surface.id);
          const cards = propositions.flatMap(proposition => 
            proposition.items.filter(item => item.schema === 'https://ns.adobe.com/personalization/message/content-card')
          );
          
          return {
            title: surface.title,
            data: cards || [],
            surfaceId: surface.id
          };
        })
      );

      // Filter out sections with no cards
      const sectionsWithCards = sections.filter(section => section.data.length > 0);
      setCardSections(sectionsWithCards);
    } catch (error) {
      console.error('Failed to fetch content cards:', error);
    }
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderContentCard = ({ item, index }) => {
    const { data } = item;
    
    return (
      <TouchableOpacity style={styles.cardWrapper}>
        {data.imageUrl && (
          <Image source={{ uri: data.imageUrl }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          {data.title && <Text style={styles.cardTitle}>{data.title}</Text>}
          {data.body && <Text style={styles.cardBody}>{data.body}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      sections={cardSections}
      renderItem={renderContentCard}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => `card-${index}`}
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

```javascript
// Example refresh strategy
const useContentCardRefresh = (surfacePath, refreshInterval = 300000) => { // 5 minutes
  const [cards, setCards] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(0);

  const refreshCards = useCallback(async (force = false) => {
    const now = Date.now();
    if (force || (now - lastRefresh) > refreshInterval) {
      try {
        await Messaging.updatePropositionsForSurfaces([surfacePath]);
        const propositions = await Messaging.getPropositionsForSurface(surfacePath);
        const newCards = propositions.flatMap(proposition => 
          proposition.items.filter(item => item.schema === 'https://ns.adobe.com/personalization/message/content-card')
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
