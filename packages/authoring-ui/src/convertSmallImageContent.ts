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
import { Component, ComponentType, ComponentTextStyle, ButtonStyle } from './common/Component';
import { SmallImageContentData, SmallImageContentStyle } from './SmallImageTypes';
import { ViewStyle, ImageStyle } from 'react-native';

const DISMISS_BUTTON_INTERACT_ID = 'dismiss_button';

interface StyleObject extends SmallImageContentStyle {
    card: ViewStyle;
    container: ViewStyle;
    imageContainer: ViewStyle;
    image: ImageStyle;
    contentContainer: ViewStyle;
    textContent: ViewStyle;
    buttonContainer: ViewStyle;
    title: ComponentTextStyle;
    body: ComponentTextStyle;
    button: ButtonStyle;
}

const styles: StyleObject = {
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        margin: 15,
        position: 'relative',
        minHeight: 120,
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        minHeight: 120,
    },
    imageContainer: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        width: "35%",
        height: "100%",
        minHeight: 120,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        minHeight: 120,
    },
    contentContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        // Use flex layout instead of space-between
        // justifyContent: 'space-between',
        justifyContent: 'flex-start',
        minHeight: 120,
    },
    textContent: {
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginRight: 16,
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
        justifyContent: 'flex-start',
        paddingTop: 8,
        minHeight: 36,
    },
    button: {
        marginHorizontal: 8,
    }

};

function mergeStyles(defaultStyles: StyleObject, overrides?: SmallImageContentStyle): StyleObject {
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
        button: { ...defaultStyles.button, ...overrides.button },
    };
}

export function convertSmallImageContentToComponent(
    data: SmallImageContentData,
    styleOverrides?: SmallImageContentStyle,
    height?: number
): Component {

    // let's add height to the sytleOverrides before merging the customer provided styles.
    styleOverrides = { ...styleOverrides, card: { ...styleOverrides?.card, maxHeight: height } };

    const mergedStyles = mergeStyles(styles, styleOverrides);

    const children: Component[] = [
        {
            type: 'view',
            style: mergedStyles.container,
            actionView: true,
            ...(data.actionUrl && { actionUrl: data.actionUrl }),
            children: [
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
                {
                    type: 'view' as ComponentType,
                    style: mergedStyles.contentContainer,
                    children: [
                        {
                            type: 'view' as ComponentType,
                            style: mergedStyles.textContent,
                            children: [
                                ...(data.title?.content ? [{
                                    type: 'title' as ComponentType,
                                    style: mergedStyles.title,
                                    content: data.title.content,
                                }] : []),
                                ...(data.body?.content ? [{
                                    type: 'body' as ComponentType,
                                    style: mergedStyles.body,
                                    content: data.body.content,
                                }] : []),
                            ],
                        },
                        ...(Array.isArray(data.buttons) && data.buttons.length > 0 ? [{
                            type: 'view' as ComponentType,
                            style: mergedStyles.buttonContainer,
                            children: data.buttons.map(btn => ({
                                type: 'button' as ComponentType,
                                interactId: btn.interactId,
                                actionUrl: btn.actionUrl,
                                id: btn.id,
                                content: btn.text.content,
                                style: mergedStyles.button,
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