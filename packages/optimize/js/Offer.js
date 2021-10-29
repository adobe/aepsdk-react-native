/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

import { NativeModules } from 'react-native';
const RCTAEPOptimize = NativeModules.AEPOptimize;

export default class Offer {

    constructor(data) {
        this.id = data['id'];
        this.etag = data['etag'];
        this.schema = data['schema'];
        this.type = data['type'];
        this.language = data['language'];
        this.content = data['content'];
        this.characteristics = data['characteristics'];        

        this.displayed.bind(this);
        this.tapped.bind(this);
        this.generateDisplayInteractionXdm.bind(this);
    }

    displayed = () => {
        RCTAEPOptimize.offerDisplayed(this);
    }

    tapped = () => {
        console.log("Offer is tapped:: Offer");
        RCTAEPOptimize.offerTapped(this);
    }

    generateDisplayInteractionXdm = () => {
        return Promise.resolve(RCTAEPOptimize.generateDisplayInteractionXdm(this));
    }
}

// -----------VARIABLES----------------
// private String id;
        // private String etag;
        // private String schema;
        // private OfferType type;
        // private List<String> language;
        // private String content;
        // private Map<String, String> characteristics;

// ----------------SAMPLE--------------------
// {
    // "characteristics":{"testing":"true"},
// "content":"sample text offer!!",
// "type":"text/plain",
// "language":["en-us"],
// "id":"xcore:personalized-offer:141c79fc913a06b9",
// "etag":"1",
// "schema":"https://ns.adobe.com/experience/offer-management/content-component-text"
// }