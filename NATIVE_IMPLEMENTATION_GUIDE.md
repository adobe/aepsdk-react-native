# Native Implementation Guide: Unified PropositionItem Tracking

This guide explains the complete native implementation for the unified `PropositionItem` tracking system that enables `ContentCard`, `HTMLProposition`, `JSONPropositionItem`, and other proposition types to use the same tracking methods.

## Overview

The unified tracking system allows all proposition item types to use the same `track()` and `generateInteractionXdm()` methods by:

1. **Caching PropositionItems**: When propositions are retrieved via `getPropositionsForSurfaces`, all `PropositionItem` objects are cached by their ID
2. **Unified Native Methods**: New native methods `trackPropositionItem` and `generatePropositionInteractionXdm` that work with cached items
3. **Automatic Cleanup**: Cache management methods for memory optimization

## Architecture

```
React Native Layer:
├── PropositionItem (base class)
├── ContentCard extends PropositionItem 
├── HTMLProposition extends PropositionItem
├── JSONPropositionItem extends PropositionItem
└── All call unified native methods

Native Layer (Android/iOS):
├── PropositionItem Cache (itemId -> PropositionItem)
├── Proposition Cache (itemId -> parent Proposition)
├── trackPropositionItem() native method
├── generatePropositionInteractionXdm() native method
└── Automatic caching in getPropositionsForSurfaces()
```

## Android Implementation

### Key Changes Made

The following methods were added to `RCTAEPMessagingModule.java`:

#### 1. Cache Properties
```java
// Cache to store PropositionItem objects by their ID for unified tracking
private final Map<String, PropositionItem> propositionItemCache = new ConcurrentHashMap<>();
// Cache to store the parent Proposition for each PropositionItem
private final Map<String, Proposition> propositionCache = new ConcurrentHashMap<>();
```

#### 2. Core Tracking Method
```java
@ReactMethod
public void trackPropositionItem(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens) {
    try {
        // Convert eventType int to MessagingEdgeEventType enum
        MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
        
        // Find the PropositionItem by ID
        PropositionItem propositionItem = findPropositionItemById(itemId);
        
        if (propositionItem == null) {
            Log.warning(TAG, "trackPropositionItem - PropositionItem not found for ID: " + itemId);
            return;
        }

        // Convert ReadableArray to List<String> if provided
        List<String> tokenList = null;
        if (tokens != null) {
            tokenList = new ArrayList<>();
            for (int i = 0; i < tokens.size(); i++) {
                tokenList.add(tokens.getString(i));
            }
        }

        // Call the appropriate track method based on provided parameters
        if (interaction != null && tokenList != null) {
            propositionItem.track(interaction, edgeEventType, tokenList);
        } else if (interaction != null) {
            propositionItem.track(interaction, edgeEventType, null);
        } else {
            propositionItem.track(edgeEventType);
        }

        Log.debug(TAG, "Successfully tracked PropositionItem: " + itemId + " with eventType: " + edgeEventType);

    } catch (Exception e) {
        Log.error(TAG, "Error tracking PropositionItem: " + itemId, e);
    }
}
```

#### 3. XDM Generation Method
```java
@ReactMethod
public void generatePropositionInteractionXdm(String itemId, @Nullable String interaction, int eventType, @Nullable ReadableArray tokens, Promise promise) {
    try {
        // Convert eventType int to MessagingEdgeEventType enum
        MessagingEdgeEventType edgeEventType = RCTAEPMessagingUtil.getEventType(eventType);
        
        // Find the PropositionItem by ID
        PropositionItem propositionItem = findPropositionItemById(itemId);
        
        if (propositionItem == null) {
            promise.reject("PropositionItemNotFound", "No PropositionItem found with ID: " + itemId);
            return;
        }

        // Generate XDM data using the appropriate method
        Map<String, Object> xdmData;
        if (interaction != null && tokenList != null) {
            xdmData = propositionItem.generateInteractionXdm(interaction, edgeEventType, tokenList);
        } else if (interaction != null) {
            xdmData = propositionItem.generateInteractionXdm(interaction, edgeEventType, null);
        } else {
            xdmData = propositionItem.generateInteractionXdm(edgeEventType);
        }

        if (xdmData != null) {
            WritableMap result = RCTAEPMessagingUtil.toWritableMap(xdmData);
            promise.resolve(result);
        } else {
            promise.reject("XDMGenerationFailed", "Failed to generate XDM data for PropositionItem: " + itemId);
        }

    } catch (Exception e) {
        promise.reject("XDMGenerationError", "Error generating XDM data: " + e.getMessage(), e);
    }
}
```

