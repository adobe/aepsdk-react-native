"use strict";

import { useCallback, useEffect, useState } from "react";
import Messaging from "../../Messaging.js";
export function useContentContainer(surface) {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchContainer = useCallback(async () => {
    try {
      setIsLoading(true);
      const settings = await Messaging.getContentCardContainer(surface);
      setSettings(settings);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [surface]);
  useEffect(() => {
    fetchContainer();
  }, [surface]);
  return {
    settings,
    error,
    isLoading,
    refetch: fetchContainer
  };
}
//# sourceMappingURL=useContentContainer.js.map