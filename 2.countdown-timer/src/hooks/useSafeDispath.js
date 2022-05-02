import { useCallback, useEffect, useRef } from "react";

// Prevent updating state after component has unmounted,
// causing memory leaks
export default function useSafeDispatch(unsafeDispatch) {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dispatch = useCallback(
    (...args) => {
      if (!mountedRef.current) return;
      unsafeDispatch(...args);
    },
    [unsafeDispatch]
  );

  return dispatch;
}
