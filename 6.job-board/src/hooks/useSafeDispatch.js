import { useCallback, useEffect, useRef } from "react";

export function useSafeDispatch(unsafeDispatch) {
  // refs
  const mountedRef = useRef(false);

  // effects
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // callbacks
  const safeDispatch = useCallback(
    (...args) => {
      if (!mountedRef.current) return;
      unsafeDispatch(...args);
    },
    [unsafeDispatch]
  );

  return safeDispatch;
}
