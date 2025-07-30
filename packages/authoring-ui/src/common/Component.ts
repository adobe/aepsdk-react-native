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
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type ComponentType = 'view' | 'text' | 'title' | 'body' | 'image' | 'button' | 'dismissButton';

// Union type for all possible component styles
export type ComponentStyle = ViewStyle | ComponentTextStyle | ImageStyle;

// Text style with additional properties
export type ComponentTextStyle = TextStyle & {
    numberOfLines?: number;
    adjustsFontSizeToFit?: boolean;
}

// Button style with additional properties
export interface ButtonStyle {
    color?: string;
    marginHorizontal?: number;
}

// Component interface the represents the content card data and its style
export interface Component {
    type: ComponentType;
    style?: ComponentStyle;
    id?: string;
    name?: string;
    // Add interactId for event monitoring
    interactId?: string;
    // Child components
    children?: Component[];
    // Text/Button properties
    content?: string;
    // Action URL for button and the root view
    actionUrl?: string;
    // Image properties
    url?: string;
    darkUrl?: string;
    alt?: string;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
    // Dismiss button properties
    dismissType?: 'none' | 'simple' | 'circle';
}