#### 4. Automatic Caching
```java
@ReactMethod
public void getPropositionsForSurfaces(ReadableArray surfaces, final Promise promise) {
    String bundleId = this.reactContext.getPackageName();
    Messaging.getPropositionsForSurfaces(
        RCTAEPMessagingUtil.convertSurfaces(surfaces),
        new AdobeCallbackWithError<Map<Surface, List<Proposition>>>() {
            @Override
            public void call(Map<Surface, List<Proposition>> propositionsMap) {
                
                // Cache PropositionItems for unified tracking when propositions are retrieved
                for (Map.Entry<Surface, List<Proposition>> entry : propositionsMap.entrySet()) {
                    List<Proposition> propositions = entry.getValue();
                    if (propositions != null) {
                        cachePropositionsItems(propositions);
                    }
                }
                
                promise.resolve(RCTAEPMessagingUtil.convertSurfacePropositions(propositionsMap, bundleId));
            }
        });
}
```

## iOS Implementation

### Key Changes Made

The following methods were added to `RCTAEPMessaging.swift`:

#### 1. Cache Properties
```swift
// Cache to store PropositionItem objects by their ID for unified tracking
private var propositionItemCache = [String: PropositionItem]()
// Cache to store the parent Proposition for each PropositionItem
private var propositionCache = [String: Proposition]()
```

#### 2. Core Tracking Method
```swift
@objc
func trackPropositionItem(
    _ itemId: String,
    interaction: String?,
    eventType: Int,
    tokens: [String]?,
    withResolver resolve: @escaping RCTPromiseResolveBlock,
    withRejecter reject: @escaping RCTPromiseRejectBlock
) {
    guard let edgeEventType = MessagingEdgeEventType(rawValue: eventType) else {
        reject("InvalidEventType", "Invalid eventType: \(eventType)", nil)
        return
    }
    
    guard let propositionItem = findPropositionItemById(itemId) else {
        print("Warning: PropositionItem not found for ID: \(itemId)")
        resolve(nil)
        return
    }
    
    // Call the appropriate track method based on provided parameters
    if let interaction = interaction, let tokens = tokens {
        propositionItem.track(interaction, withEdgeEventType: edgeEventType, forTokens: tokens)
    } else if let interaction = interaction {
        propositionItem.track(interaction, withEdgeEventType: edgeEventType)
    } else {
        propositionItem.track(withEdgeEventType: edgeEventType)
    }
    
    print("Successfully tracked PropositionItem: \(itemId) with eventType: \(edgeEventType)")
    resolve(nil)
}
```

#### 3. XDM Generation Method
```swift
@objc
func generatePropositionInteractionXdm(
    _ itemId: String,
    interaction: String?,
    eventType: Int,
    tokens: [String]?,
    withResolver resolve: @escaping RCTPromiseResolveBlock,
    withRejecter reject: @escaping RCTPromiseRejectBlock
) {
    guard let edgeEventType = MessagingEdgeEventType(rawValue: eventType) else {
        reject("InvalidEventType", "Invalid eventType: \(eventType)", nil)
        return
    }
    
    guard let propositionItem = findPropositionItemById(itemId) else {
        reject("PropositionItemNotFound", "No PropositionItem found with ID: \(itemId)", nil)
        return
    }
    
    // Generate XDM data using the appropriate method
    var xdmData: [String: Any]?
    
    if let interaction = interaction, let tokens = tokens {
        xdmData = propositionItem.generateInteractionXdm(interaction, withEdgeEventType: edgeEventType, forTokens: tokens)
    } else if let interaction = interaction {
        xdmData = propositionItem.generateInteractionXdm(interaction, withEdgeEventType: edgeEventType)
    } else {
        xdmData = propositionItem.generateInteractionXdm(withEdgeEventType: edgeEventType)
    }
    
    if let xdmData = xdmData {
        resolve(xdmData)
    } else {
        reject("XDMGenerationFailed", "Failed to generate XDM data for PropositionItem: \(itemId)", nil)
    }
}
```

