# Content Card Customization Guide

## Overview

The Adobe Experience Platform (AEP) React Native Messaging SDK provides a comprehensive and flexible content card system with multiple levels of customization. This guide explains how to customize content cards using the three-tier hierarchy: **Theme → Style Overrides → Props**.

## Table of Contents

1. [Customization Hierarchy](#customization-hierarchy)
2. [Theme System](#theme-system)
3. [Style Overrides](#style-overrides)
4. [Component Props](#component-props)
5. [Practical Example](#practical-example)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Customization Hierarchy

The content card customization follows a clear hierarchy where each level can override the previous one:

```
Theme (Global) → Style Overrides (Component-specific) → Props (Element-specific)
```

### Priority Order (Highest to Lowest)
1. **Props** - Most specific, overrides everything
2. **Style Overrides** - Component-level customization
3. **Theme** - Global application-wide styling
4. **Default Styles** - Built-in component styles

### How the Hierarchy Works

Each level in the hierarchy can override properties from levels below it:

```typescript
// Example: Text color resolution
const finalTextColor = 
  titleProps?.style?.color ||           // 1. Props (highest priority)
  styleOverrides?.title?.color ||       // 2. Style Overrides  
  theme.colors.textPrimary ||           // 3. Theme
  defaultStyles.title.color;            // 4. Default (lowest priority)
```

This means you can set a global brand color in your theme, override it for specific components with style overrides, and further customize individual elements with props when needed.

## Theme System

### Basic Theme Setup

The theme system provides global styling for all content cards with automatic light/dark mode support.

```typescript
import { ThemeProvider, Themes } from '@adobe/react-native-aepmessaging';

const customThemes: Themes = {
  light: {
    colors: {
      primary: '#007AFF',        // Brand primary color
      secondary: '#5856D6',      // Secondary accent color  
      background: '#FFFFFF',     // Card background
      textPrimary: '#000000',    // Main text color
      textSecondary: '#8E8E93',  // Secondary text color
      imagePlaceholder: '#C7C7CC', // Image loading placeholder
      buttonTextColor: 'dodgerblue'   // Button text color
    }
  },
  dark: {
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6', 
      background: '#262626',
      textPrimary: '#FFFFFF',
      textSecondary: '#8E8E93',
      imagePlaceholder: '#48484A',
      buttonTextColor: 'dodgerblue'
    }
  }
};

function App() {
  return (
    <ThemeProvider customThemes={customThemes}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Available Theme Colors

The following colors can be customized in your theme:

| Color Property | Description | Usage |
|----------------|-------------|--------|
| `background` | Card background color | All card templates |
| `textPrimary` | Main text content | Title and body text |
| `imagePlaceholder` | Image loading state | Placeholder while images load |
| `buttonTextColor` | Button text color | Action button text |

**Example:**
```typescript
const myBrandTheme = {
  light: {
    colors: {
      background: '#FFFFFF',
      textPrimary: '#1A1A1A',
      imagePlaceholder: '#E5E5E5',
      buttonTextColor: '#007AFF'
    }
  }
};
```

## Style Overrides

Style overrides provide component-level customization for each template type. They follow React Native's `StyleSheet` patterns.

### SmallImageCard Style Overrides

```typescript
import { SmallImageContentStyle } from '@adobe/react-native-aepmessaging';

const smallImageStyleOverrides: SmallImageContentStyle = {
  // Root card container
  card: {
    borderRadius: 16,
    margin: 20,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  // Inner container
  container: {
    padding: 16,
    flexDirection: 'row'
  },
  
  // Image container
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12
  },
  
  // Image styling
  image: {
    width: 80,
    height: 80
  },
  
  // Content area
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  
  // Text styling (applies to both title and body)
  text: {
    fontFamily: 'YourCustomFont-Regular'
  },
  
  // Title-specific styling
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4
  },
  
  // Body text styling
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666'
  },
  
  // Button container
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8
  },
  
  // Individual button styling
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  
  // Button text styling
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  
  // Dismiss button styling
  dismissButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 24,
    height: 24,
    borderRadius: 12
  }
};
```

### LargeImageCard Style Overrides

```typescript
import { LargeImageContentStyle } from '@adobe/react-native-aepmessaging';

const largeImageStyleOverrides: LargeImageContentStyle = {
  // Root card container
  card: {
    borderRadius: 20,
    margin: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  
  // Main container
  container: {
    flexDirection: 'column'
  },
  
  // Image container (top section)
  imageContainer: {
    height: 200,
    position: 'relative'
  },
  
  // Image styling
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  
  // Content area (below image)
  contentContainer: {
    padding: 20
  },
  
  // Text content wrapper
  textContent: {
    marginBottom: 16
  },
  
  // Title styling
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8
  },
  
  // Body text styling
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a'
  },
  
  // Button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  // Button styling
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4
  },
  
  // Button text
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
};
```

### ImageOnlyCard Style Overrides

```typescript
import { ImageOnlyContentStyle } from '@adobe/react-native-aepmessaging';

