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
/**
 * The event types for the ContentView component.
 * 
 * @enum {string}
 * @readonly
 * @description The event types for the ContentView component.
 * @property {string} onDismiss - The event type for the onDismiss event when the dismiss button is pressed.    
 * @property {string} onDisplay - The event type for the onDisplay event when the content card is displayed.
 * @property {string} clickButton - The event type for the clickButton event when a button is clicked.
 * @property {string} press - The event type for the press event when the content is pressed.
 */
export type ContentViewEvent = "onDismiss" | "onDisplay" | "clickButton" | "press";
