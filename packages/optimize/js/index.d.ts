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
export class AEPOptimize {
    static extensionVersion(): Promise<string>;
    static onPropositionUpdate(adobeCallback: AdobeCallback);    
    static clearCachedPropositions();
    static getPropositions(decisionScopes: Array<DecisionScope>): Promise<Map<string, Proposition>>;
    static updatePropositions(decisionScopes: Array<DecisionScope>, xdm: ?Map<string, any>, data: ?Map<string, any>);
};

export class Offer {
    id: string;
    etag: string;
    schema: string;
    content:? string;
    format:? string; 
    language:? Array<string>;
    characteristics:? Map<string, any>;

    constructor(eventData: any)    
    getContent(): ?string;    
    getType(): ?string;    
    getLanguage(): ?Array<string>;
    getCharacteristics(): ?Map<string, any>;
    displayed(proposition: Proposition);
    tapped(proposition: Proposition);
    generateDisplayInteractionXdm(proposition: Proposition): Promise<Map<string, any>>;
    generateTapInteractionXdm(proposition: Proposition): Promise<Map<string, any>>;
}

export class Proposition {
    id: string;
    items: Array<Offer>;
    scope: string;
    scopeDetails: Object;

    constructor(eventData: any)
    generateReferenceXdm(): Promise<Map<string, any>>;
}

export class DecisionScope {
    name: string;        

    constructor(name: ?string, activityId: ?string, placementId: ?string, itemCount: ?number)
    getName(): string;
};

export type AdobeCallback = {    
    call(propositionMap: Map<string, Proposition>);
};

