"use strict";
/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const Message_1 = tslib_1.__importDefault(require("./models/Message"));
const MessagingProposition_1 = require("./models/MessagingProposition");
const PersonalizationSchema_1 = require("./models/PersonalizationSchema");
const Templates_1 = require("./ui/types/Templates");
const RCTAEPMessaging = react_native_1.NativeModules.AEPMessaging;
var messagingDelegate;
class Messaging {
    /**
     * Returns the version of the AEPMessaging extension
     * @returns {string} Promise a promise that resolves with the extension version
     */
    static extensionVersion() {
        return Promise.resolve(RCTAEPMessaging.extensionVersion());
    }
    /**
     * Initiates a network call to retrieve remote In-App Message definitions.
     */
    static refreshInAppMessages() {
        RCTAEPMessaging.refreshInAppMessages();
    }
    /**
     * Retrieves the list of messages which have been cached using the `shouldSaveMessage`
     * method of the messaging delegate.
     * Note: Messages should be cached before trying to use any of the methods on the message class
     * @returns An array of messages that have been cached
     */
    static getCachedMessages() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const messages = yield RCTAEPMessaging.getCachedMessages();
            return messages.map((msg) => new Message_1.default(msg));
        });
    }
    /**
     * Retrieves the last message that has been shown in the UI
     * @returns The latest message to have been displayed
     */
    static getLatestMessage() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const message = yield RCTAEPMessaging.getLatestMessage();
            return message ? new Message_1.default(message) : undefined;
        });
    }
    /**
     * Retrieves the previously fetched (and cached) feeds content from the SDK for the provided surfaces.
     * If the feeds content for one or more surfaces isn't previously cached in the SDK, it will not be retrieved from Adobe Journey Optimizer via the Experience Edge network.
     * @param surfaces A list of surfaces to fetch
     * @returns A record of surface names with their corresponding propositions
     */
    static getPropositionsForSurfaces(surfaces) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield RCTAEPMessaging.getPropositionsForSurfaces(surfaces);
        });
    }
    /**
     * @deprecated Use PropositionItem.track(...) instead.
     */
    static trackContentCardDisplay(proposition, contentCard) {
        RCTAEPMessaging.trackContentCardDisplay(proposition, contentCard);
    }
    /**
     * @deprecated Use PropositionItem.track(...) instead.
     */
    static trackContentCardInteraction(proposition, contentCard) {
        RCTAEPMessaging.trackContentCardInteraction(proposition, contentCard);
    }
    /**
     * Tracks interactions with a PropositionItem using the provided interaction and event type.
     * This method is used internally by the PropositionItem.track() method.
     *
     * @param {string} itemId - The unique identifier of the PropositionItem
     * @param {string | null} interaction - A custom string value to be recorded in the interaction
     * @param {number} eventType - The MessagingEdgeEventType numeric value
     * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
     */
    static trackPropositionItem(itemId, interaction, eventType, tokens) {
        RCTAEPMessaging.trackPropositionItem(itemId, interaction, eventType, tokens);
    }
    /**
     * Function to set the UI Message delegate to listen the Message lifecycle events.
     * @returns A function to unsubscribe from all event listeners
     */
    static setMessagingDelegate(delegate) {
        messagingDelegate = delegate;
        const eventEmitter = new react_native_1.NativeEventEmitter(RCTAEPMessaging);
        eventEmitter.addListener('onShow', (message) => { var _a; return (_a = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.onShow) === null || _a === void 0 ? void 0 : _a.call(messagingDelegate, new Message_1.default(message)); });
        eventEmitter.addListener('onDismiss', (message) => {
            var _a;
            const messageInstance = new Message_1.default(message);
            messageInstance._clearJavascriptMessageHandlers();
            (_a = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.onDismiss) === null || _a === void 0 ? void 0 : _a.call(messagingDelegate, messageInstance);
        });
        eventEmitter.addListener('shouldShowMessage', (message) => {
            var _a, _b, _c, _d;
            const messageInstance = new Message_1.default(message);
            const shouldShowMessage = (_b = (_a = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.shouldShowMessage) === null || _a === void 0 ? void 0 : _a.call(messagingDelegate, messageInstance)) !== null && _b !== void 0 ? _b : true;
            const shouldSaveMessage = (_d = (_c = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.shouldSaveMessage) === null || _c === void 0 ? void 0 : _c.call(messagingDelegate, messageInstance)) !== null && _d !== void 0 ? _d : false;
            RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
        });
        if (react_native_1.Platform.OS === 'ios') {
            eventEmitter.addListener('urlLoaded', (event) => { var _a; return (_a = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.urlLoaded) === null || _a === void 0 ? void 0 : _a.call(messagingDelegate, event.url, new Message_1.default(event.message)); });
        }
        if (react_native_1.Platform.OS === 'android') {
            eventEmitter.addListener('onContentLoaded', (event) => { var _a; return (_a = messagingDelegate === null || messagingDelegate === void 0 ? void 0 : messagingDelegate.onContentLoaded) === null || _a === void 0 ? void 0 : _a.call(messagingDelegate, new Message_1.default(event.message)); });
        }
        RCTAEPMessaging.setMessagingDelegate();
        return () => {
            eventEmitter.removeAllListeners('onDismiss');
            eventEmitter.removeAllListeners('onShow');
            eventEmitter.removeAllListeners('shouldShowMessage');
            if (react_native_1.Platform.OS === 'ios') {
                eventEmitter.removeAllListeners('urlLoaded');
            }
            if (react_native_1.Platform.OS === 'android') {
                eventEmitter.removeAllListeners('onContentLoaded');
            }
        };
    }
    /**
     * Sets global settings for messages being shown and cached
     * Note: This method is also used by MessagingDelegate.shouldShowMessage,
     * which allows finer-grained control over setting these settings
     * @param shouldShowMessage Whether or not a message should be displayed
     * @param shouldSaveMessage Whether or not a message should be cached
     */
    static setMessageSettings(shouldShowMessage, shouldSaveMessage) {
        RCTAEPMessaging.setMessageSettings(shouldShowMessage, shouldSaveMessage);
    }
    /**
     * Dispatches an event to fetch propositions for the provided surfaces from remote.
     * @param surfaces A list of surface names to update
     */
    static updatePropositionsForSurfaces(surfaces) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield RCTAEPMessaging.updatePropositionsForSurfaces(surfaces);
        });
    }
    /**
     * @experimental
     * Retrieves the content card UI data for a given surface.
     * @param surface The surface to get the content card UI data for
     * @returns The content card UI data for the given surface
     */
    static getContentCardUI(surface) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const messages = yield Messaging.getPropositionsForSurfaces([surface]);
            const propositions = messages[surface];
            if (!(propositions === null || propositions === void 0 ? void 0 : propositions.length)) {
                return [];
            }
            const contentCards = propositions
                .map((proposition) => new MessagingProposition_1.MessagingProposition(proposition))
                .flatMap((proposition) => proposition.items.filter((item) => item.schema === PersonalizationSchema_1.PersonalizationSchema.CONTENT_CARD));
            if (!(contentCards === null || contentCards === void 0 ? void 0 : contentCards.length)) {
                return [];
            }
            return contentCards.map((card) => {
                var _a, _b, _c, _d;
                const type = (_d = (_c = (_b = (_a = card.data) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.adobe) === null || _c === void 0 ? void 0 : _c.template) !== null && _d !== void 0 ? _d : 'SmallImage';
                return new Templates_1.ContentTemplate(card, type);
            });
        });
    }
}
exports.default = Messaging;
//# sourceMappingURL=Messaging.js.map