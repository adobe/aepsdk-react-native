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

const AEPOptimize = require('./AEPOptimize');
const Proposition = require('./Proposition');

module.exports = class Offer {

    id: string;
    etag: string;
    schema: string;
    data: Object;    

    constructor(eventData: Object) {
        this.id = eventData['id'];
        this.etag = eventData['etag'];
        this.schema = eventData['schema'];
        this.data = eventData['data'];        

        this.getContent.bind(this);
        this.getType.bind(this);
        this.displayed.bind(this);
        this.tapped.bind(this);
        this.generateDisplayInteractionXdm.bind(this);        
    }

    getContent = () => {
        return this.data['content'];
    };

    getType = () => {
        return this.data['format'];
    };

    displayed = (proposition: Proposition) => {
        AEPOptimize.offerDisplayed(this.id, proposition);
    };

    tapped = (proposition: Proposition) => {                
        AEPOptimize.offerTapped(this.id, proposition);
    };

    generateDisplayInteractionXdm(proposition: Proposition): Promise<Object> {
        return AEPOptimize.generateDisplayInteractionXdm(this.id, proposition);
    };   

    generateTapInteractionXdm(proposition: Proposition): Promise<Object> {
        return AEPOptimize.generateTapInteractionXdm(this.id, proposition);
    };   
}