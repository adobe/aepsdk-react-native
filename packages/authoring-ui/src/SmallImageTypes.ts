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
import { ViewStyle, ImageStyle } from "react-native";
import { ComponentTextStyle, ButtonStyle } from "./common/Component";

export interface SmallImageContentButton {
    readonly interactId: string;
    readonly actionUrl?: string;
    readonly id?: string;
    readonly text: {
        readonly content: string;
    };
}

export interface SmallImageContentData {
    // TODO: should the image url always be required??
    // If not, we need to think about how to render the content card without an image
    readonly image?: {
        readonly alt?: string;
        readonly url: string;
        readonly darkUrl?: string;
    };
    readonly buttons?: readonly SmallImageContentButton[];
    readonly dismissBtn?: {
        readonly style: "none" | "simple" | "circle";
    };
    readonly actionUrl?: string;
    readonly body?: {
        readonly content: string;
    };
    readonly title: {
        readonly content: string;
    };
}

export interface SmallImageContentStyle {
    card?: Partial<ViewStyle>;
    container?: Partial<ViewStyle>;
    imageContainer?: Partial<ViewStyle>;
    image?: Partial<ImageStyle>;
    contentContainer?: Partial<ViewStyle>;
    textContent?: Partial<ViewStyle>;
    title?: Partial<ComponentTextStyle>;
    body?: Partial<ComponentTextStyle>;
    buttonContainer?: Partial<ViewStyle>;
    button?: Partial<ButtonStyle>;
}