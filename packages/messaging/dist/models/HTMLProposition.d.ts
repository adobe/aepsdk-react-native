import { PersonalizationSchema } from './PersonalizationSchema';
import { PropositionItem, PropositionItemData } from './PropositionItem';
export interface HTMLPropositionData extends PropositionItemData {
    data: {
        content: string;
    };
    schema: PersonalizationSchema.HTML_CONTENT;
}
export declare class HTMLProposition extends PropositionItem {
    data: HTMLPropositionData['data'];
    constructor(htmlData: HTMLPropositionData);
}
