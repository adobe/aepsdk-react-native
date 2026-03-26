/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

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
      setError(null);
      await Messaging.updatePropositionsForSurfaces([surface]);
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
