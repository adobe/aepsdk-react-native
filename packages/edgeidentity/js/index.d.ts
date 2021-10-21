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
export class AEPIdentity{
    static extensionVersion(): Promise<string>;
    static getExperienceCloudId(): Promise<string>;
    static getIdentities(): Promise<IdentityMap>;
    static updateIdentities(identityMap: Map);
    static removeIdentityItem(item:<IdentityItem>, namespace: String)
};

export class AEPAuthenticatedState{
    static AUTHENTICATED: string;
    static LOGGED_OUT: string;
    static AMBIGUOUS: string;
}

export class AEPIdentityItem {
  id: string;
  authenticatedState: AEPAuthenticatedState: ;
  primary: boolean;
  constructor(id: string, authenticatedState: AEPAuthenticatedState = AEPAuthenticatedState.AMBIGUOUS, primary: boolean = false)
}

export class AEPIdentityMap {
  isEmpty: boolean;
  namespaces: string;
  item: AEPIdentityItem;
  constructor()

  isEmpty()

  addItem(item: AEPIdentityItem, namespace: string)

  removeItem(item: AEPIdentityItem, namespace: string)

  getItem(namespace: string)
}