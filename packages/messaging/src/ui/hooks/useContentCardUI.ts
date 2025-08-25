import { useCallback, useEffect, useState } from 'react';
import Messaging from '../../Messaging';
import { ContentTemplate } from '../types/Templates';

export const useContentCardUI = (surface: string) => {
  const [content, setContent] = useState<ContentTemplate[]>([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
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

  return { content, error, isLoading };
};
