/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
import { Component, ComponentType } from './common/Component';
import { ImageOnlyContentData, ImageOnlyContentStyle } from './ImageOnlyTypes';
import { ViewStyle, ImageStyle } from 'react-native';

const DISMISS_BUTTON_INTERACT_ID = 'dismiss_button';

interface StyleObject extends ImageOnlyContentStyle {
    card: ViewStyle;
    container: ViewStyle;
    imageContainer: ViewStyle;
    image: ImageStyle;
}

const styles: StyleObject = {
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        margin: 15,
        position: 'relative',
        minHeight: 120, // Added for dismiss button positioning
        flex: 1, // Ensure card takes full width
    },
    container: {
        flexDirection: 'column',
        minHeight: 120,
    },
    imageContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        width: "100%", // Full width for the image
        minHeight: 120,
        maxHeight: 300, // Fallback when no cardHeight provided
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
};

function mergeStyles(defaultStyles: StyleObject, overrides?: ImageOnlyContentStyle): StyleObject {
    if (!overrides) return defaultStyles;

    const merged = {
        card: { ...defaultStyles.card, ...overrides.card },
        container: { ...defaultStyles.container, ...overrides.container },
        imageContainer: { ...defaultStyles.imageContainer, ...overrides.imageContainer },
        image: { ...defaultStyles.image, ...overrides.image },
    };
    
    return merged;
}

export function convertImageOnlyContentToComponent(
    data: ImageOnlyContentData,
    height?: number,
    styleOverrides?: ImageOnlyContentStyle,
): Component {
    // let's add height to the styleOverrides before merging the customer provided styles.
    if (height) {
        styleOverrides = { 
            ...styleOverrides, 
            card: { ...styleOverrides?.card, maxHeight: height },
            imageContainer: { ...styleOverrides?.imageContainer, maxHeight: height }
        };
    }

    const mergedStyles = mergeStyles(styles, styleOverrides);

    const children: Component[] = [
        {
            type: 'view',
            style: mergedStyles.container,
            actionView: true,
            ...(data.actionUrl && { actionUrl: data.actionUrl }),
            children: [
                // Image container - always present for image only template
                {
                    type: 'view' as ComponentType,
                    style: mergedStyles.imageContainer,
                    children: [{
                        type: 'image' as ComponentType,
                        style: mergedStyles.image,
                        url: data.image.url,
                        darkUrl: data.image?.darkUrl,
                        alt: data.image.alt || '',
                    }],
                },
            ],
        },
    ];

    // Add dismiss button if present and style is not 'none'
    if (data.dismissBtn?.style && data.dismissBtn.style !== 'none') {
        children.push({
            type: 'dismissButton' as ComponentType,
            interactId: DISMISS_BUTTON_INTERACT_ID,
            dismissType: data.dismissBtn.style,
        });
    }

    return {
        type: 'view',
        style: mergedStyles.card,
        children,
    };
}
