# PropositionItem-Based Tracking Example

This example demonstrates the new unified tracking approach using the `PropositionItem` base class, which mirrors the native Android implementation. Both ContentCards and code-based experiences now use the same underlying tracking mechanism.

## Architecture Overview

```typescript
PropositionItem (base class)
├── ContentCard extends PropositionItem
├── JSONPropositionItem extends PropositionItem
├── HTMLProposition extends PropositionItem
└── (Future) Other proposition types extend PropositionItem
```

All proposition items inherit the same tracking capabilities from the base `PropositionItem` class, just like in the native Android SDK.

## Basic Usage

### ContentCard with PropositionItem Tracking

```typescript
import { 
  ContentCard, 
  ContentCardData, 
  MessagingEdgeEventType,
  PropositionItem 
} from '@adobe/react-native-aepMessaging';

// Create a ContentCard (which extends PropositionItem)
const contentCardData: ContentCardData = {
  id: "card-123",
  data: {
    contentType: 'application/json',
    expiryDate: 1735689600,
    publishedDate: 1735603200,
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

// All PropositionItem tracking methods are available
contentCard.track(MessagingEdgeEventType.DISPLAY); // Single parameter
contentCard.track(null, MessagingEdgeEventType.DISPLAY, null); // Full parameters
contentCard.track("button_clicked", MessagingEdgeEventType.INTERACT, ["token1"]);

// Plus ContentCard-specific convenience methods
contentCard.trackDisplay();
contentCard.trackInteraction("card_clicked");
contentCard.trackDismiss("user_dismissed");
```

### Code-Based Experience with JSONPropositionItem

```typescript
import { 
  JSONPropositionItem, 
  JSONPropositionItemData, 
  MessagingEdgeEventType 
} from '@adobe/react-native-aepMessaging';

// Create a JSONPropositionItem (which extends PropositionItem)
const jsonData: JSONPropositionItemData = {
  id: "json-item-456",
  data: {
    content: '{"title": "Special Offer", "discount": "20%", "cta": "Shop Now"}'
  },
  schema: PersonalizationSchema.JSON_CONTENT
};

const jsonPropositionItem = new JSONPropositionItem(jsonData);

// Same tracking methods available as ContentCard
jsonPropositionItem.track(MessagingEdgeEventType.DISPLAY);
jsonPropositionItem.track("offer_viewed", MessagingEdgeEventType.INTERACT, null);

// JSONPropositionItem-specific methods
const parsedContent = jsonPropositionItem.getParsedContent();
console.log(parsedContent); // { title: "Special Offer", discount: "20%", cta: "Shop Now" }
```

### HTML Experience with HTMLProposition

```typescript
import { 
  HTMLProposition, 
  HTMLPropositionData, 
  MessagingEdgeEventType 
} from '@adobe/react-native-aepMessaging';

// Create an HTMLProposition (which extends PropositionItem)
const htmlData: HTMLPropositionData = {
  id: "html-banner-789",
  data: {
    content: `
      <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px;">
        <h2 style="color: white; margin: 0;">Summer Sale!</h2>
        <p style="color: white; margin: 10px 0;">Up to 50% off on all items</p>
        <button onclick="trackAction('shop_now')" style="background: white; color: #333; padding: 10px 20px; border: none; border-radius: 5px;">
          Shop Now
        </button>
        <a href="https://example.com/terms" style="color: white; margin-left: 10px;">Terms & Conditions</a>
      </div>
    `
  },
  schema: PersonalizationSchema.HTML_CONTENT
};

const htmlProposition = new HTMLProposition(htmlData);

// Same tracking methods available as other proposition items
htmlProposition.track(MessagingEdgeEventType.DISPLAY);
htmlProposition.track("banner_viewed", MessagingEdgeEventType.INTERACT, null);

// HTMLProposition-specific methods
console.log(htmlProposition.hasInteractiveElements()); // true (has button and link)
console.log(htmlProposition.isFullPageExperience()); // false (just a banner)
console.log(htmlProposition.extractLinks()); // ["https://example.com/terms"]
console.log(htmlProposition.getWordCount()); // Approximately 12 words

// Convenience tracking methods
htmlProposition.trackDisplay(); // Track when banner is shown
htmlProposition.trackInteraction("button_clicked"); // Track button clicks
htmlProposition.trackDismiss("user_closed"); // Track when user closes banner
```

## Advanced Tracking Features

### XDM Data Generation

```typescript
// Generate XDM data for analytics (mirrors native functionality)
const xdmData = await contentCard.generateInteractionXdm(MessagingEdgeEventType.DISPLAY);
console.log(xdmData); // XDM-formatted tracking data

// With full parameters
const xdmDataWithTokens = await contentCard.generateInteractionXdm(
  "button_clicked", 
  MessagingEdgeEventType.INTERACT, 
  ["token1", "token2"]
);
```

