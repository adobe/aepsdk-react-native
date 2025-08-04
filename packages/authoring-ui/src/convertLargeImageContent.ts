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
import { Component, ComponentType, ComponentTextStyle } from './common/Component';
import { LargeImageContentData, LargeImageContentStyle } from './LargeImageTypes';
import { ViewStyle, ImageStyle } from 'react-native';

const DISMISS_BUTTON_INTERACT_ID = 'dismiss_button';

interface StyleObject extends LargeImageContentStyle {
    card: ViewStyle;
    container: ViewStyle;
    imageContainer: ViewStyle;
    image: ImageStyle;
    contentContainer: ViewStyle;
    textContent: ViewStyle;
    buttonContainer: ViewStyle;
    title: ComponentTextStyle;
    body: ComponentTextStyle;
}

const styles: StyleObject = {
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        margin: 15,
        position: 'relative',
        minHeight: 200,
        width: '100%',
    },
    container: {
        flexDirection: 'column',
        minHeight: 200,
    },
    imageContainer: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: "100%",
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
        resizeMode: 'cover',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-start',
        minHeight: 100,
    },
    textContent: {
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
    },
    body: {
        fontSize: 14,
        lineHeight: 18,
        numberOfLines: 3,
        adjustsFontSizeToFit: true,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Evenly space up to 3 buttons
        alignItems: 'center',
        paddingTop: 8,
        minHeight: 36,
    },
};

function mergeStyles(defaultStyles: StyleObject, overrides?: LargeImageContentStyle): StyleObject {
    if (!overrides) return defaultStyles;

    return {
        card: { ...defaultStyles.card, ...overrides.card },
        container: { ...defaultStyles.container, ...overrides.container },
        imageContainer: { ...defaultStyles.imageContainer, ...overrides.imageContainer },
        image: { ...defaultStyles.image, ...overrides.image },
        contentContainer: { ...defaultStyles.contentContainer, ...overrides.contentContainer },
        textContent: { ...defaultStyles.textContent, ...overrides.textContent },
        buttonContainer: { ...defaultStyles.buttonContainer, ...overrides.buttonContainer },
        title: { ...defaultStyles.title, ...overrides.title },
        body: { ...defaultStyles.body, ...overrides.body },
    };
}

export function convertLargeImageContentToComponent(
    data: LargeImageContentData,
    styleOverrides?: LargeImageContentStyle
): Component {
    const mergedStyles = mergeStyles(styles, styleOverrides);

    const children: Component[] = [
        {
            type: 'view',
            style: mergedStyles.container,
            actionView: true,
            ...(data.actionUrl && { actionUrl: data.actionUrl }),
            children: [
                // Image at the top (if present)
                ...(data.image?.url ? [{
                    type: 'view' as ComponentType,
                    style: mergedStyles.imageContainer,
                    children: [{
                        type: 'image' as ComponentType,
                        style: mergedStyles.image,
                        url: data.image.url,
                        darkUrl: data.image?.darkUrl,
                        alt: data.image.alt || '',
                    }],
                }] : []),

                // Content container with text and buttons
                {
                    type: 'view' as ComponentType,
                    style: mergedStyles.contentContainer,
                    children: [
                        // Text content (title and body)
                        {
                            type: 'view' as ComponentType,
                            style: mergedStyles.textContent,
                            children: [
                                ...(data.title?.content ? [{
                                    type: 'text' as ComponentType,
                                    style: mergedStyles.title,
                                    content: data.title.content,
                                }] : []),
                                ...(data.body?.content ? [{
                                    type: 'text' as ComponentType,
                                    style: mergedStyles.body,
                                    content: data.body.content,
                                }] : []),
                            ],
                        },

                        // Button container at the bottom (if buttons present)
                        ...(Array.isArray(data.buttons) && data.buttons.length > 0 ? [{
                            type: 'view' as ComponentType,
                            style: mergedStyles.buttonContainer,
                            children: data.buttons.slice(0, 3).map(btn => ({ // Limit to 3 buttons
                                type: 'button' as ComponentType,
                                interactId: btn.interactId,
                                actionUrl: btn.actionUrl,
                                id: btn.id,
                                content: btn.text.content,
                            })),
                        }] : []),
                    ],
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