const imageOnlyStyleOverrides: ImageOnlyContentStyle = {
  // Root card container
  card: {
    borderRadius: 16,
    margin: 12,
    overflow: 'hidden'
  },
  
  // Image container
  imageContainer: {
    backgroundColor: '#f0f0f0',
    position: 'relative'
  },
  
  // Image styling
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover'
  },
  
  // Dismiss button (overlaid on image)
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 28,
    borderRadius: 14
  }
};
```

## Component Props

For advanced customization, some components accept additional props that provide element-level control.

### SmallImageCard Props

The `SmallImageCard` component extends React Native's `PressableProps` and supports the following specific props:

```typescript
import { SmallImageCard } from '@adobe/react-native-aepmessaging';

<SmallImageCard
  content={contentData}
  imageUri={imageUrl}
  height={120}  // Optional: Custom height for the card
  styleOverrides={smallImageStyleOverrides}
  onPress={handlePress}
  onDismiss={handleDismiss}
  
  // Standard PressableProps are also supported
  accessibilityLabel="Product promotion card"
  accessibilityRole="button"
  accessibilityHint="Double tap to view product details"
  disabled={false}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  
  // Custom style function for press states
  style={({ pressed }) => [
    baseCardStyle,
    pressed && { opacity: 0.8 }
  ]}
/>
```

**Note**: `SmallImageCard` supports granular component props (like `ImageProps`, `TextProps`, `ButtonProps`) via the `ComponentOverrideProps` interface, similar to `LargeImageCard` and `ImageOnlyCard`. You can use both these props and `styleOverrides` for comprehensive customization.

#### SmallImageCard Advanced Props Example

```typescript
import { SmallImageCard } from '@adobe/react-native-aepmessaging';

<SmallImageCard
  content={contentData}
  imageUri={imageUrl}
  height={120}
  styleOverrides={smallImageStyleOverrides}
  onPress={handlePress}
  onDismiss={handleDismiss}
  
  // Advanced component props
  ContainerProps={{
    accessibilityLabel: 'Product promotion card'
  }}
  
  ImageContainerProps={{
    accessibilityRole: 'image'
  }}
  
  ImageProps={{
    accessibilityLabel: 'Product image',
    resizeMode: 'cover'
  }}
  
  TextProps={{
    accessibilityRole: 'text',
    maxFontSizeMultiplier: 1.2
  }}
  
  TitleProps={{
    numberOfLines: 1,
    ellipsizeMode: 'tail'
  }}
  
  BodyProps={{
    numberOfLines: 2,
    ellipsizeMode: 'tail'
  }}
  
  ButtonContainerProps={{
    accessibilityRole: 'button'
  }}
  
  ButtonProps={{
    accessibilityHint: 'Double tap to learn more'
  }}
  
  DismissButtonProps={{
    accessibilityLabel: 'Dismiss this card',
    accessibilityHint: 'Double tap to close'
  }}
  
  // Standard PressableProps are also supported
  accessibilityLabel="Product promotion card"
  accessibilityRole="button"
  disabled={false}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  
  // Custom style function for press states
  style={({ pressed }) => [
    baseCardStyle,
    pressed && { opacity: 0.8 }
  ]}
/>
```

### LargeImageCard Advanced Props

```typescript
import { LargeImageCard } from '@adobe/react-native-aepmessaging';

