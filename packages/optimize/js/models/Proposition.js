"use strict";
/*
Copyright 2021 Adobe. All rights reserved.
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
const Offer_1 = tslib_1.__importDefault(require("./Offer"));
const RCTAEPOptimize = require('react-native').NativeModules.AEPOptimize;
class Proposition {
    constructor(eventData) {
        this.id = eventData['id'];
        this.scope = eventData['scope'];
        this.scopeDetails = eventData['scopeDetails'];
        if (eventData['items']) {
            this.items = eventData['items'].map((offer) => new Offer_1.default(offer));
        }
    }
    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Reference} field group from proposition arguement.
    * The returned XDM data does not contain eventType for the Experience Event.
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm data map
    */
    generateReferenceXdm() {
        const entries = Object.entries(this).filter(([_, value]) => typeof (value) !== "function");
        const proposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateReferenceXdm(proposition));
    }
    ;
}
exports.default = Proposition;
//# sourceMappingURL=Proposition.js.map