import { PersonalizationSchema } from './PersonalizationSchema';
import { PropositionItem, PropositionItemData } from './PropositionItem';
export type ContentCardTemplate = 'SmallImage' | 'LargeImage' | 'ImageOnly';
export type DismissButtonStyle = 'circle' | 'none' | 'simple';
export interface ContentCardButton {
    readonly interactId: string;
    readonly actionUrl?: string;
    readonly id?: string;
    readonly text: {
        readonly content: string;
    };
}
export interface ContentCardContent {
    readonly image?: {
        readonly alt?: string;
        readonly url: string;
        readonly darkUrl?: string;
    };
    readonly buttons?: readonly ContentCardButton[];
    readonly dismissBtn?: {
        readonly style: DismissButtonStyle;
    };
    readonly actionUrl?: string;
    readonly body?: {
        readonly content: string;
    };
    readonly title: {
        readonly content: string;
    };
}
export type ImageOnlyContent = Pick<ContentCardContent, 'image' | 'dismissBtn' | 'actionUrl'>;
export type LargeImageContentData = ContentCardContent;
export type SmallImageContentData = ContentCardContent;
export interface ContentCardMeta {
    [key: string]: any;
    adobe: {
        template: ContentCardTemplate;
    };
    surface?: string;
}
export interface ContentCardData extends PropositionItemData {
    id: string;
    schema: PersonalizationSchema.CONTENT_CARD;
    data: {
        contentType: 'application/json';
        expiryDate: number;
        publishedDate: number;
        meta: ContentCardMeta;
        content: SmallImageContentData | LargeImageContentData | ImageOnlyContent;
    };
}
export declare class ContentCard extends PropositionItem {
    data: ContentCardData['data'];
    isRead: boolean;
    constructor(contentCardData: ContentCardData, isRead?: boolean);
}
//# sourceMappingURL=ContentCard.d.ts.map