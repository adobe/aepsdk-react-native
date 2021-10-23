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
import Offer from './Offer';


export default class Proposition {

    constructor(data) {
        this.id = data['id'];
        this.offers = data['offers'].map(offer => {
            return new Offer(offer);
        });
        this.scope = data['scope'];
        this.scopeDetails = data['scopeDetails'];

        this.generateReferenceXdm.bind(this);
    }    
        
    generateReferenceXdm = () => {
        return Promise.resolve(RCTAEPOptimize.generateReferenceXdm(this));
    }
}



//------------------------VARIBLES--------------------------
// private final String id;
        // private final List<Offer> offers;
        // private final String scope;
        // private final Map<String, Object> scopeDetails;    

//-------------------------SAMPLE-----------------------------        
// {"scope":
// "eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkNWQzOGYwNDg5NyJ9",
// "offers":[{"characteristics":{"testing":"true"},
// "content":"sample text offer!!",
// "type":"text/plain",
// "language":["en-us"],
// "id":"xcore:personalized-offer:141c79fc913a06b9",
// "etag":"1",
// "schema":"https://ns.adobe.com/experience/offer-management/content-component-text"}],
// "id":"6f842ade-682d-434e-9b56-aa8280d489f8"}