### Generic PropositionItem Handling

```typescript
// Function that can handle any proposition item type
function trackPropositionDisplay(item: PropositionItem) {
  if (item.isContentCard()) {
    console.log("Tracking ContentCard display");
    item.track(MessagingEdgeEventType.DISPLAY);
  } else if (item.isJsonContent()) {
    console.log("Tracking JSON content display");
    item.track("json_content_viewed", MessagingEdgeEventType.DISPLAY, null);
  } else if (item.isHtmlContent()) {
    console.log("Tracking HTML content display");
    item.track(MessagingEdgeEventType.DISPLAY);
  } else {
    console.log("Tracking unknown proposition type display");
    item.track(MessagingEdgeEventType.DISPLAY);
  }
}

// Works with any proposition item type
trackPropositionDisplay(contentCard);
trackPropositionDisplay(jsonPropositionItem);
trackPropositionDisplay(htmlProposition);
```

## React Native Component Integration

### Universal Proposition Item Component

```typescript
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropositionItem, MessagingEdgeEventType } from '@adobe/react-native-aepMessaging';

interface PropositionItemComponentProps {
  propositionItem: PropositionItem;
  onInteraction?: (interaction: string) => void;
}

const PropositionItemComponent: React.FC<PropositionItemComponentProps> = ({ 
  propositionItem, 
  onInteraction 
}) => {
  // Track display when component mounts
  useEffect(() => {
    propositionItem.track(MessagingEdgeEventType.DISPLAY);
  }, [propositionItem]);

  const handlePress = () => {
    const interaction = propositionItem.isContentCard() ? "card_clicked" : "content_clicked";
    propositionItem.track(interaction, MessagingEdgeEventType.INTERACT, null);
    onInteraction?.(interaction);
  };

  const renderContent = () => {
    if (propositionItem.isContentCard()) {
      const contentCard = propositionItem as ContentCard;
      return (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {contentCard.getTitle()}
          </Text>
          <Text>{contentCard.getBody()}</Text>
        </View>
      );
    } else if (propositionItem.isJsonContent()) {
      const jsonItem = propositionItem as JSONPropositionItem;
      const content = jsonItem.getParsedContent();
      return (
        <View>
          <Text>JSON Content: {JSON.stringify(content)}</Text>
        </View>
      );
    } else if (propositionItem.isHtmlContent()) {
      const htmlItem = propositionItem as HTMLProposition;
      return (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>HTML Content</Text>
          <Text numberOfLines={3}>{htmlItem.getContent()}</Text>
          {htmlItem.hasInteractiveElements() && (
            <Text style={{ fontSize: 12, color: 'blue', marginTop: 5 }}>
              ⚡ Interactive content available
            </Text>
          )}
        </View>
      );
    }
    return <Text>Unknown content type</Text>;
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ padding: 16, margin: 8, backgroundColor: '#f0f0f0' }}>
      {renderContent()}
    </TouchableOpacity>
  );
};
```

### Proposition Management Hook

```typescript
import { useState, useEffect } from 'react';
import { PropositionItem, MessagingEdgeEventType } from '@adobe/react-native-aepMessaging';

export const usePropositionTracking = (items: PropositionItem[]) => {
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());

  const trackItemDisplay = (item: PropositionItem) => {
    if (!viewedItems.has(item.getItemId())) {
      item.track(MessagingEdgeEventType.DISPLAY);
      setViewedItems(prev => new Set(prev).add(item.getItemId()));
    }
  };

  const trackItemInteraction = (item: PropositionItem, interaction: string) => {
    item.track(interaction, MessagingEdgeEventType.INTERACT, null);
  };

  const trackItemDismiss = (item: PropositionItem, reason: string = "user_dismissed") => {
    item.track(reason, MessagingEdgeEventType.DISMISS, null);
  };

  return {
    trackItemDisplay,
    trackItemInteraction,
    trackItemDismiss,
    viewedItems
  };
};
```

## Native Implementation Requirements

To support this unified approach, you'll need to implement these methods in your native modules:

### Android Implementation

