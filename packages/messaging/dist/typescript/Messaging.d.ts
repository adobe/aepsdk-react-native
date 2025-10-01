import Message from "./models/Message";
import { MessagingDelegate } from "./models/MessagingDelegate";
import { MessagingProposition } from "./models/MessagingProposition";
import { ContentCard } from "./models/ContentCard";
import { ContentTemplate } from "./ui/types/Templates";
import { ContainerSettings } from "./ui/providers/ContentCardContainerProvider";
export interface NativeMessagingModule {
    extensionVersion: () => Promise<string>;
    getCachedMessages: () => Message[];
    getLatestMessage: () => Message;
    getContentCardUI: (surface: string) => Promise<ContentTemplate[]>;
    getPropositionsForSurfaces: (surfaces: string[]) => Record<string, MessagingProposition[]>;
    refreshInAppMessages: () => void;
    setMessagingDelegate: (delegate?: MessagingDelegate) => void;
    setMessageSettings: (shouldShowMessage: boolean, shouldSaveMessage: boolean) => void;
    updatePropositionsForSurfaces: (surfaces: string[]) => Promise<void>;
    trackContentCardDisplay: (proposition: MessagingProposition, contentCard: ContentCard) => void;
    trackContentCardInteraction: (proposition: MessagingProposition, contentCard: ContentCard) => void;
    trackPropositionItem: (itemId: string, interaction: string | null, eventType: number, tokens: string[] | null) => void;
}
declare class Messaging {
    /**
     * Returns the version of the AEPMessaging extension
     * @returns {string} Promise a promise that resolves with the extension version
     */
    static extensionVersion(): Promise<string>;
    /**
     * Initiates a network call to retrieve remote In-App Message definitions.
     */
    static refreshInAppMessages(): void;
    /**
     * Retrieves the list of messages which have been cached using the `shouldSaveMessage`
     * method of the messaging delegate.
     * Note: Messages should be cached before trying to use any of the methods on the message class
     * @returns An array of messages that have been cached
     */
    static getCachedMessages(): Promise<Message[]>;
    /**
     * Retrieves the last message that has been shown in the UI
     * @returns The latest message to have been displayed
     */
    static getLatestMessage(): Promise<Message | null | undefined>;
    /**
     * Retrieves the previously fetched (and cached) feeds content from the SDK for the provided surfaces.
     * If the feeds content for one or more surfaces isn't previously cached in the SDK, it will not be retrieved from Adobe Journey Optimizer via the Experience Edge network.
     * @param surfaces A list of surfaces to fetch
     * @returns A record of surface names with their corresponding propositions
     */
    static getPropositionsForSurfaces(surfaces: string[]): Promise<Record<string, MessagingProposition[]>>;
    /**
     * @deprecated Use PropositionItem.track(...) instead.
     */
    static trackContentCardDisplay(proposition: MessagingProposition, contentCard: ContentCard): void;
    /**
     * @deprecated Use PropositionItem.track(...) instead.
     */
    static trackContentCardInteraction(proposition: MessagingProposition, contentCard: ContentCard): void;
    /**
     * Tracks interactions with a PropositionItem using the provided interaction and event type.
     * This method is used internally by the PropositionItem.track() method.
     *
     * @param {string} itemId - The unique identifier of the PropositionItem
     * @param {string | null} interaction - A custom string value to be recorded in the interaction
     * @param {number} eventType - The MessagingEdgeEventType numeric value
     * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
     */
    static trackPropositionItem(itemId: string, interaction: string | null, eventType: number, tokens: string[] | null): void;
    /**
     * Function to set the UI Message delegate to listen the Message lifecycle events.
     * @returns A function to unsubscribe from all event listeners
     */
    static setMessagingDelegate(delegate: MessagingDelegate): () => void;
    /**
     * Sets global settings for messages being shown and cached
     * Note: This method is also used by MessagingDelegate.shouldShowMessage,
     * which allows finer-grained control over setting these settings
     * @param shouldShowMessage Whether or not a message should be displayed
     * @param shouldSaveMessage Whether or not a message should be cached
     */
    static setMessageSettings(shouldShowMessage: boolean, shouldSaveMessage: boolean): void;
    /**
     * Dispatches an event to fetch propositions for the provided surfaces from remote.
     * @param surfaces A list of surface names to update
     */
    static updatePropositionsForSurfaces(surfaces: string[]): Promise<void>;
    /**
     * @experimental
     * Retrieves the content card UI data for a given surface.
     * @param surface The surface to get the content card UI data for
     * @returns The content card UI data for the given surface
     */
    static getContentCardUI(surface: string): Promise<ContentTemplate[]>;
    static getContentCardContainer(surface: string): Promise<ContainerSettings>;
}
export default Messaging;
//# sourceMappingURL=Messaging.d.ts.map