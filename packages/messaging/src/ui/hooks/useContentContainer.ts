import { useCallback, useEffect, useState } from "react";
import Messaging from "../../Messaging";
import { ContainerSettings } from "../providers/ContentCardContainerProvider";

export function useContentContainer(surface: string) {
  const [settings, setSettings] = useState<ContainerSettings | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContainer = useCallback(async () => {
    try {
      setIsLoading(true);
      const settings = await Messaging.getContentCardContainer(surface);
      setSettings(settings);
      console.log('--------------------------------');
      console.log('--------------------------------');
      console.log('--------------------------------');
      console.log(
        '[ContentCardContainer] settings\n' +
        JSON.stringify({ surface, settings }, null, 2)
      );
      console.log('--------------------------------');
      console.log('--------------------------------');
      console.log('--------------------------------');
      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [surface]);

  useEffect(() => {
    fetchContainer();
  }, [surface]);

  return { settings, error, isLoading, refetch: fetchContainer };
}
