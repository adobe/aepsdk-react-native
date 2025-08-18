/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import Offer from './Offer';

const RCTAEPOptimize = require('react-native').NativeModules.AEPOptimize;

interface Activity {
    id: string;
    etag: string;
}

interface Placement {
    id: string;
    etag: string;
}

interface PropositionEventData {
    id: string;
    items: Array<Offer>;
    scope: string;
    scopeDetails?: Map<string, any>;
    activity?: Activity;
    placement?: Placement;
}

class Proposition {
    id: string;
    items: Array<Offer>;
    scope: string;
    scopeDetails?: Map<string, any>;
    activity?: Activity;
    placement?: Placement;

    constructor(eventData: PropositionEventData) {
        this.id = eventData['id'];
        this.scope = eventData['scope'];
        if (eventData['scopeDetails']) {
            this.scopeDetails = eventData['scopeDetails'];
        }
        if (eventData['activity']) {
            this.activity = eventData['activity'];
        }
        if (eventData['placement']) {
            this.placement = eventData['placement'];
        }
        if(eventData['items']) {
            let uniquePropositionId: string | undefined = undefined;
            if (this.activity && this.activity['id']) {
                uniquePropositionId = this.activity['id'];
            } else if (this.scopeDetails && this.scopeDetails['activity'] && this.scopeDetails['activity']['id']) {
                uniquePropositionId = this.scopeDetails['activity']['id'];
            }
            this.items = eventData['items'].map((offer) => new Offer({ ...offer, uniquePropositionId}));                
        }else {
            this.items = new Array();
        }           
    }    
        
    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Reference} field group from proposition arguement.
    * The returned XDM data does not contain eventType for the Experience Event.     
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm data map
    */
    generateReferenceXdm(): Promise<Map<string, any>> {
        const entries = Object.entries(this).filter(([_,value]) => typeof(value) !== "function");
        const proposition = Object.fromEntries(entries);    
        return Promise.resolve(RCTAEPOptimize.generateReferenceXdm(proposition));
    };
}

export default Proposition;
