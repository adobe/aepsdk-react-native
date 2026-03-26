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
