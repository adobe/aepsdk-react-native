import { PersonalizationSchema } from './PersonalizationSchema';
import MessagingEdgeEventType from './MessagingEdgeEventType';
/**
 * Base PropositionItem interface that all proposition items implement
 */
export interface PropositionItemData {
    id: string;
    uuid: string;
    schema: PersonalizationSchema;
    activityID: string;
    data: {
        [key: string]: any;
    };
}
/**
 * A PropositionItem represents a personalization JSON object returned by Konductor.
 * This is the base class that provides tracking functionality for all proposition items
 * including ContentCards, InApp messages, and code-based experiences.
 *
 * This mirrors the native Android PropositionItem class functionality.
 */
export declare class PropositionItem {
    id: string;
    uuid: string;
    activityID: string;
    schema: PersonalizationSchema;
    data: {
        [key: string]: any;
    };
    constructor(propositionItemData: PropositionItemData);
    /**
     * Gets the PropositionItem identifier.
     *
     * @returns {string} The PropositionItem identifier
     */
    getItemId(): string;
    /**
     * Gets the PropositionItem content schema.
     *
     * @returns {PersonalizationSchema} The PropositionItem content schema
     */
    getSchema(): PersonalizationSchema;
    /**
     * Gets the PropositionItem data.
     *
     * @returns {object} The PropositionItem data
     */
    getItemData(): {
        [key: string]: any;
    };
    /**
     * Tracks interaction with this proposition item.
     * This is the core tracking method that all proposition items use.
     *
     * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
     *
     * @example
     * propositionItem.track(MessagingEdgeEventType.DISPLAY);
     */
    track(eventType: MessagingEdgeEventType): void;
    /**
     * Tracks interaction with this proposition item.
     *
     * @param {string | null} interaction - String describing the interaction
     * @param {MessagingEdgeEventType} eventType - The MessagingEdgeEventType specifying event type for the interaction
     * @param {string[] | null} tokens - Array containing the sub-item tokens for recording interaction
     *
     * @example
     * // Track display
     * propositionItem.track(null, MessagingEdgeEventType.DISPLAY, null);
     *
     * // Track interaction
     * propositionItem.track("button_clicked", MessagingEdgeEventType.INTERACT, null);
     *
     * // Track with tokens
     * propositionItem.track("click", MessagingEdgeEventType.INTERACT, ["token1", "token2"]);
     */
    track(interaction: string | null, eventType: MessagingEdgeEventType, tokens: string[] | null): void;
    /**
     * Internal method that performs the actual tracking
     */
    private trackWithDetails;
}
