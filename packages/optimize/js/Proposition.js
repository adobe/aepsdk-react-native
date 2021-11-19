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
const { AEPOptimize } = NativeModules;
import Offer from './Offer';


export default class Proposition {
    id: string;
    offers: Array<Offer>;
    scope: string;
    scopeDetails: Map<string, Object>;

    constructor(eventData: Object) {
        this.id = eventData['id'];
        this.offers = eventData['offers'].map(offer => {
            return new Offer(offer);
        });
        this.scope = eventData['scope'];
        this.scopeDetails = eventData['scopeDetails'];

        this.generateReferenceXdm.bind(this);
    }    
        
    generateReferenceXdm = () => {
        return Promise.resolve(AEPOptimize.generateReferenceXdm(this));
    }
}