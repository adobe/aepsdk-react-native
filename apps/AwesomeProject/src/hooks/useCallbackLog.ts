import { useCallback, useState } from 'react';

const MAX_LINES = 300;

export function useCallbackLog() {
  const [lines, setLines] = useState<string[]>([]);

  const appendLog = useCallback((message: string) => {
    const line = `[${new Date().toISOString()}] ${message}`;
    setLines((prev) => [line, ...prev].slice(0, MAX_LINES));
  }, []);

  const clearLog = useCallback(() => setLines([]), []);

  return { lines, appendLog, clearLog };
}
