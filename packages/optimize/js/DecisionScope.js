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

module.exports = class DecisionScope {

    name: string;    
    
    constructor(name: string = "", activityId: string = "", placementId: string = "", itemCount: number = 1) {                
        if(name && name.trim() !== "") {
            this.name = name;
        } else {            
            var decisionScopeObject: Object = new Object();
            decisionScopeObject['activityId'] = activityId;            
            decisionScopeObject['placementId'] = placementId;    
            decisionScopeObject['itemCount'] = itemCount;   

            this.name = Buffer.from(JSON.stringify(decisionScopeObject)).toString("base64");

            this.getName.bind(this);
        }                
    }

    getName(): string {
       return this.name; 
    }
};
