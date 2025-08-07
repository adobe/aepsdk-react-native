# ContentCard Tracking Example

This example demonstrates how to use the new ContentCard tracking functionality in the React Native Messaging wrapper.

## Basic Usage

```typescript
import { ContentCard, ContentCardData, MessagingEdgeEventType } from '@adobe/react-native-aepMessaging';

// Create a ContentCard instance from your data
const contentCardData: ContentCardData = {
  id: "card-123",
  data: {
    contentType: 'application/json',
    expiryDate: 1735689600, // Some future timestamp
    publishedDate: 1735603200, // Some past timestamp
    content: {
      actionUrl: "https://example.com",
      body: { content: "This is the card body" },
      title: { content: "Card Title" },
      buttons: [
        {
          actionUrl: "https://example.com/action",
          id: "btn-1",
          text: { content: "Click Me" },
          interactId: "button-interact-1"
        }
      ],
      image: { alt: "Card Image", url: "https://example.com/image.jpg" },
      dismissBtn: { style: "circle" }
    },
    meta: {
      adobe: { template: "SmallImage" },
      dismissState: false,
      readState: false,
      surface: "mobileapp://com.example.app/main"
    }
  },
  schema: PersonalizationSchema.CONTENT_CARD
};

const contentCard = new ContentCard(contentCardData);
```

## Tracking Examples

### 1. Track Display (when card is shown to user)
```typescript
// Method 1: Using convenience method
contentCard.trackDisplay();

// Method 2: Using general track method
contentCard.track(null, MessagingEdgeEventType.DISPLAY);
```

### 2. Track User Interactions
```typescript
// Track general card click
contentCard.trackInteraction("card_clicked");

// Track specific button clicks
contentCard.track("button_1_clicked", MessagingEdgeEventType.INTERACT);

// Track action URL clicks
contentCard.track("action_url_clicked", MessagingEdgeEventType.INTERACT);
```

### 3. Track Dismissal
```typescript
// Method 1: Using convenience method (no specific interaction)
contentCard.trackDismiss();

// Method 2: With specific interaction identifier
contentCard.trackDismiss("user_dismissed");

// Method 3: Using general track method
contentCard.track("auto_dismissed", MessagingEdgeEventType.DISMISS);
```

### 4. Track Custom Events
```typescript
// Track when user reads the content
contentCard.track("content_read", MessagingEdgeEventType.INTERACT);

// Track when card expires
if (contentCard.isExpired()) {
  contentCard.track("card_expired", MessagingEdgeEventType.DISPLAY);
}

// Track based on card state
if (!contentCard.isRead()) {
  contentCard.track("card_viewed_first_time", MessagingEdgeEventType.DISPLAY);
}
```

## Integration with React Native Components

### Basic ContentCard Component
```typescript
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ContentCard, MessagingEdgeEventType } from '@adobe/react-native-aepMessaging';

interface ContentCardComponentProps {
  contentCard: ContentCard;
}

const ContentCardComponent: React.FC<ContentCardComponentProps> = ({ contentCard }) => {
  // Track display when component mounts
  useEffect(() => {
    contentCard.trackDisplay();
  }, [contentCard]);

  const handleCardPress = () => {
    contentCard.trackInteraction("card_body_clicked");
    // Handle navigation or action
  };

  const handleButtonPress = (buttonId: string) => {
    contentCard.track(`button_${buttonId}_clicked`, MessagingEdgeEventType.INTERACT);
    // Handle button action
  };

  const handleDismiss = () => {
    contentCard.trackDismiss("user_dismissed");
    // Handle card dismissal
  };

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={{ padding: 16, backgroundColor: 'white', marginVertical: 8 }}>
        <Image 
          source={{ uri: contentCard.getImageUrl() }} 
          style={{ width: 100, height: 100 }}
          alt={contentCard.getImageAlt()}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {contentCard.getTitle()}
        </Text>
        <Text style={{ fontSize: 14, marginVertical: 8 }}>
          {contentCard.getBody()}
        </Text>
        
        {/* Render buttons */}
        {contentCard.getButtons().map((button) => (
          <TouchableOpacity 
            key={button.id}
            onPress={() => handleButtonPress(button.id)}
            style={{ backgroundColor: 'blue', padding: 8, marginVertical: 4 }}
          >
            <Text style={{ color: 'white' }}>{button.text.content}</Text>
          </TouchableOpacity>
        ))}
        
        {/* Dismiss button */}
        <TouchableOpacity onPress={handleDismiss} style={{ position: 'absolute', top: 8, right: 8 }}>
          <Text>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
```

### Advanced Usage with State Management
```typescript
import React, { useState, useEffect } from 'react';
import { ContentCard } from '@adobe/react-native-aepMessaging';

const ContentCardList: React.FC = () => {
  const [contentCards, setContentCards] = useState<ContentCard[]>([]);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const handleCardViewed = (card: ContentCard) => {
    if (!viewedCards.has(card.id)) {
      card.trackDisplay();
      setViewedCards(prev => new Set(prev).add(card.id));
    }
  };

  const handleCardInteraction = (card: ContentCard, interaction: string) => {
    card.trackInteraction(interaction);
  };

  const handleCardDismiss = (card: ContentCard) => {
    card.trackDismiss("user_dismissed");
    setContentCards(prev => prev.filter(c => c.id !== card.id));
  };

  return (
    <View>
      {contentCards.map(card => (
        <ContentCardComponent 
          key={card.id}
          contentCard={card}
          onViewed={() => handleCardViewed(card)}
          onInteraction={(interaction) => handleCardInteraction(card, interaction)}
          onDismiss={() => handleCardDismiss(card)}
        />
      ))}
    </View>
  );
};
```

## Helper Utilities

### ContentCard Utility Functions
```typescript
// Utility to check if tracking should occur based on card state
export const shouldTrackCard = (card: ContentCard): boolean => {
  return !card.isExpired() && !card.isDismissed();
};

// Utility to get appropriate interaction based on card template
export const getTemplateSpecificInteraction = (card: ContentCard, action: string): string => {
  const template = card.getTemplate();
  return `${template.toLowerCase()}_${action}`;
};

// Utility to track card lifecycle events
export const trackCardLifecycle = (card: ContentCard, event: 'shown' | 'hidden' | 'expired') => {
  if (!shouldTrackCard(card)) return;
  
  switch (event) {
    case 'shown':
      card.trackDisplay();
      break;
    case 'hidden':
      card.trackDismiss('auto_hidden');
      break;
    case 'expired':
      card.track('card_expired', MessagingEdgeEventType.DISPLAY);
      break;
  }
};
```

## Migration from Legacy trackContentCardDisplay/trackContentCardInteraction

If you were previously using the static methods from the Messaging class:

```typescript
// Old way (still supported)
Messaging.trackContentCardDisplay(proposition, contentCard);
Messaging.trackContentCardInteraction(proposition, contentCard);

// New way (recommended)
const card = new ContentCard(contentCard);
card.trackDisplay();
card.trackInteraction("user_clicked");
```

The new approach provides:
- Better encapsulation and object-oriented design
- More granular tracking options
- Convenience methods for common operations
- Better TypeScript support and intellisense
- Consistent API with the Message class 