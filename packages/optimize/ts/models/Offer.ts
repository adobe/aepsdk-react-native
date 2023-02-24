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

import Proposition from'./Proposition';
import { NativeModules } from 'react-native';
const { AEPOptimize: RCTAEPOptimize } = NativeModules;

interface OfferData {
    id: string;
    content: string;
    format: string;
    characteristics?: Record<string, string>;
    language?: string[];
}

interface OfferEventData {
    id: string;
    etag: string;
    schema: string;
    data: OfferData;
    score: number;
    meta?: Map<string, any>;
}

class Offer {
    id: string;
    etag: string;
    schema: string;
    data: OfferData;  
    score: number;
    meta?: Map<string, any>;

    get content(): string {
        return this.data.content;
    }

    get format(): string {
        return this.data.format;
    }

    get language(): Array<string> {
        return this.data.language;
    }

    get characteristics(): Record<string, string> {
        return this.data.characteristics;
    }    

    constructor(eventData: OfferEventData) {
        this.id = eventData.id;
        this.etag = eventData.etag;
        this.schema = eventData.schema;        
        this.data = eventData.data;
        this.score = eventData.score;
        this.meta = eventData.meta;
    }

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the display interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    displayed(proposition: Proposition): void {
        const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");        
        const cleanedProposition = Object.fromEntries(entries);  
        RCTAEPOptimize.offerDisplayed(this.id, cleanedProposition);
    };

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the tap interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    tapped(proposition: Proposition): void {                
        console.log("Offer is tapped");
        const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);        
        RCTAEPOptimize.offerTapped(this.id, cleanedProposition);
    };

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from proposition arguement.
    * The returned XDM data does contain the eventType for the Experience Event with value decisioning.propositionDisplay.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} - a promise that resolves to xdm map
    */
    generateDisplayInteractionXdm(proposition: Proposition): Promise<Map<string, any>> {        
        const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateDisplayInteractionXdm(this.id, cleanedProposition));        
    };   

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from this proposition arguement.    
    * The returned XDM data contains the eventType for the Experience Event with value decisioning.propositionInteract.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.    
    * @param {Proposition} proposition - proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm map
    */
    generateTapInteractionXdm(proposition: Proposition): Promise<Map<string, any>> {
        const entries = Object.entries(proposition).filter(([_, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateTapInteractionXdm(this.id, cleanedProposition));
    };   
};

export default Offer;
