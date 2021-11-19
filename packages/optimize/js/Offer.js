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

import { NativeModules } from "react-native";
const { AEPOptimize } = NativeModules;

export default class Offer {

    id: string;
    etag: string;
    schema: string;
    type: string;
    language: Array<string>;
    content: string;
    characteristics: Map<string, string>;

    constructor(eventData: Object) {
        this.id = eventData['id'];
        this.etag = eventData['etag'];
        this.schema = eventData['schema'];
        this.type = eventData['type'];
        this.language = eventData['language'];
        this.content = eventData['content'];
        this.characteristics = eventData['characteristics'];        

        this.displayed.bind(this);
        this.tapped.bind(this);
        this.generateDisplayInteractionXdm.bind(this);
    }

    displayed = () => {
        AEPOptimize.offerDisplayed(this);
    }

    tapped = () => {        
        AEPOptimize.offerTapped(this);
    }

    generateDisplayInteractionXdm = () => {
        return Promise.resolve(AEPOptimize.generateDisplayInteractionXdm(this));
    }
}