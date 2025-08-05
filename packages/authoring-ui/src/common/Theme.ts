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
export interface Themes {
    light: Theme,
    dark: Theme
}

export interface Theme {
    colors: Colors;
    // Optional: add custom styles for the selected components
    // components: {
    //     button: {
    //         padding: number;
    //         margin: number;
    //         borderRadius: number;
    //         borderWidth: number
    //     }
    // }
}
export interface Colors {
    primary?: string;
    secondary?: string;
    background?: string;
    text_primary?: string;
    text_secondary?: string;
    title_background?: string;
    body_background?: string;
    image_placeholder?: string;
    button_text_color?: string;
}