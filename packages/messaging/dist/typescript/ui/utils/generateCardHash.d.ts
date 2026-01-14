import { ContentTemplate } from '../types/Templates';
/**
 * Generate a stable identifier (hash) for a card based on its content
 * This ensures the same card is identified even if the ID changes between refetches
 *
 * Priority: content hash (most stable) > uuid > id
 *
 * @param card - The content card template
 * @returns A stable identifier string with a prefix indicating the source (content:, uuid:, or id:)
 *
 * @example
 * ```typescript
 * const cardHash = generateCardHash(card);
 * // Returns: "content:https://example.com|Title|Body|image.jpg|SmallImage"
 * // or: "uuid:123e4567-e89b-12d3-a456-426614174000"
 * // or: "id:card-123"
 * ```
 */
export declare const generateCardHash: (card: ContentTemplate | any) => string;
//# sourceMappingURL=generateCardHash.d.ts.map