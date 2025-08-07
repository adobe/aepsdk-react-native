# ItemId Flow Example: User Code → Native Implementation

This example demonstrates how the `itemId` flows from user React Native code down to the native `trackPropositionItem` method.

## Step-by-Step Flow

### **Step 1: User Retrieves Propositions**

```typescript
import { Messaging } from '@adobe/react-native-aepmessaging';

// User calls this to get propositions
const propositions = await Messaging.getPropositionsForSurfaces(['homepage', 'product-page']);
```

### **Step 2: Native Response (What Gets Returned)**

The native code returns proposition data like this:

```typescript
// Example response structure
{
  "homepage": [
    {
      "uniqueId": "AT:eyJhY3Rpdml0eUlkIjoiMTM3NTg5IiwiZXhwZXJpZW5jZUlkIjoiMCJ9",
      "items": [
        {
          "id": "xcore:personalized-offer:124e36a756c8", // <- This is the itemId
          "schema": "https://ns.adobe.com/personalization/content-card",
          "data": {
            "content": {
              "title": "Summer Sale!",
              "body": "Get 50% off on summer collection",
              "imageUrl": "https://example.com/summer.jpg"
            }
          }
        }
      ],
      "scope": {
        "surface": "homepage"
      }
    }
  ],
  "product-page": [
    {
      "uniqueId": "AT:eyJhY3Rpdml0eUlkIjoiMTM3NTkwIiwiZXhwZXJpZW5jZUlkIjoiMCJ9",
      "items": [
        {
          "id": "xcore:personalized-offer:789xyz456def", // <- Another itemId
          "schema": "https://ns.adobe.com/personalization/html-content-item",
          "data": {
            "content": "<div>Special offer for this product!</div>",
            "format": "text/html"
          }
        }
      ],
      "scope": {
        "surface": "product-page"
      }
    }
  ]
}
```

### **Step 3: Native Caching (Happens Automatically)**

When the propositions are retrieved, the native code automatically caches the PropositionItems:

**Android Cache State After Step 2:**
```java
// propositionItemCache contents:
{
  "xcore:personalized-offer:124e36a756c8" -> PropositionItem(id="xcore:personalized-offer:124e36a756c8", schema=CONTENT_CARD, ...),
  "xcore:personalized-offer:789xyz456def" -> PropositionItem(id="xcore:personalized-offer:789xyz456def", schema=HTML_CONTENT, ...)
}

// propositionCache contents:
{
  "xcore:personalized-offer:124e36a756c8" -> Proposition(uniqueId="AT:eyJhY3Rpdml0eUlkIjoiMTM3NTg5IiwiZXhwZXJpZW5jZUlkIjoiMCJ9", ...),
  "xcore:personalized-offer:789xyz456def" -> Proposition(uniqueId="AT:eyJhY3Rpdml0eUlkIjoiMTM3NTkwIiwiZXhwZXJpZW5jZUlkIjoiMCJ9", ...)
}
```

### **Step 4: User Creates Typed Objects**

```typescript
import { ContentCard, HTMLProposition } from '@adobe/react-native-aepmessaging';

// User creates ContentCard from homepage proposition
const homepageItems = propositions['homepage'][0].items;
const contentCard = new ContentCard({
  id: homepageItems[0].id,        // "xcore:personalized-offer:124e36a756c8"
  schema: homepageItems[0].schema,
  data: homepageItems[0].data,
  // ... other fields
});

// User creates HTMLProposition from product-page proposition
const productPageItems = propositions['product-page'][0].items;
const htmlProposition = new HTMLProposition({
  id: productPageItems[0].id,     // "xcore:personalized-offer:789xyz456def"
  schema: productPageItems[0].schema,
  data: productPageItems[0].data,
  // ... other fields
});
```

### **Step 5: User Calls Tracking Methods**

```typescript
// User tracks content card display
contentCard.trackDisplay();

// User tracks HTML proposition interaction
htmlProposition.trackInteraction("view-details");
```

### **Step 6: React Native → Native Method Calls**

When `contentCard.trackDisplay()` is called:

```typescript
// Inside ContentCard class (extends PropositionItem)
trackDisplay(): void {
  this.track(MessagingEdgeEventType.DISPLAY);
}

// Inside PropositionItem base class
track(eventType: MessagingEdgeEventType): void {
  this.trackWithDetails(null, eventType, null);
}

private trackWithDetails(interaction: string | null, eventType: MessagingEdgeEventType, tokens: string[] | null): void {
  // this.id = "xcore:personalized-offer:124e36a756c8"
  RCTAEPMessaging.trackPropositionItem(this.id, interaction, eventType, tokens);
  //                                    ^^^^^^^
  //                                    itemId passed to native!
}
```

### **Step 7: Native Method Execution**

**Android:**
```java
@ReactMethod
public void trackPropositionItem(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens) {
    // itemId = "xcore:personalized-offer:124e36a756c8"
    // interaction = null
    // eventType = 4 (MessagingEdgeEventType.DISPLAY)
    // tokens = null
    
    try {
        MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
        // edgeEventType = MessagingEdgeEventType.DISPLAY
        
        PropositionItem propositionItem = findPropositionItemById(itemId);
        // Looks up "xcore:personalized-offer:124e36a756c8" in propositionItemCache
        
        if (propositionItem != null) {
            // Found the cached ContentCard PropositionItem!
            propositionItem.track(edgeEventType);
            // Calls the native Android SDK PropositionItem.track(MessagingEdgeEventType.DISPLAY)
            
            Log.debug(TAG, "Successfully tracked PropositionItem: " + itemId + " with eventType: " + edgeEventType);
        } else {
            Log.warning(TAG, "PropositionItem not found for ID: " + itemId);
        }
    } catch (Exception e) {
        Log.error(TAG, "Error tracking PropositionItem: " + itemId, e);
    }
}

private PropositionItem findPropositionItemById(String itemId) {
    return propositionItemCache.get(itemId);
    // Returns the cached PropositionItem for "xcore:personalized-offer:124e36a756c8"
}
```

## Key Points

### **1. ItemId Origin**
The `itemId` comes from the Adobe Experience Edge response and is included in the proposition data structure.

### **2. No Manual ID Management**
Users don't need to manually manage or remember IDs - they're automatically included in the proposition data.

### **3. Automatic Caching**
The native code automatically caches PropositionItems by their ID when propositions are first retrieved.

### **4. Transparent to User**
The user just calls `contentCard.track()` - the ID handling is transparent.

### **5. Type Safety**
The TypeScript classes ensure the correct `itemId` is always passed to the native methods.

## Error Scenarios

### **What if itemId is not found in cache?**

```java
// Android
if (propositionItem == null) {
    Log.warning(TAG, "PropositionItem not found for ID: " + itemId);
    return; // Gracefully handle - no crash
}
```

```swift
// iOS
guard let propositionItem = findPropositionItemById(itemId) else {
    print("Warning: PropositionItem not found for ID: \(itemId)")
    resolve(nil) // Gracefully handle - no crash
    return
}
```

### **Common causes:**
1. Propositions were never retrieved via `getPropositionsForSurfaces()`
2. Cache was cleared
3. PropositionItem was created with incorrect/invalid data

## Summary

The `itemId` flows naturally through the system:
1. **Adobe Edge** → generates unique IDs for each PropositionItem
2. **Native SDK** → receives propositions with IDs, caches by ID
3. **React Native** → receives proposition data including IDs
4. **User Code** → creates objects using the IDs from proposition data
5. **Tracking** → uses the ID to look up cached native objects

The system is designed so users never need to manually handle or remember IDs - they're embedded in the objects and flow transparently through the tracking system. 