import { ScopeDetails } from './ScopeDetails';
import { PropositionItem } from './PropositionItem';
export declare class MessageProposition {
    id: string;
    scope: string;
    scopeDetails: ScopeDetails;
    items: PropositionItem[];
    constructor(raw: {
        id: string;
        scope: string;
        scopeDetails: ScopeDetails;
        items?: any[];
    });
}
export { MessageProposition as MessagingProposition };
