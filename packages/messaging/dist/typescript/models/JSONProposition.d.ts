import { PersonalizationSchema } from './PersonalizationSchema';
import { PropositionItem, PropositionItemData } from './PropositionItem';
export interface JSONPropositionData extends PropositionItemData {
    data: {
        content: any;
    };
    schema: PersonalizationSchema.JSON_CONTENT;
}
export declare class JSONPropositionItem extends PropositionItem {
    data: JSONPropositionData['data'];
    constructor(jsonData: JSONPropositionData);
}
//# sourceMappingURL=JSONProposition.d.ts.map