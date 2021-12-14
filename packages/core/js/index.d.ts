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
export class MobileCore{
    static extensionVersion(): Promise<string>;
    static configureWithAppId(appId?: string);
    static updateConfiguration(configMap?: Map);
    static setLogLevel(mode: LogLevel);
    static getLogLevel(): Promise<LogLevel>;
    static log(logLevel: string, tag: string, message: string);
    static setPrivacyStatus(privacyStatus: PrivacyStatus);
    static getPrivacyStatus(): Promise<PrivacyStatus>;
    static getSdkIdentities(): Promise<?string>;
    static dispatchEvent(event: Event): Promise<boolean>;
    static dispatchEventWithResponseCallback(event: Event): Promise<Event>;
    static trackAction(action?: string, contextData?: Map);
    static trackState(state?: string, contextData?: Map);
    static setAdvertisingIdentifier(advertisingIdentifier?: string);
    static setPushIdentifier(pushIdentifier?: string);
    static collectPii(data: Map);
    static setSmallIconResourceID(resourceID: number);
    static setLargeIconResourceID(resourceID: number);
    static setAppGroup(appGroup?: string);
    static resetIdentities();
}
export class Lifecycle{
    static extensionVersion(): Promise<string>;
}
export class Identity{
    static extensionVersion(): Promise<string>;
    static syncIdentifiers(identifiers?: Map);
    static syncIdentifiersWithAuthState(identifiers?: Map, authenticationState: MobileVisitorAuthenticationState);
    static syncIdentifier(identifierType: string, identifier: string, authenticationState: MobileVisitorAuthenticationState);
    static appendVisitorInfoForURL(baseURL?: string): Promise<?string>;
    static getUrlVariables(): Promise<?string>;
    static getIdentifiers(): Promise<Array<?VisitorID>>;
    static getExperienceCloudId(): Promise<?string>;
}
export class Signal{
    static extensionVersion(): Promise<string>;
}

export enum PrivacyStatus{
    OPT_IN = "OPT_IN",
    OPT_OUT = "OPT_OUT",
    UNKNOWN = "UNKNOWN",
}
export enum LogLevel{
    ERROR = "ERROR",
    WARNING = "WARNING",
    DEBUG = "DEBUG",
    VERBOSE = "VERBOSE",
}
export enum MobileVisitorAuthenticationState{
    AUTHENTICATED = "VISITOR_AUTH_STATE_AUTHENTICATED",
    LOGGED_OUT = "VISITOR_AUTH_STATE_LOGGED_OUT",
    UNKNOWN = "VISITOR_AUTH_STATE_UNKNOWN",
}
export class VisitorID{
    idOrigin: string;
    idType: string;
    identifier: string;
    authenticationState: MobileVisitorAuthenticationState;
    constructor(idOrigin?: string, idType: string, id?: string, authenticationState?: MobileVisitorAuthenticationState);
}
export class Event{
    eventName: string;
    eventType: string;
    eventSource: string;
    eventData: Map

  constructor(eventName: string, eventType: string, eventSource: string, eventData: Map)
}