<LargeImageCard
  content={contentData}
  imageUri={imageUrl}
  styleOverrides={largeImageStyleOverrides}
  onPress={handlePress}
  onDismiss={handleDismiss}
  
  // Advanced component props
  ContainerProps={{
    accessibilityLabel: 'Product promotion card'
  }}
  
  ImageContainerProps={{
    accessibilityRole: 'image'
  }}
  
  ImageProps={{
    accessibilityLabel: 'Product image',
    resizeMode: 'cover'
  }}
  
  TextProps={{
    accessibilityRole: 'text',
    maxFontSizeMultiplier: 1.2
  }}
  
  TitleProps={{
    numberOfLines: 2,
    ellipsizeMode: 'tail'
  }}
  
  BodyProps={{
    numberOfLines: 3,
    ellipsizeMode: 'tail'
  }}
  
  ButtonContainerProps={{
    accessibilityRole: 'button'
  }}
  
  ButtonProps={{
    accessibilityHint: 'Double tap to learn more'
  }}
  
  DismissButtonProps={{
    accessibilityLabel: 'Dismiss this card',
    accessibilityHint: 'Double tap to close'
  }}
/>
```

### ImageOnlyCard Advanced Props

```typescript
import { ImageOnlyCard } from '@adobe/react-native-aepmessaging';

<ImageOnlyCard
  content={contentData}
  imageUri={imageUrl}
  styleOverrides={imageOnlyStyleOverrides}
  onPress={handlePress}
  onDismiss={handleDismiss}
  
  // Advanced component props
  ContainerProps={{
    accessibilityLabel: 'Featured image card'
  }}
  
  ImageContainerProps={{
    accessibilityRole: 'image'
  }}
  
  ImageProps={{
    accessibilityLabel: 'Featured content image',
    resizeMode: 'contain'
  }}
  
  DismissButtonProps={{
    accessibilityLabel: 'Close image',
    accessibilityHint: 'Double tap to dismiss'
  }}
/>
```

## Practical Example

### E-commerce Product Card

```typescript
import React from 'react';
import { ContentCardView, ThemeProvider } from '@adobe/react-native-aepmessaging';

// Custom theme for e-commerce
const ecommerceTheme = {
  light: {
    colors: {
      primary: '#FF6B35',
      secondary: '#004E89', 
      background: '#FFFFFF',
      textPrimary: '#1A1A1A',
      textSecondary: '#666666',
      imagePlaceholder: '#E5E5E5',
      buttonTextColor: '#FFFFFF'
    }
  },
  dark: {
    colors: {
      primary: '#FF8A5B',
      secondary: '#0066CC',
      background: '#1A1A1A', 
      textPrimary: '#FFFFFF',
      textSecondary: '#CCCCCC',
      imagePlaceholder: '#333333',
      buttonTextColor: 'dodgerblue'
    }
  }
};

// Product card style overrides
const productCardStyles = {
  smallImageStyle: {
    card: {
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    image: {
      borderRadius: 8
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A'
    },
    body: {
      fontSize: 14,
      color: '#666666',
      marginTop: 4
    },
    button: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14
    }
  }
};

function ProductCard({ template }) {
  const handleInteraction = (event, data) => {
    console.log('Product card interaction:', event, data);
  };

  return (
    <ThemeProvider customThemes={ecommerceTheme}>
      <ContentCardView
        template={template}
        styleOverrides={productCardStyles}
        listener={handleInteraction}
      />
    </ThemeProvider>
  );
}
```

## Best Practices

### 1. Hierarchy Best Practices
```typescript
// Good: Use hierarchy effectively
const styles = {
  card: {
    // Base card styling
    backgroundColor: theme.colors.background, // Theme value
    padding: 16, // Component-specific override
  }
};

// Good: Specific overrides
<SmallImageCard 
  styleOverrides={{
    title: { fontSize: 18 }, // Override specific element
    button: { backgroundColor: '#FF6B35' } // Brand-specific button color
  }}
/>

// Avoid: Over-styling at theme level
const badTheme = {
  colors: {
    buttonSpecificBackgroundForProductCards: '#FF6B35' // Too specific for theme
  }
};
```

### 2. Consistent Theming
- Use the theme system for colors that should be consistent across all content cards
- Always provide both light and dark theme variants
- Test your themes in both color schemes

### 3. Responsive Design
- Use flexible layouts and relative sizing
- Test on different screen sizes and orientations
- Consider accessibility font scaling

---

This guide provides a comprehensive overview of the Content Card customization system. With the three-tier customization hierarchy (Theme → Style Overrides → Props), you can create beautiful, branded content cards that fit seamlessly into your app's design system.
