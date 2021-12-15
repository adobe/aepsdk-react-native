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
export class Identity{
    static extensionVersion(): Promise<string>;
    static getExperienceCloudId(): Promise<string>;
    static getIdentities(): Promise<IdentityMap>;
    static updateIdentities(identityMap: IdentityMap);
    static removeIdentity(item: IdentityItem, namespace: string);
};

export enum AuthenticatedState {
    AUTHENTICATED: "authenticated";
    LOGGED_OUT: "loggedOut";
    AMBIGUOUS: "ambiguous";
}

export class IdentityItem {
  id: string;
  authenticatedState: AuthenticatedState;
  primary: boolean;
  constructor(id: string, authenticatedState: AuthenticatedState = AuthenticatedState.AMBIGUOUS, primary: boolean = false)
}

export class IdentityMap {
  constructor()

  addItem(item: IdentityItem, namespace: string);
  isEmpty();
  getNamespaces();
  getIdentityItemsForNamespace(namespace: string)
  removeItem(item: IdentityItem, namespace: string);
}