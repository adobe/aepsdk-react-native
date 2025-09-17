"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropositionItem = void 0;
const react_native_1 = require("react-native");
const RCTAEPMessaging = react_native_1.NativeModules.AEPMessaging;
/**
 * A PropositionItem represents a personalization JSON object returned by Konductor.
 * This is the base class that provides tracking functionality for all proposition items
 * including ContentCards, InApp messages, and code-based experiences.
 *
 * This mirrors the native Android PropositionItem class functionality.
 */
class PropositionItem {
    constructor(propositionItemData) {
        this.id = propositionItemData.id;
        this.schema = propositionItemData.schema;
        this.data = propositionItemData.data;
        this.uuid = propositionItemData.uuid;
        this.activityID = propositionItemData.activityID;
    }
    /**
     * Gets the PropositionItem identifier.
     *
     * @returns {string} The PropositionItem identifier
     */
    getItemId() {
        return this.id;
    }
    /**
     * Gets the PropositionItem content schema.
     *
     * @returns {PersonalizationSchema} The PropositionItem content schema
     */
    getSchema() {
        return this.schema;
    }
    /**
     * Gets the PropositionItem data.
     *
     * @returns {object} The PropositionItem data
     */
    getItemData() {
        return this.data;
    }
    // Implementation
    track(interactionOrEventType, eventType, tokens) {
        // Handle overloaded method signatures
        if (typeof interactionOrEventType === 'number' && eventType === undefined) {
            // First overload: track(eventType)
            this.trackWithDetails(null, interactionOrEventType, null);
        }
        else if (typeof interactionOrEventType === 'string' || interactionOrEventType === null) {
            // Second overload: track(interaction, eventType, tokens)
            this.trackWithDetails(interactionOrEventType, eventType, tokens || null);
        }
    }
    /**
     * Internal method that performs the actual tracking
     */
    trackWithDetails(interaction, eventType, tokens) {
        var _a;
        const nativeIdentifier = (_a = this.activityID) !== null && _a !== void 0 ? _a : null;
        RCTAEPMessaging.trackPropositionItem(nativeIdentifier, interaction, eventType, tokens);
    }
}
exports.PropositionItem = PropositionItem;
//# sourceMappingURL=PropositionItem.js.map