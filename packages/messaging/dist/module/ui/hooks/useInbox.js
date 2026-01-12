"use strict";

import { useCallback, useEffect, useState } from "react";
import Messaging from "../../Messaging.js";
export function useInbox(surface) {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchInbox = useCallback(async () => {
    try {
      setIsLoading(true);
      const settings = await Messaging.getInbox(surface);
      setSettings(settings);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [surface]);
  useEffect(() => {
    fetchInbox();
  }, [surface]);
  return {
    settings,
    error,
    isLoading,
    refetch: fetchInbox
  };
}
//# sourceMappingURL=useInbox.js.map