#### 4. Automatic Caching
```swift
@objc
func getPropositionsForSurfaces(
    _ surfaces: [String],
    withResolver resolve: @escaping RCTPromiseResolveBlock,
    withRejecter reject: @escaping RCTPromiseRejectBlock
) {
    let surfacePaths = surfaces.map { $0.isEmpty ? Surface() : Surface(path: $0) }
    Messaging.getPropositionsForSurfaces(surfacePaths) { propositions, error in
        guard error == nil else {
            reject("Unable to Retrieve Propositions", nil, nil)
            return
        }
        
        // Cache PropositionItems for unified tracking when propositions are retrieved
        if let propositionsDict = propositions {
            let allPropositions = Array(propositionsDict.values).flatMap { $0 }
            self.cachePropositionsItems(allPropositions)
        }
        
        resolve(RCTAEPMessagingDataBridge.transformPropositionDict(dict: propositions!))
    }
}
```

## Key Features

### 1. Automatic Caching
- **When**: PropositionItems are automatically cached when `getPropositionsForSurfaces()` is called
- **What**: Both the `PropositionItem` object and its parent `Proposition` are cached
- **Why**: Enables tracking without needing to pass full proposition data each time

### 2. Flexible Method Signatures
The tracking methods support multiple call patterns:
```javascript
// Event type only
propositionItem.track(MessagingEdgeEventType.DISPLAY);

// With interaction
propositionItem.track("button-click", MessagingEdgeEventType.INTERACT, null);

// With interaction and tokens
propositionItem.track("carousel-item", MessagingEdgeEventType.INTERACT, ["token1", "token2"]);
```

### 3. Memory Management
- Uses `ConcurrentHashMap` (Android) and thread-safe collections (iOS)
- Provides cache management methods (`clearPropositionItemCache`, `getPropositionItemCacheSize`, `hasPropositionItem`)
- Automatic cleanup when propositions are refreshed

### 4. Error Handling
- Graceful handling of missing PropositionItems
- Detailed error messages for debugging
- Promise-based error reporting for XDM generation

## Integration Requirements

### React Native Interface Updates

Update your `Messaging.ts` interface to include the new methods:

```typescript
export interface NativeMessagingModule {
  // ... existing methods ...
  trackPropositionItem: (itemId: string, interaction: string | null, eventType: number, tokens: string[] | null) => void;
  generatePropositionInteractionXdm: (itemId: string, interaction: string | null, eventType: number, tokens: string[] | null) => Promise<object>;
}
```

### Usage Flow

1. **App calls `getPropositionsForSurfaces()`**
   - Native code retrieves propositions from Adobe Edge
   - All PropositionItems are automatically cached
   - React Native receives proposition data

2. **App creates PropositionItem objects**
   - `ContentCard`, `HTMLProposition`, `JSONPropositionItem` extend base `PropositionItem`
   - Each contains an `id` that maps to cached native objects

3. **App calls tracking methods**
   - `track()` methods call `RCTAEPMessaging.trackPropositionItem()`
   - Native code finds cached PropositionItem by ID
   - Calls appropriate native tracking method

## Benefits

1. **Unified API**: All proposition types use the same tracking interface
2. **Performance**: Avoids passing large proposition objects on each tracking call
3. **Flexibility**: Supports all native tracking method variations
4. **Consistency**: Mirrors the native Android SDK architecture
5. **Memory Efficient**: Automatic cache management prevents memory leaks
6. **Developer Experience**: Simple, consistent API across all proposition types

## Testing

Test the implementation by:

1. Retrieving propositions via `getPropositionsForSurfaces()`
2. Creating `ContentCard`, `HTMLProposition`, or `JSONPropositionItem` objects
3. Calling `track()` methods with different parameter combinations
4. Verifying tracking events are sent to Adobe Experience Edge
5. Testing cache management methods for proper memory handling

This unified approach provides a robust, scalable foundation for proposition tracking across all content types in your React Native Adobe Experience SDK implementation. 