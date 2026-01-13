"use strict";

import { useCallback, useEffect, useState } from 'react';
import Messaging from "../../Messaging.js";
/**
 * Hook to fetch the content card UI for a given surface.
 * @param surface - The surface to fetch the content card UI for.
 * @returns An object containing the content card UI, error, loading state, and a refetch function.
 */
export const useContentCardUI = surface => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      await Messaging.updatePropositionsForSurfaces([surface]);
      const content = await Messaging.getContentCardUI(surface);
      setContent(content);
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
  return {
    content,
    error,
    isLoading,
    refetch: fetchContent
  };
};
//# sourceMappingURL=useContentCardUI.js.map