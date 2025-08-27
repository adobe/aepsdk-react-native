import { useCallback, useEffect, useState } from 'react';
import Messaging from '../../Messaging';
import { ContentTemplate } from '../types/Templates';

/**
 * Hook to fetch the content card UI for a given surface.
 * @param surface - The surface to fetch the content card UI for.
 * @returns An object containing the content card UI, error, loading state, and a refetch function.
 */
export const useContentCardUI = (surface: string) => {
  const [content, setContent] = useState<ContentTemplate[]>([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      await Messaging.updatePropositionsForSurfaces([surface]);
      const content = await Messaging.getContentCardUI(surface);
      setContent(content);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setContent([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [surface]);

  useEffect(() => {
    fetchContent();
  }, [surface, fetchContent]);

  return { content, error, isLoading, refetch: fetchContent };
};