```java
@ReactMethod
public void trackPropositionItem(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens) {
    MessagingEdgeEventType edgeEventType = MessagingEdgeEventType.values()[eventType];
    
    // Find the PropositionItem by ID (you'll need to maintain a mapping)
    PropositionItem propositionItem = findPropositionItemById(itemId);
    
    if (propositionItem != null) {
        List<String> tokenList = tokens != null ? tokens.toArrayList().stream()
            .map(Object::toString)
            .collect(Collectors.toList()) : null;
        
        if (interaction != null && tokenList != null) {
            propositionItem.track(interaction, edgeEventType, tokenList);
        } else if (interaction != null) {
            propositionItem.track(interaction, edgeEventType, null);
        } else {
            propositionItem.track(edgeEventType);
        }
    }
}

@ReactMethod
public void generatePropositionInteractionXdm(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens, Promise promise) {
    MessagingEdgeEventType edgeEventType = MessagingEdgeEventType.values()[eventType];
    PropositionItem propositionItem = findPropositionItemById(itemId);
    
    if (propositionItem != null) {
        List<String> tokenList = tokens != null ? tokens.toArrayList().stream()
            .map(Object::toString)
            .collect(Collectors.toList()) : null;
        
        Map<String, Object> xdmData = propositionItem.generateInteractionXdm(interaction, edgeEventType, tokenList);
        promise.resolve(Arguments.makeNativeMap(xdmData));
    } else {
        promise.reject("PropositionItem not found", "No PropositionItem found with ID: " + itemId);
    }
}
```

### iOS Implementation

```objc
RCT_EXPORT_METHOD(trackPropositionItem:(NSString *)itemId 
                 interaction:(NSString * _Nullable)interaction 
                 eventType:(NSInteger)eventType 
                 tokens:(NSArray<NSString *> * _Nullable)tokens) {
    AEPMessagingEdgeEventType edgeEventType = (AEPMessagingEdgeEventType)eventType;
    AEPPropositionItem *propositionItem = [self findPropositionItemById:itemId];
    
    if (propositionItem) {
        if (interaction && tokens) {
            [propositionItem track:interaction eventType:edgeEventType tokens:tokens];
        } else if (interaction) {
            [propositionItem track:interaction eventType:edgeEventType];
        } else {
            [propositionItem track:edgeEventType];
        }
    }
}

RCT_EXPORT_METHOD(generatePropositionInteractionXdm:(NSString *)itemId 
                 interaction:(NSString * _Nullable)interaction 
                 eventType:(NSInteger)eventType 
                 tokens:(NSArray<NSString *> * _Nullable)tokens
                 resolve:(RCTPromiseResolveBlock)resolve 
                 reject:(RCTPromiseRejectBlock)reject) {
    AEPMessagingEdgeEventType edgeEventType = (AEPMessagingEdgeEventType)eventType;
    AEPPropositionItem *propositionItem = [self findPropositionItemById:itemId];
    
    if (propositionItem) {
        NSDictionary *xdmData = [propositionItem generateInteractionXdm:interaction eventType:edgeEventType tokens:tokens];
        resolve(xdmData);
    } else {
        reject(@"PropositionItem not found", [NSString stringWithFormat:@"No PropositionItem found with ID: %@", itemId], nil);
    }
}
```

## Benefits of This Approach

1. **Unified Architecture**: Mirrors the native Android/iOS SDK structure
2. **Consistent API**: Same tracking methods across all proposition types
3. **Extensibility**: Easy to add new proposition item types
4. **Type Safety**: Strong TypeScript typing with inheritance
5. **Code Reuse**: Common tracking logic shared across all types
6. **Future-Proof**: Scalable for additional Adobe Journey Optimizer features

## Migration from Previous Implementation

```typescript
// Old approach (if you had any HTML-specific tracking)
// No previous HTML tracking methods existed

// New unified approach (recommended for all proposition types)
const contentCard = new ContentCard(contentCardData);
contentCard.track(MessagingEdgeEventType.DISPLAY);
contentCard.track("user_interaction", MessagingEdgeEventType.INTERACT, null);

// For JSON code-based experiences
const jsonItem = new JSONPropositionItem(jsonData);
jsonItem.track(MessagingEdgeEventType.DISPLAY);
jsonItem.track("offer_clicked", MessagingEdgeEventType.INTERACT, ["offer_token"]);

// For HTML code-based experiences (NEW)
const htmlItem = new HTMLProposition(htmlData);
htmlItem.track(MessagingEdgeEventType.DISPLAY);
htmlItem.track("banner_interaction", MessagingEdgeEventType.INTERACT, null);

// Universal approach - works with any proposition type
function trackAnyProposition(item: PropositionItem, interaction?: string) {
  item.track(MessagingEdgeEventType.DISPLAY);
  if (interaction) {
    item.track(interaction, MessagingEdgeEventType.INTERACT, null);
  }
}

// Works seamlessly across all types
trackAnyProposition(contentCard);
trackAnyProposition(jsonItem, "json_viewed");
trackAnyProposition(htmlItem, "html_viewed");
```

This approach provides a much more scalable and maintainable solution that aligns perfectly with the native SDK architecture! 