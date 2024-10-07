import { useCallback, useLayoutEffect } from 'react';

export const useOnKeyPress = (cb: (e: KeyboardEvent) => void) => {
  const listener = useCallback((e: KeyboardEvent) => cb(e), [cb]);

  useLayoutEffect(() => {
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [listener]);
};
