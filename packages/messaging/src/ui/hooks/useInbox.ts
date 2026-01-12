import { useCallback, useEffect, useState } from "react";
import Messaging from "../../Messaging";
import { InboxSettings } from "../providers/InboxProvider";

export function useInbox(surface: string) {
  const [settings, setSettings] = useState<InboxSettings | null>(null);
  const [error, setError] = useState<any>(null);
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

  return { settings, error, isLoading, refetch: fetchInbox };
}
