export class AEPCore{
    static extensionVersion(): Promise<string>;
    static configureWithAppId(appId?: string);
    static updateConfiguration(configMap?: Map);
    static setLogLevel(mode: string);
    static getLogLevel(): Promise<string>;
    static log(logLevel: string, tag: string, message: string);
    static setPrivacyStatus(privacyStatus: string);
    static getPrivacyStatus(): Promise<string>;
    static getSdkIdentities(): Promise<?string>;
    static dispatchEvent(event: AEPExtensionEvent): Promise<boolean>;
    static dispatchEventWithResponseCallback(event: AEPExtensionEvent): Promise<AEPExtensionEvent>;
    static dispatchResponseEvent(responseEvent: AEPExtensionEvent, requestEvent: AEPExtensionEvent): Promise<boolean>;
    static trackAction(action?: string, contextData?: Map);
    static trackState(state?: string, contextData?: Map);
    static setAdvertisingIdentifier(advertisingIdentifier?: string);
    static setPushIdentifier(pushIdentifier?: string);
    static collectPii(data: Map);
    static setSmallIconResourceID(resourceID: number);
    static setLargeIconResourceID(resourceID: number);
    static setAppGroup(appGroup?: string);
}
export class AEPLifecycle{
    static extensionVersion(): Promise<string>;
}
export class AEPIdentity{
    static extensionVersion(): Promise<string>;
    static syncIdentifiers(identifiers?: Map);
    static syncIdentifiersWithAuthState(identifiers?: Map, authenticationState: string);
    static syncIdentifier(identifierType: string, identifier: string, authenticationState: string);
    static appendVisitorInfoForURL(baseURL?: string): Promise<?string>;
    static getUrlVariables(): Promise<?string>;
    static getIdentifiers(): Promise<Array<?AEPVisitorID>>;
    static getExperienceCloudId(): Promise<?string>;
}
export class AEPSignal{
    static extensionVersion(): Promise<string>;
}

export class AEPMobilePrivacyStatus{
    static OPT_IN: string;
    static OPT_OUT: string;
    static UNKNOWN: string;
}
export class AEPMobileLogLevel{
    static ERROR: string;
    static WARNING: string;
    static DEBUG: string;
    static VERBOSE: string;
}
export class AEPMobileVisitorAuthenticationState{
    static AUTHENTICATED: string;
    static LOGGED_OUT: string;
    static UNKNOWN: string;
}
export class AEPVisitorID{
    idOrigin: string;
    idType: string;
    identifier: string;
    authenticationState: AEPMobileVisitorAuthenticationState;
    constructor(idOrigin?: string, idType: string, id?: string, authenticationState?: AEPMobileVisitorAuthenticationState);
}
export class AEPExtensionEvent{
    eventName: string;
    eventType: string;
    eventSource: string;
    eventData: Map

  constructor(eventName: string, eventType: string, eventSource: string, eventData: Map)
}