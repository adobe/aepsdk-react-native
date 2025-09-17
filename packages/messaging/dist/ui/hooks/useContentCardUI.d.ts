import { ContentTemplate } from '../types/Templates';
/**
 * Hook to fetch the content card UI for a given surface.
 * @param surface - The surface to fetch the content card UI for.
 * @returns An object containing the content card UI, error, loading state, and a refetch function.
 */
export declare const useContentCardUI: (surface: string) => {
    content: ContentTemplate[];
    error: any;
    isLoading: boolean;
    refetch: () => Promise<void>;
};
