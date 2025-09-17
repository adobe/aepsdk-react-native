import { PersonalizationSchema } from './PersonalizationSchema';
export interface InAppMessage {
    id: string;
    schema: PersonalizationSchema.IN_APP;
    data: {
        content: string;
        contentType: 'text/html';
        expiryDate: number;
        publishedDate: number;
        meta?: Record<string, any>;
        mobileParameters?: Record<string, any>;
        webParameters?: Record<string, any>;
        remoteAssets?: string[];
    };
}
