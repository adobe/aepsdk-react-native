export interface Activity {
    matchedSurfaces: string[];
    id: string;
}
export interface Characteristics {
    eventToken: string;
}
export interface ScopeDetails {
    activity: Activity;
    characteristics: Characteristics;
    correlationID: string;
    decisionProvider: string;
}
