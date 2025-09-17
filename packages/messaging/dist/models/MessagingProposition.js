"use strict";
/*
    Copyright 2024 Adobe. All rights reserved.
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
exports.MessagingProposition = exports.MessageProposition = void 0;
const PersonalizationSchema_1 = require("./PersonalizationSchema");
const ContentCard_1 = require("./ContentCard");
const HTMLProposition_1 = require("./HTMLProposition");
const JSONProposition_1 = require("./JSONProposition");
const PropositionItem_1 = require("./PropositionItem");
class MessageProposition {
    constructor(raw) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.id = (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : '';
        this.scope = (_b = raw === null || raw === void 0 ? void 0 : raw.scope) !== null && _b !== void 0 ? _b : '';
        this.scopeDetails = (_c = raw === null || raw === void 0 ? void 0 : raw.scopeDetails) !== null && _c !== void 0 ? _c : {};
        // Mirror activity.id into activity.activityID for convenience
        const activityIdFromScope = (_f = (_e = (_d = this.scopeDetails) === null || _d === void 0 ? void 0 : _d.activity) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : '';
        if ((_g = this.scopeDetails) === null || _g === void 0 ? void 0 : _g.activity) {
            this.scopeDetails.activity.activityID = activityIdFromScope;
        }
        const rawItems = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.items) ? raw.items : [];
        this.items = rawItems.map((itemData) => {
            var _a, _b, _c;
            const activityId = (_c = (_b = (_a = this.scopeDetails) === null || _a === void 0 ? void 0 : _a.activity) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '';
            let instance;
            switch (itemData === null || itemData === void 0 ? void 0 : itemData.schema) {
                case PersonalizationSchema_1.PersonalizationSchema.CONTENT_CARD:
                    instance = new ContentCard_1.ContentCard(itemData);
                    instance.activityID = activityId;
                    return instance;
                case PersonalizationSchema_1.PersonalizationSchema.HTML_CONTENT:
                    instance = new HTMLProposition_1.HTMLProposition(itemData);
                    instance.activityID = activityId;
                    return instance;
                case PersonalizationSchema_1.PersonalizationSchema.JSON_CONTENT:
                    instance = new JSONProposition_1.JSONPropositionItem(itemData);
                    instance.activityID = activityId;
                    return instance;
                default:
                    instance = new PropositionItem_1.PropositionItem(itemData);
                    instance.activityID = activityId;
                    return instance;
            }
        });
    }
}
exports.MessageProposition = MessageProposition;
exports.MessagingProposition = MessageProposition;
//# sourceMappingURL=MessagingProposition.js.map