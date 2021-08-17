export class AEPUserProfile{
    static extensionVersion(): Promise<string>;
    static removeUserAttributes(attributeNames: Array<string>): void;
    static getUserAttributes(attributeNames: Array<string>): Promise<Map | null>;
    static updateUserAttributes(attributeMap: Map):void;
};